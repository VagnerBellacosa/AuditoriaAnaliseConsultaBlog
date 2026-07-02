/******************************************************************************
 Bellacosa Mainframe Library
 router.js
 PARTE 1
******************************************************************************/

"use strict";

class Router {

    constructor() {

        this.current = {};

        this.started = false;

    }

    /**************************************************************************
     START
    **************************************************************************/

    start() {

        if (this.started)
            return;

        this.started = true;
		
this.initializeHistory();

this.restore();

this.startTimer();

this.loadFromURL();

this.applyPath();

this.prefetch();

this.bindEvents();

this.bindLinks();

this.stopTimer();

this.track();

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    bindEvents() {

        window.addEventListener(

            "popstate",

            () => this.loadFromURL()

        );

    }

    /**************************************************************************
     URL
    **************************************************************************/

    getURL() {

        return new URL(

            window.location.href

        );

    }

    /**************************************************************************
     PARAM
    **************************************************************************/

    get(name, fallback = "") {

        return this.getURL()

            .searchParams

            .get(name) ?? fallback;

    }

    /**************************************************************************
     SET PARAM
    **************************************************************************/

    set(name, value) {

        const url = this.getURL();

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            url.searchParams.delete(name);

        }

        else {

            url.searchParams.set(

                name,

                value

            );

        }

        history.replaceState(

            {},

            "",

            url

        );

    }

    /**************************************************************************
     REMOVE
    **************************************************************************/

    remove(name) {

        const url = this.getURL();

        url.searchParams.delete(name);

        history.replaceState(

            {},

            "",

            url

        );

    }

    /**************************************************************************
     LIMPA URL
    **************************************************************************/

    clear() {

        history.replaceState(

            {},

            "",

            window.location.pathname

        );

    }

    /**************************************************************************
     FILTROS
    **************************************************************************/

    updateFilters(filters = {}) {

        this.set(

            "year",

            filters.year

        );

        this.set(

            "month",

            filters.month

        );

        this.set(

            "category",

            filters.category

        );

        this.set(

            "order",

            filters.order

        );

    }

    /**************************************************************************
     SEARCH
    **************************************************************************/

    updateSearch(query = "") {

        this.set(

            "search",

            query

        );

    }

    /**************************************************************************
     LÊ URL
    **************************************************************************/

    loadFromURL() {

        this.current = {

            year:

                this.get("year"),

            month:

                this.get("month"),

            category:

                this.get("category"),

            order:

                this.get(

                    "order",

                    "newest"

                ),

            search:

                this.get("search")

        };

        this.applyRoute();

    }

    /**************************************************************************
     APLICA
    **************************************************************************/

    apply() {

        if (

            window.filters

        ) {

            filters.filters.year =

                this.current.year;

            filters.filters.month =

                this.current.month;

            filters.filters.category =

                this.current.category;

            filters.filters.order =

                this.current.order;

        }

        if (

            window.search &&

            this.current.search

        ) {

            search.query =

                this.current.search;

        }

        if (

            window.filters

        ) {

            filters.apply();

        }

        if (

            window.search &&

            this.current.search

        ) {

            search.performSearch(

                this.current.search

            );

        }

    }

    /**************************************************************************
     NAVEGAÇÃO
    **************************************************************************/

    navigate(url) {

        history.pushState(

            {},

            "",

            url

        );

        this.startTimer();

this.loadFromURL();

this.stopTimer();

this.track();

this.emit(

    "router:navigate",

    this.current

);

    }

    /**************************************************************************
     PUSH
    **************************************************************************/

    push(params = {}) {

        const url = this.getURL();

        Object.entries(params)

            .forEach(([key,value])=>{

                if (

                    value === "" ||

                    value === null ||

                    value === undefined

                ) {

                    url.searchParams.delete(key);

                }

                else {

                    url.searchParams.set(

                        key,

                        value

                    );

                }

            });

        history.pushState(

            {},

            "",

            url

        );

    }

    /**************************************************************************
     REPLACE
    **************************************************************************/

    replace(params = {}) {

        const url = this.getURL();

        Object.entries(params)

            .forEach(([key,value])=>{

                if (

                    value === "" ||

                    value === null ||

                    value === undefined

                ) {

                    url.searchParams.delete(key);

                }

                else {

                    url.searchParams.set(

                        key,

                        value

                    );

                }

            });

        history.replaceState(

            {},

            "",

            url

        );

    }

