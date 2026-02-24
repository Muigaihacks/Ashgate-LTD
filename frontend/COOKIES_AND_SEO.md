# Cookies, Analytics & SEO

## Do cookies help SEO?

**No.** Search engines do not use cookies or analytics data as a direct ranking factor. So adding analytics or marketing cookies does **not** by itself improve your position in search results.

**What does help:** Analytics gives you **data** (how people find you, which pages they visit, what they search for). You use that data to improve content, fix underperforming pages, and improve UX—and *those* improvements can help SEO. So the benefit is indirect: better decisions → better site → better rankings.

## What we implemented

- **Cookie banner** – User can Accept All, Manage Cookies, or Dismiss. Choice is stored (localStorage) and the banner does not reappear once set.
- **Cookie preferences** – Manage Cookies lets users turn **Analytics** and **Marketing** on or off. Necessary cookies are always on.
- **Real scripts only when consented:**
  - **Analytics cookies** → Google Analytics (GA4) loads only if user accepted Analytics. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel.
  - **Marketing cookies** → Facebook Pixel loads only if user accepted Marketing. Set `NEXT_PUBLIC_FB_PIXEL_ID` in Vercel.

So the site benefits from analytics and marketing when users consent, and stays compliant by not loading those scripts until then.

## Env vars (Vercel)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID (e.g. `G-XXXXXXXXXX`). Analytics scripts load only if user accepted Analytics cookies. |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook Pixel ID. Marketing scripts load only if user accepted Marketing cookies. |

See **ENV_VARIABLES_CHECKLIST.md** for the full list.
