/******************************************************************************
 Bellacosa Mainframe Library
 cards.js
 PARTE 1
******************************************************************************/

"use strict";

class Cards {

    constructor() {

        this.container =
            document.querySelector("#postsGrid");

        this.posts = [];

        this.currentPage = 1;

        this.pageSize = 12;

        this.rendered = 0;

    }

    /**************************************************************************
     INICIALIZA
    **************************************************************************/

    async initialize() {

        if (!blogAPI.isLoaded()) {

            await blogAPI.initialize();

        }

this.posts = blogAPI.getPosts();

this.render(
    this.getCurrentPagePosts()
);

this.rendered =
    this.pageSize;

this.bindEvents();

this.updateFavoritesUI();

this.enableInfiniteScroll();

    }

    /**************************************************************************
     FORMATA DATA
    **************************************************************************/

    formatDate(date) {

        return date.toLocaleDateString(

            "pt-BR",

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

    }

    /**************************************************************************
     ESCAPE HTML
    **************************************************************************/

    escape(text = "") {

        return text

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }

    /**************************************************************************
     BADGES
    **************************************************************************/

    createBadges(post) {

        let html = "";

        if (post.categories) {

            post.categories.forEach(category => {

                html +=

                    `<span class="post-tag">

                        ${this.escape(category)}

                    </span>`;

            });

        }

        return html;

    }

    /**************************************************************************
     CARD
    **************************************************************************/

    createCard(post) {

        return `

<article class="post-card fade-in">

    <div class="post-image">

        <img

            data-src="${post.image}"

            alt="${this.escape(post.title)}"

            loading="lazy"

            class="lazy-image"

        >

        <span class="post-date">

            ${this.formatDate(post.published)}

        </span>

        <button

            class="favorite"

            data-id="${post.id}"

            title="Favorito">

            ❤

        </button>

    </div>

    <div class="post-content">

        <h2 class="post-title">

            ${this.escape(post.title)}

        </h2>

        <p class="post-summary">

            ${this.escape(post.summary)}

        </p>

        <div class="post-tags">

            ${this.createBadges(post)}

        </div>

        <div class="post-footer">

            <div class="reading-time">

                ⏱ ${post.readingTime}

            </div>

            <button

                class="btn post-button"

                data-url="${post.url}">

                Ler artigo

            </button>

        </div>

    </div>

</article>

`;

    }

    /**************************************************************************
     SKELETON
    **************************************************************************/

    createSkeleton() {

        return `

<div class="card-loading">

    <div class="image"></div>

    <div class="line long"></div>

    <div class="line medium"></div>

    <div class="line short"></div>

</div>

`;

    }

    /**************************************************************************
     LOADING
    **************************************************************************/

    showLoading(quantity = 6) {

        let html = "";

        for (let i = 0; i < quantity; i++) {

            html += this.createSkeleton();

        }

        this.container.innerHTML = html;

    }

    /**************************************************************************
     LIMPA
    **************************************************************************/

    clear() {

        this.container.innerHTML = "";

    }

    /**************************************************************************
     RENDER
    **************************************************************************/

    render(posts = this.posts) {

        this.posts = posts;

        this.clear();

        if (!posts.length) {

            this.container.innerHTML =

                `

<div class="empty">

    <h2>

        Nenhum artigo encontrado

    </h2>

    <p>

        Tente outro filtro.

    </p>

</div>

`;

            return;

        }

        const html =

            posts

                .map(post =>

                    this.createCard(post)

                )

                .join("");

        this.container.innerHTML = html;

        this.enableLazyImages();

    }

    /**************************************************************************
     UPDATE
    **************************************************************************/

    update(posts) {

        this.render(posts);

    }

    /**************************************************************************
     LAZY LOADING
    **************************************************************************/

    enableLazyImages() {

        const images =

            document.querySelectorAll(

                "img[data-src]"

            );

        const observer =

            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            const img =

                                entry.target;

                            img.src =

                                img.dataset.src;

                            img.removeAttribute(

                                "data-src"

                            );

                            observer.unobserve(img);

                        }

                    });

                },

                {

                    threshold: .10

                }

            );

        images.forEach(

            image => observer.observe(image)

        );

    }

}

/******************************************************************************
 EXPORTA
******************************************************************************/

window.cards = new Cards();

/******************************************************************************
 AUTO START
******************************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        cards.showLoading();

        await cards.start();

    }

);


/******************************************************************************
 FAVORITOS
******************************************************************************/

loadFavorites() {

    return JSON.parse(

        localStorage.getItem("bellacosa-favorites") || "[]"

    );

}

saveFavorites(favorites) {

    localStorage.setItem(

        "bellacosa-favorites",

        JSON.stringify(favorites)

    );

}

