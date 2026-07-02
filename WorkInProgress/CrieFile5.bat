@echo off
title Bellacosa Mainframe Library - Criador da Estrutura

echo ==============================================
echo  Criando estrutura do projeto...
echo ==============================================
echo.

REM ==========================================================
REM Criar diretórios
REM ==========================================================
mkdir bellacosa-mainframe-library 2>nul

mkdir bellacosa-mainframe-library\css 2>nul
mkdir bellacosa-mainframe-library\css\base 2>nul
mkdir bellacosa-mainframe-library\css\layout 2>nul
mkdir bellacosa-mainframe-library\css\components 2>nul
mkdir bellacosa-mainframe-library\css\pages 2>nul
mkdir bellacosa-mainframe-library\css\themes 2>nul
mkdir bellacosa-mainframe-library\css\utilities 2>nul

mkdir bellacosa-mainframe-library\js 2>nul
mkdir bellacosa-mainframe-library\js\core 2>nul
mkdir bellacosa-mainframe-library\js\services 2>nul
mkdir bellacosa-mainframe-library\js\ui 2>nul
mkdir bellacosa-mainframe-library\js\plugins 2>nul

mkdir bellacosa-mainframe-library\templates 2>nul
mkdir bellacosa-mainframe-library\data 2>nul
mkdir bellacosa-mainframe-library\build 2>nul
mkdir bellacosa-mainframe-library\assets 2>nul

REM ==========================================================
REM Arquivos da raiz
REM ==========================================================
for %%F in (
    index.html
    manifest.json
    robots.txt
    sitemap.xml
) do (
    if not exist "bellacosa-mainframe-library\%%F" (
        type nul > "bellacosa-mainframe-library\%%F"
        echo [CRIADO] %%F
    ) else (
        echo [EXISTE] %%F
    )
)

REM ==========================================================
REM JS - CORE
REM ==========================================================
for %%F in (
    app.js
    config.js
    event-bus.js
    logger.js
    cache.js
    dom.js
) do (
    if not exist "bellacosa-mainframe-library\js\core\%%F" (
        type nul > "bellacosa-mainframe-library\js\core\%%F"
        echo [CRIADO] js\core\%%F
    ) else (
        echo [EXISTE] js\core\%%F
    )
)

REM ==========================================================
REM JS - SERVICES
REM ==========================================================
for %%F in (
    api.js
    parser.js
    storage.js
    analytics.js
    search-engine.js
) do (
    if not exist "bellacosa-mainframe-library\js\services\%%F" (
        type nul > "bellacosa-mainframe-library\js\services\%%F"
        echo [CRIADO] js\services\%%F
    ) else (
        echo [EXISTE] js\services\%%F
    )
)

REM ==========================================================
REM JS - UI
REM ==========================================================
for %%F in (
    cards.js
    filters.js
    modal.js
    router.js
    theme.js
    accessibility.js
) do (
    if not exist "bellacosa-mainframe-library\js\ui\%%F" (
        type nul > "bellacosa-mainframe-library\js\ui\%%F"
        echo [CRIADO] js\ui\%%F
    ) else (
        echo [EXISTE] js\ui\%%F
    )
)

REM ==========================================================
REM JS - APP
REM ==========================================================
if not exist "bellacosa-mainframe-library\js\app.js" (
    type nul > "bellacosa-mainframe-library\js\app.js"
    echo [CRIADO] js\app.js
) else (
    echo [EXISTE] js\app.js
)

echo.
echo ==============================================
echo Estrutura criada com sucesso!
echo ==============================================
echo.
tree /F bellacosa-mainframe-library
echo.
pause