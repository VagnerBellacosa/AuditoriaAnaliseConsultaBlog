/******************************************************************************
 Bellacosa Mainframe Library
 Analytics Service
 Version 2.0
******************************************************************************/

"use strict";

class AnalyticsService {

    constructor() {

        this.started = false;

        this.session = null;

        this.pageStart = 0;

        this.events = [];

        this.metrics = {

            pageViews: 0,

            clicks: 0,

            scrollDepth: 0,

            sessionTime: 0

        };

        this.config = {

            enabled: Config.ANALYTICS.ENABLED,

            privacy: Config.ANALYTICS.PRIVACY_MODE

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.started)
            return;

        Logger.info(

            "Initializing Analytics Service..."

        );

        this.createSession();

        this.restore();

        this.bindEvents();

        this.trackPageView();

        this.started = true;

        EventBus.emit(

            Constants.EVENTS.ANALYTICS_EVENT,

            {

                type: "initialized"

            }

        );

    }

    /**************************************************************************
     SESSION
    **************************************************************************/

    createSession() {

        this.session = {

            id: crypto.randomUUID(),

            startedAt: Date.now(),

            userAgent: navigator.userAgent,

            language: navigator.language

        };

        this.pageStart = Date.now();

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        DOM.on(

            window,

            "scroll",

            () => this.trackScroll()

        );

        DOM.on(

            document,

            "click",

            event => this.trackClick(event)

        );

        DOM.on(

            window,

            "beforeunload",

            () => this.finishSession()

        );

        EventBus.on(

            Constants.EVENTS.ROUTER_NAVIGATE,

            () => this.trackPageView()

        );

    }

    /**************************************************************************
     TRACK
    **************************************************************************/

    track(type, payload = {}) {

        if (!this.config.enabled)
            return;

        const entry = {

            id: crypto.randomUUID(),

            session: this.session.id,

            type,

            payload,

            timestamp: Date.now()

        };

        this.events.push(entry);

        Cache.set(

            "analytics-events",

            this.events

        );

        Logger.debug(

            "Analytics:",

            type,

            payload

        );

    }

    /**************************************************************************
     PAGE VIEW
    **************************************************************************/

    trackPageView() {

        this.metrics.pageViews++;

        this.track(

            "pageview",

            {

                url: location.href,

                title: document.title

            }

        );

    }

    /**************************************************************************
     CLICK
    **************************************************************************/

    trackClick(event) {

        this.metrics.clicks++;

        this.track(

            "click",

            {

                tag:

                    event.target.tagName,

                id:

                    event.target.id,

                class:

                    event.target.className,

                x:

                    event.clientX,

                y:

                    event.clientY

            }

        );

    }

    /**************************************************************************
     SCROLL
    **************************************************************************/

    trackScroll() {

        const total =

            document.documentElement.scrollHeight -

            window.innerHeight;

        if (total <= 0)
            return;

        const percent = Math.round(

            (window.scrollY / total) * 100

        );

        if (

            percent <=

            this.metrics.scrollDepth

        )

            return;

        this.metrics.scrollDepth = percent;

        this.track(

            "scroll",

            {

                depth: percent

            }

        );

    }

    /**************************************************************************
     SESSION END
    **************************************************************************/

    finishSession() {

        this.metrics.sessionTime =

            Math.floor(

                (Date.now() -

                this.pageStart) / 1000

            );

        this.track(

            "session-end",

            {

                duration:

                    this.metrics.sessionTime

            }

        );

        this.save();

    }

    /**************************************************************************
     STORAGE
    **************************************************************************/

    save() {

        const data = {

            session: this.session,

            metrics: this.metrics,

            events: this.events

        };

        App.module("storage")

            ?.save(

                Constants.STORAGE_KEYS.ANALYTICS,

                data

            );

    }

    restore() {

        const data =

            App.module("storage")

            ?.load(

                Constants.STORAGE_KEYS.ANALYTICS

            );

        if (!data)
            return;

        this.metrics =

            data.metrics ||

            this.metrics;

        this.events =

            data.events ||

            [];

    }

    /**************************************************************************
     API
    **************************************************************************/

