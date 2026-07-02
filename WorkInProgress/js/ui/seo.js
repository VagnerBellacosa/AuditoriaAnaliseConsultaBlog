/******************************************************************************
 Bellacosa Mainframe Library
 SEO UI
 Version 2.0
******************************************************************************/

"use strict";

class SEO {

    constructor() {

        this.initialized = false;

        this.defaults = {

            title: Config.SEO.TITLE,

            description: Config.SEO.DESCRIPTION,

            keywords: Config.SEO.KEYWORDS,

            robots: Config.SEO.ROBOTS,

            canonical: location.href

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing SEO..."

        );

        this.ensureBaseTags();

        this.bindEvents();

        this.reset();

        this.initialized = true;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        EventBus.on(

            Constants.EVENTS.ROUTE_CHANGED,

            () => {

                this.setCanonical(

                    location.href

                );

            }

        );

    }

    /**************************************************************************
     TITLE
    **************************************************************************/

    setTitle(title) {

        document.title = title;

    }

    getTitle() {

        return document.title;

    }

    /**************************************************************************
     DESCRIPTION
    **************************************************************************/

    setDescription(text) {

        this.meta(

            "description",

            text

        );

    }

    getDescription() {

        return this.meta(

            "description"

        );

    }

    /**************************************************************************
     KEYWORDS
    **************************************************************************/

    setKeywords(keywords) {

        if (

            Array.isArray(keywords)

        ) {

            keywords =

                keywords.join(", ");

        }

        this.meta(

            "keywords",

            keywords

        );

    }

    getKeywords() {

        return this.meta(

            "keywords"

        );

    }

    /**************************************************************************
     ROBOTS
    **************************************************************************/

    setRobots(value) {

        this.meta(

            "robots",

            value

        );

    }

    getRobots() {

        return this.meta(

            "robots"

        );

    }

    /**************************************************************************
     CANONICAL
    **************************************************************************/

    setCanonical(url) {

        let canonical =

            document.querySelector(

                "link[rel='canonical']"

            );

        if (!canonical) {

            canonical = document.createElement(

                "link"

            );

            canonical.rel =

                "canonical";

            document.head.appendChild(

                canonical

            );

        }

        canonical.href = url;

    }

    getCanonical() {

        return document.querySelector(

            "link[rel='canonical']"

        )?.href ?? "";

    }

    /**************************************************************************
     META
    **************************************************************************/

    meta(name, value) {

        let tag = document.querySelector(

            `meta[name="${name}"]`

        );

        if (!tag) {

            tag = document.createElement(

                "meta"

            );

            tag.name = name;

            document.head.appendChild(tag);

        }

        if (value === undefined)

            return tag.content;

        tag.content = value;

    }

    /**************************************************************************
     LANGUAGE
    **************************************************************************/

    setLanguage(language) {

        document.documentElement.lang =

            language;

    }

    getLanguage() {

        return document.documentElement.lang;

    }

    /**************************************************************************
     CHARSET
    **************************************************************************/

    setCharset(charset = "UTF-8") {

        let tag = document.querySelector(

            "meta[charset]"

        );

        if (!tag) {

            tag = document.createElement(

                "meta"

            );

            tag.setAttribute(

                "charset",

                charset

            );

            document.head.prepend(tag);

        }

    }

    /**************************************************************************
     VIEWPORT
    **************************************************************************/

    setViewport(value) {

        this.meta(

            "viewport",

            value

        );

    }

    /**************************************************************************
     ENSURE TAGS
    **************************************************************************/

    ensureBaseTags() {

        this.setCharset();

        this.setViewport(

            "width=device-width, initial-scale=1"

        );

        this.setLanguage(

            Config.SEO.LANGUAGE

        );

    }

    /**************************************************************************
     RESET
    **************************************************************************/

    reset() {

        this.setTitle(

            this.defaults.title

        );

        this.setDescription(

            this.defaults.description

        );

        this.setKeywords(

            this.defaults.keywords

        );

        this.setRobots(

            this.defaults.robots

        );

        this.setCanonical(

            this.defaults.canonical

        );

    }

