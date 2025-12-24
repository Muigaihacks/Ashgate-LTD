# Ashgate-LTD API Endpoints Documentation

**Base URL:** `http://localhost:8000/api` (or your production API URL)  
**Frontend API URL:** Set via `NEXT_PUBLIC_API_URL` environment variable

---

## 📋 Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Application Endpoints](#application-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Frontend API Usage](#frontend-api-usage)

---

## 🔐 Authentication Endpoints

### 1. Login
**Endpoint:** `POST /api/login`  
**Authentication:** None (Public)  
**Description:** Authenticate user and get user data

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "roles": [...],
    "is_active": true
  },
  "require_password_change": false
}
```

**Password Change Required Response (200):**
```json
{
  "message": "Password change required",
  "require_password_change": true,
  "user": {...}
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Account is inactive

**Frontend Usage:**
```typescript
// Location: frontend/src/app/page.tsx (line ~100)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password })
});
```

---

### 2. Logout
**Endpoint:** `POST /api/logout`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Log out the authenticated user

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Frontend Usage:**
```typescript
// Protected route - requires authentication token
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

---

### 3. Change Password
**Endpoint:** `POST /api/change-password`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Change user password (max 5 changes, then account locked)

**Request Body:**
```json
{
  "email": "user@example.com",
  "current_password": "oldpassword123",
  "new_password": "newpassword123",
  "new_password_confirmation": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully. Please log in."
}
```

**Error Responses:**
- `401` - Invalid current password
- `403` - Too many password changes (account locked)

**Security Features:**
- Limits password changes to 5 attempts
- Deactivates account after 5 changes
- Requires password confirmation

**Frontend Usage:**
```typescript
// Location: frontend/src/app/dashboard/homeowner/page.tsx
// Location: frontend/src/app/dashboard/agent/page.tsx
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/change-password`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email,
        current_password,
        new_password,
        new_password_confirmation
    })
});
```

---

### 4. Forgot Password
**Endpoint:** `POST /api/forgot-password`  
**Authentication:** None (Public)  
**Description:** Request password reset link via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "We have emailed your password reset link."
}
```

**Error Response (422):**
```json
{
  "email": "We can't find a user with that email address."
}
```

**Frontend Usage:**
```typescript
// Location: frontend/src/app/page.tsx (line ~132)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email })
});
```

**Note:** Reset link is configured to redirect to frontend at `APP_FRONTEND_URL/reset-password`

---

### 5. Reset Password
**Endpoint:** `POST /api/reset-password`  
**Authentication:** None (Public)  
**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Your password has been reset."
}
```

**Error Response (422):**
```json
{
  "email": "This password reset token is invalid."
}
```

**Frontend Usage:**
```typescript
// Location: frontend/src/app/reset-password/page.tsx
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation
    })
});
```

---

## 📝 Application Endpoints

### 6. Submit Application
**Endpoint:** `POST /api/applications`  
**Authentication:** None (Public)  
**Description:** Submit application for agent, owner, or expert registration

**Request Body (FormData):**
```
firstName: string (required)
lastName: string (required)
email: string (required, email format)
phone: string (required, max 20 chars)
profession: string (required)
  - "real-estate-agent" → creates 'agent' type
  - "property-owner" → creates 'owner' type
  - "property-manager" → creates 'owner' type
  - other → creates 'expert' type
yearsOfExperience: number (required)
serialNumber: string (required)
professionalBoard: string (required)
bio: string (required)
documents[]: File[] (optional, max 5MB per file)
```

**Success Response (201):**
```json
{
  "message": "Application submitted successfully",
  "application_id": 123
}
```

**Error Responses:**
- `422` - Validation errors
- `500` - Server error

**File Storage:**
- Files stored in: `storage/app/public/application-documents/`
- Accessible via: `public/storage/application-documents/{filename}`

**Frontend Usage:**
```typescript
// Location: frontend/src/app/page.tsx (Agent/Owner forms)
// Location: frontend/src/app/experts/register/page.tsx (Expert form)

const formData = new FormData();
formData.append('firstName', firstName);
formData.append('lastName', lastName);
formData.append('email', email);
formData.append('phone', phone);
formData.append('profession', profession);
formData.append('yearsOfExperience', yearsOfExperience);
formData.append('serialNumber', serialNumber);
formData.append('professionalBoard', professionalBoard);
formData.append('bio', bio);

// Add files
documents.forEach((file) => {
    formData.append('documents[]', file);
});

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        // Don't set Content-Type - browser sets it with boundary for FormData
    },
    body: formData
});
```

