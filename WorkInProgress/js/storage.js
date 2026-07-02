/******************************************************************************
 INTERSECTION OBSERVER
******************************************************************************/

observe(elements, callback, options = {}) {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                callback(entry);

            }

        });

    }, options);

    elements.forEach(element => observer.observe(element));

    return observer;

}

/******************************************************************************
 LAZY IMAGE
******************************************************************************/

lazyImages(selector = "img[data-src]") {

    const images = [...document.querySelectorAll(selector)];

    this.observe(images, entry => {

        const img = entry.target;

        img.src = img.dataset.src;

        img.removeAttribute("data-src");

    }, {

        rootMargin: "100px"

    });

}

/******************************************************************************
 DEVICE
******************************************************************************/

device() {

    const width = window.innerWidth;

    if (width < 768)
        return "mobile";

    if (width < 1200)
        return "tablet";

    return "desktop";

}

/******************************************************************************
 MOBILE
******************************************************************************/

isMobile() {

    return this.device() === "mobile";

}

/******************************************************************************
 TABLET
******************************************************************************/

isTablet() {

    return this.device() === "tablet";

}

/******************************************************************************
 DESKTOP
******************************************************************************/

isDesktop() {

    return this.device() === "desktop";

}

/******************************************************************************
 DARK MODE
******************************************************************************/

prefersDark() {

    return window.matchMedia(

        "(prefers-color-scheme: dark)"

    ).matches;

}

/******************************************************************************
 ONLINE
******************************************************************************/

isOnline() {

    return navigator.onLine;

}

/******************************************************************************
 CLONE
******************************************************************************/

clone(object) {

    if (window.structuredClone)

        return structuredClone(object);

    return JSON.parse(

        JSON.stringify(object)

    );

}

/******************************************************************************
 MERGE
******************************************************************************/

merge(target = {}, source = {}) {

    const output = this.clone(target);

    Object.keys(source).forEach(key => {

        if (

            source[key] instanceof Object &&

            key in target

        ) {

            output[key] =

                this.merge(

                    target[key],

                    source[key]

                );

        }

        else {

            output[key] = source[key];

        }

    });

    return output;

}

/******************************************************************************
 GROUP BY
******************************************************************************/

groupBy(array, property) {

    return array.reduce((result, item) => {

        const key =

            typeof property === "function"

                ? property(item)

                : item[property];

        if (!result[key])

            result[key] = [];

        result[key].push(item);

        return result;

    }, {});

}

/******************************************************************************
 SORT PROPERTY
******************************************************************************/

sortBy(array, property, asc = true) {

    return [...array].sort((a, b) => {

        if (a[property] < b[property])

            return asc ? -1 : 1;

        if (a[property] > b[property])

            return asc ? 1 : -1;

        return 0;

    });

}

/******************************************************************************
 SHUFFLE
******************************************************************************/

shuffle(array) {

    const copy = [...array];

    for (

        let i = copy.length - 1;

        i > 0;

        i--

    ) {

        const j =

            Math.floor(

                Math.random() * (i + 1)

            );

        [copy[i], copy[j]] =

            [copy[j], copy[i]];

    }

    return copy;

}

/******************************************************************************
 UNIQUE OBJECTS
******************************************************************************/

uniqueBy(array, property) {

    const map = new Map();

    array.forEach(item => {

        map.set(

            item[property],

            item

        );

    });

    return [...map.values()];

}

/******************************************************************************
 TIMER
******************************************************************************/

