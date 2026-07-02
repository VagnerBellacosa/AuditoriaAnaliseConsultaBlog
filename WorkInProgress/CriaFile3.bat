@echo off
title Criador da Estrutura BellacosaLibrary

echo ==========================================
echo Criando estrutura do projeto BellacosaLibrary
echo ==========================================
echo.

REM ==========================================
REM Criar diretórios
REM ==========================================
mkdir BellacosaLibrary 2>nul
mkdir BellacosaLibrary\css 2>nul
mkdir BellacosaLibrary\js 2>nul
mkdir BellacosaLibrary\icons 2>nul
mkdir BellacosaLibrary\assets 2>nul

REM ==========================================
REM Arquivos da raiz
REM ==========================================
for %%F in (
    index.html
    manifest.json
    robots.txt
    sitemap.xml
    service-worker.js
    README.md
) do (
    if not exist "BellacosaLibrary\%%F" (
        type nul > "BellacosaLibrary\%%F"
        echo [CRIADO] BellacosaLibrary\%%F
    ) else (
        echo [EXISTE] BellacosaLibrary\%%F
    )
)

REM ==========================================
REM Arquivos CSS
REM ==========================================
for %%F in (
    style.css
    layout.css
    cards.css
    filters.css
    modal.css
    dark.css
    responsive.css
) do (
    if not exist "BellacosaLibrary\css\%%F" (
        type nul > "BellacosaLibrary\css\%%F"
        echo [CRIADO] BellacosaLibrary\css\%%F
    ) else (
        echo [EXISTE] BellacosaLibrary\css\%%F
    )
)

REM ==========================================
REM Arquivos JavaScript
REM ==========================================
for %%F in (
    app.js
    api.js
    router.js
    search.js
    filters.js
    cards.js
    modal.js
    favorites.js
    seo.js
    analytics.js
    storage.js
    utils.js
) do (
    if not exist "BellacosaLibrary\js\%%F" (
        type nul > "BellacosaLibrary\js\%%F"
        echo [CRIADO] BellacosaLibrary\js\%%F
    ) else (
        echo [EXISTE] BellacosaLibrary\js\%%F
    )
)

echo.
echo ==========================================
echo Estrutura criada com sucesso!
echo ==========================================
echo.
echo BellacosaLibrary
echo │
echo ├── index.html
echo ├── manifest.json
echo ├── robots.txt
echo ├── sitemap.xml
echo ├── service-worker.js
echo ├── README.md
echo │
echo ├── css
echo │      ├── style.css
echo │      ├── layout.css
echo │      ├── cards.css
echo │      ├── filters.css
echo │      ├── modal.css
echo │      ├── dark.css
echo │      └── responsive.css
echo │
echo ├── js
echo │      ├── app.js
echo │      ├── api.js
echo │      ├── router.js
echo │      ├── search.js
echo │      ├── filters.js
echo │      ├── cards.js
echo │      ├── modal.js
echo │      ├── favorites.js
echo │      ├── seo.js
echo │      ├── analytics.js
echo │      ├── storage.js
echo │      └── utils.js
echo │
echo ├── icons
echo │
echo ├── assets
echo │
echo └── README.md
echo.
pause