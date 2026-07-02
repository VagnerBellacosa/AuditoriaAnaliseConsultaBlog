/******************************************************************************
 Bellacosa Mainframe Library
 app.js
 PARTE 1
******************************************************************************/

"use strict";

/******************************************************************************
 CONFIGURAÇÃO
******************************************************************************/

const APP_CONFIG = {

    version: "1.0.0",

    themeStorage: "bellacosa-theme",

    scrollOffset: 300,

    enableServiceWorker: true,

    debug: true

};

/******************************************************************************
 APP
******************************************************************************/

class App {

    constructor() {

        this.initialized = false;

        this.modules = {};

        this.theme = "dark";

    }

    /**************************************************************************
     START
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        console.log("");

        console.log("====================================");

        console.log(" Bellacosa Mainframe Library");

        console.log(" Version", APP_CONFIG.version);

        console.log("====================================");

        this.cacheDOM();

        this.restoreTheme();

        this.registerModules();

        this.bindEvents();

        this.initializeProgressBar();

        this.initializeScrollTop();

        this.initializeLoading();

        await this.initializeModules();

        this.registerServiceWorker();

        this.initialized = true;

        this.hideLoading();

        console.log("Aplicação inicializada.");

    }

    /**************************************************************************
     DOM
    **************************************************************************/

    cacheDOM() {

        this.loading =
            document.querySelector("#loading");

        this.progress =
            document.querySelector(".progress-bar");

        this.scrollTopButton =
            document.querySelector("#scrollTop");

        this.themeButton =
            document.querySelector(".theme-toggle");

    }

    /**************************************************************************
     MÓDULOS
    **************************************************************************/

    registerModules() {

        this.modules = {

            api: window.blogAPI,

            cards: window.cards,

            modal: window.modal,

            filters: window.filters,

            search: window.search,

            storage: window.storage,

            router: window.router

        };

    }

    /**************************************************************************
     INICIALIZA MÓDULOS
    **************************************************************************/

    async initializeModules() {

        if (this.modules.cards) {

            await this.modules.cards.start();

        }

    }

    /**************************************************************************
     LOADING
    **************************************************************************/

    initializeLoading() {

        if (!this.loading)
            return;

        this.loading.classList.remove("hidden");

    }

    hideLoading() {

        if (!this.loading)
            return;

        setTimeout(() => {

            this.loading.classList.add("hidden");

        }, 400);

    }

    showLoading() {

        if (!this.loading)
            return;

        this.loading.classList.remove("hidden");

    }

    /**************************************************************************
     PROGRESS BAR
    **************************************************************************/

    initializeProgressBar() {

        window.addEventListener(

            "scroll",

            () => {

                const height =

                    document.documentElement.scrollHeight -

                    window.innerHeight;

                const value =

                    (window.scrollY / height) * 100;

                if (this.progress) {

                    this.progress.style.width =

                        value + "%";

                }

            }

        );

    }

    /**************************************************************************
     SCROLL TOP
    **************************************************************************/

    initializeScrollTop() {

        if (!this.scrollTopButton)
            return;

        window.addEventListener(

            "scroll",

            () => {

                if (

                    window.scrollY >

                    APP_CONFIG.scrollOffset

                ) {

                    this.scrollTopButton.classList.add(

                        "show"

                    );

                }

                else {

                    this.scrollTopButton.classList.remove(

                        "show"

                    );

                }

            }

        );

        this.scrollTopButton.addEventListener(

            "click",

            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }

        );

    }

    /**************************************************************************
     TEMA
    **************************************************************************/

    restoreTheme() {

        const saved =

            localStorage.getItem(

                APP_CONFIG.themeStorage

            );

        if (saved) {

            this.theme = saved;

        }

        this.applyTheme(this.theme);

    }

    applyTheme(theme) {

        document.body.classList.remove(

            "light-theme",

            "auto-theme"

        );

        switch (theme) {

            case "light":

                document.body.classList.add(

                    "light-theme"

                );

                break;

            case "auto":

                document.body.classList.add(

                    "auto-theme"

                );

                break;

        }

        this.theme = theme;

        localStorage.setItem(

            APP_CONFIG.themeStorage,

            theme

        );

    }

    toggleTheme() {

        if (this.theme === "dark") {

            this.applyTheme("light");

        }

        else if (this.theme === "light") {

            this.applyTheme("auto");

        }

        else {

            this.applyTheme("dark");

        }

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    bindEvents() {

        if (this.themeButton) {

            this.themeButton.addEventListener(

                "click",

                () => this.toggleTheme()

            );

        }

        document.addEventListener(

            "visibilitychange",

            () => {

                if (

                    document.visibilityState ===

                    "visible"

                ) {

                    if (APP_CONFIG.debug) {

                        console.log(

                            "Aplicação ativa."

                        );

                    }

                }

            }

        );

    }

    /**************************************************************************
     SERVICE WORKER
    **************************************************************************/

    registerServiceWorker() {

        if (!APP_CONFIG.enableServiceWorker)
            return;

        if (!("serviceWorker" in navigator))
            return;

        navigator.serviceWorker

            .register("service-worker.js")

            .then(() => {

                console.log(

                    "Service Worker registrado."

                );

            })

            .catch(console.error);

    }

}

