/******************************************************************************
 Bellacosa Mainframe Library
 constants.js
******************************************************************************/

"use strict";

const Constants = Object.freeze({

    /**************************************************************************
     MESES
    **************************************************************************/

    MONTHS: Object.freeze([

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ]),

    MONTHS_SHORT: Object.freeze([

        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"

    ]),

    /**************************************************************************
     DIAS
    **************************************************************************/

    WEEKDAYS: Object.freeze([

        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"

    ]),

    WEEKDAYS_SHORT: Object.freeze([

        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"

    ]),

    /**************************************************************************
     ORDENAÇÃO
    **************************************************************************/

    SORT: Object.freeze({

        NEWEST: "newest",

        OLDEST: "oldest",

        TITLE: "title",

        RELEVANCE: "relevance"

    }),

    /**************************************************************************
     TEMA
    **************************************************************************/

    THEMES: Object.freeze({

        LIGHT: "light",

        DARK: "dark",

        OLED: "oled",

        AUTO: "auto"

    }),

    /**************************************************************************
     EVENTOS
    **************************************************************************/

    EVENTS: Object.freeze({

        APP_READY: "app:ready",

        POSTS_LOADED: "posts:loaded",

        POSTS_UPDATED: "posts:updated",

        SEARCH_CHANGED: "search:changed",

        SEARCH_STARTED: "search:started",

        SEARCH_COMPLETED: "search:completed",

        SEARCH_CLEARED: "search:cleared",

        FILTERS_CHANGED: "filters:changed",

        FILTERS_RESET: "filters:reset",

        MODAL_OPEN: "modal:open",

        MODAL_CLOSE: "modal:close",

        MODAL_LOADED: "modal:loaded",

        ROUTER_CHANGE: "router:change",

        ROUTER_NAVIGATE: "router:navigate",

        STORAGE_UPDATE: "storage:update",

        STORAGE_SYNC: "storage:sync",

        ANALYTICS_EVENT: "analytics:event"

    }),

    /**************************************************************************
     CSS
    **************************************************************************/

    CSS: Object.freeze({

        ACTIVE: "active",

        HIDDEN: "hidden",

        SHOW: "show",

        LOADING: "loading",

        OPEN: "open",

        DISABLED: "disabled",

        SELECTED: "selected",

        FAVORITE: "favorite"

    }),

    /**************************************************************************
     SELETORES
    **************************************************************************/

    SELECTORS: Object.freeze({

        APP: "#app",

        POSTS: "#posts",

        SEARCH: "#searchInput",

        AUTOCOMPLETE: "#autocomplete",

        FILTER_YEAR: "#filterYear",

        FILTER_MONTH: "#filterMonth",

        FILTER_CATEGORY: "#filterCategory",

        FILTER_ORDER: "#filterOrder",

        ACTIVE_FILTERS: "#activeFilters",

        CLEAR_FILTERS: "#clearFilters",

        MODAL: "#modal",

        MODAL_IFRAME: "#modal iframe",

        MODAL_TITLE: ".modal-title",

        BREADCRUMB: "#breadcrumb",

        RESULT_COUNT: "#resultCount"

    }),

    /**************************************************************************
     STORAGE
    **************************************************************************/

    STORAGE_KEYS: Object.freeze({

        SETTINGS: "settings",

        THEME: "theme",

        STATE: "state",

        FAVORITES: "favorites",

        HISTORY: "history",

        RECENT: "recent",

        SEARCHES: "searches",

        FILTERS: "filters",

        LAST_POST: "last-post",

        LAST_SEARCH: "last-search",

        ANALYTICS: "analytics",

        DASHBOARD: "analytics-dashboard",

        ROUTER_HISTORY: "router-history"

    }),

    /**************************************************************************
     ÍCONES
    **************************************************************************/

    ICONS: Object.freeze({

        SEARCH: "🔍",

        FAVORITE: "❤️",

        SHARE: "📤",

        DOWNLOAD: "📥",

        FILTER: "🏷️",

        CALENDAR: "📅",

        CLOCK: "🕒",

        BOOK: "📚",

        CATEGORY: "📂",

        HOME: "🏠",

        SETTINGS: "⚙️",

        INFO: "ℹ️",

        WARNING: "⚠️",

        SUCCESS: "✅",

        ERROR: "❌"

    }),

    /**************************************************************************
     MENSAGENS
    **************************************************************************/

    MESSAGES: Object.freeze({

        LOADING: "Carregando...",

        LOADED: "Conteúdo carregado.",

        ERROR: "Ocorreu um erro.",

        EMPTY: "Nenhum artigo encontrado.",

        OFFLINE: "Você está offline.",

        FAVORITE_ADDED: "Adicionado aos favoritos.",

        FAVORITE_REMOVED: "Removido dos favoritos.",

        LINK_COPIED: "Link copiado para a área de transferência.",

        FILTERS_RESET: "Filtros limpos.",

        SEARCH_EMPTY: "Digite um termo para pesquisar."

    }),

    /**************************************************************************
     MIME TYPES
    **************************************************************************/

    MIME: Object.freeze({

        JSON: "application/json",

        CSV: "text/csv",

        HTML: "text/html",

        XML: "application/xml",

        TEXT: "text/plain"

    }),

    /**************************************************************************
     HTTP
    **************************************************************************/

    HTTP: Object.freeze({

        OK: 200,

        CREATED: 201,

        NOT_FOUND: 404,

        SERVER_ERROR: 500

    }),

    /**************************************************************************
     REGEX
    **************************************************************************/

    REGEX: Object.freeze({

        HTML: /<[^>]+>/g,

        MULTIPLE_SPACES: /\s+/g,

        NON_WORD: /[^\w\s-]/g,

        SLUG_SPACES: /\s+/g

    })

});

window.Constants = Constants;