    /**************************************************************************
     APPLY POST
    **************************************************************************/

    applyPost(post) {

        if (!post)
            return;

        this.setTitle(

            post.title

        );

        this.setDescription(

            post.summary

        );

        this.setKeywords(

            post.tags ?? []

        );

        this.setCanonical(

            post.url

        );

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            title:

                this.getTitle(),

            canonical:

                this.getCanonical(),

            language:

                this.getLanguage()

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "SEO"

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

        this.initialized = false;

        Logger.warn(

            "SEO destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.SEO = new SEO();

/******************************************************************************
 Bellacosa Mainframe Library
 SEO UI
 Version 2.0
******************************************************************************/

"use strict";

class SEO {

    constructor() {

        this.initialized = false;

        this.defaults = {

            title: Config.SEO.TITLE,

            description: Config.SEO.DESCRIPTION,

            keywords: Config.SEO.KEYWORDS,

            robots: Config.SEO.ROBOTS,

            canonical: location.href

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing SEO..."

        );

        this.ensureBaseTags();

        this.bindEvents();

        this.reset();

        this.initialized = true;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        EventBus.on(

            Constants.EVENTS.ROUTE_CHANGED,

            () => {

                this.setCanonical(

                    location.href

                );

            }

        );

    }

    /**************************************************************************
     TITLE
    **************************************************************************/

    setTitle(title) {

        document.title = title;

    }

    getTitle() {

        return document.title;

    }

    /**************************************************************************
     DESCRIPTION
    **************************************************************************/

    setDescription(text) {

        this.meta(

            "description",

            text

        );

    }

    getDescription() {

        return this.meta(

            "description"

        );

    }

    /**************************************************************************
     KEYWORDS
    **************************************************************************/

    setKeywords(keywords) {

        if (

            Array.isArray(keywords)

        ) {

            keywords =

                keywords.join(", ");

        }

        this.meta(

            "keywords",

            keywords

        );

    }

    getKeywords() {

        return this.meta(

            "keywords"

        );

    }

    /**************************************************************************
     ROBOTS
    **************************************************************************/

    setRobots(value) {

        this.meta(

            "robots",

            value

        );

    }

    getRobots() {

        return this.meta(

            "robots"

        );

    }

    /**************************************************************************
     CANONICAL
    **************************************************************************/

    setCanonical(url) {

        let canonical =

            document.querySelector(

                "link[rel='canonical']"

            );

        if (!canonical) {

            canonical = document.createElement(

                "link"

            );

            canonical.rel =

                "canonical";

            document.head.appendChild(

                canonical

            );

        }

        canonical.href = url;

    }

    getCanonical() {

        return document.querySelector(

            "link[rel='canonical']"

        )?.href ?? "";

    }

    /**************************************************************************
     META
    **************************************************************************/

    meta(name, value) {

        let tag = document.querySelector(

            `meta[name="${name}"]`

        );

        if (!tag) {

            tag = document.createElement(

                "meta"

            );

            tag.name = name;

            document.head.appendChild(tag);

        }

        if (value === undefined)

            return tag.content;

        tag.content = value;

    }

    /**************************************************************************
     LANGUAGE
    **************************************************************************/

    setLanguage(language) {

        document.documentElement.lang =

            language;

    }

    getLanguage() {

        return document.documentElement.lang;

    }

    /**************************************************************************
     CHARSET
    **************************************************************************/

    setCharset(charset = "UTF-8") {

        let tag = document.querySelector(

            "meta[charset]"

        );

        if (!tag) {

            tag = document.createElement(

                "meta"

            );

            tag.setAttribute(

                "charset",

                charset

            );

            document.head.prepend(tag);

        }

    }

    /**************************************************************************
     VIEWPORT
    **************************************************************************/

    setViewport(value) {

        this.meta(

            "viewport",

            value

        );

    }

    /**************************************************************************
     ENSURE TAGS
    **************************************************************************/

    ensureBaseTags() {

        this.setCharset();

        this.setViewport(

            "width=device-width, initial-scale=1"

        );

        this.setLanguage(

            Config.SEO.LANGUAGE

        );

    }

    /**************************************************************************
     RESET
    **************************************************************************/

    reset() {

        this.setTitle(

            this.defaults.title

        );

        this.setDescription(

            this.defaults.description

        );

        this.setKeywords(

            this.defaults.keywords

        );

        this.setRobots(

            this.defaults.robots

        );

        this.setCanonical(

            this.defaults.canonical

        );

    }

    /**************************************************************************
     APPLY POST
    **************************************************************************/

    applyPost(post) {

        if (!post)
            return;

        this.setTitle(

            post.title

        );

        this.setDescription(

            post.summary

        );

        this.setKeywords(

            post.tags ?? []

        );

        this.setCanonical(

            post.url

        );

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            title:

                this.getTitle(),

            canonical:

                this.getCanonical(),

            language:

                this.getLanguage()

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "SEO"

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

        this.initialized = false;

        Logger.warn(

            "SEO destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.SEO = new SEO();

/******************************************************************************
 PERFORMANCE
******************************************************************************/

startMeasure() {

    this.measureStart = performance.now();

}

stopMeasure() {

    this.lastExecutionTime =

        performance.now() -

        this.measureStart;

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

notifyAccessibility(message = "Metadados atualizados.") {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    accessibility.announce(message);

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

track(metadata = {}) {

    const analytics =

        App.module("analytics");

    if (!analytics)
        return;

    analytics.track(

        "seo-update",

        {

            title: this.getTitle(),

            canonical: this.getCanonical(),

            route: location.pathname,

            duration: this.lastExecutionTime,

            ...metadata

        }

    );

}

/******************************************************************************
 APPLY COMPLETE
******************************************************************************/

apply(post) {

    this.startMeasure();

    this.applyMetadata(post);

    this.stopMeasure();

    this.notifyAccessibility();

    this.track({

        article:

            post?.title ?? null

    });

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        title:

            this.getTitle(),

        description:

            this.getDescription(),

        keywords:

            this.getKeywords(),

        canonical:

            this.getCanonical(),

        robots:

            this.getRobots(),

        language:

            this.getLanguage(),

        execution:

            this.lastExecutionTime

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

        "seo-report.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.reset();

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 VALIDATION
******************************************************************************/

validate() {

    return {

        title:

            !!this.getTitle(),

        description:

            !!this.getDescription(),

        keywords:

            !!this.getKeywords(),

        canonical:

            !!this.getCanonical(),

        robots:

            !!this.getRobots(),

        jsonld:

            !!document.getElementById(

                "jsonld-schema"

            )

    };

}

/******************************************************************************
 MISSING TAGS
******************************************************************************/

missingTags() {

    const validation =

        this.validate();

    return Object.keys(validation)

        .filter(

            key =>

                !validation[key]

        );

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

        "SEO"

    );

    Logger.table({

        Initialized:

            this.initialized,

        Enabled:

            this.enabled,

        Title:

            this.getTitle(),

        Canonical:

            this.getCanonical(),

        Execution:

            `${this.lastExecutionTime?.toFixed(2) ?? 0} ms`,

        Missing:

            this.missingTags().join(", ") ||

            "Nenhuma"

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

        initialized:

            this.initialized,

        enabled:

            this.enabled,

        title:

            this.getTitle(),

        description:

            this.getDescription(),

        keywords:

            this.getKeywords(),

        canonical:

            this.getCanonical(),

        robots:

            this.getRobots(),

        language:

            this.getLanguage(),

        execution:

            this.lastExecutionTime,

        validation:

            this.validate()

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

    this.initialized = false;

    this.enabled = true;

    Logger.warn(

        "SEO destroyed."

    );

}