isFavorite(id) {

    return this.loadFavorites().includes(id);

}

toggleFavorite(id) {

    let favorites = this.loadFavorites();

    if (favorites.includes(id)) {

        favorites = favorites.filter(item => item !== id);

    } else {

        favorites.push(id);

    }

    this.saveFavorites(favorites);

    return favorites.includes(id);

}

/******************************************************************************
 COMPARTILHAR
******************************************************************************/

async sharePost(post) {

    if (navigator.share) {

        try {

            await navigator.share({

                title: post.title,

                text: post.summary,

                url: post.url

            });

        } catch (e) {

            console.log(e);

        }

    } else {

        navigator.clipboard.writeText(post.url);

        alert("Link copiado para a área de transferência.");

    }

}

/******************************************************************************
 ABRIR MODAL
******************************************************************************/

openPost(url, title) {

    if (

        window.modal &&
        typeof window.modal.open === "function"

    ) {

        window.modal.open(url, title);

        return;

    }

    window.open(url, "_blank");

}

/******************************************************************************
 EVENTOS
******************************************************************************/

bindEvents() {

    this.container.addEventListener("click", e => {

        const favorite = e.target.closest(".favorite");

        if (favorite) {

            const id = favorite.dataset.id;

            const active = this.toggleFavorite(id);

            favorite.classList.toggle("active", active);

            return;

        }

        const button = e.target.closest(".post-button");

        if (button) {

            const url = button.dataset.url;

            const post = this.posts.find(

                p => p.url === url

            );

            if (post)

                this.openPost(

                    post.url,

                    post.title

                );

            return;

        }

        const share = e.target.closest(".share-button");

        if (share) {

            const url = share.dataset.url;

            const post = this.posts.find(

                p => p.url === url

            );

            if (post)

                this.sharePost(post);

        }

    });

}

/******************************************************************************
 PAGINAÇÃO
******************************************************************************/

getCurrentPagePosts() {

    const start =

        (this.currentPage - 1) *

        this.pageSize;

    const end =

        start + this.pageSize;

    return this.posts.slice(start, end);

}

nextPage() {

    const totalPages =

        Math.ceil(

            this.posts.length /

            this.pageSize

        );

    if (this.currentPage < totalPages) {

        this.currentPage++;

        this.render(

            this.getCurrentPagePosts()

        );

    }

}

previousPage() {

    if (this.currentPage > 1) {

        this.currentPage--;

        this.render(

            this.getCurrentPagePosts()

        );

    }

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

                window.scrollY >=

                document.body.offsetHeight - 500

            ) {

                this.loadNextChunk();

            }

        }

    );

}

/******************************************************************************
 LOAD CHUNK
******************************************************************************/

loadNextChunk() {

    if (

        this.rendered >=

        this.posts.length

    )

        return;

    const chunk =

        this.posts.slice(

            this.rendered,

            this.rendered + this.pageSize

        );

    chunk.forEach(post => {

        this.container.insertAdjacentHTML(

            "beforeend",

            this.createCard(post)

        );

    });

    this.rendered += chunk.length;

    this.enableLazyImages();

}

/******************************************************************************
 RESET PAGINAÇÃO
******************************************************************************/

reset() {

    this.currentPage = 1;

    this.rendered = 0;

}

/******************************************************************************
 FILTRO
******************************************************************************/

setPosts(posts) {

    this.posts = posts;

    this.reset();

    this.render(

        this.getCurrentPagePosts()

    );

}

/******************************************************************************
 ATUALIZA FAVORITOS
******************************************************************************/

