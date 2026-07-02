/******************************************************************************
 Bellacosa Mainframe Library
 api.js
 PARTE 1
******************************************************************************/

"use strict";

/******************************************************************************
 CONFIGURAÇÃO
******************************************************************************/

const BLOG_CONFIG = {

    // ALTERAR PARA O SEU BLOG
    BLOG_URL:
        "https://eljefemidnightlunch.blogspot.com",

    MAX_RESULTS: 150,

    CACHE_KEY:
        "bellacosa-blog-cache",

    CACHE_TIME:
        1000 * 60 * 30, //30 minutos

    DEFAULT_IMAGE:
        "assets/img/no-image.jpg"

};


/******************************************************************************
 CLASSE PRINCIPAL
******************************************************************************/

class BloggerAPI {

	constructor() {

    this.posts = [];
    this.totalPosts = 0;
    this.loaded = false;
    this.events = {};
}	


    /**************************************************************************
     URL DO FEED
    **************************************************************************/

    buildFeedURL(start = 1) {

        return `${BLOG_CONFIG.BLOG_URL}/feeds/posts/default?alt=json&max-results=${BLOG_CONFIG.MAX_RESULTS}&start-index=${start}`;

    }


    /**************************************************************************
     CACHE
    **************************************************************************/

    loadCache() {

        const cache =
            localStorage.getItem(BLOG_CONFIG.CACHE_KEY);

        if (!cache)
            return null;

        const json =
            JSON.parse(cache);

        if ((Date.now() - json.time) > BLOG_CONFIG.CACHE_TIME)
            return null;

        return json.data;

    }


    saveCache(data) {

        localStorage.setItem(

            BLOG_CONFIG.CACHE_KEY,

            JSON.stringify({

                time: Date.now(),

                data

            })

        );

    }


    clearCache() {

        localStorage.removeItem(

            BLOG_CONFIG.CACHE_KEY

        );

    }


    /**************************************************************************
     DOWNLOAD
    **************************************************************************/

    async fetchFeed(start = 1) {

        const response =

            await fetch(

                this.buildFeedURL(start)

            );

        if (!response.ok)

            throw new Error(

                "Erro lendo Blogger Feed"

            );

        return response.json();

    }


    /**************************************************************************
     TODOS OS POSTS
    **************************************************************************/

    async loadPosts() {

        try {

            const cache =
                this.loadCache();

            if (cache) {

                this.posts = cache;

                this.loaded = true;
				
				this.buildIndexes();

                console.log("Cache carregado.");

                return this.posts;

            }

            console.log("Lendo Blogger Feed...");

            let start = 1;

            let finished = false;

            this.posts = [];

            while (!finished) {

                const json =

                    await this.fetchFeed(start);

                const entries =

                    json.feed.entry || [];

                if (entries.length === 0) {

                    finished = true;

                    break;

                }

                entries.forEach(entry => {

                    this.posts.push(

                        this.normalize(entry)

                    );

                });

                start += BLOG_CONFIG.MAX_RESULTS;

            }

            this.totalPosts =

                this.posts.length;

            this.loaded = true;
			
			this.buildIndexes();

            this.saveCache(this.posts);

            console.log(

                `${this.posts.length} artigos carregados.`

            );

            return this.posts;

        }

        catch (error) {

            console.error(error);

            return [];

        }

    }


    /**************************************************************************
     NORMALIZAÇÃO
    **************************************************************************/

    normalize(entry) {

        return {

            id:

                entry.id.$t,

            title:

                this.getTitle(entry),

            url:

                this.getURL(entry),

            published:

                new Date(

                    entry.published.$t

                ),

            updated:

                new Date(

                    entry.updated.$t

                ),

            categories:

                this.getCategories(entry),

            image:

                this.extractImage(entry),

            summary:

                this.createSummary(entry),

            readingTime:

                this.readingTime(entry),

            content:

                entry.content
                    ? entry.content.$t
                    : ""

        };

    }


    /**************************************************************************
     TÍTULO
    **************************************************************************/

    getTitle(entry) {

        return entry.title
            ? entry.title.$t
            : "";

    }


    /**************************************************************************
     LINK
    **************************************************************************/

    getURL(entry) {

        const link =

            entry.link.find(

                l => l.rel === "alternate"

            );

        return link
            ? link.href
            : "#";

    }


