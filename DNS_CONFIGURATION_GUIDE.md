# 🌐 DNS Configuration Guide for ashgate.co.ke

**This guide is for the person who manages DNS records for `ashgate.co.ke`**

---

## 📋 What You Need to Do

You need to add DNS records to point `ashgate.co.ke` to our hosting services. This will allow the website to be accessible at `ashgate.co.ke` instead of a temporary URL.

---

## ⏰ When to Do This

**Wait until you receive:**
1. DNS records from Vercel (for the main website)
2. DNS records from Railway (for the API/backend - optional)

These will be provided after the initial deployment is complete.

---

## 📝 DNS Records You'll Need to Add

### Record 1: Main Website (ashgate.co.ke)

**You'll receive one of these from Vercel:**

**Option A - A Record:**
```
Type: A
Name: @ (or ashgate.co.ke)
Value: [IP address provided by Vercel]
TTL: 3600 (or Auto)
```

**Option B - CNAME Record:**
```
Type: CNAME
Name: @ (or ashgate.co.ke)
Value: [CNAME provided by Vercel, e.g., cname.vercel-dns.com]
TTL: 3600 (or Auto)
```

**Note:** Some registrars don't allow CNAME on root domain (@). If that's the case, use the A record option.

---

### Record 2: www Subdomain (www.ashgate.co.ke)

**You'll receive this from Vercel:**

```
Type: CNAME
Name: www
Value: [CNAME provided by Vercel, e.g., cname.vercel-dns.com]
TTL: 3600 (or Auto)
```

---

### Record 3: API Subdomain (api.ashgate.co.ke) - Optional

**You'll receive this from Railway (if we decide to use it):**

```
Type: CNAME
Name: api
Value: [CNAME provided by Railway, e.g., xxxx.railway.app]
TTL: 3600 (or Auto)
```

**Note:** This is optional. We may not need this immediately.

---

## 🔍 Where to Add These Records

1. **Log in to your domain registrar** (where you bought `ashgate.co.ke`)
   - Common registrars: GoDaddy, Namecheap, Google Domains, etc.
   - If you're not sure, check your email for domain purchase confirmation

2. **Find DNS Management**
   - Look for: "DNS Settings", "DNS Management", "DNS Records", or "Name Servers"
   - This is usually in: Domain Settings → DNS → Manage DNS

3. **Add the records**
   - Click "Add Record" or "+" button
   - Enter the Type, Name, and Value exactly as provided
   - Save the record

4. **Verify**
   - Make sure all records are saved
   - Double-check the values match exactly what was provided

---

## ⏱️ How Long It Takes

- **DNS propagation:** 15 minutes to 48 hours
- **Most common:** 1-4 hours
- **You'll know it's working when:** The website loads at `ashgate.co.ke`

---

## ✅ What to Send Back

After you've added the DNS records, please confirm:

1. ✅ All DNS records have been added
2. ✅ Records match exactly what was provided
3. ✅ Records are saved and active

**Example confirmation:**
> "I've added all the DNS records:
> - A record for ashgate.co.ke → [IP address]
> - CNAME for www.ashgate.co.ke → [CNAME value]
> All records are saved and active."

---

## 🐛 Common Issues

### Issue: "Can't add CNAME to root domain"

**Solution:** Use the A record option instead (Vercel will provide an IP address).

### Issue: "Record already exists"

**Solution:** 
- Check if there's an existing record for the same name
- You may need to edit the existing record instead of creating a new one
- Or delete the old record first, then add the new one

### Issue: "Don't know where DNS settings are"

**Solution:**
- Check your domain registrar's help documentation
- Look for "DNS Management" or "DNS Settings" in the domain dashboard
- Contact your registrar's support if you can't find it

---

## 📞 Need Help?

If you're unsure about anything:
1. **Don't guess** - ask for clarification
2. **Double-check** the values before saving
3. **Take a screenshot** of the DNS records after adding them (for verification)

---

## 📋 Quick Checklist

- [ ] Received DNS records from Vercel/Railway
- [ ] Logged in to domain registrar
- [ ] Found DNS Management section
- [ ] Added A or CNAME record for `ashgate.co.ke`
- [ ] Added CNAME record for `www.ashgate.co.ke`
- [ ] Added CNAME record for `api.ashgate.co.ke` (if provided)
- [ ] Verified all records are saved
- [ ] Confirmed completion

---

## 🎯 Summary

**What you're doing:** Adding DNS records so `ashgate.co.ke` points to our hosting

**What you need:** DNS record values (Type, Name, Value) from Vercel/Railway

**Where to add them:** Your domain registrar's DNS Management section

**How long:** 15 minutes to add, 1-48 hours to propagate

**That's it!** Once the records are added and propagated, the website will be live at `ashgate.co.ke` 🎉

---

**Questions?** Just ask - it's better to clarify than to guess!
