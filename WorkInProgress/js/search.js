/******************************************************************************
 Bellacosa Mainframe Library
 search.js
 PARTE 1
******************************************************************************/

"use strict";

class Search {

    constructor() {

        this.posts = [];

        this.index = [];

        this.results = [];

        this.query = "";

        this.delay = 300;

        this.timer = null;

        this.input = null;

        this.onSearch = null;

    }

    /**************************************************************************
     START
    **************************************************************************/

    async initialize() {

        if (!window.blogAPI)
            return;

        if (!blogAPI.isLoaded()) {

            await blogAPI.initialize();

        }

        this.posts = blogAPI.getPosts();
		
		this.buildIndex();
		
		this.cacheDOM();
		
		this.initializeAutocomplete();
		
		this.bindEvents();
		
		this.bindClearButton();
		
		this.restore();

    }

    /**************************************************************************
     DOM
    **************************************************************************/

    cacheDOM() {

        this.input =

            document.querySelector("#searchInput");

    }

    /**************************************************************************
     INDEXAÇÃO
    **************************************************************************/

    buildIndex() {

        this.index = this.posts.map(post => {

            return {

                id: post.id,

                post,

                text: Utils.normalize(

                    [

                        post.title,

                        post.summary,

                        post.content,

                        post.categories.join(" ")

                    ].join(" ")

                )

            };

        });

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        if (!this.input)
            return;

        this.input.addEventListener(

            "input",

            event => {

                this.debounce(() => {

                    this.performSearch(

                        event.target.value

                    );

                });

            }

        );

    }

    /**************************************************************************
     DEBOUNCE
    **************************************************************************/

    debounce(callback) {

        clearTimeout(this.timer);

        this.timer =

            setTimeout(

                callback,

                this.delay

            );

    }

    /**************************************************************************
     SEARCH
    **************************************************************************/

    search(text = "") {

        this.query = text.trim();

        if (!this.query.length) {

            this.results = [...this.posts];

            this.update();

            return;

        }

        const query =

            Utils.normalize(this.query);

        this.results =

            this.index

                .filter(item =>

                    item.text.includes(query)

                )

                .map(item => item.post);

        this.update();

    }

    /**************************************************************************
     UPDATE
    **************************************************************************/

    update() {

        if (window.filters) {

            filters.setSearch(

                this.query

            );

        }

        else if (window.cards) {

            cards.setPosts(

                this.results

            );

        }

        if (

            typeof this.onSearch ===

            "function"

        ) {

            this.onSearch(

                this.results

            );

        }

        this.emit(

            "search:changed",

            this.results

        );

    }

    /**************************************************************************
     LIMPAR
    **************************************************************************/

    clear() {

        if (this.input)

            this.input.value = "";

        this.query = "";

        this.results = [...this.posts];

        this.update();

    }

    /**************************************************************************
     POSTS
    **************************************************************************/

    getResults() {

        return this.results;

    }

    /**************************************************************************
     TOTAL
    **************************************************************************/

    count() {

        return this.results.length;

    }

    /**************************************************************************
     QUERY
    **************************************************************************/