/******************************************************************************
 EXPORTA
******************************************************************************/

window.app = new App();

/******************************************************************************
 START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await app.initialize();

    }

);

/******************************************************************************
 MENU MOBILE
******************************************************************************/

initializeMobileMenu() {

    this.menuButton =
        document.querySelector(".menu-toggle");

    this.navigation =
        document.querySelector("nav");

    if (!this.menuButton || !this.navigation)
        return;

    this.menuButton.addEventListener("click", () => {

        this.navigation.classList.toggle("mobile-open");

        this.menuButton.classList.toggle("active");

    });

}

/******************************************************************************
 TOAST
******************************************************************************/

toast(message, type = "info", timeout = 3500) {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `

        <strong>${type.toUpperCase()}</strong>

        <div>${message}</div>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 350);

    }, timeout);

}

/******************************************************************************
 SHORTCUTS
******************************************************************************/

initializeShortcuts() {

    document.addEventListener("keydown", event => {

        /* ESC */

        if (event.key === "Escape") {

            if (window.modal)

                window.modal.close?.();

        }

        /* CTRL + K */

        if (event.ctrlKey && event.key.toLowerCase() === "k") {

            event.preventDefault();

            document

                .querySelector("#searchInput")

                ?.focus();

        }

        /* / */

        if (

            event.key === "/" &&

            document.activeElement.tagName !== "INPUT"

        ) {

            event.preventDefault();

            document

                .querySelector("#searchInput")

                ?.focus();

        }

    });

}

/******************************************************************************
 ONLINE
******************************************************************************/

initializeConnectionObserver() {

    window.addEventListener("online", () => {

        this.toast(

            "Conexão restabelecida.",

            "success"

        );

    });

    window.addEventListener("offline", () => {

        this.toast(

            "Você está offline.",

            "warning"

        );

    });

}

/******************************************************************************
 GLOBAL ERROR
******************************************************************************/

initializeErrorHandler() {

    window.onerror = (

        message,

        source,

        line,

        column,

        error

    ) => {

        console.error(

            message,

            source,

            line,

            column,

            error

        );

        this.toast(

            "Erro inesperado.",

            "error"

        );

    };

    window.addEventListener(

        "unhandledrejection",

        event => {

            console.error(event.reason);

            this.toast(

                "Falha na aplicação.",

                "error"

            );

        }

    );

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

initializePerformanceMonitor() {

    if (!window.performance)
        return;

    window.addEventListener("load", () => {

        setTimeout(() => {

            const nav =

                performance

                    .getEntriesByType(

                        "navigation"

                    )[0];

            if (!nav)
                return;

            console.table({

                Load:

                    nav.loadEventEnd.toFixed(0),

                DOM:

                    nav.domComplete.toFixed(0),

                Network:

                    nav.responseEnd.toFixed(0)

            });

        }, 500);

    });

}

/******************************************************************************
 EVENT BUS
******************************************************************************/

emit(name, data = null) {

    document.dispatchEvent(

        new CustomEvent(

            name,

            {

                detail: data

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
 RESIZE
******************************************************************************/

initializeResizeObserver() {

    window.addEventListener(

        "resize",

        () => {

            this.emit(

                "window:resize",

                {

                    width:

                        window.innerWidth,

                    height:

                        window.innerHeight

                }

            );

        }

    );

}

/******************************************************************************
 VISIBILITY
******************************************************************************/

initializeVisibilityObserver() {

    document.addEventListener(

        "visibilitychange",

        () => {

            this.emit(

                "page:visibility",

                {

                    hidden:

                        document.hidden

                }

            );

        }

    );

}

/******************************************************************************
 IDLE TASKS
******************************************************************************/

initializeIdleTasks() {

    if (!window.requestIdleCallback)
        return;

    requestIdleCallback(() => {

        console.log(

            "Idle Tasks"

        );

        this.emit(

            "app:idle"

        );

    });

}

/******************************************************************************
 DEBUG
******************************************************************************/

log(...args) {

    if (!APP_CONFIG.debug)
        return;

    console.log(

        "[Bellacosa]",

        ...args

    );

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.modules = {};

    this.initialized = false;

}

/******************************************************************************
 APP.JS
 PARTE 3
 Integração Geral
******************************************************************************/

/******************************************************************************
 SINCRONIZA MÓDULOS
******************************************************************************/

initializeModulesIntegration() {

    /* API -> CARDS */

    if (window.blogAPI && window.cards) {

        blogAPI.on("refresh", () => {

            cards.refresh(

                blogAPI.getPosts()

            );

            this.toast(

                "Biblioteca atualizada.",

                "success"

            );

        });

    }

    /* FILTERS */

    if (window.filters) {

        filters.onChange = posts => {

            cards.setPosts(posts);

            this.updateDashboard();

        };

    }

    /* SEARCH */

    if (window.search) {

        search.onSearch = posts => {

            cards.setPosts(posts);

            this.updateDashboard();

        };

    }

}

/******************************************************************************
 ROUTER
******************************************************************************/

initializeRouter() {

    if (!window.router)
        return;

    router.start();

}

/******************************************************************************
 RESTAURA ESTADO
******************************************************************************/

restoreState() {

    if (!window.storage)
        return;

    const state = storage.load("app-state");

    if (!state)
        return;

    if (state.theme)
        this.applyTheme(state.theme);

    if (state.scrollY) {

        window.scrollTo({

            top: state.scrollY

        });

    }

}

/******************************************************************************
 SALVA ESTADO
******************************************************************************/

saveState() {

    if (!window.storage)
        return;

    storage.save(

        "app-state",

        {

            theme: this.theme,

            scrollY: window.scrollY,

            date: Date.now()

        }

    );

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

updateDashboard() {

    if (!window.blogAPI)
        return;

    const stats =

        blogAPI.getStatistics();

    const map = {

        totalPosts:

            stats.totalPosts,

        totalCategories:

            stats.totalCategories,

        totalYears:

            stats.totalYears,

        totalMonths:

            stats.totalMonths

    };

    Object.entries(map)

        .forEach(([id,value])=>{

            const el =

                document.getElementById(id);

            if(el)

                el.textContent=value;

        });

}

/******************************************************************************
 PREFETCH
******************************************************************************/

prefetchRecentPosts(limit = 5) {

    if (!window.blogAPI)
        return;

    const posts =

        blogAPI.getRecentPosts(limit);

    posts.forEach(post => {

        const link =

            document.createElement("link");

        link.rel = "prefetch";

        link.href = post.url;

        document.head.appendChild(link);

    });

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    console.group(

        "Bellacosa Health"

    );

    console.log(

        "API",

        !!window.blogAPI

    );

    console.log(

        "Cards",

        !!window.cards

    );

    console.log(

        "Modal",

        !!window.modal

    );

    console.log(

        "Filters",

        !!window.filters

    );

    console.log(

        "Search",

        !!window.search

    );

    console.log(

        "Router",

        !!window.router

    );

    console.groupEnd();

}

/******************************************************************************
 PLUGINS
******************************************************************************/

registerPlugin(plugin) {

    if (!this.plugins)

        this.plugins=[];

    this.plugins.push(plugin);

}

initializePlugins() {

    if (!this.plugins)
        return;

    this.plugins.forEach(plugin=>{

        if(typeof plugin.init==="function")

            plugin.init(this);

    });

}

/******************************************************************************
 AUTO REFRESH
******************************************************************************/

startAutoRefresh(interval = 1000*60*30){

    if(!window.blogAPI)
        return;

    setInterval(async()=>{

        await blogAPI.refresh();

    },interval);

}

/******************************************************************************
 APP INFO
******************************************************************************/

getInfo(){

    return{

        version:

            APP_CONFIG.version,

        theme:

            this.theme,

        initialized:

            this.initialized,

        modules:

            Object.keys(this.modules)

    };

}

/******************************************************************************
 FINALIZAÇÃO
******************************************************************************/

finishInitialization(){

    this.restoreState();

    this.updateDashboard();

    this.prefetchRecentPosts();

    this.initializeModulesIntegration();

    this.initializeRouter();

    this.initializePlugins();

    this.healthCheck();

    this.startAutoRefresh();

    window.addEventListener(

        "beforeunload",

        ()=>this.saveState()

    );

    this.emit(

        "app:ready"

    );

}