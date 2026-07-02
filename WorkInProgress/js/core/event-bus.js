/******************************************************************************
 Bellacosa Mainframe Library
 Event Bus
******************************************************************************/

"use strict";

class EventBus {

    constructor() {

        this.events = new Map();

        this.debug = Config?.APP?.DEBUG ?? false;

    }

    /**************************************************************************
     ON
    **************************************************************************/

    on(event, callback) {

        if (!this.events.has(event)) {

            this.events.set(event, []);

        }

        this.events.get(event).push(callback);

        return this;

    }

    /**************************************************************************
     ONCE
    **************************************************************************/

    once(event, callback) {

        const wrapper = payload => {

            callback(payload);

            this.off(event, wrapper);

        };

        return this.on(event, wrapper);

    }

    /**************************************************************************
     OFF
    **************************************************************************/

    off(event, callback) {

        if (!this.events.has(event))

            return this;

        if (!callback) {

            this.events.delete(event);

            return this;

        }

        const listeners =

            this.events

                .get(event)

                .filter(fn => fn !== callback);

        this.events.set(event, listeners);

        return this;

    }

    /**************************************************************************
     EMIT
    **************************************************************************/

    emit(event, payload = null) {

        if (this.debug) {

            console.log(

                "[EventBus]",

                event,

                payload

            );

        }

        if (!this.events.has(event))

            return this;

        this.events

            .get(event)

            .forEach(listener => {

                try {

                    listener(payload);

                }

                catch (error) {

                    console.error(

                        "[EventBus]",

                        error

                    );

                }

            });

        return this;

    }

    /**************************************************************************
     HAS
    **************************************************************************/

    has(event) {

        return this.events.has(event);

    }

    /**************************************************************************
     COUNT
    **************************************************************************/

    count(event) {

        if (!this.events.has(event))

            return 0;

        return this.events.get(event).length;

    }

    /**************************************************************************
     CLEAR EVENT
    **************************************************************************/

    clear(event) {

        this.events.delete(event);

    }

    /**************************************************************************
     CLEAR ALL
    **************************************************************************/

    clearAll() {

        this.events.clear();

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    eventNames() {

        return [

            ...this.events.keys()

        ];

    }

    /**************************************************************************
     LISTENERS
    **************************************************************************/

    listeners(event) {

        return this.events.get(event) ?? [];

    }

    /**************************************************************************
     WAIT
    **************************************************************************/

    wait(event) {

        return new Promise(resolve => {

            this.once(event, resolve);

        });

    }

    /**************************************************************************
     PIPE
    **************************************************************************/

    pipe(source, target) {

        this.on(source, payload => {

            this.emit(target, payload);

        });

    }

    /**************************************************************************
     WILDCARD
    **************************************************************************/

    onAny(callback) {

        this.on("*", callback);

    }

    emitAny(event, payload) {

        if (this.events.has("*")) {

            this.events

                .get("*")

                .forEach(listener =>

                    listener({

                        event,

                        payload

                    })

                );

        }

    }

    /**************************************************************************
     BROADCAST
    **************************************************************************/

    broadcast(events, payload) {

        events.forEach(event =>

            this.emit(event, payload)

        );

    }

    /**************************************************************************
     MIDDLEWARE
    **************************************************************************/

    use(fn) {

        const original = this.emit.bind(this);

        this.emit = (event, payload) => {

            fn(event, payload);

            original(event, payload);

            this.emitAny(event, payload);

        };

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        const table = {};

        this.events.forEach(

            (listeners, event) => {

                table[event] =

                    listeners.length;

            }

        );

        return table;

    }

    /**************************************************************************
     HEALTH
    **************************************************************************/

    healthCheck() {

        console.group(

            "Bellacosa EventBus"

        );

        console.table(

            this.diagnostics()

        );

        console.groupEnd();

    }

    /**************************************************************************
     VERSION
    **************************************************************************/

    version() {

        return Config.APP.VERSION;

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.EventBus = new EventBus();