    /**************************************************************************
     CATEGORIAS
    **************************************************************************/

    getCategories(entry) {

        if (!entry.category)
            return [];

        return entry.category.map(

            c => c.term

        );

    }


    /**************************************************************************
     PRIMEIRA IMAGEM
    **************************************************************************/

    extractImage(entry) {

        if (!entry.content)
            return BLOG_CONFIG.DEFAULT_IMAGE;

        const html =
            entry.content.$t;

        const parser =

            new DOMParser();

        const doc =

            parser.parseFromString(

                html,

                "text/html"

            );

        const img =

            doc.querySelector("img");

        if (!img)
            return BLOG_CONFIG.DEFAULT_IMAGE;

        return img.src;

    }


    /**************************************************************************
     RESUMO
    **************************************************************************/

    createSummary(entry) {

        if (!entry.content)
            return "";

        const html =
            entry.content.$t;

        const div =
            document.createElement("div");

        div.innerHTML = html;

        let text =

            div.textContent
                || div.innerText
                || "";

        text =

            text.replace(/\s+/g, " ")

                .trim();

        return text.substring(0, 220) + "...";

    }


    /**************************************************************************
     TEMPO DE LEITURA
    **************************************************************************/

    readingTime(entry) {

        if (!entry.content)
            return "1 min";

        const div =
            document.createElement("div");

        div.innerHTML =
            entry.content.$t;

        const words =

            div.textContent

                .split(/\s+/)

                .length;

        const minutes =

            Math.max(

                1,

                Math.ceil(

                    words / 220

                )

            );

        return `${minutes} min`;

    }


    /**************************************************************************
     GET POSTS
    **************************************************************************/

    getPosts() {

        return this.posts;

    }


    /**************************************************************************
     TOTAL
    **************************************************************************/

    getTotal() {

        return this.posts.length;

    }

}


/******************************************************************************
 EXPORTA
******************************************************************************/

window.blogAPI =

    new BloggerAPI();
	
	
/******************************************************************************
 api.js
 PARTE 2
 Estatísticas • Índices • Dashboard • Consultas
******************************************************************************/

/******************************************************************************
 CRIA ÍNDICES
******************************************************************************/

buildIndexes() {

    this.years = new Set();
    this.months = new Set();
    this.categories = new Set();

    this.postsByYear = {};
    this.postsByMonth = {};
    this.postsByCategory = {};

    this.posts.forEach(post => {

        const year = post.published.getFullYear();

        const month = post.published.getMonth() + 1;

        this.years.add(year);

        this.months.add(month);

        /* -----------------------------
           Índice Ano
        ----------------------------- */

        if (!this.postsByYear[year])
            this.postsByYear[year] = [];

        this.postsByYear[year].push(post);

        /* -----------------------------
           Índice Mês
        ----------------------------- */

        if (!this.postsByMonth[month])
            this.postsByMonth[month] = [];

        this.postsByMonth[month].push(post);

        /* -----------------------------
           Categorias
        ----------------------------- */

        post.categories.forEach(category => {

            this.categories.add(category);

            if (!this.postsByCategory[category])
                this.postsByCategory[category] = [];

            this.postsByCategory[category].push(post);

        });

    });

}

/******************************************************************************
 ANOS
******************************************************************************/

getYears() {

    return [...this.years]

        .sort((a, b) => b - a);

}

/******************************************************************************
 MESES
******************************************************************************/

getMonths() {

    return [...this.months]

        .sort((a, b) => a - b);

}

/******************************************************************************
 CATEGORIAS
******************************************************************************/

getCategoriesList() {

    return [...this.categories]

        .sort((a, b) => a.localeCompare(b));

}

/******************************************************************************
 POSTS POR ANO
******************************************************************************/

getPostsByYear(year) {

    return this.postsByYear[year] || [];

}

/******************************************************************************
 POSTS POR MÊS
******************************************************************************/

getPostsByMonth(month) {

    return this.postsByMonth[month] || [];

}

/******************************************************************************
 POSTS POR CATEGORIA
******************************************************************************/

getPostsByCategory(category) {

    return this.postsByCategory[category] || [];

}

/******************************************************************************
 ESTATÍSTICAS
******************************************************************************/