    /**************************************************************************
     URL ATUAL
    **************************************************************************/

    currentURL() {

        return window.location.href;

    }

    /**************************************************************************
     QUERY
    **************************************************************************/

    currentQuery() {

        return {

            ...this.current

        };

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

            started:

                this.started,

            route:

                this.current,

            url:

                this.currentURL()

        };

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.router = new Router();

/******************************************************************************
 AUTO START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        router.start();

    }

);

/******************************************************************************
 HISTÓRICO
******************************************************************************/

initializeHistory() {

    this.history = [];

}

/******************************************************************************
 ADICIONA HISTÓRICO
******************************************************************************/

addHistory(route = this.current) {

    this.history.push({

        ...route,

        date: Date.now()

    });

    if (this.history.length > 100) {

        this.history.shift();

    }

    if (window.storage) {

        storage.save(

            "router-history",

            this.history

        );

    }

}

/******************************************************************************
 RESTAURA HISTÓRICO
******************************************************************************/

restoreHistory() {

    if (!window.storage)
        return;

    this.history =

        storage.load(

            "router-history",

            []

        );

}

/******************************************************************************
 HISTÓRICO
******************************************************************************/

getHistory() {

    return this.history;

}

/******************************************************************************
 BREADCRUMB
******************************************************************************/

breadcrumb() {

    const items = [];

    items.push({

        label: "Home",

        url: "/"

    });

    if (this.current.year) {

        items.push({

            label: this.current.year,

            url:

                "?year=" +

                this.current.year

        });

    }

    if (this.current.month) {

        items.push({

            label:

                this.current.month,

            url:

                "?month=" +

                this.current.month

        });

    }

    if (this.current.category) {

        items.push({

            label:

                this.current.category,

            url:

                "?category=" +

                encodeURIComponent(

                    this.current.category

                )

        });

    }

    if (this.current.search) {

        items.push({

            label:

                '"' +

                this.current.search +

                '"',

            url:

                "?search=" +

                encodeURIComponent(

                    this.current.search

                )

        });

    }

    return items;

}

/******************************************************************************
 RENDER BREADCRUMB
******************************************************************************/

renderBreadcrumb() {

    const container =

        document.querySelector(

            "#breadcrumb"

        );

    if (!container)
        return;

    container.innerHTML = "";

    this.breadcrumb()

        .forEach(item => {

            const a =

                document.createElement("a");

            a.href = item.url;

            a.textContent =

                item.label;

            a.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    this.navigate(

                        item.url

                    );

                }

            );

            container.appendChild(a);

        });

}

/******************************************************************************
 COMPARTILHAR
******************************************************************************/

async share() {

    const url =

        this.currentURL();

    if (navigator.share) {

        try {

            await navigator.share({

                title:

                    document.title,

                url

            });

            return;

        }

        catch {}

    }

    if (window.Utils) {

        await Utils.copy(url);

    }

    app?.toast(

        "URL copiada.",

        "success"

    );

}

/******************************************************************************
 BACK
******************************************************************************/

back() {

    history.back();

    this.emit(

        "router:back"

    );

}

/******************************************************************************
 FORWARD
******************************************************************************/

forward() {

    history.forward();

    this.emit(

        "router:forward"

    );

}

/******************************************************************************
 HOME
******************************************************************************/

home() {

    this.navigate("/");

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.loadFromURL();

}

/******************************************************************************
 DEEP LINK
******************************************************************************/

deepLink(params = {}) {

    this.push(params);

    this.loadFromURL();

}

/******************************************************************************
 RESTORE
******************************************************************************/

restore() {

    this.restoreHistory();

}

/******************************************************************************
 OVERRIDE APPLY
******************************************************************************/

applyRoute() {

    this.apply();

    this.addHistory();

    this.renderBreadcrumb();

    this.emit(

        "router:change",

        this.current

    );

}

/******************************************************************************
 LINKS INTERNOS
******************************************************************************/

bindLinks() {

    document

        .querySelectorAll(

            "[data-route]"

        )

        .forEach(link => {

            link.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    this.navigate(

                        link.dataset.route

                    );

                }

            );

        });

}

/******************************************************************************
 MÉTODOS
******************************************************************************/

isHome() {

    return Object.values(

        this.current

    ).every(value => !value);

}

hasFilters() {

    return (

        this.current.year ||

        this.current.month ||

        this.current.category ||

        this.current.search

    );

}

/******************************************************************************
 URL LIMPA
******************************************************************************/