    getQuery() {

        return this.query;

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    emit(name, detail = null) {

        document.dispatchEvent(

            new CustomEvent(

                name,

                {

                    detail

                }

            )

        );

    }

    on(name, callback) {

        document.addEventListener(

            name,

            callback

        );

    }

    /**************************************************************************
     INFO
    **************************************************************************/

    info() {

        return {

            posts:

                this.posts.length,

            indexed:

                this.index.length,

            results:

                this.results.length,

            query:

                this.query

        };

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.search = new Search();

/******************************************************************************
 AUTO START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await search.initialize();

    }

);

/******************************************************************************
 AUTOCOMPLETE
******************************************************************************/

initializeAutocomplete() {

    this.autocomplete = document.querySelector("#autocomplete");

    if (!this.autocomplete)
        return;

    this.input?.addEventListener("input", () => {

        this.renderSuggestions();

    });

}

/******************************************************************************
 SUGESTÕES
******************************************************************************/

renderSuggestions() {

    if (!this.autocomplete)
        return;

    this.autocomplete.innerHTML = "";

    if (!this.query.length)
        return;

    const query = Utils.normalize(this.query);

    const suggestions = this.index

        .filter(item =>

            item.text.includes(query)

        )

        .slice(0,8);

    suggestions.forEach(item => {

        const div = document.createElement("div");

        div.className = "autocomplete-item";

        div.innerHTML = `

            <strong>${item.post.title}</strong>

            <small>${Utils.dateBR(item.post.published)}</small>

        `;

        div.addEventListener("click",()=>{

            this.input.value = item.post.title;

            this.search(item.post.title);

            this.hideSuggestions();

        });

        this.autocomplete.appendChild(div);

    });

}

/******************************************************************************
 ESCONDE SUGESTÕES
******************************************************************************/

hideSuggestions() {

    if (!this.autocomplete)
        return;

    this.autocomplete.innerHTML = "";

}

/******************************************************************************
 HISTÓRICO
******************************************************************************/

saveHistory(term) {

    if (!window.storage)
        return;

    storage.addSearch(term);

}

loadHistory() {

    if (!window.storage)
        return [];

    return storage.getSearches();

}

/******************************************************************************
 ÚLTIMAS PESQUISAS
******************************************************************************/

renderHistory() {

    if (!this.autocomplete)
        return;

    const history =

        this.loadHistory();

    if (!history.length)
        return;

    this.autocomplete.innerHTML = "";

    history.forEach(term=>{

        const div = document.createElement("div");

        div.className =

            "autocomplete-history";

        div.innerHTML = `

            🕘 ${term}

        `;

        div.onclick=()=>{

            this.input.value = term;

            this.search(term);

        };

        this.autocomplete.appendChild(div);

    });

}

/******************************************************************************
 HIGHLIGHT
******************************************************************************/

highlight(text) {

    if (!this.query)

        return text;

    const regex =

        new RegExp(

            `(${this.query})`,

            "gi"

        );

    return text.replace(

        regex,

        "<mark>$1</mark>"

    );

}

/******************************************************************************
 LIMPA
******************************************************************************/

clearSearch() {

    this.clear();

    this.hideSuggestions();

    this.emit(

        "search:cleared"

    );

}

/******************************************************************************
 RESTORE
******************************************************************************/

restore() {

    if (!window.storage)
        return;

    const value =

        storage.load(

            "last-search",

            ""

        );

    if (!value)
        return;

    this.query = value;

    if (this.input)

        this.input.value = value;

    this.search(value);

}

/******************************************************************************
 SAVE
******************************************************************************/

save() {

    if (!window.storage)
        return;

    storage.save(

        "last-search",

        this.query

    );

}

/******************************************************************************
 POPULAR
******************************************************************************/

popular() {

    const map = {};

    this.posts.forEach(post=>{

        post.categories.forEach(cat=>{

            map[cat] =

                (map[cat]||0)+1;

        });

    });

    return Object.entries(map)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,10);

}

/******************************************************************************
 EVENTOS
******************************************************************************/

startSearch() {

    this.emit(

        "search:started",

        this.query

    );

}

finishSearch() {

    this.emit(

        "search:completed",

        this.results

    );

}

/******************************************************************************
 OVERRIDE SEARCH
******************************************************************************/

performSearch(text) {

    this.startSearch();

    this.search(text);

    this.save();

    this.saveHistory(text);

    this.renderSuggestions();

    this.finishSearch();

}

/******************************************************************************
 CLEAR BUTTON
******************************************************************************/

bindClearButton() {

    const button =

        document.querySelector(

            "#searchClear"

        );

    if (!button)
        return;

    button.addEventListener(

        "click",

        ()=>this.clearSearch()

    );

}

/******************************************************************************
 SHORTCUT
******************************************************************************/

focus() {

    this.input?.focus();

}

/******************************************************************************
 INFO EXTRA
******************************************************************************/

statistics() {

    return {

        searches:

            this.loadHistory().length,

        indexed:

            this.index.length,

        results:

            this.results.length

    };

}

/******************************************************************************
 CACHE
******************************************************************************/

initializeCache() {

    this.cache = new Map();

    this.metrics = {

        searches: 0,

        cacheHits: 0,

        totalTime: 0

    };

}

cacheKey(query) {

    return Utils.normalize(query);

}

loadCache(query) {

    const key = this.cacheKey(query);

    if (this.cache.has(key)) {

        this.metrics.cacheHits++;

        return this.cache.get(key);

    }

    return null;

}

saveCache(query, results) {

    this.cache.set(

        this.cacheKey(query),

        results

    );

}

clearCache() {

    this.cache.clear();

}

/******************************************************************************
 LEVENSHTEIN
******************************************************************************/

levenshtein(a="",b=""){

    const matrix=[];

    for(let i=0;i<=b.length;i++){

        matrix[i]=[i];

    }

    for(let j=0;j<=a.length;j++){

        matrix[0][j]=j;

    }

    for(let i=1;i<=b.length;i++){

        for(let j=1;j<=a.length;j++){

            if(b.charAt(i-1)==a.charAt(j-1))

                matrix[i][j]=matrix[i-1][j-1];

            else{

                matrix[i][j]=Math.min(

                    matrix[i-1][j-1]+1,

                    matrix[i][j-1]+1,

                    matrix[i-1][j]+1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}

/******************************************************************************
 FUZZY SCORE
******************************************************************************/

score(post, query){

    query=Utils.normalize(query);

    let score=0;

    const title=Utils.normalize(post.title);

    const summary=Utils.normalize(post.summary);

    const content=Utils.normalize(post.content);

    if(title.includes(query))

        score+=100;

    if(summary.includes(query))

        score+=50;

    if(content.includes(query))

        score+=20;

    post.categories.forEach(cat=>{

        if(Utils.normalize(cat).includes(query))

            score+=80;

    });

    if(

        this.levenshtein(

            title,

            query

        )<=2

    ){

        score+=60;

    }

    return score;

}

/******************************************************************************
 BUSCA AVANÇADA
******************************************************************************/

advancedSearch(query){

    const cached=

        this.loadCache(query);

    if(cached){

        this.results=cached;

        this.update();

        return;

    }

    const start=

        performance.now();

    this.results=this.posts

        .map(post=>{

            return{

                post,

                score:

                    this.score(post,query)

            };

        })

        .filter(item=>

            item.score>0

        )

        .sort(

            (a,b)=>

                b.score-a.score

        )

        .map(

            item=>item.post

        );

    this.saveCache(

        query,

        this.results

    );

    this.metrics.searches++;

    this.metrics.totalTime+=

        performance.now()-start;

    this.update();

}

/******************************************************************************
 ROUTER
******************************************************************************/

updateRouter(){

    if(!window.router)

        return;

    router.updateSearch(

        this.query

    );

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

averageTime(){

    if(

        this.metrics.searches===0

    )

        return 0;

    return (

        this.metrics.totalTime/

        this.metrics.searches

    ).toFixed(2);

}

/******************************************************************************
 HEALTH
******************************************************************************/

healthCheck(){

    console.group(

        "Bellacosa Search"

    );

    console.table({

        Posts:

            this.posts.length,

        Indexed:

            this.index.length,

        Results:

            this.results.length,

        Cache:

            this.cache.size,

        Searches:

            this.metrics.searches,

        CacheHits:

            this.metrics.cacheHits,

        Average:

            this.averageTime()+" ms"

    });

    console.groupEnd();

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy(){

    this.posts=[];

    this.results=[];

    this.index=[];

    this.clearCache();

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload(){

    this.posts=

        blogAPI.getPosts();

    this.buildIndex();

    this.clearCache();

}

/******************************************************************************
 EXPORT
******************************************************************************/

exportIndex(){

    return JSON.stringify(

        this.index,

        null,

        2

    );

}

/******************************************************************************
 IMPORT
******************************************************************************/

importIndex(json){

    try{

        this.index=

            JSON.parse(json);

        return true;

    }

    catch{

        return false;

    }

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics(){

    return{

        version:"1.0.0",

        indexed:this.index.length,

        posts:this.posts.length,

        cache:this.cache.size,

        searches:this.metrics.searches,

        cacheHits:this.metrics.cacheHits,

        average:this.averageTime()

    };

}