    event(name, payload = {}) {

        this.track(

            name,

            payload

        );

    }

    getEvents() {

        return this.events;

    }

    getMetrics() {

        return {

            ...this.metrics

        };

    }

    getSession() {

        return {

            ...this.session

        };

    }

    totalEvents() {

        return this.events.length;

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            started:

                this.started,

            session:

                this.session?.id,

            metrics:

                this.metrics,

            events:

                this.events.length

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Analytics Service"

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

        this.finishSession();

        this.events = [];

        this.started = false;

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.AnalyticsService = new AnalyticsService();

/******************************************************************************
 FAVORITOS
******************************************************************************/

trackFavorite(post) {

    if (!post)
        return;

    this.track(

        "favorite",

        {

            id: post.id,

            title: post.title,

            categories: post.categories

        }

    );

}

/******************************************************************************
 COMPARTILHAMENTO
******************************************************************************/

trackShare(post, platform = "local") {

    if (!post)
        return;

    this.track(

        "share",

        {

            id: post.id,

            title: post.title,

            platform

        }

    );

}

/******************************************************************************
 DOWNLOAD
******************************************************************************/

trackDownload(file) {

    this.track(

        "download",

        {

            file

        }

    );

}

/******************************************************************************
 PESQUISA
******************************************************************************/

trackSearch(query, results = 0) {

    this.track(

        "search",

        {

            query,

            results

        }

    );

}

/******************************************************************************
 FILTROS
******************************************************************************/

trackFilters(filters) {

    this.track(

        "filters",

        filters

    );

}

/******************************************************************************
 POST
******************************************************************************/

trackPost(post) {

    if (!post)
        return;

    this.track(

        "post",

        {

            id: post.id,

            title: post.title,

            category: post.categories,

            published: post.published

        }

    );

}

/******************************************************************************
 HEATMAP
******************************************************************************/

trackHeatmap(event) {

    this.track(

        "heatmap",

        {

            x: event.clientX,

            y: event.clientY,

            width: window.innerWidth,

            height: window.innerHeight,

            scrollY: window.scrollY

        }

    );

}

/******************************************************************************
 CLICK OVERRIDE
******************************************************************************/

trackClick(event) {

    this.metrics.clicks++;

    this.trackHeatmap(event);

    this.track(

        "click",

        {

            tag: event.target.tagName,

            id: event.target.id,

            class: event.target.className,

            text:

                event.target.textContent

                    ?.trim()

                    ?.substring(0,60),

            x: event.clientX,

            y: event.clientY

        }

    );

}

/******************************************************************************
 CONTADOR
******************************************************************************/

count(type) {

    return this.events.filter(

        event => event.type === type

    ).length;

}

/******************************************************************************
 MAIS LIDOS
******************************************************************************/

topPosts(limit = 10) {

    const map = {};

    this.events

        .filter(

            event => event.type === "post"

        )

        .forEach(event => {

            const id = event.payload.id;

            if (!map[id]) {

                map[id] = {

                    id,

                    title: event.payload.title,

                    views: 0

                };

            }

            map[id].views++;

        });

    return Object.values(map)

        .sort(

            (a, b) => b.views - a.views

        )

        .slice(0, limit);

}

/******************************************************************************
 MAIS PESQUISADOS
******************************************************************************/

topSearches(limit = 10) {

    const map = {};

    this.events

        .filter(

            event => event.type === "search"

        )

        .forEach(event => {

            const query = event.payload.query;

            map[query] =

                (map[query] || 0) + 1;

        });

    return Object.entries(map)

        .map(([query, total]) => ({

            query,

            total

        }))

        .sort(

            (a, b) => b.total - a.total

        )

        .slice(0, limit);

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

dashboard() {

    return {

        pageViews:

            this.metrics.pageViews,

        clicks:

            this.metrics.clicks,

        scrollDepth:

            this.metrics.scrollDepth,

        sessionTime:

            this.metrics.sessionTime,

       
	   /******************************************************************************
 PROVIDERS
******************************************************************************/

configureProviders(options = {}) {

    this.providers = {

        ga4: options.ga4 || Config.ANALYTICS.GA4,

        plausible: options.plausible || Config.ANALYTICS.PLAUSIBLE,

        umamiHost: options.umamiHost || "",

        umamiWebsiteId: options.umamiWebsiteId || ""

    };

}

/******************************************************************************
 PRIVACY MODE
******************************************************************************/

privacy(enabled = true) {

    this.config.privacy = enabled;

    Logger.info(

        "Analytics Privacy:",

        enabled ? "ON" : "OFF"

    );

}

/******************************************************************************
 GOOGLE ANALYTICS
******************************************************************************/

sendGA4(event, payload = {}) {

    if (this.config.privacy)
        return;

    if (typeof window.gtag !== "function")
        return;

    window.gtag(

        "event",

        event,

        payload

    );

}

/******************************************************************************
 PLAUSIBLE
******************************************************************************/

sendPlausible(event) {

    if (this.config.privacy)
        return;

    if (typeof window.plausible !== "function")
        return;

    window.plausible(event);

}

/******************************************************************************
 UMAMI
******************************************************************************/

sendUmami(event, payload = {}) {

    if (this.config.privacy)
        return;

    if (!window.umami)
        return;

    window.umami.track(

        event,

        payload

    );

}

/******************************************************************************
 OVERRIDE TRACK
******************************************************************************/

track(type, payload = {}) {

    if (!this.config.enabled)
        return;

    const entry = {

        id: crypto.randomUUID(),

        session: this.session.id,

        type,

        payload,

        timestamp: Date.now()

    };

    this.events.push(entry);

    Cache.set(

        "analytics-events",

        this.events

    );

    this.sendGA4(type, payload);

    this.sendPlausible(type);

    this.sendUmami(type, payload);

    EventBus.emit(

        Constants.EVENTS.ANALYTICS_EVENT,

        entry

    );

}

/******************************************************************************
 EXPORT JSON
******************************************************************************/

exportJSON() {

    return JSON.stringify(

        {

            session: this.session,

            metrics: this.metrics,

            dashboard: this.dashboard(),

            report: this.report(),

            events: this.events

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

        "date,type,data"

    ];

    this.events.forEach(event => {

        rows.push([

            new Date(event.timestamp)

                .toISOString(),

            event.type,

            JSON.stringify(event.payload)

        ].join(","));

    });

    return rows.join("\n");

}

/******************************************************************************
 DOWNLOAD JSON
******************************************************************************/

downloadJSON() {

    Utils.download(

        "analytics.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 DOWNLOAD CSV
******************************************************************************/

downloadCSV() {

    Utils.download(

        "analytics.csv",

        this.exportCSV(),

        "text/csv"

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

        session:

            this.getSession(),

        dashboard:

            this.dashboard(),

        metrics:

            this.getMetrics(),

        topPosts:

            this.topPosts(),

        topSearches:

            this.topSearches(),

        totalEvents:

            this.totalEvents()

    };

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.restore();

    Logger.info(

        "Analytics reloaded."

    );

}

/******************************************************************************
 RESET
******************************************************************************/

reset() {

    this.events = [];

    this.metrics = {

        pageViews: 0,

        clicks: 0,

        scrollDepth: 0,

        sessionTime: 0

    };

    Cache.delete(

        "analytics-events"

    );

    App.module("storage")

        ?.remove(

            Constants.STORAGE_KEYS.ANALYTICS

        );

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Analytics Service"

    );

    Logger.table({

        Started:

            this.started,

        Privacy:

            this.config.privacy,

        Events:

            this.events.length,

        PageViews:

            this.metrics.pageViews,

        Clicks:

            this.metrics.clicks,

        Scroll:

            this.metrics.scrollDepth,

        Session:

            this.session?.id,

        Cache:

            Cache.statistics()

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

        providers:

            this.providers,

        session:

            this.session,

        metrics:

            this.metrics,

        dashboard:

            this.dashboard(),

        events:

            this.events.length

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

    this.finishSession();

    this.events = [];

    this.started = false;

    Logger.warn(

        "Analytics destroyed."

    );

}
	   