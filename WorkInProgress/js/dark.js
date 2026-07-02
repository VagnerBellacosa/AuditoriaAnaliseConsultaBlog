/* ==========================================================================
   Bellacosa Mainframe Library
   dark.css
   Sistema de Temas
   ========================================================================== */

/* ==========================================================================
   TEMA ESCURO (PADRÃO)
   ========================================================================== */

:root{

    /* ===========================
       BRAND
    =========================== */

    --color-primary:#00AEEF;
    --color-primary-dark:#0090C5;
    --color-secondary:#00C896;

    /* ===========================
       BACKGROUND
    =========================== */

    --color-background:#0D1117;
    --color-background-alt:#111827;

    --color-surface:#161B22;
    --color-surface-light:#1F2937;

    /* ===========================
       TEXTO
    =========================== */

    --color-text:#F8FAFC;
    --color-text-light:#CBD5E1;
    --color-muted:#94A3B8;

    /* ===========================
       BORDAS
    =========================== */

    --color-border:#30363D;

    /* ===========================
       STATUS
    =========================== */

    --color-success:#10B981;
    --color-warning:#F59E0B;
    --color-danger:#EF4444;
    --color-info:#3B82F6;

    /* ===========================
       SHADOWS
    =========================== */

    --shadow-sm:
        0 2px 8px rgba(0,0,0,.25);

    --shadow-md:
        0 10px 30px rgba(0,0,0,.35);

    --shadow-lg:
        0 20px 60px rgba(0,0,0,.45);

}

/* ==========================================================================
   TEMA CLARO
   ========================================================================== */

body.light-theme{

    --color-background:#F4F7FB;
    --color-background-alt:#FFFFFF;

    --color-surface:#FFFFFF;
    --color-surface-light:#EEF3F8;

    --color-text:#111827;
    --color-text-light:#374151;
    --color-muted:#64748B;

    --color-border:#D7DEE8;

    --shadow-sm:
        0 2px 8px rgba(0,0,0,.06);

    --shadow-md:
        0 10px 25px rgba(0,0,0,.08);

    --shadow-lg:
        0 25px 50px rgba(0,0,0,.12);

}

/* ==========================================================================
   BODY
   ========================================================================== */

body{

    background:var(--color-background);

    color:var(--color-text);

    transition:

        background .35s ease,

        color .35s ease;

}

/* ==========================================================================
   HEADER
   ========================================================================== */

header{

    background:rgba(13,17,23,.90);

    transition:background .35s;

}

body.light-theme header{

    background:rgba(255,255,255,.92);

}

/* ==========================================================================
   HERO
   ========================================================================== */

body.light-theme .hero{

    background:

        linear-gradient(

            135deg,

            rgba(0,174,239,.08),

            rgba(255,255,255,0)

        );

}

/* ==========================================================================
   CARDS
   ========================================================================== */

body.light-theme .post-card,

body.light-theme .dashboard-card,

body.light-theme .sidebar-block,

body.light-theme .category-box,

body.light-theme .hero-card,

body.light-theme footer{

    background:var(--color-surface);

    border-color:var(--color-border);

}

/* ==========================================================================
   INPUTS
   ========================================================================== */

body.light-theme input,

body.light-theme select,

body.light-theme textarea{

    background:white;

    color:var(--color-text);

    border-color:var(--color-border);

}

/* ==========================================================================
   MODAL
   ========================================================================== */

body.light-theme .modal{

    background:rgba(255,255,255,.75);

}

body.light-theme .modal-content{

    background:white;

}

/* ==========================================================================
   BUTTONS
   ========================================================================== */

body.light-theme .btn-secondary{

    background:#F8FAFC;

    color:#111827;

}

body.light-theme .icon-button{

    background:#F3F6FA;

}

/* ==========================================================================
   TAGS
   ========================================================================== */

body.light-theme .post-tag{

    background:rgba(0,174,239,.12);

}

/* ==========================================================================
   FAVORITE
   ========================================================================== */

.favorite{

    transition:

        transform .25s,

        background .25s;

}

.favorite:hover{

    transform:scale(1.15);

}

/* ==========================================================================
   SCROLLBAR
   ========================================================================== */

body.light-theme::-webkit-scrollbar-track{

    background:#E8EDF3;

}

body.light-theme::-webkit-scrollbar-thumb{

    background:#8FA7C2;

}

/* ==========================================================================
   SELECTION
   ========================================================================== */

::selection{

    background:var(--color-primary);

    color:white;

}

/* ==========================================================================
   CÓDIGO
   ========================================================================== */

pre{

    background:#0F172A;

    color:#F8FAFC;

    border-radius:12px;

    overflow:auto;

    padding:20px;

}

body.light-theme pre{

    background:#F3F6FA;

    color:#111827;

}

code{

    font-family:

        Consolas,

        "Cascadia Code",

        monospace;

}

/* ==========================================================================
   TABELAS
   ========================================================================== */

table{

    width:100%;

    border-collapse:collapse;

}

th{

    background:var(--color-primary);

    color:white;

}

td,

th{

    padding:14px;

    border:1px solid var(--color-border);

}

body.light-theme td{

    background:white;

}

/* ==========================================================================
   BLOCO DE CITAÇÃO
   ========================================================================== */

blockquote{

    border-left:5px solid var(--color-primary);

    padding:18px;

    margin:25px 0;

    background:rgba(0,174,239,.08);

}

body.light-theme blockquote{

    background:#EEF8FD;

}

/* ==========================================================================
   LINKS
   ========================================================================== */

a{

    transition:.25s;

}

a:hover{

    color:var(--color-primary);

}

/* ==========================================================================
   TRANSIÇÃO GLOBAL
   ========================================================================== */

body,

header,

footer,

.post-card,

.dashboard-card,

.hero-card,

.sidebar-block,

.category-box,

input,

select,

textarea,

button{

    transition:

        background .30s,

        color .30s,

        border-color .30s,

        box-shadow .30s;

}

/* ==========================================================================
   TEMA AUTOMÁTICO DO SISTEMA
   ========================================================================== */

@media (prefers-color-scheme: dark){

    body.auto-theme{

        background:#0D1117;

    }

}

@media (prefers-color-scheme: light){

    body.auto-theme{

        background:#F4F7FB;

    }

}

/* ==========================================================================
   BOTÃO DE TROCA DE TEMA
   ========================================================================== */

.theme-toggle{

    position:relative;

}

.theme-toggle::after{

    content:"";

    position:absolute;

    inset:0;

    border-radius:50%;

    border:2px solid transparent;

    transition:.30s;

}

.theme-toggle:hover::after{

    border-color:var(--color-primary);

}

/* ==========================================================================
   ANIMAÇÃO DA TROCA
   ========================================================================== */

.theme-fade{

    animation:themeFade .35s ease;

}

@keyframes themeFade{

    from{

        opacity:.75;

    }

    to{

        opacity:1;

    }

}