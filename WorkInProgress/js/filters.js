/******************************************************************************
 Bellacosa Mainframe Library
 filters.js
 PARTE 1
******************************************************************************/

"use strict";

class Filters {

    constructor() {

        this.posts = [];

        this.filteredPosts = [];

        this.filters = {

            year: "",

            month: "",

            category: "",

            order: "newest"

        };

        this.onChange = null;

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

        this.filteredPosts = [...this.posts];

        this.cacheDOM();

        this.populateFilters();

        this.bindEvents();

        this.restoreState();
		
		this.bindClearButton();
		
		this.apply();

    }

    /**************************************************************************
     DOM
    **************************************************************************/

    cacheDOM() {

        this.yearSelect =
            document.querySelector("#filterYear");

        this.monthSelect =
            document.querySelector("#filterMonth");

        this.categorySelect =
            document.querySelector("#filterCategory");

        this.orderSelect =
            document.querySelector("#filterOrder");

    }

    /**************************************************************************
     POPULA ANOS
    **************************************************************************/

    populateYears() {

        if (!this.yearSelect)
            return;

        this.yearSelect.innerHTML =
            `<option value="">Todos os anos</option>`;

        blogAPI.getYears()

            .sort((a,b)=>b-a)

            .forEach(year=>{

                this.yearSelect.insertAdjacentHTML(

                    "beforeend",

                    `<option value="${year}">${year}</option>`

                );

            });

    }

    /**************************************************************************
     POPULA MESES
    **************************************************************************/

