/******************************************************************************
 Bellacosa Mainframe Library
 API Service
 Version 2.0
******************************************************************************/

"use strict";

class ApiService {

    constructor() {

        this.posts = [];

        this.feed = null;

        this.loaded = false;

        this.loading = false;

        this.abortController = null;

        this.statistics = {

            downloads: 0,

            cacheHits: 0,

            retries: 0,

            lastUpdate: null

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.loaded)
            return;

        Logger.info(

            "Initializing API Service..."

        );

        await this.load();

    }

    /**************************************************************************
     LOAD
    **************************************************************************/

    async load(force = false) {

        if (this.loading)
            return;

        this.loading = true;

        try {

            const cacheKey = "blog-feed";

            if (

                !force &&

                Cache.has(cacheKey)

            ) {

                this.feed = Cache.get(cacheKey);

                this.statistics.cacheHits++;

                Logger.info(

                    "Feed loaded from cache."

                );

            }

            else {

                this.feed =

                    await this.fetch();

                Cache.set(

                    cacheKey,

                    this.feed,

                    Config.API.CACHE_TTL

                );

            }

            this.loaded = true;

            this.statistics.lastUpdate =

                new Date();

            EventBus.emit(

                Constants.EVENTS.POSTS_LOADED,

                this.feed

            );

        }

        catch (error) {

            Logger.error(error);

            EventBus.emit(

                "api:error",

                error

            );

        }

        finally {

            this.loading = false;

        }

    }

    /**************************************************************************
     FETCH
    **************************************************************************/

    async fetch() {

        this.abortController =

            new AbortController();

        const timeout =

            setTimeout(

                () =>

                    this.abortController.abort(),

                Config.API.TIMEOUT

            );

        try {

            const response =

                await fetch(

                    Config.BLOG.FEED,

                    {

                        signal:

                            this.abortController.signal

                    }

                );

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(

                    response.statusText

                );

            }

            this.statistics.downloads++;

            return await response.json();

        }