**Backend Processing:**
- Maps profession to application type (agent/owner/expert)
- Stores files on 'public' disk
- Creates Application record with status 'pending'
- Stores details as JSON in `details` field
- Stores file paths as array in `documents` field

---

## 👤 User Endpoints

### 7. Get Current User
**Endpoint:** `GET /api/user`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Get authenticated user information

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "roles": [
    {
      "id": 1,
      "name": "property_owner"
    }
  ],
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Frontend Usage:**
```typescript
// Not currently used in frontend, but available
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    }
});
```

---

## 🔧 Frontend API Usage

### Environment Configuration

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend `.env`:**
```env
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:3000
```

### API Client Pattern

Currently, the frontend makes direct `fetch()` calls in components. There's no centralized `api.ts` file yet, but here's the pattern used:

**Example from `frontend/src/app/page.tsx`:**
```typescript
// Login
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
    },
    body: JSON.stringify(signInData)
});

// Forgot Password
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
    },
    body: JSON.stringify({ email: forgotPasswordEmail })
});
```

**Example from `frontend/src/app/experts/register/page.tsx`:**
```typescript
// Application Submission (with file uploads)
const formData = new FormData();
// ... append fields ...
documents.forEach((file) => {
    formData.append('documents[]', file);
});

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        // No Content-Type header - browser sets it automatically for FormData
    },
    body: formData
});
```

---

## 📊 API Summary Table

| Method | Endpoint | Auth | Purpose | Used In |
|--------|----------|------|---------|---------|
| `POST` | `/api/login` | ❌ | User login | `page.tsx` (Sign In modal) |
| `POST` | `/api/logout` | ✅ | User logout | Dashboard (not yet implemented) |
| `POST` | `/api/change-password` | ✅ | Change password | `dashboard/homeowner/page.tsx`, `dashboard/agent/page.tsx` |
| `POST` | `/api/forgot-password` | ❌ | Request reset link | `page.tsx` (Forgot Password modal) |
| `POST` | `/api/reset-password` | ❌ | Reset password | `reset-password/page.tsx` |
| `POST` | `/api/applications` | ❌ | Submit application | `page.tsx` (Agent/Owner forms), `experts/register/page.tsx` |
| `GET` | `/api/user` | ✅ | Get current user | Available but not used yet |

---

## 🔒 Authentication Flow

### Current Implementation
- Uses Laravel Sanctum for API authentication
- Session-based authentication for web routes
- Token-based authentication for API routes (when implemented)

### Password Security
- **Hashing:** Bcrypt (Laravel default)
- **Change Limit:** 5 attempts max, then account deactivated
- **Force Change:** `must_change_password` flag for temporary passwords
- **Password Requirements:** Minimum 8 characters, confirmed

### Session Management
- Login creates session (web guard)
- Logout destroys session
- Protected routes use `auth:sanctum` middleware

---

## 📁 File Upload Handling

### Storage Configuration
- **Disk:** `public` (configured in `config/filesystems.php`)
- **Path:** `storage/app/public/application-documents/`
- **Public Access:** Via symlink `public/storage` → `storage/app/public`
- **Max Size:** 5MB per file
- **Multiple Files:** Supported (array of files)

### File Access in Admin Panel
- Files displayed via Filament `FileUpload` component
- Component configured with:
  - `disk('public')`
  - `directory('application-documents')`
  - `downloadable()` - allows downloading
  - `openable()` - allows opening in new tab
  - `disabled()` - read-only for admins

---

## 🚀 Future API Endpoints (Not Yet Implemented)

These endpoints are planned but not yet created:

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/{id}` - Get property details
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### User Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/properties` - User's properties
- `POST /api/dashboard/properties` - Create property from dashboard

### Expert Profiles
- `GET /api/experts` - List expert profiles
- `GET /api/experts/{id}` - Get expert details

---

## 🛠️ Error Handling

### Standard Error Response Format
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `401` - Unauthorized
- `403` - Forbidden
- `422` - Validation Error
- `500` - Server Error

---

## 📝 Notes

1. **No Centralized API Client:** Frontend makes direct `fetch()` calls. Consider creating `frontend/src/lib/api.ts` for better organization.

2. **CORS:** Ensure CORS is configured in `config/cors.php` if frontend and backend are on different domains.

3. **Rate Limiting:** API routes use `throttle:api` middleware (configured in `bootstrap/app.php`).

4. **File Uploads:** Always use `FormData` for file uploads, not JSON.

5. **Authentication Tokens:** Currently using session-based auth. For production, implement Sanctum token-based auth for API calls.

---

**Last Updated:** December 2024  
**API Version:** 1.0

