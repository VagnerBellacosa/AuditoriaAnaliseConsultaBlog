/******************************************************************************
 Bellacosa Mainframe Library
 Storage Service
 Version 2.0
******************************************************************************/

"use strict";

class StorageService {

    constructor() {

        this.prefix = Config.STORAGE.PREFIX;

        this.version = Config.STORAGE.VERSION;

        this.started = false;

        this.statistics = {

            reads: 0,

            writes: 0,

            removes: 0,

            clears: 0

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.started)
            return;

        Logger.info(

            "Initializing Storage Service..."

        );

        this.started = true;

        this.migrate();

        this.bindEvents();

    }

    /**************************************************************************
     KEY
    **************************************************************************/

    key(name) {

        return `${this.prefix}:${name}`;

    }

    /**************************************************************************
     SAVE
    **************************************************************************/

    save(name, value) {

        try {

            localStorage.setItem(

                this.key(name),

                JSON.stringify(value)

            );

            this.statistics.writes++;

            EventBus.emit(

                Constants.EVENTS.STORAGE_UPDATED,

                {

                    action: "save",

                    key: name

                }

            );

            return true;

        }

        catch (error) {

            Logger.error(error);

            return false;

        }

    }

    /**************************************************************************
     LOAD
    **************************************************************************/

    load(name, defaultValue = null) {

        try {

            const value = localStorage.getItem(

                this.key(name)

            );

            this.statistics.reads++;

            if (value === null)

                return defaultValue;

            return JSON.parse(value);

        }

        catch (error) {

            Logger.error(error);

            return defaultValue;

        }

    }

    /**************************************************************************
     REMOVE
    **************************************************************************/

    remove(name) {

        localStorage.removeItem(

            this.key(name)

        );

        this.statistics.removes++;

        EventBus.emit(

            Constants.EVENTS.STORAGE_UPDATED,

            {

                action: "remove",

                key: name

            }

        );

    }

    /**************************************************************************
     EXISTS
    **************************************************************************/

    exists(name) {

        return (

            localStorage.getItem(

                this.key(name)

            ) !== null

        );

    }

    /**************************************************************************
     SESSION SAVE
    **************************************************************************/

    saveSession(name, value) {

        sessionStorage.setItem(

            this.key(name),

            JSON.stringify(value)

        );

    }

    /**************************************************************************
     SESSION LOAD
    **************************************************************************/

    loadSession(name, defaultValue = null) {

        const value =

            sessionStorage.getItem(

                this.key(name)

            );

        if (value === null)

            return defaultValue;

        return JSON.parse(value);

    }

    /**************************************************************************
     SESSION REMOVE
    **************************************************************************/

    removeSession(name) {

        sessionStorage.removeItem(

            this.key(name)

        );

    }

    /**************************************************************************
     CLEAR
    **************************************************************************/

    clear() {

        Object.keys(localStorage)

            .filter(key =>

                key.startsWith(

                    this.prefix + ":"

                )

            )

            .forEach(key =>

                localStorage.removeItem(key)

            );

        this.statistics.clears++;

        Logger.warn(

            "Storage cleared."

        );

    }

    /**************************************************************************
     KEYS
    **************************************************************************/

    keys() {

        return Object.keys(localStorage)

            .filter(key =>

                key.startsWith(

                    this.prefix + ":"

                )

            );

    }

    /**************************************************************************
     SIZE
    **************************************************************************/

    size() {

        return this.keys().length;

    }

    /**************************************************************************
     VERSION
    **************************************************************************/

    getVersion() {

        return this.load(

            "__version__",

            null

        );

    }

    setVersion() {

        this.save(

            "__version__",

            this.version

        );

    }

    /**************************************************************************
     MIGRATION
    **************************************************************************/

    migrate() {

        const current =

            this.getVersion();

        if (

            current === this.version

        )

            return;

        Logger.info(

            "Storage migration",

            current,

            "→",

            this.version

        );

        this.setVersion();

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        window.addEventListener(

            "storage",

            event => {

                if (

                    !event.key ||

                    !event.key.startsWith(

                        this.prefix + ":"

                    )

                )

                    return;

                EventBus.emit(

                    Constants.EVENTS.STORAGE_UPDATED,

                    {

                        key: event.key,

                        oldValue: event.oldValue,

                        newValue: event.newValue

                    }

                );

            }

        );

    }

    /**************************************************************************
     STATISTICS
    **************************************************************************/

    stats() {

        return {

            ...this.statistics,

            keys: this.size(),

            version: this.version

        };

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            service: "Storage",

            started: this.started,

            version: this.version,

            statistics: this.stats()

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Storage Service"

        );

