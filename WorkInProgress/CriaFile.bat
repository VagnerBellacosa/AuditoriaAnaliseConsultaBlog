@echo off
title Criador da Estrutura do Projeto

REM =====================================
REM Criar diretórios
REM =====================================
mkdir css 2>nul
mkdir js 2>nul
mkdir icons 2>nul
mkdir assets 2>nul
mkdir tools 2>nul
mkdir backup 2>nul

echo.
echo Criando arquivos...
echo.

REM =====================================
REM Arquivos da raiz
REM =====================================
for %%F in (
    index.html
    manifest.json
    service-worker.js
) do (
    if not exist "%%F" (
        type nul > "%%F"
        echo [CRIADO] %%F
    ) else (
        echo [EXISTE] %%F
    )
)

REM =====================================
REM CSS
REM =====================================
for %%F in (
    style.css
    cards.css
    modal.css
    dark.css
) do (
    if not exist "css\%%F" (
        type nul > "css\%%F"
        echo [CRIADO] css\%%F
    ) else (
        echo [EXISTE] css\%%F
    )
)

REM =====================================
REM JavaScript
REM =====================================
for %%F in (
    app.js
    api.js
    filters.js
    ui.js
    modal.js
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
echo ├── service-worker.js
echo │
echo ├── css\
echo │   ├── style.css
echo │   ├── cards.css
echo │   ├── modal.css
echo │   └── dark.css
echo │
echo ├── js\
echo │   ├── app.js
echo │   ├── api.js
echo │   ├── filters.js
echo │   ├── ui.js
echo │   ├── modal.js
echo │   └── utils.js
echo │
echo ├── icons\
echo │
echo ├── tools\
echo │
echo └── assets\
echo.
pause