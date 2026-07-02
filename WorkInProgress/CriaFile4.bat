@echo off
title Criador da Estrutura CSS

echo ==========================================
echo Criando estrutura CSS...
echo ==========================================
echo.

REM ==========================================
REM Criar diretórios
REM ==========================================
mkdir css 2>nul
mkdir css\base 2>nul
mkdir css\layout 2>nul
mkdir css\components 2>nul
mkdir css\themes 2>nul

REM ==========================================
REM BASE
REM ==========================================
for %%F in (
    reset.css
    variables.css
    typography.css
    utilities.css
) do (
    if not exist "css\base\%%F" (
        type nul > "css\base\%%F"
        echo [CRIADO] css\base\%%F
    ) else (
        echo [EXISTE] css\base\%%F
    )
)

REM ==========================================
REM LAYOUT
REM ==========================================
for %%F in (
    header.css
    hero.css
    footer.css
    sidebar.css
) do (
    if not exist "css\layout\%%F" (
        type nul > "css\layout\%%F"
        echo [CRIADO] css\layout\%%F
    ) else (
        echo [EXISTE] css\layout\%%F
    )
)

REM ==========================================
REM COMPONENTS
REM ==========================================
for %%F in (
    cards.css
    modal.css
    filters.css
    buttons.css
    forms.css
    badges.css
) do (
    if not exist "css\components\%%F" (
        type nul > "css\components\%%F"
        echo [CRIADO] css\components\%%F
    ) else (
        echo [EXISTE] css\components\%%F
    )
)

REM ==========================================
REM THEMES
REM ==========================================
for %%F in (
    dark.css
    light.css
) do (
    if not exist "css\themes\%%F" (
        type nul > "css\themes\%%F"
        echo [CRIADO] css\themes\%%F
    ) else (
        echo [EXISTE] css\themes\%%F
    )
)

REM ==========================================
REM ARQUIVO DA RAIZ
REM ==========================================
if not exist "css\responsive.css" (
    type nul > "css\responsive.css"
    echo [CRIADO] css\responsive.css
) else (
    echo [EXISTE] css\responsive.css
)

echo.
echo ==========================================
echo Estrutura CSS criada com sucesso!
echo ==========================================
echo.
echo css\
echo ├── base\
echo │   ├── reset.css
echo │   ├── variables.css
echo │   ├── typography.css
echo │   └── utilities.css
echo │
echo ├── layout\
echo │   ├── header.css
echo │   ├── hero.css
echo │   ├── footer.css
echo │   └── sidebar.css
echo │
echo ├── components\
echo │   ├── cards.css
echo │   ├── modal.css
echo │   ├── filters.css
echo │   ├── buttons.css
echo │   ├── forms.css
echo │   └── badges.css
echo │
echo ├── themes\
echo │   ├── dark.css
echo │   └── light.css
echo │
echo └── responsive.css
echo.
pause