        catch (error) {

            clearTimeout(timeout);

            return this.retry(error);

        }

    }

    /**************************************************************************
     RETRY
    **************************************************************************/

    async retry(error) {

        if (

            this.statistics.retries >=

            Config.API.RETRIES

        ) {

            throw error;

        }

        this.statistics.retries++;

        Logger.warn(

            `Retry ${this.statistics.retries}`

        );

        await Utils.sleep(1000);

        return this.fetch();

    }

    /**************************************************************************
     REFRESH
    **************************************************************************/

    async refresh() {

        Logger.info(

            "Refreshing feed..."

        );

        Cache.delete(

            "blog-feed"

        );

        await this.load(true);

    }

    /**************************************************************************
     CANCEL
    **************************************************************************/

    cancel() {

        if (

            this.abortController

        ) {

            this.abortController.abort();

            Logger.warn(

                "Download cancelled."

            );

        }

    }

    /**************************************************************************
     STATUS
    **************************************************************************/

    isLoaded() {

        return this.loaded;

    }

    isLoading() {

        return this.loading;

    }

    /**************************************************************************
     FEED
    **************************************************************************/

    getFeed() {

        return this.feed;

    }

    /**************************************************************************
     POSTS
    **************************************************************************/

    getPosts() {

        return this.posts;

    }

    /**************************************************************************
     TOTAL
    **************************************************************************/

    totalPosts() {

        return this.posts.length;

    }

    /**************************************************************************
     STATS
    **************************************************************************/

    stats() {

        return {

            ...this.statistics,

            loaded: this.loaded,

            loading: this.loading,

            posts: this.posts.length

        };

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            service: "API",

            version: Config.APP.VERSION,

            loaded: this.loaded,

            statistics: this.stats()

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "API Service"

        );

        Logger.table(

            this.stats()

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.cancel();

        this.feed = null;

        this.posts = [];

        this.loaded = false;

        Logger.warn(

            "API destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.ApiService = new ApiService();

/******************************************************************************
 PARSER
******************************************************************************/

parse() {

    if (!this.feed?.feed?.entry) {

        this.posts = [];

        return [];

    }

    this.posts = this.feed.feed.entry.map(

        entry => this.parseEntry(entry)

    );

    Logger.success(

        `${this.posts.length} posts processados.`

    );

    EventBus.emit(

        Constants.EVENTS.POSTS_UPDATED,

        this.posts

    );

    return this.posts;

}

/******************************************************************************
 PARSE ENTRY
******************************************************************************/

parseEntry(entry) {

    const link =

        entry.link?.find(

            item => item.rel === "alternate"

        )?.href ?? "";

    return {

        id:

            entry.id?.$t ?? "",

        title:

            entry.title?.$t ?? "",

        slug:

            Utils.slug(

                entry.title?.$t ?? ""

            ),

        url:

            link,

        summary:

            entry.summary?.$t ?? "",

        content:

            entry.content?.$t ??

            entry.summary?.$t ??

            "",

        author:

            entry.author?.[0]?.name?.$t ??

            "",

        published:

            new Date(

                entry.published?.$t

            ),

        updated:

            new Date(

                entry.updated?.$t

            ),

        categories:

            entry.category

                ?.map(

                    c => c.term

                ) ?? [],

        image:

            this.extractImage(entry),

        readingTime:

            this.readingTime(

                entry.content?.$t ??

                entry.summary?.$t ??

                ""

            )

    };

}

/******************************************************************************
 IMAGEM
******************************************************************************/

extractImage(entry) {

    if (

        entry.media$thumbnail?.url

    ) {

        return entry.media$thumbnail.url

            .replace(

                "/s72-c/",

                "/s1200/"

            );

    }

    const html =

        entry.content?.$t ??

        "";

    const match = html.match(

        /<img[^>]+src=["']([^"']+)["']/i

    );

    if (match)

        return match[1];

    return Config.API.IMAGE_PLACEHOLDER;

}

/******************************************************************************
 LEITURA
******************************************************************************/

readingTime(html) {

    const text = html.replace(

        Constants.REGEX.HTML,

        " "

    );

    const words =

        text.trim()

            .split(/\s+/)

            .length;

    return Math.max(

        1,

        Math.ceil(words / 200)

    );

}

/******************************************************************************
 POSTS
******************************************************************************/

all() {

    return [...this.posts];

}

/******************************************************************************
 ID
******************************************************************************/

findById(id) {

    return this.posts.find(

        post => post.id === id

    ) ?? null;

}

/******************************************************************************
 SLUG
******************************************************************************/

findBySlug(slug) {

    return this.posts.find(

        post => post.slug === slug

    ) ?? null;

}

/******************************************************************************
 URL
******************************************************************************/

findByUrl(url) {

    return this.posts.find(

        post => post.url === url

    ) ?? null;

}

/******************************************************************************
 CATEGORY
******************************************************************************/

findByCategory(category) {

    return this.posts.filter(

        post =>

            post.categories.includes(

                category

            )

    );

}

/******************************************************************************
 YEAR
******************************************************************************/

findByYear(year) {

    return this.posts.filter(

        post =>

            post.published.getFullYear()

            == year

    );

}

/******************************************************************************
 MONTH
******************************************************************************/

findByMonth(year, month) {

    return this.posts.filter(

        post =>

            post.published.getFullYear()

                == year

            &&

            post.published.getMonth()

                == month

    );

}

/******************************************************************************
 RECENTES
******************************************************************************/

recent(limit = 10) {

    return [...this.posts]

        .sort(

            (a,b)=>

                b.published-a.published

        )

        .slice(0,limit);

}

/******************************************************************************
 ANTIGOS
******************************************************************************/

oldest(limit = 10) {

    return [...this.posts]

        .sort(

            (a,b)=>

                a.published-b.published

        )

        .slice(0,limit);

}

/******************************************************************************
 CATEGORIAS
******************************************************************************/

categories() {

    const map = {};

    this.posts.forEach(post=>{

        post.categories.forEach(cat=>{

            map[cat] =

                (map[cat]||0)+1;

        });

    });

    return Object.entries(map)

        .map(([name,total])=>({

            name,

            total

        }))

        .sort(

            (a,b)=>

                b.total-a.total

        );

}

/******************************************************************************
 TIMELINE
******************************************************************************/

timeline() {

    const map={};

    this.posts.forEach(post=>{

        const year=

            post.published.getFullYear();

        const month=

            post.published.getMonth()+1;

        if(!map[year])

            map[year]={};

        if(!map[year][month])

            map[year][month]=[];

        map[year][month]

            .push(post);

    });

    return map;

}

/******************************************************************************
 ANOS
******************************************************************************/

years() {

    return [

        ...new Set(

            this.posts.map(

                post=>

                    post.published

                        .getFullYear()

            )

        )

    ].sort();

}

/******************************************************************************
 MESES
******************************************************************************/

months(year) {

    return [

        ...new Set(

            this.findByYear(year)

                .map(

                    post=>

                        post.published

                            .getMonth()+1

                )

        )

    ].sort();

}

/******************************************************************************
 ESTATÍSTICAS
******************************************************************************/

statistics() {

    return {

        total:

            this.posts.length,

        categories:

            this.categories().length,

        years:

            this.years().length,

        first:

            this.oldest(1)[0] ??

            null,

        last:

            this.recent(1)[0] ??

            null

    };

}

/******************************************************************************
 PAGINAÇÃO
******************************************************************************/

paginate(page = 1, pageSize = Config.PAGINATION.PAGE_SIZE) {

    const start = (page - 1) * pageSize;

    const end = start + pageSize;

    return {

        page,

        pageSize,

        total: this.posts.length,

        totalPages: Math.ceil(

            this.posts.length / pageSize

        ),

        items: this.posts.slice(start, end)

    };

}

/******************************************************************************
 INFINITE SCROLL
******************************************************************************/

next(page = 1) {

    return this.paginate(page + 1);

}

/******************************************************************************
 PREFETCH
******************************************************************************/

prefetch(limit = 5) {

    this.posts

        .slice(0, limit)

        .forEach(post => {

            if (!post.image)

                return;

            const img = new Image();

            img.src = post.image;

        });

    Logger.info(

        `Prefetch: ${limit} imagens`

    );

}

/******************************************************************************
 REFRESH INCREMENTAL
******************************************************************************/

async update() {

    Logger.info(

        "Atualizando feed..."

    );

    await this.refresh();

}

/******************************************************************************
 EXPORT JSON
******************************************************************************/

exportJSON() {

    return JSON.stringify(

        {

            generated:

                new Date().toISOString(),

            statistics:

                this.statistics(),

            posts:

                this.posts

        },

        null,

        2

    );

}

/******************************************************************************
 EXPORT CSV
******************************************************************************/

exportCSV() {

    const rows = [

        [

            "title",

            "author",

            "published",

            "categories",

            "url"

        ].join(",")

    ];

    this.posts.forEach(post => {

        rows.push([

            `"${post.title.replace(/"/g,'""')}"`,

            `"${post.author}"`,

            post.published.toISOString(),

            `"${post.categories.join("|")}"`,

            post.url

        ].join(","));

    });

    return rows.join("\n");

}

/******************************************************************************
 SEARCH INDEX
******************************************************************************/

searchIndex() {

    return this.posts.map(post => ({

        id: post.id,

        slug: post.slug,

        title: post.title,

        summary: post.summary,

        categories: post.categories,

        published: post.published,

        readingTime: post.readingTime

    }));

}

/******************************************************************************
 EXPORT SEARCH INDEX
******************************************************************************/

exportSearchIndex() {

    return JSON.stringify(

        this.searchIndex(),

        null,

        2

    );

}

/******************************************************************************
 FIND RELATED
******************************************************************************/

related(post, limit = 5) {

    if (!post)

        return [];

    return this.posts

        .filter(item =>

            item.id !== post.id &&

            item.categories.some(cat =>

                post.categories.includes(cat)

            )

        )

        .slice(0, limit);

}

/******************************************************************************
 RANDOM POSTS
******************************************************************************/

random(limit = 5) {

    return [...this.posts]

        .sort(() => Math.random() - 0.5)

        .slice(0, limit);

}

/******************************************************************************
 SORT
******************************************************************************/

sort(by = Constants.SORT.NEWEST) {

    const list = [...this.posts];

    switch (by) {

        case Constants.SORT.OLDEST:

            return list.sort(

                (a,b)=>

                    a.published-b.published

            );

        case Constants.SORT.TITLE:

            return list.sort(

                (a,b)=>

                    a.title.localeCompare(b.title)

            );

        default:

            return list.sort(

                (a,b)=>

                    b.published-a.published

            );

    }

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.loaded = false;

    return this.load(true);

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "API Service"

    );

    Logger.table({

        Loaded:

            this.loaded,

        Loading:

            this.loading,

        Posts:

            this.posts.length,

        Downloads:

            this.statistics.downloads,

        CacheHits:

            this.statistics.cacheHits,

        Retries:

            this.statistics.retries,

        Updated:

            this.statistics.lastUpdate

    });

    Logger.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        service: "ApiService",

        version: Config.APP.VERSION,

        loaded: this.loaded,

        loading: this.loading,

        statistics: this.statistics(),

        cache: Cache.statistics(),

        events: EventBus.eventNames()

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

    this.cancel();

    this.posts = [];

    this.feed = null;

    this.loaded = false;

    this.loading = false;

    Cache.delete("blog-feed");

    Logger.warn(

        "API Service destroyed."

    );

}

