# Metadata & favicon (SEO & branding)

The root layout is configured with:

- **Title template** – Child pages use `"Page Title | Ashgate"`.
- **Description & keywords** – Tuned for real estate in Kenya and East Africa.
- **Open Graph & Twitter** – For link previews on social and messaging apps.
- **Canonical URL** – `https://www.ashgate.co.ke`.
- **Robots** – `index, follow` for search engines.

## Current assets

- **`public/favicon.png`** – “A” mark favicon (browser tab).
- **`public/apple-touch-icon.png`** – “A” mark for Add to Home Screen on iOS.

## Optional later

- **Social preview** – Add **`public/og-image.png`** (1200×630), then in `app/layout.tsx` inside `openGraph` add:  
  `images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ashgate Real Estate" }]`
