# Password Reset Issue - Decoupled App (Next.js + Laravel)

## 🔍 **Root Cause Analysis**

### **The Problem:**
The password reset flow in Ashgate is **failing because it's a decoupled application** (Next.js frontend + Laravel backend).

### **Why It's Happening:**
1. **Current Flow (Monolithic - Doesn't Work):**
   - Email link points to Laravel backend
   - Laravel tries to handle reset in same domain
   - Works in monolithic apps (Sokofresh), but NOT in decoupled apps

2. **Decoupled App Challenges:**
   - Next.js frontend = `ashgate.com` (Vercel)
   - Laravel backend = `api.ashgate.com` (Railway/Render)
   - **Different domains** = CORS issues
   - **No shared session** = CSRF issues
   - **Cross-origin requests** = Security blocks

---

## ❌ **Current Implementation (Broken)**

```
Email Link → Laravel Backend → Reset Password (FAILS)
                     ↓
              CORS/CSRF Blocks It
```

**Issues:**
- Link points to Laravel backend
- No CORS configured for frontend domain
- CSRF cookie not initialized from email link
- Session not shared between frontend and backend

---

## ✅ **Correct Implementation for Decoupled Apps**

### **Option 1: Signed URLs (Recommended)**

**Flow:**
```
1. Admin accepts application
2. Laravel generates signed URL (expires in 24h)
3. Email sent with link: ashgate.com/set-password?token=SIGNED_TOKEN
4. User clicks link → Next.js frontend
5. Next.js validates token with Laravel API
6. User sets password via API call
```

**Pros:**
- ✅ No temporary password needed
- ✅ Smooth user experience
- ✅ Token is self-contained (signed URL)
- ✅ Works with decoupled architecture

**Implementation:**
```php
// Laravel (Backend)
use Illuminate\Support\Facades\URL;

// Generate signed URL
$signedUrl = URL::temporarySignedRoute(
    'password.setup',
    now()->addHours(24),
    ['user' => $user->id]
);

// Email link: https://ashgate.com/set-password?token=XXX
```

```typescript
// Next.js (Frontend)
// Page: /set-password?token=XXX

// Validate token with Laravel API
const response = await fetch('https://api.ashgate.com/api/validate-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: token }),
});

// If valid, show password form
// Submit new password to Laravel API
```

---

### **Option 2: JWT Tokens (Cleaner for Decoupled)**

**Flow:**
```
1. Admin accepts application
2. Laravel generates JWT token (expires in 24h)
3. Email sent with link: ashgate.com/set-password?token=JWT_TOKEN
4. User clicks link → Next.js frontend
5. Next.js validates JWT locally (or with API)
6. User sets password via API call with JWT
```

**Pros:**
- ✅ Stateless (no session needed)
- ✅ No CSRF issues
- ✅ Works perfectly for decoupled apps
- ✅ Token contains all needed info

**Implementation:**
```php
// Laravel (Backend)
use Firebase\JWT\JWT;

$payload = [
    'user_id' => $user->id,
    'exp' => time() + (24 * 60 * 60), // 24 hours
    'purpose' => 'password_setup'
];

$token = JWT::encode($payload, config('app.key'), 'HS256');

// Email link: https://ashgate.com/set-password?token=JWT_TOKEN
```

```typescript
// Next.js (Frontend)
import jwt from 'jsonwebtoken';

// Validate JWT token
const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

// If valid, show password form
// Submit new password to Laravel API with token
```

---

## 🔧 **Required Changes**

### **1. CORS Configuration (Laravel)**

**File:** `config/cors.php`

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://ashgate.com',
        'https://www.ashgate.com',
        'http://localhost:3000', // For development
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true, // Important for cookies
];
```

### **2. CSRF Configuration (Laravel Sanctum)**

**File:** `config/sanctum.php`

```php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),
    
    'guard' => ['web'],
    
    'expiration' => null,
    
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

**File:** `.env`
```env
SANCTUM_STATEFUL_DOMAINS=ashgate.com,www.ashgate.com,localhost:3000
SESSION_DOMAIN=.ashgate.com
FRONTEND_URL=https://ashgate.com
```

### **3. Password Reset Route (Laravel)**

**File:** `routes/api.php`

```php
// Validate password setup token
Route::post('/validate-password-token', [AuthController::class, 'validatePasswordToken']);

// Set password (after token validation)
Route::post('/set-password', [AuthController::class, 'setPassword']);
```

### **4. Frontend Implementation (Next.js)**

**File:** `frontend/src/app/set-password/page.tsx`

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [validToken, setValidToken] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Validate token with Laravel API
    const validateToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-password-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setValidToken(true);
        } else {
          // Token invalid/expired
          setValidToken(false);
        }
      } catch (error) {
        setValidToken(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          password,
          password_confirmation: confirmPassword 
        }),
      });

      if (response.ok) {
        // Success - redirect to login
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to set password');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  if (!token) {
    return <div>Invalid link</div>;
  }

  if (!validToken) {
    return <div>Token expired or invalid</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Set Password</button>
    </form>
  );
}
```

---

## 🔄 **Why Sokofresh Works (Monolithic)**

**Sokofresh Architecture:**
- Frontend AND Backend = Same domain (`sokofresh.com`)
- Shared session cookies
- No CORS issues
- CSRF works naturally

**That's why password reset works there!**

---

## ✅ **Recommended Solution**

**Use Signed URLs (Option 1) for now:**
- ✅ Easier to implement
- ✅ Built into Laravel
- ✅ No additional dependencies
- ✅ Good enough for most use cases

**Consider JWT (Option 2) later:**
- ✅ Better for decoupled apps
- ✅ More scalable
- ✅ Stateless (no session)

---

## 📋 **Fix Checklist**

- [ ] Update CORS configuration in Laravel
- [ ] Configure Sanctum stateful domains
- [ ] Create password setup route (signed URL)
- [ ] Update email template to use frontend URL
- [ ] Create Next.js `/set-password` page
- [ ] Implement token validation API endpoint
- [ ] Implement password setting API endpoint
- [ ] Test full flow (email → frontend → API → success)
- [ ] Handle expired/invalid tokens gracefully

---

## 🎯 **Summary**

**The Issue:**
- Decoupled apps (Next.js + Laravel) need different password reset flow
- CORS and CSRF are the main blockers
- Current implementation assumes monolithic architecture

**The Solution:**
- Use signed URLs or JWT tokens
- Link points to Next.js frontend
- Frontend calls Laravel API to validate/set password
- Configure CORS and Sanctum properly

**Why Sokofresh Works:**
- Monolithic (same domain) = no CORS/CSRF issues

---

**Status:** ⏳ To be fixed after deployments are complete