getStatistics() {

    return {

        totalPosts:

            this.posts.length,

        totalYears:

            this.years.size,

        totalMonths:

            this.months.size,

        totalCategories:

            this.categories.size

    };

}

/******************************************************************************
 POPULA FILTRO DE ANOS
******************************************************************************/

populateYears() {

    const select =

        document.querySelector("#yearFilter");

    if (!select)
        return;

    select.innerHTML =
        '<option value="">Ano</option>';

    this.getYears()

        .forEach(year => {

            select.innerHTML +=

                `<option value="${year}">
                    ${year}
                </option>`;

        });

}

/******************************************************************************
 POPULA FILTRO DE MESES
******************************************************************************/

populateMonths() {

    const nomes = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];

    const select =

        document.querySelector("#monthFilter");

    if (!select)
        return;

    select.innerHTML =
        '<option value="">Mês</option>';

    this.getMonths()

        .forEach(month => {

            select.innerHTML +=

                `<option value="${month}">
                    ${nomes[month-1]}
                </option>`;

        });

}

/******************************************************************************
 POPULA CATEGORIAS
******************************************************************************/

populateCategories() {

    const select =

        document.querySelector("#categoryFilter");

    if (!select)
        return;

    select.innerHTML =
        '<option value="">Categoria</option>';

    this.getCategoriesList()

        .forEach(category => {

            select.innerHTML +=

                `<option value="${category}">
                    ${category}
                </option>`;

        });

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

updateDashboard() {

    const stats =
        this.getStatistics();

    const totalPosts =
        document.querySelector("#totalPosts");

    const totalCategories =
        document.querySelector("#totalCategories");

    const totalYears =
        document.querySelector("#totalYears");

    const lastUpdate =
        document.querySelector("#lastUpdate");

    if (totalPosts)
        totalPosts.textContent =
            stats.totalPosts;

    if (totalCategories)
        totalCategories.textContent =
            stats.totalCategories;

    if (totalYears)
        totalYears.textContent =
            stats.totalYears;

    if (lastUpdate)
        lastUpdate.textContent =
            new Date().toLocaleDateString("pt-BR");

}

/******************************************************************************
 ORDENAÇÃO
******************************************************************************/

sortPosts(mode = "recent") {

    switch (mode) {

        case "recent":

            this.posts.sort(

                (a, b) =>

                    b.published - a.published

            );

            break;

        case "old":

            this.posts.sort(

                (a, b) =>

                    a.published - b.published

            );

            break;

        case "az":

            this.posts.sort(

                (a, b) =>

                    a.title.localeCompare(b.title)

            );

            break;

        case "za":

            this.posts.sort(

                (a, b) =>

                    b.title.localeCompare(a.title)

            );

            break;

    }

}

/******************************************************************************
 INICIALIZA
******************************************************************************/

async initialize() {

    await this.loadPosts();

    this.buildIndexes();

    this.sortPosts();

    this.populateYears();

    this.populateMonths();

    this.populateCategories();

    this.updateDashboard();

    console.log("API inicializada.");

}

/******************************************************************************
 api.js
 PARTE 3
 Busca • Filtros • Relacionados • Trending • Eventos • Paginação
******************************************************************************/

/******************************************************************************
 EVENTOS
******************************************************************************/

on(eventName, callback) {

    if (!this.events)
        this.events = {};

    if (!this.events[eventName])
        this.events[eventName] = [];

    this.events[eventName].push(callback);

}

emit(eventName, data = null) {

    if (!this.events)
        return;

    if (!this.events[eventName])
        return;

    this.events[eventName].forEach(callback => callback(data));

}

/******************************************************************************
 NORMALIZA TEXTO
******************************************************************************/

normalizeText(text = "") {

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}

/******************************************************************************
 BUSCA
******************************************************************************/

search(term = "") {

    if (!term)
        return [...this.posts];

    const search = this.normalizeText(term);

    return this.posts.filter(post => {

        const title =
            this.normalizeText(post.title);

        const summary =
            this.normalizeText(post.summary);

        const content =
            this.normalizeText(post.content);

        const categories =
            this.normalizeText(post.categories.join(" "));

        return (
            title.includes(search) ||
            summary.includes(search) ||
            content.includes(search) ||
            categories.includes(search)
        );

    });

}

/******************************************************************************
 FILTRO COMPLETO
******************************************************************************/

filter(options = {}) {

    let result = [...this.posts];

    if (options.year) {

        result = result.filter(post =>
            post.published.getFullYear() == options.year
        );

    }

    if (options.month) {

        result = result.filter(post =>
            (post.published.getMonth() + 1) == options.month
        );

    }

    if (options.category) {

        result = result.filter(post =>
            post.categories.includes(options.category)
        );

    }

    if (options.text) {

        const text =
            this.normalizeText(options.text);

        result = result.filter(post => {

            return this.normalizeText(

                post.title +
                " " +
                post.summary +
                " " +
                post.content +
                " " +
                post.categories.join(" ")

            ).includes(text);

        });

    }

    return result;

}

/******************************************************************************
 POSTS RECENTES
******************************************************************************/

getRecentPosts(limit = 10) {

    return [...this.posts]

        .sort((a,b)=>b.published-a.published)

        .slice(0,limit);

}

/******************************************************************************
 POSTS ANTIGOS
******************************************************************************/

getOldPosts(limit = 10){

    return [...this.posts]

        .sort((a,b)=>a.published-b.published)

        .slice(0,limit);

}

/******************************************************************************
 POSTS ALEATÓRIOS
******************************************************************************/

getRandomPosts(limit=5){

    return [...this.posts]

        .sort(()=>Math.random()-0.5)

        .slice(0,limit);

}

/******************************************************************************
 POSTS RELACIONADOS
******************************************************************************/

getRelatedPosts(post, limit = 4){

    const related = this.posts.filter(item=>{

        if(item.id===post.id)
            return false;

        return item.categories.some(cat=>
            post.categories.includes(cat)
        );

    });

    return related.slice(0,limit);

}

/******************************************************************************
 TRENDING

(atualmente usa atualização mais recente)

No futuro poderá utilizar Google Analytics
******************************************************************************/

getTrendingPosts(limit=10){

    return [...this.posts]

        .sort((a,b)=>b.updated-a.updated)

        .slice(0,limit);

}

/******************************************************************************
 ÚLTIMA ATUALIZAÇÃO
******************************************************************************/

getLastUpdated(){

    return [...this.posts]

        .sort((a,b)=>b.updated-a.updated)[0];

}

/******************************************************************************
 POSTS POR DATA
******************************************************************************/

getPostsBetween(start,end){

    return this.posts.filter(post=>{

        return post.published>=start &&
               post.published<=end;

    });

}

/******************************************************************************
 PAGINAÇÃO
******************************************************************************/

paginate(posts,page=1,pageSize=12){

    const total=

        posts.length;

    const totalPages=

        Math.ceil(total/pageSize);

    const start=

        (page-1)*pageSize;

    const end=

        start+pageSize;

    return{

        page,

        total,

        totalPages,

        pageSize,

        items:

            posts.slice(start,end)

    };

}

/******************************************************************************
 CARREGAMENTO INFINITO
******************************************************************************/

getPage(page=1,pageSize=12){

    return this.paginate(

        this.posts,

        page,

        pageSize

    );

}

/******************************************************************************
 IMAGENS LAZY
******************************************************************************/

enableLazyImages(){

    const images=

        document.querySelectorAll(

            "img[data-src]"

        );

    const observer=

        new IntersectionObserver(entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    const img=

                        entry.target;

                    img.src=

                        img.dataset.src;

                    img.removeAttribute(

                        "data-src"

                    );

                    observer.unobserve(img);

                }

            });

        });

    images.forEach(img=>observer.observe(img));

}

/******************************************************************************
 ATUALIZA FEED
******************************************************************************/

async refresh(){

    this.clearCache();

    await this.initialize();

    this.emit(

        "refresh",

        this.posts

    );

}

/******************************************************************************
 EXPORTAÇÃO
******************************************************************************/

exportJSON(){

    return JSON.stringify(

        this.posts,

        null,

        2

    );

}

/******************************************************************************
 ESTADO
******************************************************************************/

isLoaded(){

    return this.loaded;

}

/******************************************************************************
 RESUMO GERAL
******************************************************************************/

getInfo(){

    return{

        posts:

            this.posts.length,

        years:

            this.getYears().length,

        months:

            this.getMonths().length,

        categories:

            this.getCategoriesList().length,

        loaded:

            this.loaded,

        cache:

            BLOG_CONFIG.CACHE_KEY

    };

}

