# Email SMTP Configuration Fix

## Issue
The error "Username and Password not accepted" occurs when trying to send emails via Gmail SMTP.

## Solution

### For Gmail SMTP (info@ashgate.co.ke):

**Important:** You need to use the **info@ashgate.co.ke Gmail account** (or whatever email account you're using for Ashgate) to generate the app password.

1. **Enable 2-Step Verification** on the info@ashgate.co.ke Google account (if not already enabled)
   - Go to: https://myaccount.google.com/security
   - Sign in with info@ashgate.co.ke
   - Enable 2-Step Verification

2. **Generate an App Password** (required for Gmail SMTP)
   - Go to: https://myaccount.google.com/apppasswords
   - Make sure you're signed in with **info@ashgate.co.ke** (not your personal account)
   - Select "Mail" and "Other (Custom name)"
   - Enter "Ashgate Laravel" as the name
   - Copy the 16-character app password generated

3. **Update your `.env` file** with the following:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=your-16-character-app-password-here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@ashgate.co.ke
MAIL_FROM_NAME="Ashgate Limited"
```

**Important:** 
- Use the **App Password** (16 characters) in `MAIL_PASSWORD`, NOT your regular Gmail password
- The App Password will look like: `abcd efgh ijkl mnop` (remove spaces when adding to .env)
- Make sure you're generating the app password for the **info@ashgate.co.ke account**, not your personal account

### Alternative: Use a Different Email Service

If Gmail continues to cause issues, consider using:
- **SendGrid** (recommended for production)
- **Mailgun**
- **Amazon SES**

### Testing

After updating `.env`, clear config cache:
```bash
php artisan config:clear
php artisan cache:clear
```

Then test by approving an agent application in the admin panel.
