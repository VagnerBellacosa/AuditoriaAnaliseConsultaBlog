/******************************************************************************
 Bellacosa Mainframe Library
 Accessibility UI
 Version 2.0
******************************************************************************/

"use strict";

class Accessibility {

    constructor() {

        this.started = false;

        this.focusStack = [];

        this.liveRegion = null;

        this.focusTrap = null;

        this.keyboardEnabled = true;

    }

    /**************************************************************************
     INITIALIZE
    **************************************************************************/

    async initialize() {

        if (this.started)
            return;

        Logger.info(

            "Initializing Accessibility..."

        );

        this.createLiveRegion();

        this.createSkipLink();

        this.bindKeyboard();

        this.started = true;

    }

    /**************************************************************************
     LIVE REGION
    **************************************************************************/

    createLiveRegion() {

        this.liveRegion = DOM.create("div", {

            id: "aria-live",

            attributes: {

                "aria-live": "polite",

                "aria-atomic": "true",

                "class": "sr-only"

            }

        });

        document.body.appendChild(

            this.liveRegion

        );

    }

    /**************************************************************************
     ANNOUNCE
    **************************************************************************/

    announce(message) {

        if (!this.liveRegion)
            return;

        this.liveRegion.textContent = "";

        setTimeout(() => {

            this.liveRegion.textContent = message;

        }, 50);

    }

    /**************************************************************************
     SKIP LINK
    **************************************************************************/

    createSkipLink() {

        if (DOM.$("#skip-link"))
            return;

        const link = DOM.create("a", {

            id: "skip-link",

            text: "Pular para o conteúdo",

            attributes: {

                href: "#main"

            }

        });

        document.body.prepend(link);

    }

    /**************************************************************************
     FOCUS
    **************************************************************************/

    focus(element) {

        if (!element)
            return;

        this.focusStack.push(

            document.activeElement

        );

        element.focus();

    }

    /**************************************************************************
     RESTORE FOCUS
    **************************************************************************/

    restoreFocus() {

        const previous =

            this.focusStack.pop();

        previous?.focus();

    }

    /**************************************************************************
     FOCUS TRAP
    **************************************************************************/

    enableFocusTrap(container) {

        if (!container)
            return;

        this.focusTrap = container;

        container.addEventListener(

            "keydown",

            event => {

                if (

                    event.key !== "Tab"

                )

                    return;

                const items =

                    container.querySelectorAll(

                        'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'

                    );

                if (!items.length)
                    return;

                const first = items[0];

                const last =

                    items[items.length - 1];

                if (

                    event.shiftKey &&

                    document.activeElement === first

                ) {

                    event.preventDefault();

                    last.focus();

                }

                else if (

                    !event.shiftKey &&

                    document.activeElement === last

                ) {

                    event.preventDefault();

                    first.focus();

                }

            }

        );

    }

    /**************************************************************************
     DISABLE TRAP
    **************************************************************************/

    disableFocusTrap() {

        this.focusTrap = null;

    }

    /**************************************************************************
     ARIA
    **************************************************************************/

    aria(element, attribute, value) {

        if (!element)
            return;

        if (value === undefined)

            return element.getAttribute(attribute);

        element.setAttribute(

            attribute,

            value

        );

    }

    /**************************************************************************
     ROLE
    **************************************************************************/

    role(element, role) {

        this.aria(

            element,

            "role",

            role

        );

    }

    /**************************************************************************
     LABEL
    **************************************************************************/

    label(element, text) {

        this.aria(

            element,

            "aria-label",

            text

        );

    }

    /**************************************************************************
     HIDDEN
    **************************************************************************/

    hidden(element, hidden = true) {

        this.aria(

            element,

            "aria-hidden",

            hidden

        );

    }

    /**************************************************************************
     EXPANDED
    **************************************************************************/

    expanded(element, expanded) {

        this.aria(

            element,

            "aria-expanded",

            expanded

        );

    }

    /**************************************************************************
     KEYBOARD
    **************************************************************************/

    bindKeyboard() {

        document.addEventListener(

            "keydown",

            event => {

                if (!this.keyboardEnabled)
                    return;

                EventBus.emit(

                    Constants.EVENTS.KEYBOARD,

                    event

                );

                switch (event.key) {

                    case "Escape":

                        this.announce(

                            "Operação cancelada"

                        );

                        break;

                    case "Tab":

                        this.announce(

                            "Navegação por teclado"

                        );

                        break;

                }

            }

        );

    }

    /**************************************************************************
     TABINDEX
    **************************************************************************/

