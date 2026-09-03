# D's Landscaping — Website

A single-page site for D's Landscaping, focused on landscape design & installation.
Static HTML/CSS/JS — no build step, no framework. Deploys as-is to Vercel, Netlify,
GitHub Pages, or any static host.

## Structure

- `index.html` — all page content/sections
- `assets/css/style.css` — dark/gold "bold & premium" theme
- `assets/js/main.js` — header scroll state, mobile nav, scroll-reveal animations,
  3D tilt on cards, and the Three.js hero scene (animated wireframe terrain,
  floating particles, rotating icosahedron cluster)

## Things to customize before launch

These are placeholders and need real values:

- **Phone / email** — `index.html`, Contact section (`tel:` and `mailto:` links)
  and the `#contact-form` submit handler in `assets/js/main.js`.
- **Service area** — Contact section ("Your City & Surrounding Areas").
- **Gallery photos** — the `.gallery-item` tiles are CSS-only placeholders.
  Swap them for real project photos (add an `<img>` inside each tile, or set
  it as a `background-image`).
- **Testimonials** — the three quotes are sample text, marked as such on the page.
- **Contact form delivery** — the form currently opens the visitor's email client
  via a `mailto:` link (works with zero backend, but requires them to hit "send"
  in their own mail app). For a submit-and-forget form, wire it to a service like
  Formspree, Web3Forms, or a small serverless function, and replace the submit
  handler in `assets/js/main.js`.

## Local preview

No build step needed — just serve the folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