timer(label = "Timer") {

    return {

        start() {

            console.time(label);

        },

        end() {

            console.timeEnd(label);

        }

    };

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

measure(callback, label = "Execution") {

    const timer = this.timer(label);

    timer.start();

    const result = callback();

    timer.end();

    return result;

}

/******************************************************************************
 WAIT IMAGES
******************************************************************************/

waitImages() {

    const images =

        [...document.images];

    return Promise.all(

        images.map(image => {

            if (image.complete)

                return Promise.resolve();

            return new Promise(resolve => {

                image.onload = resolve;

                image.onerror = resolve;

            });

        })

    );

}

/******************************************************************************
 BROWSER
******************************************************************************/

browser() {

    return navigator.userAgent;

}

/******************************************************************************
 PLATFORM
******************************************************************************/

platform() {

    return navigator.platform;

}

/******************************************************************************
 LANGUAGE
******************************************************************************/

language() {

    return navigator.language;

}

/******************************************************************************
 UUID SHORT
******************************************************************************/

shortID(size = 8) {

    return Math.random()

        .toString(36)

        .substring(2, 2 + size);

}

/******************************************************************************
 VERSION
******************************************************************************/

version() {

    return "1.0.0";

}

/******************************************************************************
 ENVIRONMENT
******************************************************************************/

environment() {

    return {

        browser: this.browser(),

        platform: this.platform(),

        language: this.language(),

        online: this.isOnline(),

        device: this.device(),

        dark: this.prefersDark(),

        width: window.innerWidth,

        height: window.innerHeight

    };

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    console.group(

        "Bellacosa Utils"

    );

    console.table(

        this.environment()

    );

    console.groupEnd();

}

/******************************************************************************
 FAVORITOS
******************************************************************************/

getFavorites() {

    return this.load("favorites", []);

}

isFavorite(id) {

    return this.getFavorites().includes(id);

}

addFavorite(id) {

    const favorites = this.getFavorites();

    if (!favorites.includes(id)) {

        favorites.push(id);

        this.save("favorites", favorites);

        this.emit("favorites:changed", favorites);

    }

}

removeFavorite(id) {

    const favorites = this.getFavorites()

        .filter(item => item !== id);

    this.save("favorites", favorites);

    this.emit("favorites:changed", favorites);

}

toggleFavorite(id) {

    if (this.isFavorite(id)) {

        this.removeFavorite(id);

        return false;

    }

    this.addFavorite(id);

    return true;

}

clearFavorites() {

    this.save("favorites", []);

    this.emit("favorites:changed", []);

}

/******************************************************************************
 HISTÓRICO
******************************************************************************/

addHistory(post) {

    let history = this.load("history", []);

    history = history.filter(item => item.id !== post.id);

    history.unshift({

        ...post,

        viewedAt: Date.now()

    });

    history = history.slice(0, 100);

    this.save("history", history);

}

getHistory() {

    return this.load("history", []);

}

clearHistory() {

    this.save("history", []);

}

/******************************************************************************
 RECENTES
******************************************************************************/

addRecent(post) {

    let recent = this.load("recent", []);

    recent = recent.filter(item => item.id !== post.id);

    recent.unshift(post);

    recent = recent.slice(0, 20);

    this.save("recent", recent);

}

getRecent() {

    return this.load("recent", []);

}

/******************************************************************************
 PESQUISAS
******************************************************************************/

addSearch(term) {

    if (!term)
        return;

    let searches = this.load("searches", []);

    searches = searches.filter(item => item !== term);

    searches.unshift(term);

    searches = searches.slice(0, 20);

    this.save("searches", searches);

}

getSearches() {

    return this.load("searches", []);

}

clearSearches() {

    this.save("searches", []);

}

/******************************************************************************
 FILTROS
******************************************************************************/

saveFilters(filters) {

    this.save("filters", filters);

}

loadFilters() {

    return this.load("filters", {});

}

clearFilters() {

    this.remove("filters");

}

/******************************************************************************
 CONTADORES
******************************************************************************/

increment(name) {

    const value = this.load(name, 0);

    this.save(name, value + 1);

    return value + 1;

}

counter(name) {

    return this.load(name, 0);

}

/******************************************************************************
 ÚLTIMO POST
******************************************************************************/

saveLastPost(id) {

    this.save("last-post", id);

}

loadLastPost() {

    return this.load("last-post");

}

/******************************************************************************
 DASHBOARD
******************************************************************************/

dashboard() {

    return {

        favorites:

            this.getFavorites().length,

        history:

            this.getHistory().length,

        searches:

            this.getSearches().length,

        recent:

            this.getRecent().length,

        storage:

            this.stats()

    };

}

/******************************************************************************
 EVENTOS
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
 LIMPA DADOS DO USUÁRIO
******************************************************************************/

clearUserData() {

    this.clearFavorites();

    this.clearHistory();

    this.clearSearches();

    this.clearFilters();

    this.remove("last-post");

}

/******************************************************************************
 SINCRONIZAÇÃO
******************************************************************************/

notify(key) {

    this.emit(

        "storage:update",

        {

            key

        }

    );

}

/******************************************************************************
 LISTA CHAVES
******************************************************************************/

keys() {

    return Object.keys(localStorage)

        .filter(key =>

            key.startsWith(

                this.prefix + ":"

            )

        );

}

/******************************************************************************
 TAMANHO
******************************************************************************/

size() {

    return this.keys().length;

}

/******************************************************************************
 EXPORTA TODO STORAGE
******************************************************************************/

export() {

    const data = {};

    this.keys().forEach(key => {

        data[key] = localStorage.getItem(key);

    });

    return data;

}

/******************************************************************************
 EXPORT JSON
******************************************************************************/

exportJSON(pretty = true) {

    return JSON.stringify(

        this.export(),

        null,

        pretty ? 2 : 0

    );

}

/******************************************************************************
 IMPORTA
******************************************************************************/

import(data = {}) {

    Object.entries(data)

        .forEach(([key, value]) => {

            localStorage.setItem(

                key,

                value

            );

        });

    this.emit(

        "storage:imported"

    );

}

/******************************************************************************
 IMPORT JSON
******************************************************************************/

importJSON(json) {

    try {

        this.import(

            JSON.parse(json)

        );

        return true;

    }

    catch (e) {

        console.error(e);

        return false;

    }

}

/******************************************************************************
 BACKUP
******************************************************************************/

backup() {

    return {

        version:

            STORAGE_CONFIG.version,

        created:

            Date.now(),

        data:

            this.export()

    };

}

/******************************************************************************
 RESTORE
******************************************************************************/

restore(backup) {

    if (!backup)

        return false;

    if (!backup.data)

        return false;

    this.import(

        backup.data

    );

    return true;

}

/******************************************************************************
 DOWNLOAD BACKUP
******************************************************************************/

downloadBackup() {

    const file =

        JSON.stringify(

            this.backup(),

            null,

            2

        );

    const blob =

        new Blob(

            [file],

            {

                type:

                    "application/json"

            }

        );

    const url =

        URL.createObjectURL(blob);

    const a =

        document.createElement("a");

    a.href = url;

    a.download =

        "bellacosa-backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

/******************************************************************************
 REMOVE EXPIRADOS
******************************************************************************/

cleanExpired() {

    let removed = 0;

    this.keys().forEach(key => {

        try {

            const raw =

                localStorage.getItem(key);

            if (!raw)

                return;

            const item =

                JSON.parse(raw);

            if (

                item.expires &&

                Date.now() >

                item.expires

            ) {

                localStorage.removeItem(key);

                removed++;

            }

        }

        catch {}

    });

    return removed;

}

/******************************************************************************
 AUTO CLEAN
******************************************************************************/

startAutoClean(interval = 3600000) {

    this.cleanExpired();

    setInterval(() => {

        const total =

            this.cleanExpired();

        if (total > 0) {

            console.log(

                total +

                " registros expirados removidos."

            );

        }

    }, interval);

}

/******************************************************************************
 SYNC ENTRE ABAS
******************************************************************************/

enableSync() {

    window.addEventListener(

        "storage",

        event => {

            if (

                event.key &&

                event.key.startsWith(

                    this.prefix + ":"

                )

            ) {

                this.emit(

                    "storage:sync",

                    {

                        key: event.key,

                        oldValue:

                            event.oldValue,

                        newValue:

                            event.newValue

                    }

                );

            }

        }

    );

}

/******************************************************************************
 COMPRESSÃO
******************************************************************************/

compress(text = "") {

    if (!window.btoa)

        return text;

    return btoa(

        encodeURIComponent(text)

    );

}

decompress(text = "") {

    if (!window.atob)

        return text;

    try {

        return decodeURIComponent(

            atob(text)

        );

    }

    catch {

        return text;

    }

}

/******************************************************************************
 SAVE COMPRESSED
******************************************************************************/

saveCompressed(name, value) {

    this.save(

        name,

        this.compress(

            JSON.stringify(value)

        )

    );

}

loadCompressed(name) {

    const value =

        this.load(name);

    if (!value)

        return null;

    return JSON.parse(

        this.decompress(value)

    );

}

/******************************************************************************
 HEALTH
******************************************************************************/

healthCheck() {

    console.group(

        "Bellacosa Storage"

    );

    console.table({

        Version:

            STORAGE_CONFIG.version,

        Prefix:

            this.prefix,

        Keys:

            this.size(),

        Favorites:

            this.getFavorites().length,

        History:

            this.getHistory().length,

        Searches:

            this.getSearches().length,

        Recent:

            this.getRecent().length,

        Storage:

            this.stats().kb + " KB"

    });

    console.groupEnd();

}

/******************************************************************************
 RESET
******************************************************************************/

factoryReset() {

    this.clear();

    sessionStorage.clear();

    this.emit(

        "storage:reset"

    );

}

/******************************************************************************
 INICIALIZA
******************************************************************************/

initialize() {

    this.cleanExpired();

    this.enableSync();

    this.startAutoClean();

    console.log(

        "Storage inicializado."

    );

}

/******************************************************************************
 INFO
******************************************************************************/

info() {

    return {

        version:

            STORAGE_CONFIG.version,

        prefix:

            this.prefix,

        keys:

            this.size(),

        stats:

            this.stats()

    };

}
