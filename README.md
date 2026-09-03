# D's Landscaping LLC — Website

A single-page site for D's Landscaping LLC, a landscape contractor in Holyoke, MA.
Static HTML/CSS/JS — no build step, no framework. Deploys as-is to Vercel, Netlify,
GitHub Pages, or any static host.

## Structure

- `index.html` — all page content/sections, SEO metadata, Open Graph tags, and
  LocalBusiness structured data (JSON-LD)
- `assets/css/style.css` — dark/gold "bold & premium" theme
- `assets/js/main.js` — header scroll state, mobile nav, scroll-reveal animations,
  3D tilt on cards, transform-based scroll parallax (reduced-motion aware), and
  the Three.js hero scene (animated wireframe terrain, floating particles,
  rotating icosahedron cluster)
- `favicon.svg`, `assets/img/` — logo mark, favicon, and Open Graph image

## Facts used on this site — please verify

Business details were gathered from the business's Google Maps listing and
public directory/review sites. Two of them are single-source and should be
double-checked by the business owner before this goes live:

- **Name & address** (6 Ernest Ln, Holyoke, MA 01040) — confirmed directly from
  the business's Google Maps redirect, high confidence.
- **Phone** ((413) 455-4631) — found via Nextdoor's business listing only.
  Not cross-confirmed elsewhere. **Please verify this is correct** — it's used
  as a tap-to-call link throughout the site (`tel:+14134554631`).
- **Services** (yard material delivery, junk/debris hauling, powerwashing) —
  based on category tags from Angi/HomeAdvisor listings.
- **Hours** and **customer reviews** — could not be reliably retrieved (Yelp
  and Angi both block automated access). Rather than invent them, the site
  omits specific hours ("Hours vary seasonally — call to confirm") and links
  out to the business's real Yelp/Nextdoor/Facebook/Instagram profiles instead
  of fabricating review quotes.

## Local preview

No build step needed — just serve the folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
