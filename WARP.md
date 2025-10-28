# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

- Serve the app locally (ES modules require HTTP, not file://):
  - Python
    ```bash path=null start=null
    python3 -m http.server 5173
    ```
  - Node-based
    ```bash path=null start=null
    npx serve -l 5173 .
    ```
  - Then open one of:
    - http://localhost:5173/index.html
    - http://localhost:5173/search-results.html
    - http://localhost:5173/product-screen.html?id=<PRODUCT_ID>
    - http://localhost:5173/cart.html
    - http://localhost:5173/shopping-results.html


- Lint, build, tests: Not configured in this repo (no package.json). Use a static server + browser for manual verification and the validation script above.

## High-level architecture

- Static multi‑page web app using vanilla JS ES modules and Bootstrap CSS. No bundler/build step.
- Centralized configuration in `js-files/config.js` exporting `API_BASE_URL`.
  - Run `node validate-config.js` to ensure modules import the URL from the config and no hardcoded API endpoints remain.
- API layer in `js-files/api_service.js` (ES module)
  - Exposes: `fetchCategories`, `fetchSearchResults`, `fetchSuggestions`, `fetchProductsByCategory`, `fetchProductById`
  - All functions compose requests off `API_BASE_URL`.
- Cart subsystem
  - Data access in `js-files/network.js` (`/cart` endpoints: fetch, add/update/remove).
  - UI/state in `js-files/cart.js` (shared cart sidebar + icon badge) and `js-files/cart-page.js` (cart page interactions).
  - Helpers in `js-files/utils.js` (debounce, `getOrCreateUserId`, price formatting, sidebar loader).
  - `js-files/cookie-id.js` creates a per‑session cookie; `localStorage` also stores a `user_id`.
  - `cart-sidebar.html` is dynamically injected on pages that load the cart module.
- Search and discovery
  - `js-files/suggestions.js` renders typeahead suggestions.
  - `js-files/search.js` handles search form submit/redirect.
  - `js-files/search-results.js` renders category or query results and links to product details.
  - `js-files/categories.js` renders category tiles on `index.html`.
- Product details
  - `js-files/product-screen.js` reads `id` from the query string, fetches product data, renders details and store list.
- Shopping results (cart optimization view)
  - `js-files/shopping-results.js` fetches ranked store options for the current cart and renders them.
- Theming
  - `js-files/theme.js` + `js-files/theme-toggle.js` manage light/dark theme via `#theme-style` swapping between `stylelight.css` and `styledark.css`, and `data-theme` on `<html>`.
- HTML entry points (no framework): `index.html`, `search-results.html`, `product-screen.html`, `cart.html`, `shopping-results.html` include the modules above with `<script type="module">`.

## Configuration notes

- To change the backend API origin, edit `js-files/config.js` and update `API_BASE_URL`.
- Keep API URLs centralized—do not inline URLs in modules. Use the validator to catch regressions.