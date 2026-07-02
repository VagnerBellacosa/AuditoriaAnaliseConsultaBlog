/******************************************************************************
 Bellacosa Mainframe Library
 utils.js
 PARTE 1
******************************************************************************/

"use strict";

/******************************************************************************
 CLASSE
******************************************************************************/

class Utils {

    /**************************************************************************
     HTML
    **************************************************************************/

    escapeHTML(text = "") {

        return String(text)

            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    /**************************************************************************
     REMOVE HTML
    **************************************************************************/

    stripHTML(html = "") {

        const div = document.createElement("div");

        div.innerHTML = html;

        return div.textContent || div.innerText || "";

    }

    /**************************************************************************
     RESUMO
    **************************************************************************/

    excerpt(text = "", size = 220) {

        const value = this.stripHTML(text)

            .replace(/\s+/g, " ")

            .trim();

        if (value.length <= size)
            return value;

        return value.substring(0, size) + "...";

    }

    /**************************************************************************
     SLUG
    **************************************************************************/

    slug(text = "") {

        return text

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .toLowerCase()

            .replace(/[^a-z0-9]+/g, "-")

            .replace(/^-+|-+$/g, "");

    }

    /**************************************************************************
     NORMALIZA TEXTO
    **************************************************************************/

    normalize(text = "") {

        return text

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .toLowerCase()

            .trim();

    }

    /**************************************************************************
     CAPITALIZA
    **************************************************************************/

    capitalize(text = "") {

        if (!text.length)
            return "";

        return text.charAt(0).toUpperCase()

            + text.slice(1);

    }

    /**************************************************************************
     TITLE CASE
    **************************************************************************/

    title(text = "") {

        return text

            .split(" ")

            .map(word => this.capitalize(word))

            .join(" ");

    }

    /**************************************************************************
     UUID
    **************************************************************************/

    uuid() {

        return crypto.randomUUID();

    }

    /**************************************************************************
     RANDOM
    **************************************************************************/

    random(min = 0, max = 100) {

        return Math.floor(

            Math.random() * (max - min + 1)

        ) + min;

    }

    /**************************************************************************
     CLAMP
    **************************************************************************/

    clamp(value, min, max) {

        return Math.min(

            Math.max(value, min),

            max

        );

    }

    /**************************************************************************
     PAD
    **************************************************************************/

    pad(number) {

        return String(number).padStart(2, "0");

    }

    /**************************************************************************
     DATA BR
    **************************************************************************/

    dateBR(date) {

        return new Date(date)

            .toLocaleDateString(

                "pt-BR"

            );

    }

    /**************************************************************************
     DATA LONGA
    **************************************************************************/

    longDate(date) {

        return new Date(date)

            .toLocaleDateString(

                "pt-BR",

                {

                    weekday: "long",

                    day: "numeric",

                    month: "long",

                    year: "numeric"

                }

            );

    }

    /**************************************************************************
     HORA
    **************************************************************************/

    time(date) {

        return new Date(date)

            .toLocaleTimeString(

                "pt-BR",

                {

                    hour: "2-digit",

                    minute: "2-digit"

                }

            );

    }

    /**************************************************************************
     DATA ISO
    **************************************************************************/

    iso(date) {

        return new Date(date)

            .toISOString();

    }

    /**************************************************************************
     ANO
    **************************************************************************/

    year(date) {

        return new Date(date)

            .getFullYear();

    }

    /**************************************************************************
     MÊS
    **************************************************************************/

    month(date) {

        return new Date(date)

            .getMonth() + 1;

    }

    /**************************************************************************
     DIA
    **************************************************************************/

    day(date) {

        return new Date(date)

            .getDate();

    }

    /**************************************************************************
     TEMPO DE LEITURA
    **************************************************************************/

    readingTime(text = "") {

        const words =

            this.stripHTML(text)

                .split(/\s+/)

                .length;

        return Math.max(

            1,

            Math.ceil(words / 220)

        );

    }

    /**************************************************************************
     FORMATA LEITURA
    **************************************************************************/

    readingLabel(text = "") {

        return this.readingTime(text)

            + " min";

    }

    /**************************************************************************
     FORMATA NÚMERO
    **************************************************************************/

    number(value) {

        return Number(value)

            .toLocaleString(

                "pt-BR"

            );

    }

    /**************************************************************************
     BYTES
    **************************************************************************/

    bytes(bytes) {

        if (bytes < 1024)

            return bytes + " B";

        if (bytes < 1048576)

            return (bytes / 1024)

                .toFixed(1)

                + " KB";

        if (bytes < 1073741824)

            return (bytes / 1048576)

                .toFixed(1)

                + " MB";

        return (bytes / 1073741824)

            .toFixed(1)

            + " GB";

    }

    /**************************************************************************
     BOOLEAN
    **************************************************************************/

    bool(value) {

        return !!value;

    }

    /**************************************************************************
     URL
    **************************************************************************/

    isURL(text = "") {

        try {

            new URL(text);

            return true;

        }

        catch {

            return false;

        }

    }

    /**************************************************************************
     EMAIL
    **************************************************************************/

    isEmail(email = "") {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            .test(email);

    }

    /**************************************************************************
     TELEFONE BR
    **************************************************************************/

    phone(phone = "") {

        return phone

            .replace(/\D/g, "")

            .replace(

                /^(\d{2})(\d)/,

                "($1) $2"

            )

            .replace(

                /(\d{5})(\d)/,

                "$1-$2"

            );

    }

    /**************************************************************************
     ARRAY ÚNICO
    **************************************************************************/

    unique(array = []) {

        return [...new Set(array)];

    }

    /**************************************************************************
     ORDENA ALFABÉTICO
    **************************************************************************/

    sort(array = []) {

        return [...array]

            .sort((a, b) =>

                a.localeCompare(

                    b,

                    "pt-BR"

                )

            );

    }

}

/******************************************************************************
 EXPORTA
******************************************************************************/

window.Utils = new Utils();

/******************************************************************************
 DEBOUNCE
******************************************************************************/

debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(this, args);

        }, delay);

    };

}

