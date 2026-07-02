/******************************************************************************
 Bellacosa Mainframe Library
 analytics.js
 PARTE 1
******************************************************************************/

"use strict";

class Analytics {

    constructor() {

        this.sessionId = null;

        this.pageStart = 0;

        this.scrollDepth = 0;

        this.clicks = 0;

        this.pageViews = 0;

        this.events = [];

        this.started = false;

    }

    /**************************************************************************
     START
    **************************************************************************/

    initialize() {

        if (this.started)
            return;

        this.started = true;

        this.createSession();

        this.cacheDOM();

        this.bindEvents();

        this.trackPageView();

    }

    /**************************************************************************
     SESSION
    **************************************************************************/

    createSession() {

        this.sessionId =

            Utils.shortID(16);

        this.pageStart =

            Date.now();

    }

    /**************************************************************************
     DOM
    **************************************************************************/

    cacheDOM() {

        this.body = document.body;

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    bindEvents() {

        window.addEventListener(

            "scroll",

            ()=>this.trackScroll()

        );

        document.addEventListener(

            "click",

            event=>this.trackClick(event)

        );

        window.addEventListener(

            "beforeunload",

            ()=>this.trackTime()

        );

        document.addEventListener(

            "router:navigate",

            ()=>this.trackPageView()

        );

    }

    /**************************************************************************
     PAGE VIEW
    **************************************************************************/

    trackPageView() {

        this.pageViews++;

        this.track(

            "pageview",

            {

                url:

                    window.location.href,

                title:

                    document.title

            }

        );

    }

    /**************************************************************************
     TEMPO
    **************************************************************************/

    trackTime() {

        const seconds =

            Math.floor(

                (Date.now()-this.pageStart)

                /1000

            );

        this.track(

            "time",

            {

                seconds

            }

        );

    }

    /**************************************************************************
     SCROLL
    **************************************************************************/

    trackScroll() {

        const height =

            document.documentElement

                .scrollHeight

            -

            window.innerHeight;

        if(height<=0)
            return;

        const value =

            Math.round(

                window.scrollY

                /height

                *100

            );

        if(value<=this.scrollDepth)
            return;

        this.scrollDepth=value;

        this.track(

            "scroll",

            {

                depth:value

            }

        );

    }

    /**************************************************************************
     CLICK
    **************************************************************************/

    trackClick(event){

        this.clicks++;

        this.track(

            "click",

            {

                tag:

                    event.target.tagName,

                id:

                    event.target.id,

                class:

                    event.target.className

            }

        );

    }

    /**************************************************************************
     EVENTO
    **************************************************************************/

    track(type,data={}){

        const event={

            session:

                this.sessionId,

            date:

                Date.now(),

            type,

            data

        };

        this.events.push(event);

        if(window.storage){

            storage.save(

                "analytics-events",

                this.events

            );

        }

        this.emit(

            "analytics:event",

            event

        );

    }

    /**************************************************************************
     CUSTOM
    **************************************************************************/

    event(name,data={}){

        this.track(

            name,

            data

        );

    }

    /**************************************************************************
     STORAGE
    **************************************************************************/

    save(){

        if(!window.storage)
            return;

        storage.save(

            "analytics",

            {

                session:

                    this.sessionId,

                pageViews:

                    this.pageViews,

                clicks:

                    this.clicks,

                scroll:

                    this.scrollDepth,

                events:

                    this.events

            }

        );

    }

    /**************************************************************************
     LOAD
    **************************************************************************/

    load(){

        if(!window.storage)
            return;

        const value=

            storage.load(

                "analytics"

            );

        if(!value)
            return;

        this.pageViews=

            value.pageViews||0;

        this.clicks=

            value.clicks||0;

        this.scrollDepth=

            value.scroll||0;

        this.events=

            value.events||[];

    }

    /**************************************************************************
     RESET
    **************************************************************************/

    reset(){

        this.events=[];

        this.clicks=0;

        this.pageViews=0;

        this.scrollDepth=0;

    }

    /**************************************************************************
     CONTADORES
    **************************************************************************/

    totalEvents(){

        return this.events.length;

    }

    sessionTime(){

        return Math.floor(

            (Date.now()-this.pageStart)

            /1000

        );

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    emit(name,detail=null){

        document.dispatchEvent(

            new CustomEvent(

                name,

                {

                    detail

                }

            )

        );

    }

    on(name,callback){

        document.addEventListener(

            name,

            callback

        );

    }

    /**************************************************************************
     INFO
    **************************************************************************/

    info(){

        return{

            session:

                this.sessionId,

            pageViews:

                this.pageViews,

            clicks:

                this.clicks,

            scroll:

                this.scrollDepth,

            events:

                this.events.length,

            time:

                this.sessionTime()

        };

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.analytics=new Analytics();

/******************************************************************************
 AUTO START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        analytics.load();

        analytics.initialize();

    }

);

/******************************************************************************
 FAVORITOS
******************************************************************************/

trackFavorite(post) {

    this.track(

        "favorite",

        {

            id: post?.id,

            title: post?.title

        }

    );

}

/******************************************************************************
 COMPARTILHAMENTO
******************************************************************************/

trackShare(post, platform = "local") {

    this.track(

        "share",

        {

            id: post?.id,

            title: post?.title,

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

    this.track(

        "post",

        {

            id: post.id,

            title: post.title,

            categories:

                post.categories

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

            width:

                window.innerWidth,

            height:

                window.innerHeight

        }

    );

}

/******************************************************************************
 OVERRIDE CLICK
******************************************************************************/

trackClick(event){

    this.clicks++;

    this.trackHeatmap(event);

    this.track(

        "click",

        {

            tag:

                event.target.tagName,

            id:

                event.target.id,

            class:

                event.target.className,

            text:

                event.target.textContent

                    ?.substring(0,50)

        }

    );

}

/******************************************************************************
 MAIS LIDOS
******************************************************************************/

topPosts(limit = 10){

    const posts = {};

    this.events

        .filter(

            event=>event.type==="post"

        )

        .forEach(event=>{

            const id =

                event.data.id;

            if(!posts[id]){

                posts[id]={

                    id,

                    title:

                        event.data.title,

                    views:0

                };

            }

            posts[id].views++;

        });

    return Object.values(posts)

        .sort(

            (a,b)=>

                b.views-a.views

        )

        .slice(0,limit);

}

/******************************************************************************
 MAIS PESQUISAS
******************************************************************************/

topSearches(limit=10){

    const map={};

    this.events

        .filter(

            event=>

                event.type==="search"

        )

        .forEach(event=>{

            const q=

                event.data.query;

            map[q]=(map[q]||0)+1;

        });

    return Object.entries(map)

        .sort(

            (a,b)=>b[1]-a[1]

        )

        .slice(0,limit);

}

/******************************************************************************
 EVENTOS
******************************************************************************/

count(type){

    return this.events

        .filter(

            event=>

                event.type===type

        ).length;

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

dashboard(){

    return{

        pageViews:

            this.pageViews,

        clicks:

            this.clicks,

        scroll:

            this.scrollDepth,

        favorites:

            this.count(

                "favorite"

            ),

        shares:

            this.count(

                "share"

            ),

        downloads:

            this.count(

                "download"

            ),

        searches:

            this.count(

                "search"

            ),

        filters:

            this.count(

                "filters"

            ),

        posts:

            this.count(

                "post"

            ),

        events:

            this.events.length

    };

}

/******************************************************************************
 EXPORT CSV
******************************************************************************/

exportCSV(){

    const header=

        "date,type,data\n";

    const body=

        this.events

        .map(event=>{

            return [

                event.date,

                event.type,

                JSON.stringify(

                    event.data

                )

            ].join(",");

        })

        .join("\n");

    return header+body;

}

/******************************************************************************
 EXPORT JSON
******************************************************************************/

exportJSON(){

    return JSON.stringify(

        this.events,

        null,

        2

    );

}

/******************************************************************************
 SAVE DASHBOARD
******************************************************************************/

saveDashboard(){

    if(!window.storage)
        return;

    storage.save(

        "analytics-dashboard",

        this.dashboard()

    );

}

/******************************************************************************
 RESTORE DASHBOARD
******************************************************************************/

restoreDashboard(){

    if(!window.storage)
        return null;

    return storage.load(

        "analytics-dashboard"

    );

}

/******************************************************************************
 CLEAR EVENTS
******************************************************************************/

clearEvents(){

    this.events=[];

    this.save();

}

/******************************************************************************
 UPDATE
******************************************************************************/

update(){

    this.save();

    this.saveDashboard();

}

/******************************************************************************
 REPORT
******************************************************************************/

report(){

    return{

        info:

            this.info(),

        dashboard:

            this.dashboard(),

        topPosts:

            this.topPosts(),

        topSearches:

            this.topSearches()

    };

}

/******************************************************************************
 CONFIGURAÇÃO
******************************************************************************/

configure(options = {}) {

    this.config = {

        privacyMode: true,

        googleAnalytics: "",

        plausibleDomain: "",

        umamiHost: "",

        umamiWebsiteId: "",

        ...options

    };

}

/******************************************************************************
 PRIVACIDADE
******************************************************************************/

privacy(enabled = true) {

    this.config.privacyMode = enabled;

}

/******************************************************************************
 GOOGLE ANALYTICS 4
******************************************************************************/

sendGA4(event, data = {}) {

    if (this.config.privacyMode)
        return;

    if (typeof gtag !== "function")
        return;

    gtag("event", event, data);

}

/******************************************************************************
 PLAUSIBLE
******************************************************************************/

sendPlausible(event) {

    if (this.config.privacyMode)
        return;

    if (typeof plausible !== "function")
        return;

    plausible(event);

}

/******************************************************************************
 UMAMI
******************************************************************************/

sendUmami(event, data = {}) {

    if (this.config.privacyMode)
        return;

    if (typeof umami === "undefined")
        return;

    umami.track(event, data);

}

/******************************************************************************
 OVERRIDE TRACK
******************************************************************************/

track(type, data = {}) {

    const event = {

        session: this.sessionId,

        date: Date.now(),

        type,

        data

    };

    this.events.push(event);

    this.sendGA4(type, data);

    this.sendPlausible(type);

    this.sendUmami(type, data);

    this.update();

    this.emit(

        "analytics:event",

        event

    );

}

/******************************************************************************
 EXPORT
******************************************************************************/

export() {

    return {

        version: "1.0.0",

        generated: new Date().toISOString(),

        session: this.sessionId,

        dashboard: this.dashboard(),

        report: this.report(),

        events: this.events

    };

}

/******************************************************************************
 DOWNLOAD JSON
******************************************************************************/

downloadJSON() {

    Utils.download(

        "analytics.json",

        JSON.stringify(

            this.export(),

            null,

            2

        ),

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
 HEALTH
******************************************************************************/

healthCheck() {

    console.group(

        "Bellacosa Analytics"

    );

    console.table({

        Version: "1.0.0",

        Session: this.sessionId,

        Privacy: this.config.privacyMode,

        Events: this.events.length,

        PageViews: this.pageViews,

        Clicks: this.clicks,

        Scroll: this.scrollDepth,

        Time: this.sessionTime(),

        Cache:

            storage?.stats()?.kb ?? 0

    });

    console.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        version: "1.0.0",

        session: this.sessionId,

        dashboard: this.dashboard(),

        metrics: {

            pageViews: this.pageViews,

            clicks: this.clicks,

            scroll: this.scrollDepth,

            sessionTime: this.sessionTime(),

            totalEvents: this.totalEvents()

        },

        report: this.report()

    };

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.load();

    this.healthCheck();

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.events = [];

    this.pageViews = 0;

    this.clicks = 0;

    this.scrollDepth = 0;

    this.started = false;

}

/******************************************************************************
 RESET
******************************************************************************/

factoryReset() {

    this.destroy();

    storage?.remove("analytics");

    storage?.remove("analytics-events");

    storage?.remove("analytics-dashboard");

}

/******************************************************************************
 VERSION
******************************************************************************/

version() {

    return "1.0.0";

}

/******************************************************************************
 STATUS
******************************************************************************/

status() {

    return {

        started: this.started,

        privacy: this.config.privacyMode,

        session: this.sessionId,

        pageViews: this.pageViews,

        clicks: this.clicks,

        events: this.events.length

    };

}
