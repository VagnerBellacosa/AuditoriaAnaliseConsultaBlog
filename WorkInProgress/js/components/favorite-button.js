/******************************************************************************
 Bellacosa Mainframe Library
 Favorite Button Component
 Version 2.0
******************************************************************************/

"use strict";

class FavoriteButton {

    constructor(post) {

        this.post = post;

        this.element = null;

        this.icon = null;

    }

    /**************************************************************************
     CREATE
    **************************************************************************/

    create() {

        this.element = DOM.create("button", {

            className: "favorite-button",

            attributes: {

                type: "button",

                "aria-label": "Adicionar aos favoritos",

                title: "Favoritos"

            }

        });

        this.icon = DOM.create("span", {

            className: "favorite-icon"

        });

        this.element.appendChild(

            this.icon

        );

        this.update();

        this.bindEvents();

        return this.element;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        DOM.on(

            this.element,

            "click",

            event => {

                event.preventDefault();

                event.stopPropagation();

                this.toggle();

            }

        );

    }

    /**************************************************************************
     TOGGLE
    **************************************************************************/

    toggle() {

        const favorites =

            App.module("favorites");

        if (!favorites)
            return;

        favorites.toggle(

            this.post

        );

        this.update();

        EventBus.emit(

            Constants.EVENTS.FAVORITE_CHANGED,

            this.post

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

        const active =

            favorites.exists(

                this.post.id

            );

        this.icon.textContent =

            active

                ? "★"

                : "☆";

        DOM.toggleClass(

            this.element,

            "active",

            active

        );

        this.element.setAttribute(

            "aria-pressed",

            active

        );

        this.element.setAttribute(

            "aria-label",

            active

                ? "Remover dos favoritos"

                : "Adicionar aos favoritos"

        );

    }

    /**************************************************************************
     ENABLE
    **************************************************************************/

    enable() {

        this.element.disabled = false;

    }

    /**************************************************************************
     DISABLE
    **************************************************************************/

    disable() {

        this.element.disabled = true;

    }

    /**************************************************************************
     SET POST
    **************************************************************************/

    setPost(post) {

        this.post = post;

        this.update();

    }

    /**************************************************************************
     GET POST
    **************************************************************************/

    getPost() {

        return this.post;

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        if (this.element) {

            this.element.remove();

        }

        this.element = null;

        this.icon = null;

        this.post = null;

    }

}

/******************************************************************************
 FACTORY
******************************************************************************/

window.FavoriteButton = {

    create(post) {

        return new FavoriteButton(post).create();

    }

};