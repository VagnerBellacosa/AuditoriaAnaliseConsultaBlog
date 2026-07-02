# ☕ Bellacosa Mainframe Library

> Transformando um Blog Blogger em uma Biblioteca Técnica Moderna.

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-Ready-success)
![SEO](https://img.shields.io/badge/SEO-Optimized-brightgreen)

---

# 📖 Sobre

**Bellacosa Mainframe Library** é um framework front-end desenvolvido para transformar um blog do **Blogger** em uma biblioteca técnica moderna.

O projeto nasceu para suportar o blog:

> https://eljefemidnightlunch.blogspot.com

permitindo consumir o feed JSON do Blogger e apresentar os artigos em uma interface rápida, organizada, pesquisável e preparada para milhares de publicações.

O objetivo não é substituir o Blogger como CMS.

O objetivo é utilizar o Blogger como fonte de conteúdo enquanto a aplicação fornece uma experiência semelhante a sites modernos desenvolvidos em React, Vue ou Angular, porém utilizando apenas HTML, CSS e JavaScript puro.

---

# 🎯 Objetivos

- Biblioteca técnica
- Alta performance
- SEO avançado
- Progressive Web App (PWA)
- Pesquisa instantânea
- Filtros inteligentes
- Arquitetura modular
- Offline First
- Builder para geração estática
- Compatível com GitHub Pages
- Compatível com Cloudflare Pages
- Compatível com Netlify

---

# ✨ Recursos

## Interface

- Dashboard
- Cards responsivos
- Modal para leitura
- Pesquisa Full Text
- Autocomplete
- Favoritos
- Timeline
- Filtros
- Breadcrumb
- Dark Mode
- Light Mode
- OLED Mode

---

## Pesquisa

- Busca instantânea
- Busca Full Text
- Ranking por relevância
- Fuzzy Search
- Histórico
- Highlight
- Cache
- Sugestões

---

## SEO

- Meta Tags
- Open Graph
- Twitter Cards
- JSON-LD
- Sitemap
- Robots
- RSS
- llms.txt
- Search Index

---

## Performance

- Lazy Loading
- Cache
- Prefetch
- Virtual Rendering
- Minificação
- Compressão
- Service Worker

---

## Analytics

- Analytics Local
- Heatmap
- Favoritos
- Pesquisas
- Downloads
- Compartilhamentos
- Dashboard
- Google Analytics (Opcional)
- Plausible
- Umami

---

# 🏗 Arquitetura

```
                 App

                  │

      ┌───────────┴────────────┐

      │                        │

   Event Bus               Config

      │                        │

      │                    Constants

      │                        │

      ▼

+-------------------------------+

|             API               |

+-------------------------------+

              │

      +-------+--------+

      |                |

   Search          Filters

      │                │

      +-------+--------+

              │

            Cards

              │

            Modal

              │

         Analytics

              │

           Storage

              │

            Cache

```

---

# 📂 Estrutura

```
bellacosa-mainframe-library/

│

├── index.html

├── manifest.json

├── robots.txt

├── sitemap.xml

│

├── css/

│   ├── style.css

│   ├── layout.css

│   ├── cards.css

│   ├── modal.css

│   ├── filters.css

│   ├── responsive.css

│   └── dark.css

│

├── js/

│   ├── core/

│   │     config.js

│   │     constants.js

│   │     event-bus.js

│   │     logger.js

│   │     cache.js

│   │

│   ├── api.js

│   ├── app.js

│   ├── analytics.js

│   ├── cards.js

│   ├── filters.js

│   ├── modal.js

│   ├── router.js

│   ├── search.js

│   ├── storage.js

│   └── utils.js

│

├── build/

├── templates/

├── assets/

├── data/

└── docs/

```

---

# 🔍 Funcionalidades

✔ Pesquisa Instantânea

✔ Pesquisa Full Text

✔ Filtros

✔ Timeline

✔ Categorias

✔ Meses

✔ Anos

✔ Favoritos

✔ Compartilhamento

✔ Dashboard

✔ Analytics

✔ Cache

✔ Offline

✔ PWA

✔ SEO

✔ Builder

---

# 🚀 Tecnologias

- HTML5
- CSS3
- JavaScript ES2023
- Blogger JSON Feed
- LocalStorage
- Service Worker
- Web Components
- Progressive Web App

Sem frameworks.

Sem dependências.

Sem build obrigatório.

---

# 🎓 Público-alvo

Este projeto foi desenvolvido principalmente para bibliotecas técnicas como:

- IBM Mainframe
- COBOL
- Java
- CICS
- DB2
- IMS
- z/OS
- DevOps
- Cloud
- Inteligência Artificial

Entretanto, pode ser utilizado para qualquer blog hospedado no Blogger.

---

# 🛣 Roadmap

## Versão 1

- Biblioteca
- Pesquisa
- Filtros
- Modal
- Analytics
- SEO

## Versão 2

- Builder

- Templates

- RSS

- Sitemap

- PWA

- Dashboard

## Versão 3

- IA

- Embeddings

- Busca Semântica

- Roadmaps

- Recomendações

---

# 🤝 Contribuindo

Pull Requests são bem-vindos.

Caso encontre algum problema, abra uma Issue.

---

# 📄 Licença

MIT License

---

# 👨‍💻 Autor

**Vagner Bellacosa**

IBM Mainframe Specialist

IBM Champion

LinkedIn

https://www.linkedin.com/in/vagnerbellacosa/

GitHub

https://github.com/VagnerBellacosa

Blog

https://eljefemidnightlunch.blogspot.com

---

# ⭐ Visão do Projeto

A Bellacosa Mainframe Library não é apenas um tema para Blogger.

É uma plataforma para transformar um blog tradicional em uma biblioteca técnica moderna, rápida, pesquisável, instalável como aplicativo (PWA) e preparada para SEO, Inteligência Artificial e geração de sites estáticos.

A proposta é manter o Blogger como CMS e utilizar tecnologias modernas no front-end para oferecer uma experiência de navegação equivalente às principais plataformas de documentação técnica do mercado.
