/******************************************************************************
 Bellacosa Mainframe Library
 Theme UI
 Version 2.0
******************************************************************************/

"use strict";

class ThemeUI {

    constructor() {

        this.initialized = false;

        this.currentTheme = Config.THEME.DEFAULT;

        this.root = document.documentElement;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.initialized)
            return;

        Logger.info(

            "Initializing Theme UI..."

        );

        this.load();

        this.detectSystemTheme();

        this.bindEvents();

        this.initialized = true;

    }

    /**************************************************************************
     EVENTS
    **************************************************************************/

    bindEvents() {

        window.matchMedia(

            "(prefers-color-scheme: dark)"

        ).addEventListener(

            "change",

            event => {

                if (

                    this.currentTheme === "auto"

                ) {

                    this.apply(

                        event.matches

                            ? "dark"

                            : "light",

                        false

                    );

                }

            }

        );

        EventBus.on(

            Constants.EVENTS.THEME_CHANGED,

            theme => {

                Logger.info(

                    "Theme changed:",

                    theme

                );

            }

        );

    }

    /**************************************************************************
     LOAD
    **************************************************************************/

    load() {

        const storage =

            App.module("storage");

        if (!storage)
            return;

        const theme = storage.load(

            Constants.STORAGE_KEYS.THEME,

            Config.THEME.DEFAULT

        );

        this.set(theme);

    }

    /**************************************************************************
     SAVE
    **************************************************************************/

    save() {

        const storage =

            App.module("storage");

        if (!storage)
            return;

        storage.save(

            Constants.STORAGE_KEYS.THEME,

            this.currentTheme

        );

    }

    /**************************************************************************
     SET
    **************************************************************************/

    set(theme) {

        switch (theme) {

            case "light":

                this.light();

                break;

            case "dark":

                this.dark();

                break;

            case "auto":

                this.auto();

                break;

            default:

                this.light();

        }

    }

    /**************************************************************************
     APPLY
    **************************************************************************/

    apply(theme, persist = true) {

        this.root.setAttribute(

            "data-theme",

            theme

        );

        this.currentTheme = theme;

        if (persist)

            this.save();

        EventBus.emit(

            Constants.EVENTS.THEME_CHANGED,

            theme

        );

    }

    /**************************************************************************
     LIGHT
    **************************************************************************/

    light() {

        this.apply("light");

    }

    /**************************************************************************
     DARK
    **************************************************************************/

    dark() {

        this.apply("dark");

    }

    /**************************************************************************
     AUTO
    **************************************************************************/

    auto() {

        this.currentTheme = "auto";

        const dark =

            window.matchMedia(

                "(prefers-color-scheme: dark)"

            ).matches;

        this.apply(

            dark

                ? "dark"

                : "light",

            false

        );

        this.save();

    }

    /**************************************************************************
     TOGGLE
    **************************************************************************/

    toggle() {

        if (

            this.root.getAttribute(

                "data-theme"

            ) === "dark"

        ) {

            this.light();

        }

        else {

            this.dark();

        }

    }

    /**************************************************************************
     SYSTEM
    **************************************************************************/

    detectSystemTheme() {

        if (

            this.currentTheme !== "auto"

        )

            return;

        this.auto();

    }

    /**************************************************************************
     CSS VARIABLE
    **************************************************************************/

    setVariable(name, value) {

        this.root.style.setProperty(

            name,

            value

        );

    }

    /**************************************************************************
     GET VARIABLE
    **************************************************************************/

    getVariable(name) {

        return getComputedStyle(

            this.root

        ).getPropertyValue(name);

    }

    /**************************************************************************
     REMOVE VARIABLE
    **************************************************************************/

    removeVariable(name) {

        this.root.style.removeProperty(

            name

        );

    }

    /**************************************************************************
     CURRENT
    **************************************************************************/

    current() {

        return this.currentTheme;

    }

    /**************************************************************************
     IS DARK
    **************************************************************************/

    isDark() {

        return this.root.getAttribute(

            "data-theme"

        ) === "dark";

    }

    /**************************************************************************
     IS LIGHT
    **************************************************************************/

    isLight() {

        return this.root.getAttribute(

            "data-theme"

        ) === "light";

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            initialized:

                this.initialized,

            theme:

                this.currentTheme,

            dark:

                this.isDark(),

            light:

                this.isLight()

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Theme UI"

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

        this.root.removeAttribute(

            "data-theme"

        );

        this.initialized = false;

        Logger.warn(

            "Theme UI destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.ThemeUI = new ThemeUI();

/******************************************************************************
 ACCENT COLORS
******************************************************************************/

setAccent(color) {

    this.accentColor = color;

    this.setVariable(

        "--color-accent",

        color

    );

    this.savePreferences();

    EventBus.emit(

        Constants.EVENTS.ACCENT_CHANGED,

        color

    );

}

/******************************************************************************
 GET ACCENT
******************************************************************************/

getAccent() {

    return this.accentColor;

}

/******************************************************************************
 RESET ACCENT
******************************************************************************/

resetAccent() {

    this.setAccent(

        Config.THEME.ACCENT

    );

}

/******************************************************************************
 PALETTE
******************************************************************************/

applyPalette(palette = {}) {

    Object.entries(palette)

        .forEach(([variable, value]) => {

            this.setVariable(

                variable,

                value

            );

        });

}

/******************************************************************************
 HIGH CONTRAST
******************************************************************************/

setHighContrast(enabled = true) {

    this.highContrast = enabled;

    this.root.classList.toggle(

        "high-contrast",

        enabled

    );

    this.savePreferences();

    EventBus.emit(

        Constants.EVENTS.HIGH_CONTRAST_CHANGED,

        enabled

    );

}

/******************************************************************************
 TOGGLE HIGH CONTRAST
******************************************************************************/

toggleHighContrast() {

    this.setHighContrast(

        !this.highContrast

    );

}

/******************************************************************************
 REDUCED MOTION
******************************************************************************/

setReducedMotion(enabled = true) {

    this.reducedMotion = enabled;

    this.root.classList.toggle(

        "reduce-motion",

        enabled

    );

    this.savePreferences();

}

/******************************************************************************
 FONT SCALE
******************************************************************************/

setFontScale(scale = 100) {

    this.fontScale =

        Math.min(

            200,

            Math.max(

                70,

                scale

            )

        );

    this.setVariable(

        "--font-scale",

        `${this.fontScale}%`

    );

    this.root.style.fontSize =

        `${this.fontScale}%`;

    this.savePreferences();

}

/******************************************************************************
 FONT SCALE
******************************************************************************/

increaseFontScale() {

    this.setFontScale(

        this.fontScale + 10

    );

}

decreaseFontScale() {

    this.setFontScale(

        this.fontScale - 10

    );

}

resetFontScale() {

    this.setFontScale(100);

}

/******************************************************************************
 SYSTEM PREFERENCES
******************************************************************************/

detectSystemPreferences() {

    if (

        window.matchMedia(

            "(prefers-reduced-motion: reduce)"

        ).matches

    ) {

        this.setReducedMotion(

            true

        );

    }

    if (

        window.matchMedia(

            "(prefers-contrast: more)"

        ).matches

    ) {

        this.setHighContrast(

            true

        );

    }

}

/******************************************************************************
 SAVE PREFERENCES
******************************************************************************/

savePreferences() {

    const storage =

        App.module("storage");

    if (!storage)
        return;

    storage.save(

        Constants.STORAGE_KEYS.THEME_PREFERENCES,

        {

            accent:

                this.accentColor,

            fontScale:

                this.fontScale,

            highContrast:

                this.highContrast,

            reducedMotion:

                this.reducedMotion

        }

    );

}

/******************************************************************************
 LOAD PREFERENCES
******************************************************************************/

loadPreferences() {

    const storage =

        App.module("storage");

    if (!storage)
        return;

    const preferences = storage.load(

        Constants.STORAGE_KEYS.THEME_PREFERENCES,

        null

    );

    if (!preferences)
        return;

    this.accentColor =

        preferences.accent ??

        Config.THEME.ACCENT;

    this.fontScale =

        preferences.fontScale ?? 100;

    this.highContrast =

        preferences.highContrast ?? false;

    this.reducedMotion =

        preferences.reducedMotion ?? false;

    this.setAccent(

        this.accentColor

    );

    this.setFontScale(

        this.fontScale

    );

    this.setHighContrast(

        this.highContrast

    );

    this.setReducedMotion(

        this.reducedMotion

    );

}

/******************************************************************************
 AVAILABLE PALETTES
******************************************************************************/

palettes() {

    return Config.THEME.PALETTES;

}

/******************************************************************************
 APPLY PREDEFINED PALETTE
******************************************************************************/

usePalette(name) {

    const palette =

        Config.THEME.PALETTES[name];

    if (!palette)
        return;

    this.applyPalette(

        palette

    );

}

/******************************************************************************
 RESET THEME
******************************************************************************/

reset() {

    this.light();

    this.resetAccent();

    this.resetFontScale();

    this.setHighContrast(false);

    this.setReducedMotion(false);

}

/******************************************************************************
 SYSTEM INFORMATION
******************************************************************************/

systemPreferences() {

    return {

        dark:

            window.matchMedia(

                "(prefers-color-scheme: dark)"

            ).matches,

        reducedMotion:

            window.matchMedia(

                "(prefers-reduced-motion: reduce)"

            ).matches,

        highContrast:

            window.matchMedia(

                "(prefers-contrast: more)"

            ).matches

    };

}

/******************************************************************************
 PERFORMANCE
******************************************************************************/

startMeasure() {

    this.themeChangeStart = performance.now();

}

/******************************************************************************
 STOP PERFORMANCE
******************************************************************************/

stopMeasure() {

    this.lastThemeChangeTime =

        performance.now() -

        this.themeChangeStart;

}

/******************************************************************************
 ACCESSIBILITY
******************************************************************************/

notifyAccessibility() {

    const accessibility =

        App.module("accessibility");

    if (!accessibility)
        return;

    const theme = this.root.getAttribute(
        "data-theme"
    );

    accessibility.announce(

        `Tema ${theme} aplicado.`

    );

}

/******************************************************************************
 ANALYTICS
******************************************************************************/

trackTheme() {

    const analytics =

        App.module("analytics");

    if (!analytics)
        return;

    analytics.track(

        "theme-change",

        {

            theme:

                this.currentTheme,

            accent:

                this.accentColor,

            highContrast:

                this.highContrast,

            reducedMotion:

                this.reducedMotion,

            duration:

                this.lastThemeChangeTime

        }

    );

}

/******************************************************************************
 APPLY WITH PERFORMANCE
******************************************************************************/

applyTheme(theme) {

    this.startMeasure();

    this.set(theme);

    this.stopMeasure();

    this.notifyAccessibility();

    this.trackTheme();

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        theme:

            this.currentTheme,

        accent:

            this.accentColor,

        fontScale:

            this.fontScale,

        highContrast:

            this.highContrast,

        reducedMotion:

            this.reducedMotion,

        duration:

            this.lastThemeChangeTime

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
 DOWNLOAD REPORT
******************************************************************************/

downloadReport() {

    Utils.download(

        "theme-report.json",

        this.exportJSON(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.apply(

        this.currentTheme,

        false

    );

}

/******************************************************************************
 RELOAD
******************************************************************************/

reload() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 RESET VARIABLES
******************************************************************************/

resetVariables() {

    const style = this.root.style;

    for (let i = style.length - 1; i >= 0; i--) {

        const property = style[i];

        if (

            property.startsWith("--")

        ) {

            style.removeProperty(

                property

            );

        }

    }

}

/******************************************************************************
 LIST VARIABLES
******************************************************************************/

variables() {

    const variables = {};

    const styles = getComputedStyle(
        this.root
    );

    for (let i = 0; i < styles.length; i++) {

        const property = styles[i];

        if (

            property.startsWith("--")

        ) {

            variables[property] =

                styles

                    .getPropertyValue(property)

                    .trim();

        }

    }

    return variables;

}

/******************************************************************************
 ENABLE
******************************************************************************/

enable() {

    this.enabled = true;

}

/******************************************************************************
 DISABLE
******************************************************************************/

disable() {

    this.enabled = false;

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    Logger.group(

        "Theme UI"

    );

    Logger.table({

        Initialized:

            this.initialized,

        Enabled:

            this.enabled,

        Theme:

            this.currentTheme,

        Accent:

            this.accentColor,

        FontScale:

            `${this.fontScale}%`,

        HighContrast:

            this.highContrast,

        ReducedMotion:

            this.reducedMotion,

        Duration:

            `${this.lastThemeChangeTime?.toFixed(2) ?? 0} ms`

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

        enabled:

            this.enabled,

        theme:

            this.currentTheme,

        accent:

            this.accentColor,

        fontScale:

            this.fontScale,

        highContrast:

            this.highContrast,

        reducedMotion:

            this.reducedMotion,

        variables:

            Object.keys(

                this.variables()

            ).length,

        duration:

            this.lastThemeChangeTime

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

    this.resetVariables();

    this.root.removeAttribute(

        "data-theme"

    );

    this.initialized = false;

    this.enabled = true;

    Logger.warn(

        "Theme UI destroyed."

    );

}
