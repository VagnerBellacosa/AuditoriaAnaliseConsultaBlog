/******************************************************************************
 Bellacosa Mainframe Library
 Router UI
 Version 2.0
******************************************************************************/

"use strict";

class RouterUI {

    constructor() {

        this.routes = new Map();

        this.currentRoute = "/";

        this.currentParams = {};

        this.started = false;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.started)
            return;

        Logger.info(

            "Initializing Router UI..."

        );

        this.registerDefaultRoutes();

        this.bindEvents();

        this.resolve();

        this.started = true;

    }

    /**************************************************************************
     DEFAULT ROUTES
    **************************************************************************/

    registerDefaultRoutes() {

        this.add("/", () => this.home());

        this.add("/404", () => this.notFound());

        this.add("/post/:slug", params => {

            this.openPost(params.slug);

        });

    }

    /**************************************************************************
     REGISTER
    **************************************************************************/

    add(path, handler) {

        this.routes.set(

            path,

            handler

        );

    }

    /**************************************************************************
     REMOVE
    **************************************************************************/

    remove(path) {

        this.routes.delete(path);

    }

    /**************************************************************************
     EXISTS
    **************************************************************************/

    exists(path) {

        return this.routes.has(path);

    }

    /**************************************************************************
     NAVIGATE
    **************************************************************************/

    navigate(path, push = true) {

        if (push) {

            history.pushState(

                {},

                "",

                path

            );

        }

        this.currentRoute = path;

        this.resolve();

    }

    /**************************************************************************
     REPLACE
    **************************************************************************/

    replace(path) {

        history.replaceState(

            {},

            "",

            path

        );

        this.currentRoute = path;

        this.resolve();

    }

    /**************************************************************************
     BACK
    **************************************************************************/

    back() {

        history.back();

    }

    /**************************************************************************
     FORWARD
    **************************************************************************/

    forward() {

        history.forward();

    }

    /**************************************************************************
     REFRESH
    **************************************************************************/

    refresh() {

        this.resolve();

    }

    /**************************************************************************
     POPSTATE
    **************************************************************************/

    bindEvents() {

        window.addEventListener(

            "popstate",

            () => {

                this.resolve();

            }

        );

    }

    /**************************************************************************
     RESOLVE
    **************************************************************************/

    resolve() {

        const path =

            location.pathname;

        const match =

            this.match(path);

        if (!match) {

            this.notFound();

            return;

        }

        this.currentRoute = path;

        this.currentParams =

            match.params;

        match.handler(

            match.params

        );

        EventBus.emit(

            Constants.EVENTS.ROUTE_CHANGED,

            {

                route: path,

                params: match.params

            }

        );

    }

    /**************************************************************************
     MATCH
    **************************************************************************/

    match(path) {

        for (

            const [route, handler]

            of this.routes

        ) {

            const params = {};

            const routeParts =

                route.split("/");

            const pathParts =

                path.split("/");

            if (

                routeParts.length !==

                pathParts.length

            )

                continue;

            let matched = true;

            for (

                let i = 0;

                i < routeParts.length;

                i++

            ) {

                const part =

                    routeParts[i];

                if (

                    part.startsWith(":")

                ) {

                    params[

                        part.substring(1)

                    ] =

                        decodeURIComponent(

                            pathParts[i]

                        );

                }

                else if (

                    part !==

                    pathParts[i]

                ) {

                    matched = false;

                    break;

                }

            }

            if (matched)

                return {

                    handler,

                    params

                };

        }

        return null;

    }

    /**************************************************************************
     HOME
    **************************************************************************/

    home() {

        Logger.info(

            "Home"

        );

        EventBus.emit(

            Constants.EVENTS.HOME

        );

    }

    /**************************************************************************
     OPEN POST
    **************************************************************************/

    openPost(slug) {

        const api =

            App.module("api");

        const modal =

            App.module("modal");

        if (

            !api ||

            !modal

        )

            return;

        const post =

            api.findBySlug(slug);

        if (!post) {

            this.notFound();

            return;

        }

        modal.open(post);

    }

    /**************************************************************************
     NOT FOUND
    **************************************************************************/

    notFound() {

        Logger.warn(

            "404"

        );

        EventBus.emit(

            Constants.EVENTS.NOT_FOUND

        );

    }

    /**************************************************************************
     CURRENT ROUTE
    **************************************************************************/

    current() {

        return this.currentRoute;

    }

    /**************************************************************************
     PARAMS
    **************************************************************************/

    params() {

        return {

            ...this.currentParams

        };

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            started:

                this.started,

            route:

                this.currentRoute,

            routes:

                this.routes.size,

            params:

                this.currentParams

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Router UI"

        );

        Logger.table(

            this.diagnostics()

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.routes.clear();

        this.currentParams = {};

        this.currentRoute = "/";

        this.started = false;

        Logger.warn(

            "Router UI destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.RouterUI = new RouterUI();

/******************************************************************************
 QUERY STRING
******************************************************************************/

query() {

    return Object.fromEntries(

        new URLSearchParams(

            location.search

        )

    );

}

/******************************************************************************
 GET QUERY
******************************************************************************/

getQuery(name, defaultValue = null) {

    return this.query()[name] ?? defaultValue;

}

/******************************************************************************
 SET QUERY
******************************************************************************/

setQuery(params = {}) {

    const url = new URL(

        location.href

    );

    Object.entries(params).forEach(

        ([key, value]) => {

            if (

                value === null ||

                value === ""

            ) {

                url.searchParams.delete(key);

            }

            else {

                url.searchParams.set(

                    key,

                    value

                );

            }

        }

    );

    history.replaceState(

        {},

        "",

        url

    );

}

/******************************************************************************
 HASH
******************************************************************************/

hash() {

    return location.hash.replace(

        "#",

        ""

    );

}

/******************************************************************************
 SET HASH
******************************************************************************/

setHash(hash) {

    location.hash = hash;

}

/******************************************************************************
 CLEAR HASH
******************************************************************************/

clearHash() {

    history.replaceState(

        "",

        document.title,

        location.pathname +

        location.search

    );

}

/******************************************************************************
 REDIRECT
******************************************************************************/

redirect(from, to) {

    if (

        location.pathname === from

    ) {

        this.navigate(to);

    }

}

/******************************************************************************
 BEFORE GUARDS
******************************************************************************/

beforeEnter = [];

/******************************************************************************
 AFTER GUARDS
******************************************************************************/

afterEnter = [];

/******************************************************************************
 BEFORE
******************************************************************************/

before(callback) {

    this.beforeEnter.push(

        callback

    );

}

/******************************************************************************
 AFTER
******************************************************************************/

after(callback) {

    this.afterEnter.push(

        callback

    );

}

/******************************************************************************
 EXECUTE BEFORE
******************************************************************************/

runBefore(path) {

    return this.beforeEnter.every(

        callback =>

            callback(path) !== false

    );

}

/******************************************************************************
 EXECUTE AFTER
******************************************************************************/

runAfter(path) {

    this.afterEnter.forEach(

        callback =>

            callback(path)

    );

}

/******************************************************************************
 LAZY ROUTE
******************************************************************************/

lazy(path, loader) {

    this.add(

        path,

        async params => {

            await loader();

            this.resolve();

        }

    );

}

/******************************************************************************
 DYNAMIC ROUTES
******************************************************************************/

register(routes = []) {

    routes.forEach(route => {

        this.add(

            route.path,

            route.handler

        );

    });

}

/******************************************************************************
 REMOVE ROUTES
******************************************************************************/

removeDynamic(path) {

    this.remove(path);

}

/******************************************************************************
 SCROLL SAVE
******************************************************************************/

saveScroll() {

    sessionStorage.setItem(

        "router-scroll",

        window.scrollY

    );

}

/******************************************************************************
 SCROLL RESTORE
******************************************************************************/

restoreScroll() {

    const position =

        Number(

            sessionStorage.getItem(

                "router-scroll"

            )

        );

    window.scrollTo(

        0,

        position

    );

}

/******************************************************************************
 MIDDLEWARE
******************************************************************************/

middleware(callback) {

    this.before(callback);

}

/******************************************************************************
 CURRENT URL
******************************************************************************/

url() {

    return location.href;

}

/******************************************************************************
 PATHNAME
******************************************************************************/

pathname() {

    return location.pathname;

}

/******************************************************************************
 SEARCH
******************************************************************************/

search() {

    return location.search;

}

/******************************************************************************
 FULL PATH
******************************************************************************/

fullPath() {

    return location.pathname +

        location.search +

        location.hash;

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

startMeasure() {

    this.navigationStart = performance.now();

}

stopMeasure() {

    this.lastNavigationTime =

        performance.now() -

        this.navigationStart;

}

/******************************************************************************
 NAMED ROUTES
******************************************************************************/

namedRoutes = new Map();

/******************************************************************************
 REGISTER NAME
******************************************************************************/

name(name, path) {

    this.namedRoutes.set(

        name,

        path

    );

}

/******************************************************************************
 NAVIGATE NAME
******************************************************************************/

navigateTo(name, params = {}) {

    let path =

        this.namedRoutes.get(name);

    if (!path)
        return;

    Object.entries(params).forEach(

        ([key, value]) => {

            path = path.replace(

                `:${key}`,

                encodeURIComponent(value)

            );

        }

    );

    this.navigate(path);

}

/******************************************************************************
 URL BUILDER
******************************************************************************/

build(name, params = {}) {

    let path =

        this.namedRoutes.get(name);

    if (!path)
        return "";

    Object.entries(params).forEach(

        ([key, value]) => {

            path = path.replace(

                `:${key}`,

                encodeURIComponent(value)

            );

        }

    );

    return path;

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

accessibility() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    accessibility.announce(

        `Página carregada`

    );

    const main =

        document.querySelector("main");

    if (main) {

        accessibility.makeFocusable(main);

        main.focus();

    }

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

trackRoute() {

    const analytics =

        App.module("analytics");

    if (!analytics)
        return;

    analytics.track(

        "route-change",

        {

            route:

                this.currentRoute,

            duration:

                this.lastNavigationTime

        }

    );

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        route:

            this.currentRoute,

        params:

            this.currentParams,

        query:

            this.currentQuery,

        hash:

            this.currentHash,

        routes:

            this.routes.size,

        namedRoutes:

            this.namedRoutes.size,

        navigationTime:

            this.lastNavigationTime

    };

}

/******************************************************************************
 EXPORT
******************************************************************************/

exportJSON() {

    return JSON.stringify(

        this.report(),

        null,

        2

    );

}

/******************************************************************************
 DOWNLOAD REPORT
******************************************************************************/

downloadReport() {

    Utils.download(

        "router-report.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 ENABLE
******************************************************************************/

enable() {

    this.enabled = true;

}

/******************************************************************************
 DISABLE
******************************************************************************/

disable() {

    this.enabled = false;

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Router UI"

    );

    Logger.table({

        Started:

            this.started,

        CurrentRoute:

            this.currentRoute,

        Routes:

            this.routes.size,

        NamedRoutes:

            this.namedRoutes.size,

        Query:

            JSON.stringify(

                this.currentQuery

            ),

        Hash:

            this.currentHash,

        Navigation:

            `${this.lastNavigationTime?.toFixed(2) ?? 0} ms`

    });

    Logger.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        version:

            Config.APP.VERSION,

        started:

            this.started,

        enabled:

            this.enabled,

        route:

            this.currentRoute,

        routes:

            this.routes.size,

        namedRoutes:

            this.namedRoutes.size,

        params:

            this.currentParams,

        query:

            this.currentQuery,

        hash:

            this.currentHash,

        navigationTime:

            this.lastNavigationTime

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

    this.routes.clear();

    this.namedRoutes.clear();

    this.currentParams = {};

    this.currentQuery = {};

    this.currentHash = "";

    this.currentRoute = "/";

    this.started = false;

    this.enabled = true;

    Logger.warn(

        "Router UI destroyed."

    );

}