    populateMonths() {

        if (!this.monthSelect)
            return;

        const months = [

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

        this.monthSelect.innerHTML =
            `<option value="">Todos os meses</option>`;

        months.forEach((month,index)=>{

            this.monthSelect.insertAdjacentHTML(

                "beforeend",

                `<option value="${index+1}">${month}</option>`

            );

        });

    }

    /**************************************************************************
     POPULA CATEGORIAS
    **************************************************************************/

    populateCategories() {

        if (!this.categorySelect)
            return;

        this.categorySelect.innerHTML =
            `<option value="">Todas as categorias</option>`;

        blogAPI.getCategoriesList()

            .sort()

            .forEach(category=>{

                this.categorySelect.insertAdjacentHTML(

                    "beforeend",

                    `<option value="${category}">${category}</option>`

                );

            });

    }

    /**************************************************************************
     POPULA TODOS
    **************************************************************************/

    populateFilters() {

        this.populateYears();

        this.populateMonths();

        this.populateCategories();

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    bindEvents() {

        this.yearSelect?.addEventListener(

            "change",

            event=>{

                this.filters.year =

                    event.target.value;

                this.apply();

            }

        );

        this.monthSelect?.addEventListener(

            "change",

            event=>{

                this.filters.month =

                    event.target.value;

                this.apply();

            }

        );

        this.categorySelect?.addEventListener(

            "change",

            event=>{

                this.filters.category =

                    event.target.value;

                this.apply();

            }

        );

        this.orderSelect?.addEventListener(

            "change",

            event=>{

                this.filters.order =

                    event.target.value;

                this.apply();

            }

        );

    }

    /**************************************************************************
     FILTRO
    **************************************************************************/

    apply() {

        this.filteredPosts =

            this.posts.filter(post=>{

                if(

                    this.filters.year &&

                    post.published.getFullYear() !=

                    this.filters.year

                )

                    return false;

                if(

                    this.filters.month &&

                    (post.published.getMonth()+1) !=

                    this.filters.month

                )

                    return false;

                if(

                    this.filters.category &&

                    !post.categories.includes(

                        this.filters.category

                    )

                )

                    return false;

                return true;

            });

        this.sort();

        this.update();

    }

    /**************************************************************************
     ORDENA
    **************************************************************************/

    sort() {

        switch(this.filters.order){

            case "oldest":

                this.filteredPosts.sort(

                    (a,b)=>

                        a.published-b.published

                );

                break;

            case "title":

                this.filteredPosts.sort(

                    (a,b)=>

                        a.title.localeCompare(

                            b.title,

                            "pt-BR"

                        )

                );

                break;

            default:

                this.filteredPosts.sort(

                    (a,b)=>

                        b.published-a.published

                );

        }

    }

    /**************************************************************************
     UPDATE
    **************************************************************************/

    update() {

        if (window.cards) {

            cards.setPosts(

                this.filteredPosts

            );

        }

        if (

            typeof this.onChange ===

            "function"

        ) {

            this.onChange(

                this.filteredPosts

            );

        }

    }

    /**************************************************************************
     GETTERS
    **************************************************************************/

    getPosts() {

        return this.filteredPosts;

    }

    getFilters() {

        return {

            ...this.filters

        };

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.filters = new Filters();

/******************************************************************************
 START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await filters.initialize();

    }

);

/******************************************************************************
 BUSCA
******************************************************************************/

setSearch(text = "") {

    this.filters.search = text.trim();

    this.apply();

}

/******************************************************************************
 RESET
******************************************************************************/

reset() {

    this.filters = {

        year: "",

        month: "",

        category: "",

        order: "newest",

        search: ""

    };

    if (this.yearSelect)
        this.yearSelect.value = "";

    if (this.monthSelect)
        this.monthSelect.value = "";

    if (this.categorySelect)
        this.categorySelect.value = "";

    if (this.orderSelect)
        this.orderSelect.value = "newest";

    const search =

        document.querySelector("#searchInput");

    if (search)

        search.value = "";

    this.apply();

    this.emit(

        "filters:reset"

    );

}

/******************************************************************************
 APPLY (sobrescreve a versão da Parte 1)
******************************************************************************/

apply() {

    this.filteredPosts = this.posts.filter(post => {

        if (

            this.filters.year &&

            post.published.getFullYear() != this.filters.year

        )

            return false;

        if (

            this.filters.month &&

            (post.published.getMonth() + 1) != this.filters.month

        )

            return false;

        if (

            this.filters.category &&

            !post.categories.includes(

                this.filters.category

            )

        )

            return false;

        if (this.filters.search) {

            const value =

                Utils.normalize(

                    post.title +

                    " " +

                    post.summary +

                    " " +

                    post.content +

                    " " +

                    post.categories.join(" ")

                );

            if (

                !value.includes(

                    Utils.normalize(

                        this.filters.search

                    )

                )

            )

                return false;

        }

        return true;

    });

    this.sort();

    this.saveState();

    this.update();

    this.renderChips();

    this.updateURL();

    this.emit(

        "filters:changed",

        this.filteredPosts

    );

}

/******************************************************************************
 CHIPS
******************************************************************************/

renderChips() {

    const container =

        document.querySelector(

            "#activeFilters"

        );

    if (!container)

        return;

    container.innerHTML = "";

    Object.entries(this.filters)

        .forEach(([key, value]) => {

            if (

                !value ||

                key === "order"

            )

                return;

            container.insertAdjacentHTML(

                "beforeend",

                `

<div class="filter-chip"

     data-filter="${key}">

    <span>

        ${value}

    </span>

    <button>

        ✕

    </button>

</div>

`

            );

        });

    container

        .querySelectorAll(

            ".filter-chip"

        )

        .forEach(chip => {

            chip.addEventListener(

                "click",

                () => {

                    this.filters[

                        chip.dataset.filter

                    ] = "";

                    this.apply();

                }

            );

        });

}

/******************************************************************************
 LIMPAR
******************************************************************************/

bindClearButton() {

    const button =

        document.querySelector(

            "#clearFilters"

        );

    if (!button)

        return;

    button.addEventListener(

        "click",

        () => this.reset()

    );

}

/******************************************************************************
 STORAGE
******************************************************************************/

saveState() {

    if (!window.storage)

        return;

    storage.saveFilters(

        this.filters

    );

}

restoreState() {

    if (!window.storage)

        return;

    const state =

        storage.loadFilters();

    if (!state)

        return;

    this.filters = {

        ...this.filters,

        ...state

    };

    if (this.yearSelect)

        this.yearSelect.value =

            this.filters.year;

    if (this.monthSelect)

        this.monthSelect.value =

            this.filters.month;

    if (this.categorySelect)

        this.categorySelect.value =

            this.filters.category;

    if (this.orderSelect)

        this.orderSelect.value =

            this.filters.order;

}

/******************************************************************************
 URL
******************************************************************************/

updateURL() {

    if (!window.router)

        return;

    router.updateFilters(

        this.filters

    );

}

/******************************************************************************
 EVENTOS
******************************************************************************/

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

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.posts =

        blogAPI.getPosts();

    this.apply();

}

/******************************************************************************
 CONTADOR
******************************************************************************/

count() {

    return this.filteredPosts.length;

}

/******************************************************************************
 INFO
******************************************************************************/

info() {

    return {

        filters:

            this.filters,

        total:

            this.filteredPosts.length

    };

}

/******************************************************************************
 CACHE
******************************************************************************/

initializeCache() {

    this.cache = new Map();

}

getCacheKey() {

    return JSON.stringify(this.filters);

}

loadCache() {

    return this.cache.get(

        this.getCacheKey()

    );

}

saveCache(posts) {

    this.cache.set(

        this.getCacheKey(),

        posts

    );

}

clearCache() {

    if (this.cache)

        this.cache.clear();

}

/******************************************************************************
 HISTÓRICO
******************************************************************************/

addHistory() {

    if (!window.storage)
        return;

    const history =

        storage.load(

            "filters-history",

            []

        );

    history.unshift({

        date: Date.now(),

        filters: {

            ...this.filters

        }

    });

    storage.save(

        "filters-history",

        history.slice(0,30)

    );

}

getHistory() {

    if (!window.storage)

        return [];

    return storage.load(

        "filters-history",

        []

    );

}

/******************************************************************************
 ESTATÍSTICAS
******************************************************************************/

statistics() {

    const stats = {

        total: this.filteredPosts.length,

        years: {},

        months: {},

        categories: {}

    };

    this.filteredPosts.forEach(post=>{

        const year =

            post.published.getFullYear();

        const month =

            post.published.getMonth()+1;

        stats.years[year] =

            (stats.years[year]||0)+1;

        stats.months[month] =

            (stats.months[month]||0)+1;

        post.categories.forEach(category=>{

            stats.categories[category] =

                (stats.categories[category]||0)+1;

        });

    });

    return stats;

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

updateDashboard() {

    const stats =

        this.statistics();

    document

        .querySelector("#resultCount")

        ?.replaceChildren(

            document.createTextNode(

                stats.total

            )

        );

}

/******************************************************************************
 URL COMPARTILHÁVEL
******************************************************************************/

shareURL() {

    const url =

        window.location.href;

    Utils.copy(url);

    app?.toast(

        "URL copiada.",

        "success"

    );

}

/******************************************************************************
 CACHE APPLY
******************************************************************************/

applyWithCache() {

    const cached =

        this.loadCache();

    if (cached) {

        this.filteredPosts = cached;

        this.update();

        return;

    }

    this.apply();

    this.saveCache(

        this.filteredPosts

    );

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

measure() {

    const start =

        performance.now();

    this.apply();

    const end =

        performance.now();

    console.log(

        "Filtro:",

        (end-start).toFixed(2),

        "ms"

    );

}

/******************************************************************************
 HEALTH
******************************************************************************/

healthCheck() {

    console.group(

        "Bellacosa Filters"

    );

    console.table({

        Posts:

            this.posts.length,

        Filtered:

            this.filteredPosts.length,

        Cache:

            this.cache

                ? this.cache.size

                : 0,

        History:

            this.getHistory().length

    });

    console.groupEnd();

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.posts = [];

    this.filteredPosts = [];

    this.clearCache();

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.posts =

        blogAPI.getPosts();

    this.clearCache();

    this.apply();

}

/******************************************************************************
 RESET CACHE
******************************************************************************/

resetCache() {

    this.clearCache();

    this.apply();

}

/******************************************************************************
 EXPORT
******************************************************************************/

exportFilters() {

    return JSON.stringify(

        this.filters,

        null,

        2

    );

}

/******************************************************************************
 IMPORT
******************************************************************************/

importFilters(json) {

    try{

        this.filters =

            JSON.parse(json);

        this.apply();

        return true;

    }

    catch{

        return false;

    }

}

/******************************************************************************
 START
******************************************************************************/

start() {

    this.initializeCache();

    this.restoreState();

    this.apply();

}

/******************************************************************************
 INFO
******************************************************************************/

version() {

    return "1.0.0";

}