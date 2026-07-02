@echo off
title Criador da Estrutura do Projeto

echo ==========================================
echo Criando estrutura do projeto...
echo ==========================================
echo.

REM ==========================================
REM Criar diretórios
REM ==========================================
mkdir css 2>nul
mkdir js 2>nul
mkdir assets 2>nul
mkdir icons 2>nul

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
    if not exist "%%F" (
        type nul > "%%F"
        echo [CRIADO] %%F
    ) else (
        echo [EXISTE] %%F
    )
)

REM ==========================================
REM Arquivos CSS
REM ==========================================
for %%F in (
    style.css
    cards.css
    filters.css
    modal.css
    responsive.css
) do (
    if not exist "css\%%F" (
        type nul > "css\%%F"
        echo [CRIADO] css\%%F
    ) else (
        echo [EXISTE] css\%%F
    )
)

REM ==========================================
REM Arquivos JavaScript
REM ==========================================
for %%F in (
    app.js
    api.js
    filters.js
    search.js
    modal.js
    router.js
    seo.js
    storage.js
    utils.js
) do (
    if not exist "js\%%F" (
        type nul > "js\%%F"
        echo [CRIADO] js\%%F
    ) else (
        echo [EXISTE] js\%%F
    )
)

echo.
echo ==========================================
echo Estrutura criada com sucesso!
echo ==========================================
echo.
echo .
echo ├── index.html
echo ├── manifest.json
echo ├── robots.txt
echo ├── sitemap.xml
echo ├── service-worker.js
echo ├── README.md
echo │
echo ├── css\
echo │   ├── style.css
echo │   ├── cards.css
echo │   ├── filters.css
echo │   ├── modal.css
echo │   └── responsive.css
echo │
echo ├── js\
echo │   ├── app.js
echo │   ├── api.js
echo │   ├── filters.js
echo │   ├── search.js
echo │   ├── modal.js
echo │   ├── router.js
echo │   ├── seo.js
echo │   ├── storage.js
echo │   └── utils.js
echo │
echo ├── assets\
echo │
echo └── icons\
echo.
pause