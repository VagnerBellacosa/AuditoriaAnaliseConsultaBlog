/******************************************************************************
 Bellacosa Mainframe Library
 Favorites Badge Component
 Version 2.0
******************************************************************************/

"use strict";

class FavoritesBadge {

    constructor(options = {}) {

        this.options = {

            showZero: false,

            animated: true,

            className: "",

            ...options

        };

        this.element = null;

        this.counter = null;

    }

    /**************************************************************************
     CREATE
    **************************************************************************/

    create() {

        this.element = DOM.create("span", {

            className: `favorites-badge ${this.options.className}`

        });

        this.counter = DOM.create("span", {

            className: "favorites-badge-counter"

        });

        this.element.appendChild(

            this.counter

        );

        this.update();

        this.bindEvents();

        return this.element;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        EventBus.on(

            Constants.EVENTS.FAVORITE_CHANGED,

            () => this.update()

        );

    }

    /**************************************************************************
     UPDATE
    **************************************************************************/

    update() {

        const favorites =

            App.module("favorites");

        if (!favorites)
            return;

        const total = favorites.count();

        this.counter.textContent = total;

        if (

            total === 0 &&

            !this.options.showZero

        ) {

            DOM.hide(this.element);

        }

        else {

            DOM.show(this.element);

        }

        if (

            this.options.animated

        ) {

            this.animate();

        }

        this.element.setAttribute(

            "aria-label",

            `${total} favoritos`

        );

    }

    /**************************************************************************
     ANIMATION
    **************************************************************************/

    animate() {

        DOM.removeClass(

            this.element,

            "badge-pop"

        );

        requestAnimationFrame(() => {

            DOM.addClass(

                this.element,

                "badge-pop"

            );

        });

    }

    /**************************************************************************
     VALUE
    **************************************************************************/

    value() {

        return Number(

            this.counter.textContent

        );

    }

    /**************************************************************************
     RESET
    **************************************************************************/

    reset() {

        this.counter.textContent = "0";

        if (!this.options.showZero)

            DOM.hide(this.element);

    }

    /**************************************************************************
     SHOW
    **************************************************************************/

    show() {

        DOM.show(this.element);

    }

    /**************************************************************************
     HIDE
    **************************************************************************/

    hide() {

        DOM.hide(this.element);

    }

    /**************************************************************************
     ENABLE
    **************************************************************************/

    enable() {

        this.element.removeAttribute(

            "aria-disabled"

        );

    }

    /**************************************************************************
     DISABLE
    **************************************************************************/

    disable() {

        this.element.setAttribute(

            "aria-disabled",

            "true"

        );

    }

    /**************************************************************************
     REFRESH
    **************************************************************************/

    refresh() {

        this.update();

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.element?.remove();

        this.counter = null;

        this.element = null;

    }

}

/******************************************************************************
 FACTORY
******************************************************************************/

window.FavoritesBadge = {

    create(options = {}) {

        const badge =

            new FavoritesBadge(options);

        return badge.create();

    }

};