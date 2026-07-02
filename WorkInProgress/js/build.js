/*****************************************************************
 Bellacosa Mainframe Library
 build.js
*****************************************************************/

import config from "./build/config.js";

import fetchPosts from "./build/fetch.js";

import parsePosts from "./build/parser.js";

import buildTemplates from "./build/template.js";

import buildCategories from "./build/categories.js";

import buildTimeline from "./build/timeline.js";

import buildSearch from "./build/search.js";

import buildSEO from "./build/seo.js";

import buildRSS from "./build/rss.js";

import buildSitemap from "./build/sitemap.js";

import buildManifest from "./build/manifest.js";

import buildRobots from "./build/robots.js";

async function build(){

    console.log("================================");

    console.log(" Bellacosa Mainframe Builder");

    console.log("================================");

    const raw =

        await fetchPosts(config);

    const posts =

        parsePosts(raw);

    await buildTemplates(posts);

    await buildCategories(posts);

    await buildTimeline(posts);

    await buildSearch(posts);

    await buildSEO(posts);

    await buildRSS(posts);

    await buildSitemap(posts);

    await buildManifest();

    await buildRobots();

    console.log("");

    console.log("✓ Build Finalizado");

    console.log("");

    console.log(posts.length+" artigos gerados.");

}

build();