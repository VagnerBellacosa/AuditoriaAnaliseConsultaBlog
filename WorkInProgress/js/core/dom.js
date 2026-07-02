/******************************************************************************
 Bellacosa Mainframe Library
 DOM Helper
******************************************************************************/

"use strict";

class DOM {

    /**************************************************************************
     SELETORES
    **************************************************************************/

    static $(selector, parent = document) {

        return parent.querySelector(selector);

    }

    static $$(selector, parent = document) {

        return [...parent.querySelectorAll(selector)];

    }

    /**************************************************************************
     CRIA ELEMENTO
    **************************************************************************/

    static create(tag, options = {}) {

        const element = document.createElement(tag);

        if (options.id)
            element.id = options.id;

        if (options.className)
            element.className = options.className;

        if (options.text)
            element.textContent = options.text;

        if (options.html)
            element.innerHTML = options.html;

        if (options.attributes) {

            Object.entries(options.attributes)
                .forEach(([key, value]) => {

                    element.setAttribute(key, value);

                });

        }

        return element;

    }

    /**************************************************************************
     REMOVE
    **************************************************************************/

    static remove(element) {

        if (element?.parentNode)

            element.parentNode.removeChild(element);

    }

    /**************************************************************************
     EMPTY
    **************************************************************************/

    static empty(element) {

        if (!element)
            return;

        element.innerHTML = "";

    }

    /**************************************************************************
     APPEND
    **************************************************************************/

    static append(parent, child) {

        parent?.appendChild(child);

    }

    /**************************************************************************
     PREPEND
    **************************************************************************/

    static prepend(parent, child) {

        parent?.prepend(child);

    }

    /**************************************************************************
     SHOW
    **************************************************************************/

    static show(element, display = "") {

        if (!element)
            return;

        element.style.display = display;

        element.classList.remove(

            Constants.CSS.HIDDEN

        );

    }

    /**************************************************************************
     HIDE
    **************************************************************************/

    static hide(element) {

        if (!element)
            return;

        element.style.display = "none";

        element.classList.add(

            Constants.CSS.HIDDEN

        );

    }

    /**************************************************************************
     TOGGLE
    **************************************************************************/

    static toggle(element) {

        if (!element)
            return;

        if (

            getComputedStyle(element)

                .display === "none"

        ) {

            this.show(element);

        }

        else {

            this.hide(element);

        }

    }

    /**************************************************************************
     CLASSES
    **************************************************************************/

    static addClass(element, className) {

        element?.classList.add(className);

    }

    static removeClass(element, className) {

        element?.classList.remove(className);

    }

    static toggleClass(element, className) {

        element?.classList.toggle(className);

    }

    static hasClass(element, className) {

        return element?.classList.contains(className);

    }

    /**************************************************************************
     ATRIBUTOS
    **************************************************************************/

    static attr(element, name, value) {

        if (!element)
            return null;

        if (value === undefined)

            return element.getAttribute(name);

        element.setAttribute(name, value);

    }

    static removeAttr(element, name) {

        element?.removeAttribute(name);

    }

    /**************************************************************************
     DATASET
    **************************************************************************/

    static data(element, key, value) {

        if (!element)
            return null;

        if (value === undefined)

            return element.dataset[key];

        element.dataset[key] = value;

    }

    /**************************************************************************
     HTML
    **************************************************************************/

    static html(element, value) {

        if (!element)
            return;

        if (value === undefined)

            return element.innerHTML;

        element.innerHTML = value;

    }

    /**************************************************************************
     TEXTO
    **************************************************************************/

    static text(element, value) {

        if (!element)
            return;

        if (value === undefined)

            return element.textContent;

        element.textContent = value;

    }

    /**************************************************************************
     VALOR
    **************************************************************************/

    static value(element, value) {

        if (!element)
            return;

        if (value === undefined)

            return element.value;

        element.value = value;

    }

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    static on(element, event, callback, options = false) {

        element?.addEventListener(

            event,

            callback,

            options

        );

    }

    static off(element, event, callback) {

        element?.removeEventListener(

            event,

            callback

        );

    }

    static once(element, event, callback) {

        element?.addEventListener(

            event,

            callback,

            {

                once: true

            }

        );

    }

    /**************************************************************************
     SCROLL
    **************************************************************************/

    static scrollTop() {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    static scrollIntoView(element) {

        element?.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

    /**************************************************************************
     DIMENSÕES
    **************************************************************************/

    static rect(element) {

        return element?.getBoundingClientRect();

    }

    static width(element) {

        return element?.offsetWidth;

    }

    static height(element) {

        return element?.offsetHeight;

    }

    /**************************************************************************
     VISIBILIDADE
    **************************************************************************/

    static isVisible(element) {

        if (!element)
            return false;

        return (

            element.offsetParent !== null

        );

    }

    /**************************************************************************
     FOCO
    **************************************************************************/

    static focus(element) {

        element?.focus();

    }

    static blur(element) {

        element?.blur();

    }

    /**************************************************************************
     LOADING
    **************************************************************************/

    static loading(element, enabled = true) {

        if (!element)
            return;

        if (enabled)

            this.addClass(

                element,

                Constants.CSS.LOADING

            );

        else

            this.removeClass(

                element,

                Constants.CSS.LOADING

            );

    }

    /**************************************************************************
     FRAGMENT
    **************************************************************************/

    static fragment() {

        return document.createDocumentFragment();

    }

    /**************************************************************************
     READY
    **************************************************************************/

    static ready(callback) {

        if (

            document.readyState === "loading"

        ) {

            document.addEventListener(

                "DOMContentLoaded",

                callback

            );

        }

        else {

            callback();

        }

    }

    /**************************************************************************
     VIEWPORT
    **************************************************************************/

    static viewport() {

        return {

            width: window.innerWidth,

            height: window.innerHeight

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    static healthCheck() {

        Logger.info(

            "DOM Helper",

            {

                readyState:

                    document.readyState,

                viewport:

                    this.viewport()

            }

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.DOM = DOM;