updateFavoritesUI() {

    const favorites =

        this.loadFavorites();

    document

        .querySelectorAll(".favorite")

        .forEach(button => {

            button.classList.toggle(

                "active",

                favorites.includes(

                    button.dataset.id

                )

            );

        });

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh(posts) {

    this.setPosts(posts);

    this.updateFavoritesUI();

}

/******************************************************************************
 DESTRUIR
******************************************************************************/

destroy() {

    this.container.innerHTML = "";

    this.posts = [];

    this.currentPage = 1;

    this.rendered = 0;

}

/******************************************************************************
 cards.js
 PARTE 3
 Hero • Trending • Carrosséis • Relacionados • Performance
******************************************************************************/

/******************************************************************************
 HERO CARD
******************************************************************************/

renderHero() {

    const heroContainer =
        document.querySelector("#heroPost");

    if (!heroContainer)
        return;

    const hero =
        blogAPI.getRecentPosts(1)[0];

    if (!hero)
        return;

    heroContainer.innerHTML = `

    <article class="hero-card fade-in">

        <div class="hero-card-image">

            <img
                src="${hero.image}"
                alt="${this.escape(hero.title)}">

        </div>

        <div class="hero-card-content">

            <span class="badge">

                Destaque

            </span>

            <h2>

                ${this.escape(hero.title)}

            </h2>

            <p>

                ${this.escape(hero.summary)}

            </p>

            <button
                class="btn btn-primary hero-open"
                data-url="${hero.url}">

                Ler artigo

            </button>

        </div>

    </article>

    `;

}

/******************************************************************************
 TRENDING
******************************************************************************/

renderTrending() {

    const container =
        document.querySelector("#trendingPosts");

    if (!container)
        return;

    const posts =
        blogAPI.getTrendingPosts(5);

    container.innerHTML = "";

    posts.forEach(post => {

        container.insertAdjacentHTML(

            "beforeend",

            this.createCompactCard(post)

        );

    });

}

/******************************************************************************
 CARD COMPACTO
******************************************************************************/

createCompactCard(post){

    return `

    <article class="post-compact">

        <img
            src="${post.image}"
            alt="${this.escape(post.title)}">

        <div class="post-compact-content">

            <h4>

                ${this.escape(post.title)}

            </h4>

            <small>

                ${this.formatDate(post.published)}

            </small>

        </div>

    </article>

    `;

}

/******************************************************************************
 CARROSSEL POR CATEGORIA
******************************************************************************/

renderCategoryCarousel(category){

    const posts =
        blogAPI
        .getPostsByCategory(category)
        .slice(0,10);

    return `

<section class="category-carousel">

    <div class="category-header">

        <h2>

            ${category}

        </h2>

    </div>

    <div class="carousel">

        ${posts
            .map(post=>this.createCard(post))
            .join("")}

    </div>

</section>

`;

}

/******************************************************************************
 TODAS AS CATEGORIAS
******************************************************************************/

renderCategorySections(){

    const container =
        document.querySelector("#categories");

    if(!container)
        return;

    container.innerHTML="";

    blogAPI
        .getCategoriesList()

        .forEach(category=>{

            container.insertAdjacentHTML(

                "beforeend",

                this.renderCategoryCarousel(category)

            );

        });

}

/******************************************************************************
 POSTS RELACIONADOS
******************************************************************************/

renderRelated(post){

    const related =
        blogAPI.getRelatedPosts(post);

    const container =
        document.querySelector("#relatedGrid");

    if(!container)
        return;

    container.innerHTML="";

    related.forEach(item=>{

        container.insertAdjacentHTML(

            "beforeend",

            this.createCompactCard(item)

        );

    });

}

/******************************************************************************
 ESTATÍSTICAS
******************************************************************************/

updateStatistics(){

    const total =
        document.querySelector("#statTotal");

    const categories =
        document.querySelector("#statCategories");

    const years =
        document.querySelector("#statYears");

    if(total)
        total.textContent=
            blogAPI.getTotal();

    if(categories)
        categories.textContent=
            blogAPI.getCategoriesList().length;

    if(years)
        years.textContent=
            blogAPI.getYears().length;

}

/******************************************************************************
 CACHE DE TEMPLATE
******************************************************************************/

compileTemplate(post){

    if(!this.templateCache)
        this.templateCache={};

    if(this.templateCache[post.id])
        return this.templateCache[post.id];

    this.templateCache[post.id]=
        this.createCard(post);

    return this.templateCache[post.id];

}

/******************************************************************************
 RENDER VIRTUAL
******************************************************************************/

virtualRender(posts){

    const fragment=
        document.createDocumentFragment();

    posts.forEach(post=>{

        const div=
            document.createElement("div");

        div.innerHTML=
            this.compileTemplate(post);

        fragment.appendChild(div.firstElementChild);

    });

    this.container.innerHTML="";

    this.container.appendChild(fragment);

    this.enableLazyImages();

}

/******************************************************************************
 OBSERVER
******************************************************************************/

observeCards(){

    const observer=
        new IntersectionObserver(

            entries=>{

                entries.forEach(entry=>{

                    if(entry.isIntersecting){

                        entry.target.classList.add(

                            "fade-in"

                        );

                    }

                });

            },

            {

                threshold:.15

            }

        );

    document

        .querySelectorAll(".post-card")

        .forEach(card=>observer.observe(card));

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload(){

    this.renderHero();

    this.renderTrending();

    this.renderCategorySections();

    this.updateStatistics();

    this.observeCards();

}

/******************************************************************************
 EVENTOS BLOG API
******************************************************************************/

registerEvents(){

    blogAPI.on(

        "refresh",

        ()=>{

            this.posts=
                blogAPI.getPosts();

            this.reload();

        }

    );

}

/******************************************************************************
 START
******************************************************************************/

async start(){

    await this.initialize();

    this.reload();

    this.registerEvents();

}
