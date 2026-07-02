"use strict";

EventBus.on(
    Constants.EVENTS.POSTS_UPDATED,
    posts => {

        cards.setPosts(posts);

    }
);

EventBus.on(
    Constants.EVENTS.MODAL_OPEN,
    post => {

        modal.open(post);

    }
);

EventBus.on(
    Constants.EVENTS.SEARCH_CHANGED,
    query => {

        filters.setSearch(query);

    }
);

EventBus.on(
    Constants.EVENTS.FILTERS_CHANGED,
    filters => {

        storage.saveFilters(filters);

    }
);

EventBus.onAny(data => {

    analytics.event(
        data.event,
        data.payload
    );

});