    makeFocusable(element) {

        if (!element)
            return;

        if (

            !element.hasAttribute(

                "tabindex"

            )

        ) {

            element.setAttribute(

                "tabindex",

                "0"

            );

        }

    }

    /**************************************************************************
     DISABLE KEYBOARD
    **************************************************************************/

    disableKeyboard() {

        this.keyboardEnabled = false;

    }

    /**************************************************************************
     ENABLE KEYBOARD
    **************************************************************************/

    enableKeyboard() {

        this.keyboardEnabled = true;

    }

    /**************************************************************************
     DIAGNOSTICS
    **************************************************************************/

    diagnostics() {

        return {

            started:

                this.started,

            keyboard:

                this.keyboardEnabled,

            liveRegion:

                !!this.liveRegion,

            focusStack:

                this.focusStack.length

        };

    }

    /**************************************************************************
     HEALTH CHECK
    **************************************************************************/

    healthCheck() {

        Logger.group(

            "Accessibility"

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

        this.focusStack = [];

        this.focusTrap = null;

        this.started = false;

        Logger.warn(

            "Accessibility destroyed."

        );

    }

}

/******************************************************************************
 EXPORT
******************************************************************************/

window.Accessibility = new Accessibility();

/******************************************************************************
 LOAD PREFERENCES
******************************************************************************/

loadPreferences() {

    const storage = App.module("storage");

    if (!storage)
        return;

    const preferences = storage.load(

        Constants.STORAGE_KEYS.ACCESSIBILITY,

        {}

    );

    if (preferences.fontSize)

        this.setFontSize(

            preferences.fontSize,

            false

        );

    if (preferences.zoom)

        this.setZoom(

            preferences.zoom,

            false

        );

    if (preferences.highContrast)

        this.highContrast(

            preferences.highContrast,

            false

        );

    if (preferences.reducedMotion)

        this.reduceMotion(

            preferences.reducedMotion,

            false

        );

}

/******************************************************************************
 SAVE PREFERENCES
******************************************************************************/

savePreferences() {

    const storage = App.module("storage");

    if (!storage)
        return;

    storage.save(

        Constants.STORAGE_KEYS.ACCESSIBILITY,

        {

            fontSize:

                this.fontSize,

            zoom:

                this.zoom,

            highContrast:

                this.isHighContrast,

            reducedMotion:

                this.isReducedMotion

        }

    );

}

/******************************************************************************
 FONT SIZE
******************************************************************************/

setFontSize(size = 100, save = true) {

    this.fontSize = size;

    document.documentElement.style.fontSize =

        `${size}%`;

    this.announce(

        `Fonte ${size}%`

    );

    if (save)

        this.savePreferences();

}

/******************************************************************************
 INCREASE FONT
******************************************************************************/

increaseFont() {

    this.setFontSize(

        Math.min(

            (this.fontSize || 100) + 10,

            200

        )

    );

}

/******************************************************************************
 DECREASE FONT
******************************************************************************/

decreaseFont() {

    this.setFontSize(

        Math.max(

            (this.fontSize || 100) - 10,

            70

        )

    );

}

/******************************************************************************
 RESET FONT
******************************************************************************/

resetFont() {

    this.setFontSize(100);

}

/******************************************************************************
 ZOOM
******************************************************************************/

setZoom(value = 1, save = true) {

    this.zoom = value;

    document.body.style.zoom = value;

    if (save)

        this.savePreferences();

}

/******************************************************************************
 HIGH CONTRAST
******************************************************************************/

highContrast(enabled = true, save = true) {

    this.isHighContrast = enabled;

    document.body.classList.toggle(

        "high-contrast",

        enabled

    );

    this.announce(

        enabled

            ? "Alto contraste ativado"

            : "Alto contraste desativado"

    );

    if (save)

        this.savePreferences();

}

/******************************************************************************
 TOGGLE CONTRAST
******************************************************************************/

toggleContrast() {

    this.highContrast(

        !this.isHighContrast

    );

}

/******************************************************************************
 REDUCE MOTION
******************************************************************************/

reduceMotion(enabled = true, save = true) {

    this.isReducedMotion = enabled;

    document.body.classList.toggle(

        "reduce-motion",

        enabled

    );

    if (save)

        this.savePreferences();

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

        this.reduceMotion(

            true,

            false

        );

    }

    if (

        window.matchMedia(

            "(prefers-contrast: more)"

        ).matches

    ) {

        this.highContrast(

            true,

            false

        );

    }

}

