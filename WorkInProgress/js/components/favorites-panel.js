/******************************************************************************
 Bellacosa Mainframe Library
 Favorites Panel Component
 Version 2.0
******************************************************************************/

"use strict";

class FavoritesPanel {

    constructor(options = {}) {

        this.options = {

            emptyMessage: "Nenhum favorito encontrado.",

            title: "Favoritos",

            className: "",

            ...options

        };

        this.element = null;

        this.header = null;

        this.list = null;

        this.footer = null;

    }

    /**************************************************************************
     CREATE
    **************************************************************************/

    create() {

        this.element = DOM.create("section", {

            className: `favorites-panel ${this.options.className}`

        });

        this.createHeader();

        this.createList();

        this.createFooter();

        this.render();

        this.bindEvents();

        return this.element;

    }

    /**************************************************************************
     HEADER
    **************************************************************************/

    createHeader() {

        this.header = DOM.create("header", {

            className: "favorites-panel-header"

        });

        this.header.innerHTML = `

            <h3>${this.options.title}</h3>

        `;

        this.element.appendChild(

            this.header

        );

    }

    /**************************************************************************
     LIST
    **************************************************************************/

    createList() {

        this.list = DOM.create("div", {

            className: "favorites-panel-list"

        });

        this.element.appendChild(

            this.list

        );

    }

    /**************************************************************************
     FOOTER
    **************************************************************************/

    createFooter() {

        this.footer = DOM.create("footer", {

            className: "favorites-panel-footer"

        });

        this.element.appendChild(

            this.footer

        );

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        EventBus.on(

            Constants.EVENTS.FAVORITE_CHANGED,

            () => this.render()

        );

    }

    /**************************************************************************
     RENDER
    **************************************************************************/

    render() {

        DOM.empty(this.list);

        const favorites =

            App.module("favorites");

        if (!favorites)
            return;

        const posts = favorites.list();

        if (!posts.length) {

            this.renderEmpty();

            return;

        }

        const fragment = DOM.fragment();

        posts.forEach(post => {

            fragment.appendChild(

                this.renderItem(post)

            );

        });

        this.list.appendChild(fragment);

        this.footer.textContent =

            `${posts.length} favorito(s)`;

    }

    /**************************************************************************
     ITEM
    **************************************************************************/

    renderItem(post) {

        const item = DOM.create("article", {

            className: "favorite-item"

        });

        item.innerHTML = `

            <img
                src="${post.image}"
                alt="${post.title}"
                loading="lazy">

            <div class="favorite-info">

                <h4>${post.title}</h4>

                <small>

                    ${Utils.date(post.published)}

                </small>

            </div>

            <button
                class="favorite-remove"
                aria-label="Remover favorito">

                ✕

            </button>

        `;

        DOM.on(

            item,

            "click",

            event => {

                if (

                    event.target.closest(

                        ".favorite-remove"

                    )

                ) {

                    event.stopPropagation();

                    App.module("favorites")

                        ?.remove(post.id);

                    return;

                }

                App.module("modal")

                    ?.open(post);

            }

        );

        return item;

    }

    /**************************************************************************
     EMPTY
    **************************************************************************/

    renderEmpty() {

        this.list.innerHTML = `

            <div class="favorites-empty">

                <p>

                    ${this.options.emptyMessage}

                </p>

            </div>

        `;

        this.footer.textContent = "";

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
     TOGGLE
    **************************************************************************/

    toggle() {

        this.element.hidden =

            !this.element.hidden;

    }

    /**************************************************************************
     REFRESH
    **************************************************************************/

    refresh() {

        this.render();

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
     DESTROY
    **************************************************************************/

    destroy() {

        this.element?.remove();

        this.header = null;

        this.list = null;

        this.footer = null;

        this.element = null;

    }

}

/******************************************************************************
 FACTORY
******************************************************************************/

window.FavoritesPanel = {

    create(options = {}) {

        const panel =

            new FavoritesPanel(options);

        return panel.create();

    }

};