/******************************************************************************
 Bellacosa Mainframe Library
 modal.js
 PARTE 1
******************************************************************************/

"use strict";

class Modal {

    constructor() {

        this.modal = null;

        this.overlay = null;

        this.content = null;

        this.iframe = null;

        this.loader = null;

        this.title = null;

        this.currentPost = null;

        this.isOpen = false;

    }

    /**************************************************************************
     START
    **************************************************************************/

    initialize() {

        this.cacheDOM();

        this.bindEvents();

    }

    /**************************************************************************
     CACHE
    **************************************************************************/

    cacheDOM() {

        this.modal =

            document.querySelector("#modal");

        if (!this.modal)
            return;

        this.overlay = this.modal;

        this.content =

            this.modal.querySelector(".modal-content");

        this.iframe =

            this.modal.querySelector("iframe");

        this.loader =

            this.modal.querySelector(".modal-loading");

        this.title =

            this.modal.querySelector(".modal-title");

    }

    /**************************************************************************
     OPEN
    **************************************************************************/

    open(post) {

        if (!post)
            return;

        this.currentPost = post;

        this.showLoader();

        this.updateTitle(post.title);

        this.loadIframe(post.url);

        this.modal.classList.add("show");

        document.body.style.overflow = "hidden";

        this.isOpen = true;

        if (window.storage) {

            storage.addHistory(post);

            storage.addRecent(post);

            storage.saveLastPost(post.id);

        }

        this.emit("modal:open", post);

    }

    /**************************************************************************
     CLOSE
    **************************************************************************/

    close() {

        if (!this.isOpen)
            return;

        this.modal.classList.remove("show");

        document.body.style.overflow = "";

        this.isOpen = false;

        if (this.iframe) {

            this.iframe.src = "about:blank";

        }

        this.emit("modal:close");

    }

    /**************************************************************************
     TOGGLE
    **************************************************************************/

    toggle(post) {

        if (this.isOpen) {

            this.close();

        } else {

            this.open(post);

        }

    }

    /**************************************************************************
     TITLE
    **************************************************************************/

    updateTitle(title) {

        if (!this.title)
            return;

        this.title.textContent = title;

    }

    /**************************************************************************
     LOADER
    **************************************************************************/

    showLoader() {

        if (!this.loader)
            return;

        this.loader.classList.remove("hidden");

    }

    hideLoader() {

        if (!this.loader)
            return;

        this.loader.classList.add("hidden");

    }

    /**************************************************************************
     IFRAME
    **************************************************************************/

    loadIframe(url) {

        if (!this.iframe)
            return;

        this.iframe.onload = () => {

            this.hideLoader();

            this.emit(

                "modal:loaded",

                this.currentPost

            );

        };

        this.iframe.onerror = () => {

            this.hideLoader();

            console.error(

                "Erro ao carregar iframe."

            );

        };

        this.iframe.src = url;

    }

    /**************************************************************************
     CLICK OUTSIDE
    **************************************************************************/

    outsideClick(event) {

        if (event.target === this.overlay) {

            this.close();

        }

    }

    /**************************************************************************
     ESC
    **************************************************************************/

    keyboard(event) {

        if (event.key === "Escape") {

            this.close();

        }

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        if (!this.modal)
            return;

        this.modal.addEventListener(

            "click",

            event => this.outsideClick(event)

        );

        document.addEventListener(

            "keydown",

            event => this.keyboard(event)

        );

        const closeButton =

            this.modal.querySelector(

                ".modal-close"

            );

        if (closeButton) {

            closeButton.addEventListener(

                "click",

                () => this.close()

            );

        }

    }

    /**************************************************************************
     EVENT BUS
    **************************************************************************/

