/******************************************************************************
 Bellacosa Mainframe Library
 Application Core
******************************************************************************/

"use strict";

class Application {

    constructor() {

        this.modules = new Map();

        this.services = new Map();

        this.plugins = [];

        this.started = false;

        this.version = Config.APP.VERSION;

    }

    /**************************************************************************
     REGISTER MODULE
    **************************************************************************/

    register(name, instance) {

        if (!name || !instance) {

            throw new Error(

                "Invalid module."

            );

        }

        this.modules.set(

            name,

            instance

        );

        Logger.debug(

            "Module registered:",

            name

        );

        return this;

    }

    /**************************************************************************
     MODULE
    **************************************************************************/

    module(name) {

        return this.modules.get(name);

    }

    /**************************************************************************
     MODULE EXISTS
    **************************************************************************/

    has(name) {

        return this.modules.has(name);

    }

    /**************************************************************************
     SERVICES
    **************************************************************************/

    service(name, value) {

        this.services.set(

            name,

            value

        );

        return this;

    }

    get(name) {

        return (

            this.modules.get(name)

            ||

            this.services.get(name)

        );

    }

    /**************************************************************************
     PLUGINS
    **************************************************************************/

    use(plugin) {

        if (

            typeof plugin.install ===

            "function"

        ) {

            plugin.install(this);

        }

        this.plugins.push(plugin);

        Logger.info(

            "Plugin installed",

            plugin.name ||

            "anonymous"

        );

        return this;

    }

    /**************************************************************************
     START
    **************************************************************************/

    async initialize() {

        if (this.started)

            return;

        Logger.group(

            "Bellacosa Mainframe Library"

        );

        Logger.info(

            Config.APP.NAME

        );

        Logger.info(

            "Version:",

            this.version

        );

        Logger.info(

            "Environment:",

            Config.APP.ENVIRONMENT

        );

        this.started = true;

        await this.initializeModules();

        EventBus.emit(

            Constants.EVENTS.APP_READY

        );

        Logger.success(

            "Application started."

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     MODULES
    **************************************************************************/

    async initializeModules() {

        for (

            const [

                name,

                module

            ]

            of this.modules

        ) {

            try {

                if (

                    typeof module.initialize ===

                    "function"

                ) {

                    Logger.info(

                        "Initializing",

                        name

                    );

                    await module.initialize();

                }

            }

            catch (error) {

                Logger.error(

                    name,

                    error

                );

            }

        }

    }

    /**************************************************************************
     HEALTH
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Application Health"

        );

        Logger.table({

            Modules:

                this.modules.size,

            Services:

                this.services.size,

            Plugins:

                this.plugins.length,

            Started:

                this.started,

            Version:

                this.version

        });

        this.modules.forEach(

            module => {

                if (

                    typeof module.healthCheck ===

                    "function"

                ) {

                    module.healthCheck();

                }

            }

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        const modules = {};

        this.modules.forEach(

            (module, name) => {

                modules[name] =

                    typeof module.diagnostics ===

                    "function"

                        ? module.diagnostics()

                        : "OK";

            }

        );

        return {

            application:

                Config.APP.NAME,

            version:

                this.version,

            started:

                this.started,

            modules,

            plugins:

                this.plugins.map(

                    plugin =>

                        plugin.name

                )

        };

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.modules.forEach(

            module => {

                if (

                    typeof module.destroy ===

                    "function"

                ) {

                    module.destroy();

                }

            }

        );

        this.modules.clear();

        this.services.clear();

        this.plugins = [];

        this.started = false;

        Logger.warn(

            "Application destroyed."

        );

    }

    /**************************************************************************
     RESTART
    **************************************************************************/

    async restart() {

        this.destroy();

        await this.initialize();

    }

    /**************************************************************************
     VERSION
    **************************************************************************/

    getVersion() {

        return this.version;

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.App = new Application();

/******************************************************************************
 REGISTRO DOS MÓDULOS
******************************************************************************/

DOM.ready(async () => {

    App

        .register("api", window.blogAPI)

        .register("storage", window.storage)

        .register("cache", window.Cache)

        .register("search", window.search)

        .register("filters", window.filters)

        .register("cards", window.cards)

        .register("modal", window.modal)

        .register("router", window.router)

        .register("analytics", window.analytics);

    await App.initialize();

});