/******************************************************************************
 THROTTLE
******************************************************************************/

throttle(callback, limit = 250) {

    let waiting = false;

    return (...args) => {

        if (waiting)
            return;

        callback.apply(this, args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, limit);

    };

}

/******************************************************************************
 SLEEP
******************************************************************************/

sleep(ms = 500) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/******************************************************************************
 COPY
******************************************************************************/

async copy(text = "") {

    try {

        await navigator.clipboard.writeText(text);

        return true;

    }

    catch {

        return false;

    }

}

/******************************************************************************
 DOWNLOAD
******************************************************************************/

download(filename, content, type = "text/plain") {

    const blob = new Blob(

        [content],

        {

            type

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);

}

/******************************************************************************
 QUERYSTRING
******************************************************************************/

query(name) {

    const params =

        new URLSearchParams(

            window.location.search

        );

    return params.get(name);

}

/******************************************************************************
 URL PARAMS
******************************************************************************/

setQuery(name, value) {

    const url =

        new URL(window.location);

    url.searchParams.set(name, value);

    history.replaceState(

        {},

        "",

        url

    );

}

/******************************************************************************
 REMOVE PARAM
******************************************************************************/

removeQuery(name) {

    const url =

        new URL(window.location);

    url.searchParams.delete(name);

    history.replaceState(

        {},

        "",

        url

    );

}

/******************************************************************************
 LOCAL STORAGE
******************************************************************************/

save(key, value) {

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}

/******************************************************************************
 LOAD
******************************************************************************/

load(key, fallback = null) {

    const value =

        localStorage.getItem(key);

    if (!value)

        return fallback;

    return JSON.parse(value);

}

/******************************************************************************
 REMOVE STORAGE
******************************************************************************/

remove(key) {

    localStorage.removeItem(key);

}

/******************************************************************************
 SESSION
******************************************************************************/

saveSession(key, value) {

    sessionStorage.setItem(

        key,

        JSON.stringify(value)

    );

}

loadSession(key) {

    const value =

        sessionStorage.getItem(key);

    if (!value)

        return null;

    return JSON.parse(value);

}

/******************************************************************************
 DOM
******************************************************************************/

$(selector) {

    return document.querySelector(selector);

}

$$(selector) {

    return [

        ...document.querySelectorAll(selector)

    ];

}

/******************************************************************************
 CREATE
******************************************************************************/

create(tag, classes = "") {

    const element =

        document.createElement(tag);

    if (classes)

        element.className = classes;

    return element;

}

/******************************************************************************
 REMOVE ELEMENT
******************************************************************************/

removeElement(element) {

    if (element)

        element.remove();

}

/******************************************************************************
 EMPTY
******************************************************************************/

empty(element) {

    if (!element)
        return;

    element.innerHTML = "";

}

/******************************************************************************
 SHOW
******************************************************************************/

show(element) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.hidden = false;

    element.style.display = "";

}

/******************************************************************************
 HIDE
******************************************************************************/

hide(element) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.hidden = true;

    element.style.display = "none";

}

/******************************************************************************
 TOGGLE
******************************************************************************/

toggle(element) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.hidden = !element.hidden;

}

/******************************************************************************
 EVENTS
******************************************************************************/

on(element, event, callback) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.addEventListener(

        event,

        callback

    );

}

off(element, event, callback) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.removeEventListener(

        event,

        callback

    );

}

once(element, event, callback) {

    if (typeof element === "string")

        element = this.$(element);

    if (!element)
        return;

    element.addEventListener(

        event,

        callback,

        {

            once: true

        }

    );

}

/******************************************************************************
 SCROLL
******************************************************************************/

scrollTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/******************************************************************************
 SCROLL TO
******************************************************************************/

scrollTo(selector) {

    const element =

        this.$(selector);

    if (!element)
        return;

    element.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

/******************************************************************************
 SERIALIZA FORM
******************************************************************************/

formToJSON(form) {

    const data =

        new FormData(form);

    return Object.fromEntries(data);

}

/******************************************************************************
 PARSE JSON
******************************************************************************/

safeJSON(text, fallback = {}) {

    try {

        return JSON.parse(text);

    }

    catch {

        return fallback;

    }

}

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