    emit(name, detail = null) {

        document.dispatchEvent(

            new CustomEvent(

                name,

                {

                    detail

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

    /**************************************************************************
     INFO
    **************************************************************************/

    info() {

        return {

            open: this.isOpen,

            current: this.currentPost

        };

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.modal = new Modal();

/******************************************************************************
 AUTO START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        modal.initialize();

    }

);

/******************************************************************************
 ARTIGO ATUAL
******************************************************************************/

setCurrentPost(post) {

    this.currentPost = post;

}

getCurrentPost() {

    return this.currentPost;

}

/******************************************************************************
 POSTS
******************************************************************************/

getPosts() {

    if (!window.blogAPI)
        return [];

    return blogAPI.getPosts();

}

/******************************************************************************
 ÍNDICE
******************************************************************************/

getCurrentIndex() {

    if (!this.currentPost)
        return -1;

    return this.getPosts().findIndex(

        post => post.id === this.currentPost.id

    );

}

/******************************************************************************
 PRÓXIMO
******************************************************************************/

next() {

    const posts = this.getPosts();

    const index = this.getCurrentIndex();

    if (index < 0)
        return;

    if (index >= posts.length - 1)
        return;

    this.open(

        posts[index + 1]

    );

}

/******************************************************************************
 ANTERIOR
******************************************************************************/

previous() {

    const posts = this.getPosts();

    const index = this.getCurrentIndex();

    if (index <= 0)
        return;

    this.open(

        posts[index - 1]

    );

}

/******************************************************************************
 FAVORITOS
******************************************************************************/

toggleFavorite() {

    if (!window.storage)
        return;

    if (!this.currentPost)
        return;

    const active =

        storage.toggleFavorite(

            this.currentPost.id

        );

    const button =

        this.modal.querySelector(

            ".modal-favorite"

        );

    if (button) {

        button.classList.toggle(

            "active",

            active

        );

    }

    this.emit(

        "modal:favorite",

        this.currentPost

    );

}

/******************************************************************************
 COMPARTILHAR
******************************************************************************/

async share() {

    if (!this.currentPost)
        return;

    if (navigator.share) {

        try {

            await navigator.share({

                title:

                    this.currentPost.title,

                text:

                    this.currentPost.summary,

                url:

                    this.currentPost.url

            });

        }

        catch (e) {

            console.error(e);

        }

        return;

    }

    this.copyLink();

}

/******************************************************************************
 COPIAR LINK
******************************************************************************/

async copyLink() {

    if (!this.currentPost)
        return;

    if (window.Utils) {

        await Utils.copy(

            this.currentPost.url

        );

    }

    if (window.app) {

        app.toast(

            "Link copiado.",

            "success"

        );

    }

}

/******************************************************************************
 FULLSCREEN
******************************************************************************/

toggleFullscreen() {

    if (!document.fullscreenElement) {

        this.content.requestFullscreen?.();

    }

    else {

        document.exitFullscreen?.();

    }

}

/******************************************************************************
 URL
******************************************************************************/

updateURL() {

    if (!this.currentPost)
        return;

    if (window.history) {

        history.pushState(

            {

                post:

                    this.currentPost.id

            },

            "",

            this.currentPost.url

        );

    }

}

/******************************************************************************
 BACK
******************************************************************************/

restoreURL() {

    history.back();

}

/******************************************************************************
 ATUALIZA BOTÕES
******************************************************************************/

updateNavigationButtons() {

    const previous =

        this.modal.querySelector(

            ".modal-prev"

        );

    const next =

        this.modal.querySelector(

            ".modal-next"

        );

    const index =

        this.getCurrentIndex();

    const total =

        this.getPosts().length;

    if (previous) {

        previous.disabled =

            index <= 0;

    }

    if (next) {

        next.disabled =

            index >= total - 1;

    }

}

/******************************************************************************
 TOOLBAR
******************************************************************************/

bindToolbar() {

    const favorite =

        this.modal.querySelector(

            ".modal-favorite"

        );

    const share =

        this.modal.querySelector(

            ".modal-share"

        );

    const previous =

        this.modal.querySelector(

            ".modal-prev"

        );

    const next =

        this.modal.querySelector(

            ".modal-next"

        );

    const fullscreen =

        this.modal.querySelector(

            ".modal-fullscreen"

        );

    if (favorite) {

        favorite.addEventListener(

            "click",

            () => this.toggleFavorite()

        );

    }

    if (share) {

        share.addEventListener(

            "click",

            () => this.share()

        );

    }

    if (previous) {

        previous.addEventListener(

            "click",

            () => this.previous()

        );

    }

    if (next) {

        next.addEventListener(

            "click",

            () => this.next()

        );

    }

    if (fullscreen) {

        fullscreen.addEventListener(

            "click",

            () => this.toggleFullscreen()

        );

    }

}

/******************************************************************************
 KEYBOARD
******************************************************************************/

keyboardNavigation(event) {

    if (!this.isOpen)
        return;

    switch (event.key) {

        case "ArrowLeft":

            this.previous();

            break;

        case "ArrowRight":

            this.next();

            break;

        case "f":

        case "F":

            this.toggleFullscreen();

            break;

        case "s":

        case "S":

            this.share();

            break;

    }

}

/******************************************************************************
 REBIND
******************************************************************************/

refresh() {

    this.updateNavigationButtons();

}

/******************************************************************************
 OVERRIDE OPEN
******************************************************************************/

openPost(post) {

    this.open(post);

    this.updateNavigationButtons();

    this.updateURL();

}

/******************************************************************************
 EVENTOS
******************************************************************************/

initializeToolbar() {

    this.bindToolbar();

    document.addEventListener(

        "keydown",

        event =>

            this.keyboardNavigation(event)

    );

}

/******************************************************************************
 FAVORITOS
******************************************************************************/

toggleFavorite() {

    if (!this.post)
        return;

    if (!window.storage)
        return;

    const favorites =
        storage.load(
            Constants.STORAGE_KEYS.FAVORITES,
            []
        );

    const exists = favorites.find(
        item => item.id === this.post.id
    );

    let updated;

    if (exists) {

        updated = favorites.filter(
            item => item.id !== this.post.id
        );

        Logger.info(
            "Favorito removido",
            this.post.title
        );

    } else {

        updated = [...favorites, this.post];

        Logger.info(
            "Favorito adicionado",
            this.post.title
        );

    }

    storage.save(
        Constants.STORAGE_KEYS.FAVORITES,
        updated
    );

    EventBus.emit(
        Constants.EVENTS.CARD_FAVORITE,
        this.post
    );

}

/******************************************************************************
 COMPARTILHAR
******************************************************************************/

async share() {

    if (!this.post)
        return;

    const url = this.post.url;

    if (navigator.share) {

        try {

            await navigator.share({

                title: this.post.title,

                url

            });

        }

        catch (error) {

            Logger.warn(error);

        }

    } else {

        await Utils.copy(url);

    }

    EventBus.emit(

        "modal:shared",

        this.post

    );

}

/******************************************************************************
 IMPRIMIR
******************************************************************************/

print() {

    if (!this.post)
        return;

    window.print();

}

/******************************************************************************
 TECLADO
******************************************************************************/

bindKeyboard() {

    document.addEventListener(

        "keydown",

        event => {

            if (!this.isOpen)
                return;

            switch (event.key) {

                case "Escape":

                    this.close();

                    break;

                case "ArrowLeft":

                    this.previous?.();

                    break;

                case "ArrowRight":

                    this.next?.();

                    break;

            }

        }

    );

}

/******************************************************************************
 FOCUS TRAP
******************************************************************************/

focusTrap() {

    if (!this.modal)
        return;

    const focusables = this.modal.querySelectorAll(

        'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'

    );

    if (!focusables.length)
        return;

    focusables[0].focus();

}

/******************************************************************************
 HISTORY
******************************************************************************/

pushHistory() {

    if (!window.router)
        return;

    router.push({

        post: this.post.id

    });

}

/******************************************************************************
 CLOSE HISTORY
******************************************************************************/

popHistory() {

    if (!window.router)
        return;

    router.remove("post");

}

/******************************************************************************
 LOADER
******************************************************************************/

loading(show = true) {

    if (!this.modal)
        return;

    DOM.loading(

        this.modal,

        show

    );

}

/******************************************************************************
 EVENTS
******************************************************************************/

emit(name) {

    EventBus.emit(

        name,

        this.post

    );

}

/******************************************************************************
 OPEN OVERRIDE
******************************************************************************/

afterOpen() {

    this.focusTrap();

    this.pushHistory();

    this.emit(

        Constants.EVENTS.MODAL_OPEN

    );

}

/******************************************************************************
 CLOSE OVERRIDE
******************************************************************************/

afterClose() {

    this.popHistory();

    this.emit(

        Constants.EVENTS.MODAL_CLOSE

    );

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        open: this.isOpen,

        title: this.post?.title,

        id: this.post?.id,

        iframe:

            this.iframe?.src,

        favorites:

            storage?.load(

                Constants.STORAGE_KEYS.FAVORITES,

                []

            ).length

    };

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Bellacosa Modal"

    );

    Logger.table(

        this.diagnostics()

    );

    Logger.groupEnd();

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.close();

    this.post = null;

    this.iframe = null;

    this.modal = null;

}

/******************************************************************************
 VERSION
******************************************************************************/

version() {

    return Config.APP.VERSION;

}
