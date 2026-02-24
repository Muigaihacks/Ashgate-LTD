# Map Setup (Listing Modal)

The listing detail modal uses **MapTiler** for the map. If you see **"Map failed to load. Check your internet or API key"**, the frontend is missing a valid MapTiler API key or your domain is not allowed.

## 1. Get a MapTiler API key

1. Sign up at [MapTiler Cloud](https://cloud.maptiler.com/).
2. Go to **Account** → **Keys** (or **API Keys**).
3. Create a key or copy your default key. The free tier is enough for the listing map.

## 2. Add the key in Vercel (frontend)

1. Open your [Vercel](https://vercel.com) project for the Ashgate frontend.
2. Go to **Settings** → **Environment Variables**.
3. Add:
   - **Name:** `NEXT_PUBLIC_MAPTILER_KEY`
   - **Value:** your MapTiler API key
   - **Environment:** Production (and Preview if you want maps in preview deployments).
4. Save, then **redeploy** the frontend (Deployments → … → Redeploy) so the new variable is picked up.

## 3. Restrict the key in MapTiler (recommended)

In MapTiler Cloud → **Account** → **Keys** → your key → **Referrer restrictions** (or **Allowed referrers**):

- **Ashgate live site uses www** – add: `https://www.ashgate.co.ke` (and optionally `https://www.ashgate.co.ke/*`).
- If you also use the non-www domain, add: `https://ashgate.co.ke` and/or `https://ashgate.co.ke/*`.

If the site loads on **www** but you only allowed **ashgate.co.ke** (no www), the map will fail. Allow the exact host the browser uses.

## 4. Amenities on the map (optional)

To show nearby schools, hospitals, etc., add **Geoapify**:

- **Name:** `NEXT_PUBLIC_GEOAPIFY_KEY`
- **Value:** your Geoapify API key (see [GEOAPIFY_SETUP.md](GEOAPIFY_SETUP.md)).
- In Geoapify, allow the same referrer as MapTiler (e.g. `https://www.ashgate.co.ke`).

If this is not set, the map still loads; only the amenities layer is skipped.

## Summary

| Variable | Required for map to load? | Where to set |
|----------|---------------------------|---------------|
| `NEXT_PUBLIC_MAPTILER_KEY` | **Yes** | Vercel → Settings → Environment Variables |
| `NEXT_PUBLIC_GEOAPIFY_KEY` | No (amenities only) | Same |

After adding or changing env vars in Vercel, **redeploy** the frontend so the new values are used.

---

## Troubleshooting: map still not loading

- **Redeploy after adding keys**  
  `NEXT_PUBLIC_*` vars are baked in at **build** time. In Vercel: **Deployments** → … → **Redeploy** (or push a commit) after saving env vars.

- **Allow both www and non-www in MapTiler**  
  If you use `https://www.ashgate.co.ke`, add `https://www.ashgate.co.ke` (and optionally `https://www.ashgate.co.ke/*`) in MapTiler referrer restrictions. Same for `https://ashgate.co.ke` without www.

- **See the real error**  
  Open the listing modal, then **F12** → **Console**. Look for `[MapTiler]` and the error message.  
  Or **Network** tab → filter by **maptiler** or **style.json** → click the request → **Response** to see the body (e.g. 403 “Invalid key” or “Referrer not allowed”).

- **Style URL**  
  The app uses MapTiler’s **streets-v2** style:  
  `https://api.maptiler.com/maps/streets-v2/style.json?key=...`  
  If you see a different error in Console/Network, that message is the one to fix.
