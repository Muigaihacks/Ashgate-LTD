# Email SMTP Configuration Fix

## Issue
The error "Username and Password not accepted" occurs when trying to send emails via SMTP.

## Solution

### For Outlook/Microsoft 365 (info@ashgate.co.ke):

**Important:** Since info@ashgate.co.ke is an Outlook account, use Microsoft 365 SMTP settings.

1. **Get your Outlook/Microsoft 365 password**
   - Use the password for the info@ashgate.co.ke Outlook account
   - If you have 2FA enabled, you may need to create an App Password (see below)

2. **For accounts with 2FA enabled, create an App Password:**
   - Go to: https://account.microsoft.com/security
   - Sign in with info@ashgate.co.ke
   - Go to "Security" → "Advanced security options"
   - Under "App passwords", create a new app password
   - Copy the generated password

3. **Update your `.env` file** with the following:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=your-outlook-password-or-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@ashgate.co.ke
MAIL_FROM_NAME="Ashgate Limited"
```

**Important:** 
- Use `smtp.office365.com` as the host (not smtp.gmail.com)
- Port should be `587` with `tls` encryption
- If 2FA is enabled, use the App Password instead of your regular password
- Make sure the account has permission to send emails

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
