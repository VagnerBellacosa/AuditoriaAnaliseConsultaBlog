/******************************************************************************
 Bellacosa Mainframe Library
 Search Engine Service
 Version 2.0
******************************************************************************/

"use strict";

class SearchEngine {

    constructor() {

        this.posts = [];

        this.index = [];

        this.cache = new Map();

        this.initialized = false;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing Search Engine..."

        );

        this.posts =

            App.module("api").all();

        this.buildIndex();
		this.buildInvertedIndex();

this.bindEvents();

        this.initialized = true;

    }

    /**************************************************************************
     INDEX
    **************************************************************************/

    buildIndex() {

        this.index = this.posts.map(post => ({

            id: post.id,

            title: post.title.toLowerCase(),

            summary: post.summary.toLowerCase(),

            content: Utils.stripHTML(

                post.content

            ).toLowerCase(),

            categories:

                post.categories.map(

                    c => c.toLowerCase()

                ),

            object: post

        }));

        Logger.success(

            `${this.index.length} documentos indexados.`

        );

    }

    /**************************************************************************
     SEARCH
    **************************************************************************/

    search(query) {

        if (!query)

            return [];

        query =

            query

            .trim()

            .toLowerCase();

        if (

            Cache.has(

                "search:"+query

            )

        ) {

            return Cache.get(

                "search:"+query

            );

        }

        const results =

            this.index

                .map(item => ({

                    score:

                        this.score(

                            item,

                            query

                        ),

                    post:

                        item.object

                }))

                .filter(

                    item =>

                        item.score > 0

                )

                .sort(

                    (a,b)=>

                        b.score-a.score

                );

        Cache.set(

            "search:"+query,

            results

        );

        EventBus.emit(

            Constants.EVENTS.SEARCH_COMPLETED,

            {

                query,

                total:

                    results.length

            }

        );

        return results;

    }

    /**************************************************************************
     SCORE
    **************************************************************************/

    score(post, query) {

        let score = 0;

        if (

            post.title.includes(query)

        )

            score += 100;

        if (

            post.summary.includes(query)

        )

            score += 40;

        if (

            post.content.includes(query)

        )

            score += 10;

        post.categories.forEach(cat => {

            if (

                cat.includes(query)

            )

                score += 30;

        });

        return score;

    }

    /**************************************************************************
     FIND ID
    **************************************************************************/

    byId(id) {

        return this.posts.find(

            post =>

                post.id === id

        );

    }

    /**************************************************************************
     FIND SLUG
    **************************************************************************/

    bySlug(slug) {

        return this.posts.find(

            post =>

                post.slug === slug

        );

    }

    /**************************************************************************
     CLEAR CACHE
    **************************************************************************/

    clearCache() {

        this.cache.clear();

    }

    /**************************************************************************
     REINDEX
    **************************************************************************/

    rebuild() {

        this.posts =

            App.module("api").all();

        this.buildIndex();

    }

    /**************************************************************************
     STATS
    **************************************************************************/

    statistics() {

        return {

            documents:

                this.index.length,

            cache:

                Cache.statistics(),

            initialized:

                this.initialized

        };

    }

    /**************************************************************************
     HEALTH
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Search Engine"

        );

        Logger.table(

            this.statistics()

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            version:

                Config.APP.VERSION,

            initialized:

                this.initialized,

            documents:

                this.index.length

        };

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.posts = [];

        this.index = [];

        this.cache.clear();

        this.initialized = false;

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.SearchEngine = new SearchEngine();

/******************************************************************************
 MULTI SEARCH
******************************************************************************/

