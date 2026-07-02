/******************************************************************************
 Bellacosa Mainframe Library
 Modal UI
 Version 2.0
******************************************************************************/

"use strict";

class ModalUI {

    constructor() {

        this.initialized = false;

        this.modal = null;

        this.overlay = null;

        this.content = null;

        this.closeButton = null;

        this.currentPost = null;

        this.isOpen = false;

        this.loading = false;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing Modal UI..."

        );

        this.cacheDOM();

        this.bindEvents();

        this.initialized = true;

    }

    /**************************************************************************
     CACHE DOM
    **************************************************************************/

    cacheDOM() {

        this.modal = DOM.$(

            Constants.SELECTORS.MODAL

        );

        this.overlay = DOM.$(

            Constants.SELECTORS.MODAL_OVERLAY

        );

        this.content = DOM.$(

            Constants.SELECTORS.MODAL_CONTENT

        );

        this.closeButton = DOM.$(

            Constants.SELECTORS.MODAL_CLOSE

        );

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        if (this.closeButton) {

            DOM.on(

                this.closeButton,

                "click",

                () => this.close()

            );

        }

        if (this.overlay) {

            DOM.on(

                this.overlay,

                "click",

                () => this.close()

            );

        }

        DOM.on(

            document,

            "keydown",

            event => {

                if (

                    event.key === "Escape"

                    &&

                    this.isOpen

                ) {

                    this.close();

                }

            }

        );

        EventBus.on(

            Constants.EVENTS.CARD_SELECTED,

            post => {

                this.open(post);

            }

        );

    }

    /**************************************************************************
     OPEN
    **************************************************************************/

    open(post) {

        if (!post)
            return;

        this.currentPost = post;

        this.render(post);

        DOM.addClass(

            this.modal,

            "open"

        );

        DOM.addClass(

            document.body,

            "modal-open"

        );

        this.isOpen = true;

        EventBus.emit(

            Constants.EVENTS.MODAL_OPENED,

            post

        );

    }

    /**************************************************************************
     CLOSE
    **************************************************************************/

    close() {

        if (!this.isOpen)
            return;

        DOM.removeClass(

            this.modal,

            "open"

        );

        DOM.removeClass(

            document.body,

            "modal-open"

        );

        this.currentPost = null;

        this.isOpen = false;

        EventBus.emit(

            Constants.EVENTS.MODAL_CLOSED

        );

    }

    /**************************************************************************
     RENDER
    **************************************************************************/

    render(post) {

        if (!this.content)
            return;

        this.content.innerHTML = `

            <article class="modal-post">

                <header>

                    <h1>

                        ${post.title}

                    </h1>

                    <div class="modal-meta">

                        <span>

                            📅 ${Utils.date(post.published)}

                        </span>

                        <span>

                            ⏱ ${post.readingTime} min

                        </span>

                    </div>

                </header>

                <img
                    src="${post.image}"
                    alt="${post.title}"
                    loading="lazy">

                <div class="modal-summary">

                    ${post.summary}

                </div>

                <iframe

                    src="${post.url}"

                    loading="lazy"

                    title="${post.title}"

                    class="modal-iframe">

                </iframe>

            </article>

        `;

    }

    /**************************************************************************
     LOADING
    **************************************************************************/

    showLoading() {

        this.loading = true;

        this.content.innerHTML = `

            <div class="modal-loading">

                <div class="spinner"></div>

                <p>

                    Carregando artigo...

                </p>

            </div>

        `;

    }

    /**************************************************************************
     HIDE LOADING
    **************************************************************************/

    hideLoading() {

        this.loading = false;

    }

    /**************************************************************************
     CLEAR
    **************************************************************************/

    clear() {

        if (this.content)

            DOM.empty(

                this.content

            );

    }

    /**************************************************************************
     GET POST
    **************************************************************************/

    current() {

        return this.currentPost;

    }

    /**************************************************************************
     IS OPEN
    **************************************************************************/

    opened() {

        return this.isOpen;

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            open:

                this.isOpen,

            loading:

                this.loading,

            currentPost:

                this.currentPost?.id ??

                null

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Modal UI"

        );

        Logger.table(

            this.diagnostics()

        );

        Logger.groupEnd();

    }

    /**************************************************************************
     DESTROY
    **************************************************************************/

    destroy() {

        this.clear();

        this.currentPost = null;

        this.initialized = false;

        Logger.warn(

            "Modal UI destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.ModalUI = new ModalUI();

/******************************************************************************
 NEXT POST
******************************************************************************/

next() {

    if (!this.currentPost)
        return;

    const api = App.module("api");

    const posts = api.all();

    const index = posts.findIndex(

        post => post.id === this.currentPost.id

    );

    if (index < posts.length - 1) {

        this.open(

            posts[index + 1]

        );

    }

}

/******************************************************************************
 PREVIOUS POST
******************************************************************************/

previous() {

    if (!this.currentPost)
        return;

    const api = App.module("api");

    const posts = api.all();

    const index = posts.findIndex(

        post => post.id === this.currentPost.id

    );

    if (index > 0) {

        this.open(

            posts[index - 1]

        );

    }

}

/******************************************************************************
 FULLSCREEN
******************************************************************************/

toggleFullscreen() {

    if (!document.fullscreenElement) {

        this.modal.requestFullscreen?.();

    }

    else {

        document.exitFullscreen?.();

    }

}

/******************************************************************************
 PRINT
******************************************************************************/

print() {

    if (!this.currentPost)
        return;

    window.print();

}

/******************************************************************************
 SHARE
******************************************************************************/

async share() {

    if (!this.currentPost)
        return;

    const post = this.currentPost;

    if (navigator.share) {

        try {

            await navigator.share({

                title: post.title,

                text: post.summary,

                url: post.url

            });

            return;

        }

        catch(error){

            Logger.error(error);

        }

    }

    await navigator.clipboard.writeText(

        post.url

    );

    Logger.info(

        "URL copiada."

    );

}

/******************************************************************************
 FAVORITE
******************************************************************************/

favorite() {

    if (!this.currentPost)
        return;

    App.module("storage")

        ?.save(

            `favorite:${this.currentPost.id}`,

            true

        );

}

/******************************************************************************
 REMOVE FAVORITE
******************************************************************************/

unfavorite() {

    if (!this.currentPost)
        return;

    App.module("storage")

        ?.remove(

            `favorite:${this.currentPost.id}`

        );

}

/******************************************************************************
 IS FAVORITE
******************************************************************************/

isFavorite() {

    if (!this.currentPost)
        return false;

    return App.module("storage")

        ?.exists(

            `favorite:${this.currentPost.id}`

        );

}

/******************************************************************************
 HISTORY
******************************************************************************/

history() {

    return App.module("storage")

        ?.load(

            Constants.STORAGE_KEYS.MODAL_HISTORY,

            []

        ) ?? [];

}

/******************************************************************************
 SAVE HISTORY
******************************************************************************/

saveHistory() {

    if (!this.currentPost)
        return;

    let history = this.history();

    history = history.filter(

        post =>

            post.id !== this.currentPost.id

    );

    history.unshift({

        id: this.currentPost.id,

        title: this.currentPost.title,

        date: Date.now()

    });

    history = history.slice(0,30);

    App.module("storage")

        ?.save(

            Constants.STORAGE_KEYS.MODAL_HISTORY,

            history

        );

}

/******************************************************************************
 CLEAR HISTORY
******************************************************************************/

clearHistory() {

    App.module("storage")

        ?.remove(

            Constants.STORAGE_KEYS.MODAL_HISTORY

        );

}

/******************************************************************************
 IFRAME
******************************************************************************/

iframe() {

    return this.content?.querySelector(

        "iframe"

    );

}

/******************************************************************************
 RELOAD IFRAME
******************************************************************************/

reloadIframe() {

    const iframe = this.iframe();

    if (!iframe)
        return;

    iframe.src = iframe.src;

}

/******************************************************************************
 OPEN EXTERNAL
******************************************************************************/

openExternal() {

    if (!this.currentPost)
        return;

    window.open(

        this.currentPost.url,

        "_blank",

        "noopener"

    );

}

/******************************************************************************
 ANIMATION
******************************************************************************/

animateOpen() {

    DOM.removeClass(

        this.modal,

        "fade-out"

    );

    DOM.addClass(

        this.modal,

        "fade-in"

    );

}

/******************************************************************************
 ANIMATION CLOSE
******************************************************************************/

animateClose() {

    DOM.removeClass(

        this.modal,

        "fade-in"

    );

    DOM.addClass(

        this.modal,

        "fade-out"

    );

}

/******************************************************************************
 FOCUS TRAP
******************************************************************************/

focusTrap() {

    const accessibility =

        App.module("accessibility");

    accessibility?.enableFocusTrap(

        this.modal

    );

}

/******************************************************************************
 RELEASE FOCUS
******************************************************************************/

releaseFocus() {

    const accessibility =

        App.module("accessibility");

    accessibility?.disableFocusTrap();

}

/******************************************************************************
 KEYBOARD
******************************************************************************/

keyboardNavigation() {

    DOM.on(

        document,

        "keydown",

        event => {

            if (!this.isOpen)
                return;

            switch(event.key){

                case "ArrowRight":

                    this.next();

                    break;

                case "ArrowLeft":

                    this.previous();

                    break;

            }

        }

    );

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

startMeasure() {

    this.renderStart = performance.now();

}

stopMeasure() {

    this.lastRenderTime =

        performance.now() -

        this.renderStart;

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

accessibility() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    accessibility.role(

        this.modal,

        "dialog"

    );

    accessibility.aria(

        this.modal,

        "aria-modal",

        "true"

    );

    accessibility.label(

        this.modal,

        "Visualização do artigo"

    );

    accessibility.announce(

        "Artigo aberto"

    );

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

trackOpen() {

    const analytics =

        App.module("analytics");

    if (!analytics || !this.currentPost)
        return;

    analytics.track(

        "modal-open",

        {

            id:

                this.currentPost.id,

            title:

                this.currentPost.title,

            renderTime:

                this.lastRenderTime

        }

    );

}

/******************************************************************************
 ROUTER
******************************************************************************/

updateRoute() {

    const router =

        App.module("router");

    if (

        !router ||

        !this.currentPost

    )

        return;

    router.navigate(

        `/post/${this.currentPost.slug}`

    );

}

/******************************************************************************
 RESTORE ROUTE
******************************************************************************/

restoreRoute() {

    const router =

        App.module("router");

    router?.navigate("/");

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        opened:

            this.isOpen,

        loading:

            this.loading,

        renderTime:

            this.lastRenderTime,

        history:

            this.history()

                .length,

        current:

            this.currentPost

                ?.title ??

                null

    };

}

/******************************************************************************
 EXPORT
******************************************************************************/

exportJSON() {

    return JSON.stringify(

        this.report(),

        null,

        2

    );

}

/******************************************************************************
 DOWNLOAD
******************************************************************************/

downloadReport() {

    Utils.download(

        "modal-report.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    if (

        this.currentPost

    ) {

        this.render(

            this.currentPost

        );

    }

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 ENABLE
******************************************************************************/

enable() {

    this.modal?.removeAttribute(

        "inert"

    );

}

/******************************************************************************
 DISABLE
******************************************************************************/

disable() {

    this.modal?.setAttribute(

        "inert",

        ""

    );

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Modal UI"

    );

    Logger.table({

        Initialized:

            this.initialized,

        Open:

            this.isOpen,

        Loading:

            this.loading,

        Current:

            this.currentPost

                ?.title ??

                "-",

        RenderTime:

            `${this.lastRenderTime?.toFixed(2) ?? 0} ms`,

        History:

            this.history()

                .length

    });

    Logger.groupEnd();

}

/******************************************************************************
 DIAGNOSTICS
******************************************************************************/

diagnostics() {

    return {

        version:

            Config.APP.VERSION,

        initialized:

            this.initialized,

        open:

            this.isOpen,

        loading:

            this.loading,

        renderTime:

            this.lastRenderTime,

        history:

            this.history()

                .length,

        currentPost:

            this.currentPost

                ?.id ??

                null

    };

}

/******************************************************************************
 VERSION
******************************************************************************/

version() {

    return Config.APP.VERSION;

}

/******************************************************************************
 DESTROY
******************************************************************************/

destroy() {

    this.releaseFocus();

    this.clear();

    this.modal = null;

    this.overlay = null;

    this.content = null;

    this.closeButton = null;

    this.currentPost = null;

    this.isOpen = false;

    this.loading = false;

    this.initialized = false;

    Logger.warn(

        "Modal UI destroyed."

    );

}