        Logger.table(

            this.stats()

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.started = false;

        Logger.warn(

            "Storage destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.StorageService =

    new StorageService();
	
/******************************************************************************
 BACKUP
******************************************************************************/

backup() {

    const backup = {};

    this.keys().forEach(key => {

        const cleanKey = key.replace(

            this.prefix + ":",

            ""

        );

        backup[cleanKey] = this.load(cleanKey);

    });

    Logger.info(

        "Storage backup created."

    );

    return backup;

}

/******************************************************************************
 RESTORE
******************************************************************************/

restore(data = {}) {

    if (!data)

        return;

    Object.entries(data).forEach(

        ([key, value]) => {

            this.save(

                key,

                value

            );

        }

    );

    Logger.success(

        "Storage restored."

    );

}

/******************************************************************************
 EXPORT JSON
******************************************************************************/

exportJSON() {

    return JSON.stringify(

        {

            application:

                Config.APP.NAME,

            version:

                this.version,

            generated:

                new Date()

                    .toISOString(),

            data:

                this.backup()

        },

        null,

        2

    );

}

/******************************************************************************
 IMPORT JSON
******************************************************************************/

importJSON(json) {

    try {

        const file = JSON.parse(json);

        this.restore(

            file.data

        );

        Logger.success(

            "Storage imported."

        );

        return true;

    }

    catch (error) {

        Logger.error(error);

        return false;

    }

}

/******************************************************************************
 DOWNLOAD BACKUP
******************************************************************************/

downloadBackup() {

    Utils.download(

        "bellacosa-storage.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 STORAGE USAGE
******************************************************************************/

usage() {

    let bytes = 0;

    this.keys().forEach(key => {

        bytes += (

            localStorage.getItem(key)

                ?.length || 0

        );

    });

    return {

        bytes,

        kb:

            (bytes / 1024)

                .toFixed(2),

        mb:

            (bytes / 1024 / 1024)

                .toFixed(2)

    };

}

/******************************************************************************
 LIST
******************************************************************************/

list() {

    return this.keys().map(key => ({

        key,

        value:

            JSON.parse(

                localStorage.getItem(key)

            )

    }));

}

/******************************************************************************
 REMOVE PREFIX
******************************************************************************/

removeByPrefix(prefix) {

    this.keys()

        .filter(key =>

            key.includes(prefix)

        )

        .forEach(key =>

            localStorage.removeItem(key)

        );

    Logger.warn(

        "Prefix removed:",

        prefix

    );

}

/******************************************************************************
 SNAPSHOT
******************************************************************************/

snapshot() {

    return {

        version:

            this.version,

        statistics:

            this.stats(),

        usage:

            this.usage(),

        keys:

            this.list()

    };

}

/******************************************************************************
 STORAGE INFO
******************************************************************************/

info() {

    return {

        totalKeys:

            this.size(),

        usage:

            this.usage(),

        version:

            this.version

    };

}

/******************************************************************************
 SYNC
******************************************************************************/

sync() {

    EventBus.emit(

        Constants.EVENTS.STORAGE_UPDATED,

        this.snapshot()

    );

}

/******************************************************************************
 AUTO SAVE
******************************************************************************/

autoSave(key, callback, interval = 30000) {

    return setInterval(() => {

        const value = callback();

        this.save(

            key,

            value

        );

    }, interval);

}

/******************************************************************************
 AUTO BACKUP
******************************************************************************/

autoBackup(interval = 3600000) {

    return setInterval(() => {

        Logger.info(

            "Automatic backup..."

        );

        this.downloadBackup();

    }, interval);

}

/******************************************************************************
 FIND
******************************************************************************/

find(key) {

    return this.keys()

        .find(item =>

            item.endsWith(

                ":" + key

            )

        ) ?? null;

}

/******************************************************************************
 EXISTS PREFIX
******************************************************************************/

existsPrefix(prefix) {

    return this.keys()

        .some(key =>

            key.includes(prefix)

        );

}

/******************************************************************************
 LAST UPDATE
******************************************************************************/

touch(key) {

    this.save(

        key + ":updated",

        Date.now()

    );

}

/******************************************************************************
 STATISTICS
******************************************************************************/

statistics() {

    return {

        ...this.stats(),

        usage:

            this.usage(),

        totalKeys:

            this.size()

    };

}

/******************************************************************************
 WATCHERS
******************************************************************************/

watchers = new Map();

/******************************************************************************
 WATCH
******************************************************************************/

watch(key, callback) {

    if (typeof callback !== "function")
        return;

    if (!this.watchers.has(key)) {

        this.watchers.set(

            key,

            []

        );

    }

    this.watchers

        .get(key)

        .push(callback);

}

/******************************************************************************
 UNWATCH
******************************************************************************/

unwatch(key, callback) {

    if (!this.watchers.has(key))
        return;

    const list =

        this.watchers

            .get(key)

            .filter(item =>

                item !== callback

            );

    this.watchers.set(

        key,

        list

    );

}

/******************************************************************************
 NOTIFY
******************************************************************************/

notify(key, value) {

    if (!this.watchers.has(key))
        return;

    this.watchers

        .get(key)

        .forEach(callback => {

            try {

                callback(value);

            }

            catch(error) {

                Logger.error(error);

            }

        });

}

/******************************************************************************
 BEGIN TRANSACTION
******************************************************************************/

begin() {

    this.transaction =

        this.backup();

    Logger.info(

        "Transaction started."

    );

}

/******************************************************************************
 COMMIT
******************************************************************************/

commit() {

    this.transaction = null;

    Logger.success(

        "Transaction committed."

    );

}

/******************************************************************************
 ROLLBACK
******************************************************************************/

rollback() {

    if (!this.transaction)
        return;

    this.clear();

    this.restore(

        this.transaction

    );

    this.transaction = null;

    Logger.warn(

        "Rollback executed."

    );

}

/******************************************************************************
 ENCRYPT
******************************************************************************/

encrypt(value) {

    if (

        !Config.STORAGE.ENCRYPTION

    )

        return value;

    return btoa(

        JSON.stringify(value)

    );

}

/******************************************************************************
 DECRYPT
******************************************************************************/

decrypt(value) {

    if (

        !Config.STORAGE.ENCRYPTION

    )

        return value;

    return JSON.parse(

        atob(value)

    );

}

/******************************************************************************
 SAVE ENCRYPTED
******************************************************************************/

saveEncrypted(key, value) {

    return this.save(

        key,

        this.encrypt(value)

    );

}

/******************************************************************************
 LOAD ENCRYPTED
******************************************************************************/

loadEncrypted(key) {

    const value =

        this.load(key);

    if (!value)
        return null;

    return this.decrypt(value);

}

/******************************************************************************
 GARBAGE COLLECTOR
******************************************************************************/

garbageCollector() {

    let removed = 0;

    this.keys().forEach(key => {

        if (

            key.endsWith(":updated")

        ) {

            const time =

                localStorage.getItem(key);

            if (!time)
                return;

            const age =

                Date.now() -

                Number(time);

            if (

                age >

                Config.STORAGE.MAX_METADATA_AGE

            ) {

                localStorage.removeItem(key);

                removed++;

            }

        }

    });

    Logger.info(

        `${removed} metadata removed.`

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
 FACTORY RESET
******************************************************************************/

factoryReset() {

    Logger.warn(

        "Factory Reset..."

    );

    this.clear();

    Cache.clear();

    this.setVersion();

    EventBus.emit(

        Constants.EVENTS.STORAGE_UPDATED,

        {

            action:

                "factory-reset"

        }

    );

}

/******************************************************************************
 OVERRIDE SAVE
******************************************************************************/

save(key, value) {

    try {

        localStorage.setItem(

            this.key(key),

            JSON.stringify(value)

        );

        this.statistics.writes++;

        this.touch(key);

        this.notify(

            key,

            value

        );

        EventBus.emit(

            Constants.EVENTS.STORAGE_UPDATED,

            {

                action: "save",

                key

            }

        );

        return true;

    }

    catch(error) {

        Logger.error(error);

        return false;

    }

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Storage Service"

    );

    Logger.table({

        Started:

            this.started,

        Version:

            this.version,

        Keys:

            this.size(),

        Reads:

            this.statistics.reads,

        Writes:

            this.statistics.writes,

        Removes:

            this.statistics.removes,

        UsageKB:

            this.usage().kb,

        Watchers:

            this.watchers.size

    });

    Logger.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        version:

            this.version,

        started:

            this.started,

        statistics:

            this.statistics(),

        usage:

            this.usage(),

        watchers:

            this.watchers.size,

        transaction:

            this.transaction

                ? true

                : false

    };

}

/******************************************************************************
 VERSION
******************************************************************************/

versionInfo() {

    return this.version;

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.watchers.clear();

    this.transaction = null;

    this.started = false;

    Logger.warn(

        "Storage Service destroyed."

    );

}

