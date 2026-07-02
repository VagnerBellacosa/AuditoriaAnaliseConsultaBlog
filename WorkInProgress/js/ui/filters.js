/******************************************************************************
 Bellacosa Mainframe Library
 Filters UI
 Version 2.0
******************************************************************************/

"use strict";

class FiltersUI {

    constructor() {

        this.initialized = false;

        this.elements = {};

        this.state = {

            search: "",

            category: "",

            year: "",

            month: "",

            sort: Config.FILTERS.DEFAULT_SORT

        };

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing Filters UI..."

        );

        this.cacheDOM();

        this.populate();

        this.bindEvents();

        this.restore();

        this.initialized = true;

    }

    /**************************************************************************
     DOM
    **************************************************************************/

    cacheDOM() {

        this.elements = {

            search:

                DOM.$(

                    Constants.SELECTORS.SEARCH_INPUT

                ),

            category:

                DOM.$(

                    Constants.SELECTORS.CATEGORY_FILTER

                ),

            year:

                DOM.$(

                    Constants.SELECTORS.YEAR_FILTER

                ),

            month:

                DOM.$(

                    Constants.SELECTORS.MONTH_FILTER

                ),

            sort:

                DOM.$(

                    Constants.SELECTORS.SORT_FILTER

                ),

            clear:

                DOM.$(

                    Constants.SELECTORS.CLEAR_FILTERS

                )

        };

    }

    /**************************************************************************
     POPULATE
    **************************************************************************/

    populate() {

        this.populateCategories();

        this.populateYears();

        this.populateMonths();

        this.populateSort();

    }

    /**************************************************************************
     CATEGORIES
    **************************************************************************/

    populateCategories() {

        const api = App.module("api");

        if (!api || !this.elements.category)
            return;

        DOM.empty(this.elements.category);

        this.addOption(

            this.elements.category,

            "",

            "Todas"

        );

        api.categories()

            .forEach(category => {

                this.addOption(

                    this.elements.category,

                    category.name,

                    `${category.name} (${category.total})`

                );

            });

    }

    /**************************************************************************
     YEARS
    **************************************************************************/

    populateYears() {

        const api = App.module("api");

        if (!api || !this.elements.year)
            return;

        DOM.empty(this.elements.year);

        this.addOption(

            this.elements.year,

            "",

            "Todos"

        );

        api.years()

            .forEach(year => {

                this.addOption(

                    this.elements.year,

                    year,

                    year

                );

            });

    }

    /**************************************************************************
     MONTHS
    **************************************************************************/

    populateMonths() {

        if (!this.elements.month)
            return;

        DOM.empty(this.elements.month);

        this.addOption(

            this.elements.month,

            "",

            "Todos"

        );

        Config.MONTHS.forEach(

            (month, index) => {

                this.addOption(

                    this.elements.month,

                    index + 1,

                    month

                );

            }

        );

    }

    /**************************************************************************
     SORT
    **************************************************************************/

    populateSort() {

        if (!this.elements.sort)
            return;

        DOM.empty(this.elements.sort);

        Object.entries(

            Config.FILTERS.SORT_OPTIONS

        ).forEach(([value, text]) => {

            this.addOption(

                this.elements.sort,

                value,

                text

            );

        });

    }

    /**************************************************************************
     OPTION
    **************************************************************************/

    addOption(select, value, text) {

        const option = DOM.create("option");

        option.value = value;

        option.textContent = text;

        select.appendChild(option);

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        DOM.on(

            this.elements.search,

            "input",

            () => this.apply()

        );

        DOM.on(

            this.elements.category,

            "change",

            () => this.apply()

        );

        DOM.on(

            this.elements.year,

            "change",

            () => this.apply()

        );

        DOM.on(

            this.elements.month,

            "change",

            () => this.apply()

        );

        DOM.on(

            this.elements.sort,

            "change",

            () => this.apply()

        );

        DOM.on(

            this.elements.clear,

            "click",

            () => this.clear()

        );

    }

    /**************************************************************************
     STATE
    **************************************************************************/

    updateState() {

        this.state.search =
            this.elements.search?.value ?? "";

        this.state.category =
            this.elements.category?.value ?? "";

        this.state.year =
            this.elements.year?.value ?? "";

        this.state.month =
            this.elements.month?.value ?? "";

        this.state.sort =
            this.elements.sort?.value ??
            Config.FILTERS.DEFAULT_SORT;

    }

    /**************************************************************************
     APPLY
    **************************************************************************/

    apply() {

        this.updateState();

        EventBus.emit(

            Constants.EVENTS.FILTERS_CHANGED,

            {

                ...this.state

            }

        );

        App.module("storage")

            ?.save(

                Constants.STORAGE_KEYS.FILTERS,

                this.state

            );

    }

    /**************************************************************************
     RESTORE
    **************************************************************************/

    restore() {

        const storage =

            App.module("storage");

        if (!storage)
            return;

        const state = storage.load(

            Constants.STORAGE_KEYS.FILTERS,

            null

        );

        if (!state)
            return;

        this.state = state;

        if (this.elements.search)
            this.elements.search.value = state.search;

        if (this.elements.category)
            this.elements.category.value = state.category;

        if (this.elements.year)
            this.elements.year.value = state.year;

        if (this.elements.month)
            this.elements.month.value = state.month;

        if (this.elements.sort)
            this.elements.sort.value = state.sort;

    }

    /**************************************************************************
     CLEAR
    **************************************************************************/

    clear() {

        this.state = {

            search: "",

            category: "",

            year: "",

            month: "",

            sort: Config.FILTERS.DEFAULT_SORT

        };

        this.restore();

        EventBus.emit(

            Constants.EVENTS.FILTERS_CLEARED

        );

    }

    /**************************************************************************
     GET STATE
    **************************************************************************/

    getState() {

        return {

            ...this.state

        };

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            state:

                this.state

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Filters UI"

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

        this.elements = {};

        this.initialized = false;

        Logger.warn(

            "Filters UI destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.FiltersUI = new FiltersUI();

/******************************************************************************
 DEBOUNCE
******************************************************************************/

debounce(callback, delay = 300) {

    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(

        callback,

        delay

    );

}

/******************************************************************************
 LIVE SEARCH
******************************************************************************/

enableLiveSearch() {

    if (!this.elements.search)
        return;

    DOM.on(

        this.elements.search,

        "input",

        () => {

            this.debounce(() => {

                this.apply();

            });

        }

    );

}

/******************************************************************************
 FILTER CHIPS
******************************************************************************/

renderChips() {

    const container = DOM.$(

        Constants.SELECTORS.FILTER_CHIPS

    );

    if (!container)
        return;

    DOM.empty(container);

    Object.entries(this.state)

        .forEach(([key, value]) => {

            if (!value)
                return;

            const chip = DOM.create(

                "button",

                {

                    className:

                        "filter-chip"

                }

            );

            chip.dataset.filter = key;

            chip.innerHTML = `

                ${value}

                <span>✕</span>

            `;

            DOM.on(

                chip,

                "click",

                () => {

                    this.state[key] = "";

                    this.restoreState();

                    this.apply();

                }

            );

            container.appendChild(chip);

        });

}

/******************************************************************************
 RESTORE STATE
******************************************************************************/

restoreState() {

    if (this.elements.search)
        this.elements.search.value =
            this.state.search;

    if (this.elements.category)
        this.elements.category.value =
            this.state.category;

    if (this.elements.year)
        this.elements.year.value =
            this.state.year;

    if (this.elements.month)
        this.elements.month.value =
            this.state.month;

    if (this.elements.sort)
        this.elements.sort.value =
            this.state.sort;

}

/******************************************************************************
 FAVORITES
******************************************************************************/

toggleFavorites() {

    this.state.favorites =

        !this.state.favorites;

    this.apply();

}

/******************************************************************************
 RECENT
******************************************************************************/

toggleRecent() {

    this.state.recent =

        !this.state.recent;

    this.apply();

}

/******************************************************************************
 HISTORY
******************************************************************************/

history() {

    return App.module("storage")

        ?.load(

            Constants.STORAGE_KEYS.FILTER_HISTORY,

            []

        ) ?? [];

}

/******************************************************************************
 SAVE HISTORY
******************************************************************************/

saveHistory() {

    let history = this.history();

    history.unshift({

        ...this.state,

        date:

            new Date()

                .toISOString()

    });

    history = history.slice(0,20);

    App.module("storage")

        ?.save(

            Constants.STORAGE_KEYS.FILTER_HISTORY,

            history

        );

}

/******************************************************************************
 CLEAR HISTORY
******************************************************************************/

clearHistory() {

    App.module("storage")

        ?.remove(

            Constants.STORAGE_KEYS.FILTER_HISTORY

        );

}

/******************************************************************************
 KEYBOARD
******************************************************************************/

keyboardNavigation() {

    DOM.on(

        document,

        "keydown",

        event => {

            if (

                event.ctrlKey &&

                event.key === "f"

            ) {

                event.preventDefault();

                this.elements.search

                    ?.focus();

            }

            if (

                event.key === "Escape"

            ) {

                this.clear();

            }

        }

    );

}

/******************************************************************************
 MONTH UPDATE
******************************************************************************/

updateMonths() {

    if (

        !this.state.year

    )

        return;

    const api =

        App.module("api");

    if (!api)
        return;

    const months =

        api.months(

            this.state.year

        );

    DOM.empty(

        this.elements.month

    );

    this.addOption(

        this.elements.month,

        "",

        "Todos"

    );

    months.forEach(month => {

        this.addOption(

            this.elements.month,

            month,

            Config.MONTHS[month - 1]

        );

    });

}

/******************************************************************************
 ANIMATION
******************************************************************************/

animate() {

    DOM.$$(".filter-chip")

        .forEach((chip,index)=>{

            chip.style.animationDelay =

                `${index*40}ms`;

            DOM.addClass(

                chip,

                "fade-in"

            );

        });

}

/******************************************************************************
 RESET
******************************************************************************/

reset() {

    this.clear();

    this.renderChips();

}

/******************************************************************************
 FAVORITES FILTER
******************************************************************************/

favoritesEnabled() {

    return !!this.state.favorites;

}

/******************************************************************************
 RECENT FILTER
******************************************************************************/

recentEnabled() {

    return !!this.state.recent;

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

accessibility() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    Object.values(this.elements)

        .filter(Boolean)

        .forEach(element => {

            accessibility.makeFocusable(element);

        });

    accessibility.label(

        this.elements.search,

        "Pesquisar artigos"

    );

    accessibility.label(

        this.elements.category,

        "Filtro por categoria"

    );

    accessibility.label(

        this.elements.year,

        "Filtro por ano"

    );

    accessibility.label(

        this.elements.month,

        "Filtro por mês"

    );

    accessibility.label(

        this.elements.sort,

        "Ordenação"

    );

}

/******************************************************************************
 ANNOUNCE
******************************************************************************/

announce() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    accessibility.announce(

        "Filtros atualizados"

    );

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

trackFilters() {

    const analytics =

        App.module("analytics");

    if (!analytics)
        return;

    analytics.track(

        "filters-applied",

        {

            ...this.state

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

        state:

            this.getState(),

        history:

            this.history()

                .length,

        favorites:

            this.favoritesEnabled(),

        recent:

            this.recentEnabled()

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

        "filters-report.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.populate();

    this.restore();

    this.renderChips();

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

    Object.values(this.elements)

        .filter(Boolean)

        .forEach(element => {

            element.disabled = false;

        });

}

/******************************************************************************
 DISABLE
******************************************************************************/

disable() {

    Object.values(this.elements)

        .filter(Boolean)

        .forEach(element => {

            element.disabled = true;

        });

}

/******************************************************************************
 RESET HISTORY
******************************************************************************/

resetHistory() {

    this.clearHistory();

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Filters UI"

    );

    Logger.table({

        Initialized:

            this.initialized,

        Search:

            this.state.search,

        Category:

            this.state.category,

        Year:

            this.state.year,

        Month:

            this.state.month,

        Sort:

            this.state.sort,

        History:

            this.history().length,

        Favorites:

            this.favoritesEnabled(),

        Recent:

            this.recentEnabled()

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

        state:

            this.getState(),

        history:

            this.history().length,

        elements:

            Object.keys(this.elements)

                .length

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

    this.elements = {};

    this.state = {};

    this.initialized = false;

    Logger.warn(

        "Filters UI destroyed."

    );

}