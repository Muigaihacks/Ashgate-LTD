# Vercel DNS fix – ashgate.co.ke (Invalid Configuration)

Vercel is showing **Invalid Configuration** for ashgate.co.ke and www.ashgate.co.ke. Use the **DNS Records** tab in Vercel (not "Vercel DNS") and set the records below at your current DNS provider.

---

## Records to set (exactly – from Vercel dashboard)

| Purpose           | Type   | Name  | Value                                  |
|-------------------|--------|-------|----------------------------------------|
| ashgate.co.ke     | **A**  | `@`   | **216.198.79.1**                        |
| www.ashgate.co.ke | **CNAME** | `www` | **d318632d478e78ce.vercel-dns-017.com.** |

---

## What to change

1. **ashgate.co.ke (root):**
   - If there is a **CNAME** for `@` (or for "ashgate.co.ke"), **remove it**.
   - Add (or update) an **A** record: name **@**, value **216.198.79.1**.

2. **www.ashgate.co.ke:**
   - **CNAME** record: name **www** (not "www.ashgate.co.ke"), value **d318632d478e78ce.vercel-dns-017.com.** (include the trailing dot if your registrar shows it).

---

## After you save

- DNS can take 5–15 minutes to update.
- Reply once the records are updated so we can re-check in Vercel.

Thanks.