/******************************************************************************
 COLOR SCHEME
******************************************************************************/

detectColorScheme() {

    const dark = window.matchMedia(

        "(prefers-color-scheme: dark)"

    );

    if (

        dark.matches

    ) {

        document.body.classList.add(

            "dark"

        );

    }

}

/******************************************************************************
 SCREEN READER
******************************************************************************/

screenReaderMode(enabled = true) {

    document.body.classList.toggle(

        "screen-reader",

        enabled

    );

    this.announce(

        enabled

            ? "Modo leitor ativado"

            : "Modo leitor desativado"

    );

}

/******************************************************************************
 DESCRIBE
******************************************************************************/

describe(element, text) {

    if (!element)
        return;

    element.setAttribute(

        "aria-description",

        text

    );

}

/******************************************************************************
 INVALID
******************************************************************************/

invalid(element, invalid = true) {

    this.aria(

        element,

        "aria-invalid",

        invalid

    );

}

/******************************************************************************
 REQUIRED
******************************************************************************/

required(element, required = true) {

    this.aria(

        element,

        "aria-required",

        required

    );

}

/******************************************************************************
 BUSY
******************************************************************************/

busy(element, busy = true) {

    this.aria(

        element,

        "aria-busy",

        busy

    );

}

/******************************************************************************
 CURRENT
******************************************************************************/

current(element, value = "page") {

    this.aria(

        element,

        "aria-current",

        value

    );

}

/******************************************************************************
 AUDIT
******************************************************************************/

audit() {

    return {

        images: this.auditImages(),

        buttons: this.auditButtons(),

        links: this.auditLinks(),

        forms: this.auditForms(),

        headings: this.auditHeadings(),

        landmarks: this.auditLandmarks()

    };

}

/******************************************************************************
 IMAGES
******************************************************************************/

auditImages() {

    const images = [...document.images];

    return {

        total: images.length,

        missingAlt: images.filter(

            image =>

                !image.hasAttribute("alt")

        ).length

    };

}

/******************************************************************************
 BUTTONS
******************************************************************************/

auditButtons() {

    const buttons = [

        ...document.querySelectorAll(

            "button"

        )

    ];

    return {

        total: buttons.length,

        missingLabel:

            buttons.filter(button =>

                !button.textContent.trim() &&

                !button.hasAttribute("aria-label")

            ).length

    };

}

/******************************************************************************
 LINKS
******************************************************************************/

auditLinks() {

    const links = [

        ...document.querySelectorAll("a")

    ];

    return {

        total: links.length,

        empty:

            links.filter(link =>

                !link.textContent.trim()

            ).length

    };

}

/******************************************************************************
 FORMS
******************************************************************************/

auditForms() {

    const controls = [

        ...document.querySelectorAll(

            "input,select,textarea"

        )

    ];

    return {

        total: controls.length,

        missingLabel:

            controls.filter(control =>

                !control.labels?.length &&

                !control.hasAttribute(

                    "aria-label"

                )

            ).length

    };

}

/******************************************************************************
 HEADINGS
******************************************************************************/

auditHeadings() {

    const headings = [

        ...document.querySelectorAll(

            "h1,h2,h3,h4,h5,h6"

        )

    ];

    return {

        total: headings.length,

        h1:

            document.querySelectorAll("h1")

                .length

    };

}

/******************************************************************************
 LANDMARKS
******************************************************************************/

auditLandmarks() {

    const landmarks = [

        "main",

        "header",

        "footer",

        "nav",

        "aside"

    ];

    const missing = landmarks.filter(

        tag =>

            !document.querySelector(tag)

    );

    return {

        missing

    };

}

/******************************************************************************
 TABINDEX
******************************************************************************/

