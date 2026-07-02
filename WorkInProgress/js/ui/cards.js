/******************************************************************************
 Bellacosa Mainframe Library
 Cards UI
 Version 2.0
******************************************************************************/

"use strict";

class CardsUI {

    constructor() {

        this.container = null;

        this.posts = [];

        this.rendered = 0;

        this.loading = false;

        this.initialized = false;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing Cards UI..."

        );

        this.container = DOM.$(

            Constants.SELECTORS.POSTS_CONTAINER

        );

        if (!this.container) {

            Logger.error(

                "Posts container not found."

            );

            return;

        }

        this.bindEvents();

        this.initialized = true;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        EventBus.on(

            Constants.EVENTS.POSTS_UPDATED,

            posts => {

                this.render(posts);

            }

        );

        EventBus.on(

            Constants.EVENTS.SEARCH_COMPLETED,

            event => {

                const posts =

                    event.results ??

                    [];

                this.render(

                    posts.map(

                        item =>

                            item.post ??

                            item

                    )

                );

            }

        );

    }

    /**************************************************************************
     RENDER
    **************************************************************************/

    render(posts = []) {

        this.posts = posts;

        this.rendered = 0;

        DOM.empty(

            this.container

        );

        if (!posts.length) {

            this.empty();

            return;

        }

        const fragment =

            DOM.fragment();

        posts.forEach(post => {

            fragment.appendChild(

                this.renderCard(post)

            );

            this.rendered++;

        });

        this.container.appendChild(

            fragment

        );

        EventBus.emit(

            Constants.EVENTS.CARDS_RENDERED,

            {

                total:

                    this.rendered

            }

        );

    }

    /**************************************************************************
     CARD
    **************************************************************************/

    renderCard(post) {

        const card = DOM.create(

            "article",

            {

                className:

                    "card"

            }

        );

        card.dataset.id = post.id;

        card.innerHTML = `

            <div class="card-image">

                <img
                    loading="lazy"
                    src="${post.image}"
                    alt="${post.title}">

            </div>

            <div class="card-content">

                <h2>

                    ${post.title}

                </h2>

                <p>

                    ${post.summary}

                </p>

                <footer>

                    <span>

                        📅 ${Utils.date(post.published)}

                    </span>

                    <span>

                        ⏱ ${post.readingTime} min

                    </span>

                </footer>

            </div>

        `;

        DOM.on(

            card,

            "click",

            () => {

                EventBus.emit(

                    Constants.EVENTS.CARD_SELECTED,

                    post

                );

            }

        );

        return card;

    }

    /**************************************************************************
     LOADING
    **************************************************************************/

    showLoading() {

        this.loading = true;

        DOM.empty(

            this.container

        );

        for (

            let i = 0;

            i < 6;

            i++

        ) {

            this.container.appendChild(

                this.skeleton()

            );

        }

    }

    /**************************************************************************
     HIDE LOADING
    **************************************************************************/

    hideLoading() {

        this.loading = false;

    }

    /**************************************************************************
     SKELETON
    **************************************************************************/

    skeleton() {

        const card = DOM.create(

            "article",

            {

                className:

                    "card skeleton"

            }

        );

        card.innerHTML = `

            <div class="skeleton-image"></div>

            <div class="skeleton-title"></div>

            <div class="skeleton-text"></div>

            <div class="skeleton-text short"></div>

        `;

        return card;

    }

    /**************************************************************************
     EMPTY
    **************************************************************************/

    empty() {

        const empty = DOM.create(

            "section",

            {

                className:

                    "empty-state"

            }

        );

        empty.innerHTML = `

            <h2>

                Nenhum artigo encontrado

            </h2>

            <p>

                Tente alterar os filtros ou realizar outra pesquisa.

            </p>

        `;

        this.container.appendChild(

            empty

        );

    }

    /**************************************************************************
     APPEND
    **************************************************************************/

    append(post) {

        this.posts.push(post);

        this.container.appendChild(

            this.renderCard(post)

        );

        this.rendered++;

    }

    /**************************************************************************
     CLEAR
    **************************************************************************/

    clear() {

        this.posts = [];

        this.rendered = 0;

        DOM.empty(

            this.container

        );

    }

    /**************************************************************************
     TOTAL
    **************************************************************************/

    total() {

        return this.rendered;

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            rendered:

                this.rendered,

            loading:

                this.loading,

            posts:

                this.posts.length

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Cards UI"

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

        this.container = null;

        this.initialized = false;

        Logger.warn(

            "Cards UI destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.CardsUI = new CardsUI();

/******************************************************************************
 PAGINATION
******************************************************************************/

paginate(page = 1) {

    const api = App.module("api");

    if (!api)
        return;

    const result = api.paginate(page);

    this.render(result.items);

}

/******************************************************************************
 NEXT PAGE
******************************************************************************/

nextPage() {

    this.paginate(

        (this.currentPage || 1) + 1

    );

}

/******************************************************************************
 PREVIOUS PAGE
******************************************************************************/

previousPage() {

    this.paginate(

        Math.max(

            1,

            (this.currentPage || 1) - 1

        )

    );

}

/******************************************************************************
 INFINITE SCROLL
******************************************************************************/

enableInfiniteScroll() {

    window.addEventListener(

        "scroll",

        () => {

            if (

                window.innerHeight +

                window.scrollY

                <

                document.body.offsetHeight - 300

            )

                return;

            EventBus.emit(

                Constants.EVENTS.LOAD_MORE

            );

        }

    );

}

/******************************************************************************
 VIRTUAL SCROLL
******************************************************************************/

virtualRender(limit = 30) {

    DOM.empty(this.container);

    const fragment = DOM.fragment();

    this.posts

        .slice(0, limit)

        .forEach(post => {

            fragment.appendChild(

                this.renderCard(post)

            );

        });

    this.container.appendChild(fragment);

}

/******************************************************************************
 OBSERVER
******************************************************************************/

lazyImages() {

    if (

        !("IntersectionObserver" in window)

    )

        return;

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (

                        !entry.isIntersecting

                    )

                        return;

                    const image =

                        entry.target;

                    if (

                        image.dataset.src

                    ) {

                        image.src =

                            image.dataset.src;

                        image.removeAttribute(

                            "data-src"

                        );

                    }

                    observer.unobserve(image);

                });

            },

            {

                rootMargin: "200px"

            }

        );

    DOM.$$("img[data-src]")

        .forEach(image =>

            observer.observe(image)

        );

}