searchAll(query) {

    if (!query)
        return [];

    const terms = query
        .toLowerCase()
        .trim()
        .split(/\s+/);

    const results = this.index
        .map(item => {

            let score = 0;

            terms.forEach(term => {

                score += this.score(item, term);

            });

            return {

                score,

                post: item.object

            };

        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);

    return results;

}

/******************************************************************************
 CATEGORY
******************************************************************************/

byCategory(category) {

    category = category.toLowerCase();

    return this.posts.filter(post =>

        post.categories.some(cat =>

            cat.toLowerCase() === category

        )

    );

}

/******************************************************************************
 YEAR
******************************************************************************/

byYear(year) {

    return this.posts.filter(post =>

        post.published.getFullYear() == year

    );

}

/******************************************************************************
 MONTH
******************************************************************************/

byMonth(year, month) {

    return this.posts.filter(post =>

        post.published.getFullYear() == year &&

        (post.published.getMonth() + 1) == month

    );

}

/******************************************************************************
 AUTHOR
******************************************************************************/

byAuthor(author) {

    author = author.toLowerCase();

    return this.posts.filter(post =>

        post.author

            .toLowerCase()

            .includes(author)

    );

}

/******************************************************************************
 AUTOCOMPLETE
******************************************************************************/

autocomplete(query, limit = 10) {

    query = query.toLowerCase();

    const titles = this.posts

        .filter(post =>

            post.title

                .toLowerCase()

                .includes(query)

        )

        .map(post => post.title)

        .slice(0, limit);

    return [...new Set(titles)];

}

/******************************************************************************
 FUZZY SEARCH
******************************************************************************/

fuzzy(query, tolerance = 2) {

    query = query.toLowerCase();

    return this.posts.filter(post => {

        return this.distance(

            post.title.toLowerCase(),

            query

        ) <= tolerance;

    });

}

/******************************************************************************
 LEVENSHTEIN
******************************************************************************/

distance(a, b) {

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {

        matrix[i] = [i];

    }

    for (let j = 0; j <= a.length; j++) {

        matrix[0][j] = j;

    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b.charAt(i - 1) === a.charAt(j - 1)) {

                matrix[i][j] = matrix[i - 1][j - 1];

            }

            else {

                matrix[i][j] = Math.min(

                    matrix[i - 1][j - 1] + 1,

                    matrix[i][j - 1] + 1,

                    matrix[i - 1][j] + 1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}

/******************************************************************************
 DID YOU MEAN
******************************************************************************/

suggest(query) {

    const suggestions = this.posts

        .map(post => ({

            title: post.title,

            distance: this.distance(

                post.title.toLowerCase(),

                query.toLowerCase()

            )

        }))

        .sort(

            (a, b) =>

                a.distance - b.distance

        );

    return suggestions[0]?.title ?? "";

}

/******************************************************************************
 HISTORY
******************************************************************************/

history() {

    return App.module("storage")

        ?.load(

            Constants.STORAGE_KEYS.SEARCHES,

            []

        ) ?? [];

}

/******************************************************************************
 SAVE HISTORY
******************************************************************************/

saveHistory(query) {

    let history = this.history();

    history = history.filter(

        item => item !== query

    );

    history.unshift(query);

    history = history.slice(

        0,

        Config.SEARCH.HISTORY

    );

    App.module("storage")

        ?.save(

            Constants.STORAGE_KEYS.SEARCHES,

            history

        );

}

/******************************************************************************
 HIGHLIGHT
******************************************************************************/

highlight(text, query) {

    if (!query)

        return text;

    const regex = new RegExp(

        `(${query})`,

        "gi"

    );

    return text.replace(

        regex,

        "<mark>$1</mark>"

    );

}

/******************************************************************************
 CLEAR HISTORY
******************************************************************************/

clearHistory() {

    App.module("storage")

        ?.remove(

            Constants.STORAGE_KEYS.SEARCHES

        );

}

/******************************************************************************
 INVERTED INDEX
******************************************************************************/

buildInvertedIndex() {

    this.invertedIndex = {};

    this.index.forEach(item => {

        const tokens = [

            item.title,

            item.summary,

            item.content,

            ...item.categories

        ]
        .join(" ")
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/);

        [...new Set(tokens)].forEach(token => {

            if (!token)

                return;

            if (!this.invertedIndex[token])

                this.invertedIndex[token] = [];

            this.invertedIndex[token].push(

                item.object

            );

        });

    });

    Logger.info(

        "Inverted index:",

        Object.keys(this.invertedIndex).length,

        "tokens"

    );

}

/******************************************************************************
 BOOLEAN SEARCH
******************************************************************************/

boolean(query) {

    query = query.trim();

    if (query.includes(" AND ")) {

        const terms = query.split(" AND ");

        return this.posts.filter(post =>

            terms.every(term =>

                this.score({

                    title: post.title.toLowerCase(),

                    summary: post.summary.toLowerCase(),

                    content: Utils.stripHTML(post.content).toLowerCase(),

                    categories: post.categories.map(c=>c.toLowerCase())

                }, term.toLowerCase()) > 0

            )

        );

    }

    if (query.includes(" OR ")) {

        const terms = query.split(" OR ");

        return this.posts.filter(post =>

            terms.some(term =>

                this.score({

                    title: post.title.toLowerCase(),

                    summary: post.summary.toLowerCase(),

                    content: Utils.stripHTML(post.content).toLowerCase(),

                    categories: post.categories.map(c=>c.toLowerCase())

                }, term.toLowerCase()) > 0

            )

        );

    }

    if (query.startsWith("NOT ")) {

        const term = query.substring(4).toLowerCase();

        return this.posts.filter(post =>

            this.score({

                title: post.title.toLowerCase(),

                summary: post.summary.toLowerCase(),

                content: Utils.stripHTML(post.content).toLowerCase(),

                categories: post.categories.map(c=>c.toLowerCase())

            }, term) === 0

        );

    }

    return this.search(query);

}

/******************************************************************************
 BOOST
******************************************************************************/

boost(results) {

    return results.map(result => {

        let score = result.score;

        const age =

            (Date.now() -

            result.post.published.getTime())

            / 86400000;

        if (age < 30)

            score += 15;

        if (age < 365)

            score += 5;

        return {

            ...result,

            score

        };

    })

    .sort((a,b)=>b.score-a.score);

}

/******************************************************************************
 TOKEN SEARCH
******************************************************************************/

findToken(token) {

    return this.invertedIndex[token.toLowerCase()] ?? [];

}

/******************************************************************************
 INDEX SIZE
******************************************************************************/

indexSize() {

    return Object.keys(

        this.invertedIndex

    ).length;

}

/******************************************************************************
 EXPORT INDEX
******************************************************************************/

exportIndex() {

    return JSON.stringify({

        generated:

            new Date().toISOString(),

        documents:

            this.index.length,

        tokens:

            this.indexSize(),

        index:

            this.invertedIndex

    }, null, 2);

}

/******************************************************************************
 IMPORT INDEX
******************************************************************************/

importIndex(json) {

    try {

        this.invertedIndex =

            JSON.parse(json).index;

        Logger.success(

            "Index imported."

        );

    }

    catch(error) {

        Logger.error(error);

    }

}

/******************************************************************************
 REINDEX
******************************************************************************/

reindex() {

    Logger.info(

        "Rebuilding index..."

    );

    this.posts =

        App.module("api").all();

    this.buildIndex();

    this.buildInvertedIndex();

}

/******************************************************************************
 EVENTS
******************************************************************************/

bindEvents() {

    EventBus.on(

        Constants.EVENTS.POSTS_UPDATED,

        () => {

            this.reindex();

        }

    );

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        documents:

            this.index.length,

        tokens:

            this.indexSize(),

        cache:

            Cache.statistics(),

        searches:

            this.history().length,

        initialized:

            this.initialized

    };

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Search Engine"

    );

    Logger.table(

        this.report()

    );

    Logger.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        version:

            Config.APP.VERSION,

        initialized:

            this.initialized,

        documents:

            this.index.length,

        tokens:

            this.indexSize(),

        cache:

            Cache.statistics()

    };

}

/******************************************************************************
 VERSION
******************************************************************************/

version() {

    return Config.APP.VERSION;

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.posts = [];

    this.index = [];

    this.invertedIndex = {};

    this.cache.clear();

    this.initialized = false;

    Logger.warn(

        "Search Engine destroyed."

    );

}

