/******************************************************************************
 Bellacosa Mainframe Library
 logger.js
******************************************************************************/

"use strict";

class Logger {

    constructor() {

        this.logs = [];

        this.levels = {

            TRACE: 0,

            DEBUG: 1,

            INFO: 2,

            SUCCESS: 3,

            WARN: 4,

            ERROR: 5,

            NONE: 99

        };

        this.level =

            this.levels.INFO;

        this.enabled =

            Config.LOG.ENABLED;

        this.colors = {

            trace: "#6c757d",

            debug: "#0dcaf0",

            info: "#0d6efd",

            success: "#198754",

            warn: "#ffc107",

            error: "#dc3545"

        };

    }

    /**************************************************************************
     CONFIG
    **************************************************************************/

    configure(options = {}) {

        this.enabled =

            options.enabled ??

            this.enabled;

        if (options.level) {

            this.setLevel(

                options.level

            );

        }

    }

    /**************************************************************************
     LEVEL
    **************************************************************************/

    setLevel(level) {

        level =

            String(level)

                .toUpperCase();

        if (

            this.levels[level]

            !== undefined

        ) {

            this.level =

                this.levels[level];

        }

    }

    /**************************************************************************
     SHOULD LOG
    **************************************************************************/

    canLog(level) {

        if (!this.enabled)

            return false;

        return level >= this.level;

    }

    /**************************************************************************
     WRITE
    **************************************************************************/

    write(type, color, args) {

        const entry = {

            time:

                new Date()

                    .toISOString(),

            type,

            message:

                [...args]

        };

        this.logs.push(entry);

        console.log(

            `%c${type}`,

            `color:${color};
             font-weight:bold;`,

            ...args

        );

        EventBus?.emit(

            "logger:message",

            entry

        );

    }

    /**************************************************************************
     TRACE
    **************************************************************************/

    trace(...args) {

        if (

            !this.canLog(

                this.levels.TRACE

            )

        )

            return;

        this.write(

            "TRACE",

            this.colors.trace,

            args

        );

    }

    /**************************************************************************
     DEBUG
    **************************************************************************/

    debug(...args) {

        if (

            !this.canLog(

                this.levels.DEBUG

            )

        )

            return;

        this.write(

            "DEBUG",

            this.colors.debug,

            args

        );

    }

    /**************************************************************************
     INFO
    **************************************************************************/

    info(...args) {

        if (

            !this.canLog(

                this.levels.INFO

            )

        )

            return;

        this.write(

            "INFO",

            this.colors.info,

            args

        );

    }

    /**************************************************************************
     SUCCESS
    **************************************************************************/

    success(...args) {

        if (

            !this.canLog(

                this.levels.SUCCESS

            )

        )

            return;

        this.write(

            "SUCCESS",

            this.colors.success,

            args

        );

    }

    /**************************************************************************
     WARN
    **************************************************************************/

    warn(...args) {

        if (

            !this.canLog(

                this.levels.WARN

            )

        )

            return;

        this.write(

            "WARN",

            this.colors.warn,

            args

        );

    }

    /**************************************************************************
     ERROR
    **************************************************************************/

    error(...args) {

        if (

            !this.canLog(

                this.levels.ERROR

            )

        )

            return;

        this.write(

            "ERROR",

            this.colors.error,

            args

        );

    }

    /**************************************************************************
     TABLE
    **************************************************************************/

    table(data) {

        if (!this.enabled)

            return;

        console.table(data);

    }

    /**************************************************************************
     GROUP
    **************************************************************************/

    group(title) {

        if (!this.enabled)

            return;

        console.group(title);

    }

    groupEnd() {

        if (!this.enabled)

            return;

        console.groupEnd();

    }

    /**************************************************************************
     TIMER
    **************************************************************************/

    time(label) {

        if (!this.enabled)

            return;

        console.time(label);

    }

    timeEnd(label) {

        if (!this.enabled)

            return;

        console.timeEnd(label);

    }

    /**************************************************************************
     CLEAR
    **************************************************************************/

    clear() {

        this.logs = [];

    }

    /**************************************************************************
     EXPORT
    **************************************************************************/

    export() {

        return JSON.stringify(

            this.logs,

            null,

            2

        );

    }

    /**************************************************************************
     DOWNLOAD
    **************************************************************************/

    download() {

        Utils.download(

            "bellacosa-log.json",

            this.export(),

            "application/json"

        );

    }

    /**************************************************************************
     HEALTH
    **************************************************************************/

    healthCheck() {

        console.group(

            "Bellacosa Logger"

        );

        console.table({

            Enabled:

                this.enabled,

            Level:

                this.level,

            Messages:

                this.logs.length

        });

        console.groupEnd();

    }

    /**************************************************************************
     VERSION
    **************************************************************************/

    version() {

        return Config.APP.VERSION;

    }

}

window.Logger = new Logger();