/******************************************************************************
 FAVORITES
******************************************************************************/

favorite(post) {

    App.module("storage")

        ?.save(

            `favorite:${post.id}`,

            true

        );

    EventBus.emit(

        Constants.EVENTS.CARD_FAVORITE,

        post

    );

}

/******************************************************************************
 REMOVE FAVORITE
******************************************************************************/

unfavorite(post) {

    App.module("storage")

        ?.remove(

            `favorite:${post.id}`

        );

}

/******************************************************************************
 IS FAVORITE
******************************************************************************/

isFavorite(post) {

    return App.module("storage")

        ?.exists(

            `favorite:${post.id}`

        );

}

/******************************************************************************
 BADGES
******************************************************************************/

badge(post) {

    let html = "";

    if (

        this.isFavorite(post)

    ) {

        html +=

            `<span class="badge favorite">

                ★ Favorito

             </span>`;

    }

    if (

        post.readingTime <= 5

    ) {

        html +=

            `<span class="badge quick">

                Leitura Rápida

             </span>`;

    }

    if (

        post.categories.length

    ) {

        html +=

            `<span class="badge">

                ${post.categories[0]}

             </span>`;

    }

    return html;

}

/******************************************************************************
 ANIMATION
******************************************************************************/

animateCards() {

    DOM.$$(".card")

        .forEach((card,index)=>{

            card.style.animationDelay=

                `${index*40}ms`;

            DOM.addClass(

                card,

                "fade-in"

            );

        });

}

/******************************************************************************
 SELECT
******************************************************************************/

