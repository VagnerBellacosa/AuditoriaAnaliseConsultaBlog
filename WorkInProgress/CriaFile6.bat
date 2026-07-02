@echo off
title Criador da Estrutura JavaScript

echo ============================================
echo Criando estrutura JavaScript...
echo ============================================
echo.

REM =====================================================
REM Criar diretórios
REM =====================================================
mkdir js 2>nul
mkdir js\core 2>nul
mkdir js\services 2>nul
mkdir js\ui 2>nul
mkdir js\components 2>nul

REM =====================================================
REM CORE
REM =====================================================
for %%F in (
    app.js
    config.js
    constants.js
    logger.js
    dom.js
    cache.js
    event-bus.js
) do (
    if not exist "js\core\%%F" (
        type nul > "js\core\%%F"
        echo [CRIADO] js\core\%%F
    ) else (
        echo [EXISTE] js\core\%%F
    )
)

REM =====================================================
REM SERVICES
REM =====================================================
for %%F in (
    favorites.js
    storage.js
    analytics.js
    api.js
    parser.js
    search-engine.js
) do (
    if not exist "js\services\%%F" (
        type nul > "js\services\%%F"
        echo [CRIADO] js\services\%%F
    ) else (
        echo [EXISTE] js\services\%%F
    )
)

REM =====================================================
REM UI
REM =====================================================
for %%F in (
    cards.js
    modal.js
    filters.js
    router.js
    theme.js
    accessibility.js
) do (
    if not exist "js\ui\%%F" (
        type nul > "js\ui\%%F"
        echo [CRIADO] js\ui\%%F
    ) else (
        echo [EXISTE] js\ui\%%F
    )
)

REM =====================================================
REM COMPONENTS
REM =====================================================
for %%F in (
    favorite-button.js
    favorites-panel.js
    favorites-badge.js
) do (
    if not exist "js\components\%%F" (
        type nul > "js\components\%%F"
        echo [CRIADO] js\components\%%F
    ) else (
        echo [EXISTE] js\components\%%F
    )
)

echo.
echo ============================================
echo Estrutura criada com sucesso!
echo ============================================
echo.

tree /F js

echo.
pause