cleanURL() {

    this.clear();

    this.loadFromURL();

}

/******************************************************************************
 EXPORT
******************************************************************************/

exportRoute() {

    return JSON.stringify(

        this.current,

        null,

        2

    );

}

/******************************************************************************
 IMPORT
******************************************************************************/

importRoute(json) {

    try {

        const route =

            JSON.parse(json);

        this.deepLink(route);

        return true;

    }

    catch {

        return false;

    }

}

/******************************************************************************
 DIAGNÓSTICO
******************************************************************************/

diagnostics() {

    return {

        history:

            this.history.length,

        current:

            this.current,

        url:

            this.currentURL()

    };

}

/******************************************************************************
 MODAL
******************************************************************************/

openPost(postId) {

    if (!window.blogAPI)
        return false;

    const posts = blogAPI.getPosts();

    const post = posts.find(p =>
        String(p.id) === String(postId)
    );

    if (!post)
        return false;

    if (window.modal) {

        modal.open(post);

        return true;

    }

    return false;

}

/******************************************************************************
 SLUG
******************************************************************************/

openSlug(slug) {

    if (!window.blogAPI)
        return false;

    const posts = blogAPI.getPosts();

    const post = posts.find(post =>

        Utils.slug(post.title) === slug

    );

    if (!post)
        return false;

    modal?.open(post);

    return true;

}

/******************************************************************************
 PREFETCH
******************************************************************************/

prefetch() {

    if (!window.blogAPI)
        return;

    const posts =

        blogAPI.getRecentPosts(10);

    posts.forEach(post => {

        const link =

            document.createElement("link");

        link.rel = "prefetch";

        link.href = post.url;

        document.head.appendChild(link);

    });

}

/******************************************************************************
 ROUTE
******************************************************************************/

parseRoute() {

    const url =

        this.getURL();

    const parts =

        url.pathname

            .split("/")

            .filter(Boolean);

    return parts;

}

/******************************************************************************
 ROTAS
******************************************************************************/

applyPath() {

    const route =

        this.parseRoute();

    if (!route.length)
        return;

    switch(route[0]){

        case "categoria":

            this.deepLink({

                category:

                    decodeURIComponent(

                        route[1]

                    )

            });

            break;

        case "ano":

            this.deepLink({

                year:route[1]

            });

            break;

        case "mes":

            this.deepLink({

                month:route[1]

            });

            break;

        case "post":

            this.openSlug(route[1]);

            break;

    }

}

/******************************************************************************
 404
******************************************************************************/

notFound() {

    const main =

        document.querySelector("main");

    if (!main)
        return;

    main.innerHTML = `

<h1>

404

</h1>

<p>

Conteúdo não encontrado.

</p>

`;

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

track(route = this.currentURL()) {

    if (!this.analytics){

        this.analytics={

            visits:0,

            pages:[]

        };

    }

    this.analytics.visits++;

    this.analytics.pages.push({

        route,

        date:Date.now()

    });

}

/******************************************************************************
 TEMPO
******************************************************************************/

startTimer() {

    this.navigationStart=

        performance.now();

}

stopTimer() {

    this.lastNavigation=

        performance.now()

        -

        this.navigationStart;

}

/******************************************************************************
 HEALTH
******************************************************************************/

healthCheck() {

    console.group(

        "Bellacosa Router"

    );

    console.table({

        Started:

            this.started,

        URL:

            this.currentURL(),

        History:

            this.history.length,

        Visits:

            this.analytics?.visits ?? 0,

        LastNavigation:

            this.lastNavigation?.toFixed(2)+" ms"

    });

    console.groupEnd();

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.current={};

    this.history=[];

    this.analytics={};

}

/******************************************************************************
 RESET
******************************************************************************/

reset() {

    this.clear();

    this.current={};

    this.history=[];

    this.loadFromURL();

}

/******************************************************************************
 RELOAD
******************************************************************************/

reloadRoute() {

    this.loadFromURL();

}

/******************************************************************************
 MÉTRICAS
******************************************************************************/

metrics() {

    return{

        history:

            this.history.length,

        visits:

            this.analytics?.visits ??0,

        navigation:

            this.lastNavigation,

        current:

            this.current

    };

}

/******************************************************************************
 VERSION
******************************************************************************/

version(){

    return"1.0.0";

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics(){

    return{

        router:this.version(),

        current:this.current,

        history:this.history,

        metrics:this.metrics()

    };

}