auditFocusable() {

    return [

        ...document.querySelectorAll(

            "[tabindex]"

        )

    ].length;

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        diagnostics:

            this.diagnostics(),

        audit:

            this.audit()

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

        "accessibility-report.json",

        this.exportReport(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    const report = this.audit();

    Logger.group(

        "Accessibility"

    );

    Logger.table({

        Started:

            this.started,

        Keyboard:

            this.keyboardEnabled,

        LiveRegion:

            !!this.liveRegion,

        FocusStack:

            this.focusStack.length,

        ImagesWithoutAlt:

            report.images.missingAlt,

        ButtonsWithoutLabel:

            report.buttons.missingLabel,

        InputsWithoutLabel:

            report.forms.missingLabel,

        EmptyLinks:

            report.links.empty

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

        started:

            this.started,

        keyboard:

            this.keyboardEnabled,

        focusTrap:

            !!this.focusTrap,

        focusStack:

            this.focusStack.length,

        highContrast:

            this.isHighContrast,

        reducedMotion:

            this.isReducedMotion,

        zoom:

            this.zoom,

        fontSize:

            this.fontSize

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

    this.focusStack = [];

    this.focusTrap = null;

    this.liveRegion?.remove();

    this.liveRegion = null;

    this.started = false;

    Logger.warn(

        "Accessibility destroyed."

    );

}

/******************************************************************************
 AUDIT
******************************************************************************/

audit() {

    return {

        images: this.auditImages(),

        buttons: this.auditButtons(),

        links: this.auditLinks(),

        forms: this.auditForms(),

        headings: this.auditHeadings(),

        landmarks: this.auditLandmarks()

    };

}

/******************************************************************************
 IMAGES
******************************************************************************/

auditImages() {

    const images = [...document.images];

    return {

        total: images.length,

        missingAlt: images.filter(

            image =>

                !image.hasAttribute("alt")

        ).length

    };

}

/******************************************************************************
 BUTTONS
******************************************************************************/

auditButtons() {

    const buttons = [

        ...document.querySelectorAll(

            "button"

        )

    ];

    return {

        total: buttons.length,

        missingLabel:

            buttons.filter(button =>

                !button.textContent.trim() &&

                !button.hasAttribute("aria-label")

            ).length

    };

}

/******************************************************************************
 LINKS
******************************************************************************/

auditLinks() {

    const links = [

        ...document.querySelectorAll("a")

    ];

    return {

        total: links.length,

        empty:

            links.filter(link =>

                !link.textContent.trim()

            ).length

    };

}

/******************************************************************************
 FORMS
******************************************************************************/

auditForms() {

    const controls = [

        ...document.querySelectorAll(

            "input,select,textarea"

        )

    ];

    return {

        total: controls.length,

        missingLabel:

            controls.filter(control =>

                !control.labels?.length &&

                !control.hasAttribute(

                    "aria-label"

                )

            ).length

    };

}

/******************************************************************************
 HEADINGS
******************************************************************************/

auditHeadings() {

    const headings = [

        ...document.querySelectorAll(

            "h1,h2,h3,h4,h5,h6"

        )

    ];

    return {

        total: headings.length,

        h1:

            document.querySelectorAll("h1")

                .length

    };

}

/******************************************************************************
 LANDMARKS
******************************************************************************/

auditLandmarks() {

    const landmarks = [

        "main",

        "header",

        "footer",

        "nav",

        "aside"

    ];

    const missing = landmarks.filter(

        tag =>

            !document.querySelector(tag)

    );

    return {

        missing

    };

}

/******************************************************************************
 TABINDEX
******************************************************************************/

auditFocusable() {

    return [

        ...document.querySelectorAll(

            "[tabindex]"

        )

    ].length;

}

/******************************************************************************
 REPORT
******************************************************************************/

report() {

    return {

        generated:

            new Date()

                .toISOString(),

        diagnostics:

            this.diagnostics(),

        audit:

            this.audit()

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

        "accessibility-report.json",

        this.exportReport(),

        "application/json"

    );

}

/******************************************************************************
 REFRESH
******************************************************************************/

refresh() {

    this.destroy();

    this.initialize();

}

/******************************************************************************
 HEALTH CHECK
******************************************************************************/

healthCheck() {

    const report = this.audit();

    Logger.group(

        "Accessibility"

    );

    Logger.table({

        Started:

            this.started,

        Keyboard:

            this.keyboardEnabled,

        LiveRegion:

            !!this.liveRegion,

        FocusStack:

            this.focusStack.length,

        ImagesWithoutAlt:

            report.images.missingAlt,

        ButtonsWithoutLabel:

            report.buttons.missingLabel,

        InputsWithoutLabel:

            report.forms.missingLabel,

        EmptyLinks:

            report.links.empty

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

        started:

            this.started,

        keyboard:

            this.keyboardEnabled,

        focusTrap:

            !!this.focusTrap,

        focusStack:

            this.focusStack.length,

        highContrast:

            this.isHighContrast,

        reducedMotion:

            this.isReducedMotion,

        zoom:

            this.zoom,

        fontSize:

            this.fontSize

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

    this.focusStack = [];

    this.focusTrap = null;

    this.liveRegion?.remove();

    this.liveRegion = null;

    this.started = false;

    Logger.warn(

        "Accessibility destroyed."

    );

}