select(card) {

    DOM.$$(".card.selected")

        .forEach(item=>{

            DOM.removeClass(

                item,

                "selected"

            );

        });

    DOM.addClass(

        card,

        "selected"

    );

}

/******************************************************************************
 KEYBOARD NAVIGATION
******************************************************************************/

keyboardNavigation() {

    DOM.on(

        document,

        "keydown",

        event => {

            const cards =

                DOM.$$(".card");

            if (!cards.length)
                return;

            let index =

                cards.findIndex(card =>

                    DOM.hasClass(

                        card,

                        "selected"

                    )

                );

            switch(event.key){

                case "ArrowDown":

                case "ArrowRight":

                    index++;

                    break;

                case "ArrowUp":

                case "ArrowLeft":

                    index--;

                    break;

                default:

                    return;

            }

            index = Math.max(

                0,

                Math.min(

                    cards.length-1,

                    index

                )

            );

            this.select(

                cards[index]

            );

            cards[index]

                .scrollIntoView({

                    behavior:"smooth",

                    block:"nearest"

                });

        }

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.render(

        this.posts

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
 INCREMENTAL RENDER
******************************************************************************/

async incrementalRender(posts, chunk = 20) {

    this.clear();

    this.posts = posts;

    const total = posts.length;

    for (let i = 0; i < total; i += chunk) {

        const fragment = DOM.fragment();

        posts

            .slice(i, i + chunk)

            .forEach(post => {

                fragment.appendChild(

                    this.renderCard(post)

                );

            });

        this.container.appendChild(

            fragment

        );

        this.rendered += Math.min(

            chunk,

            total - i

        );

        await new Promise(resolve =>

            requestAnimationFrame(resolve)

        );

    }

    this.animateCards();

    this.lazyImages();

}

/******************************************************************************
 DOM POOL
******************************************************************************/

createPool(size = 20) {

    this.pool = [];

    for (let i = 0; i < size; i++) {

        this.pool.push(

            DOM.create("article", {

                className: "card"

            })

        );

    }

}

getFromPool() {

    return this.pool?.pop() ?? null;

}

returnToPool(card) {

    if (!this.pool)

        this.pool = [];

    DOM.empty(card);

    this.pool.push(card);

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

accessibility() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)

        return;

    DOM.$$(".card").forEach(card => {

        accessibility.makeFocusable(card);

        accessibility.role(

            card,

            "article"

        );

        accessibility.label(

            card,

            "Cartão de artigo"

        );

    });

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

trackRender() {

    const analytics =

        App.module("analytics");

    analytics?.event(

        "cards-rendered",

        {

            total:

                this.rendered,

            renderTime:

                this.lastRenderTime

        }

    );

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        rendered:

            this.rendered,

        renderTime:

            this.lastRenderTime,

        cards:

            this.posts.length,

        loading:

            this.loading,

        pool:

            this.pool?.length ?? 0

    };

}

/******************************************************************************
 EXPORT REPORT
******************************************************************************/

exportReport() {

    return JSON.stringify(

        this.report(),

        null,

        2

    );

}

/******************************************************************************
 DOWNLOAD REPORT
******************************************************************************/

downloadReport() {

    Utils.download(

        "cards-report.json",

        this.exportReport(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.startMeasure();

    this.render(

        this.posts

    );

    this.stopMeasure();

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.clear();

    this.initialize();

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Cards UI"

    );

    Logger.table({

        Initialized:

            this.initialized,

        Rendered:

            this.rendered,

        Loading:

            this.loading,

        RenderTime:

            `${this.lastRenderTime?.toFixed(2) ?? 0} ms`,

        Pool:

            this.pool?.length ?? 0,

        Cards:

            this.posts.length

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

        rendered:

            this.rendered,

        renderTime:

            this.lastRenderTime,

        loading:

            this.loading,

        cards:

            this.posts.length,

        pool:

            this.pool?.length ?? 0

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

    this.clear();

    this.pool = [];

    this.container = null;

    this.posts = [];

    this.initialized = false;

    Logger.warn(

        "Cards UI destroyed."

    );

}