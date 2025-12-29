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
| **Authentication** |
| `POST` | `/api/login` | ❌ | User login | `page.tsx` (Sign In modal) |
| `POST` | `/api/logout` | ✅ | User logout | Dashboard (not yet implemented) |
| `POST` | `/api/change-password` | ✅ | Change password | `dashboard/homeowner/page.tsx`, `dashboard/agent/page.tsx` |
| `POST` | `/api/forgot-password` | ❌ | Request reset link | `page.tsx` (Forgot Password modal) |
| `POST` | `/api/reset-password` | ❌ | Reset password | `reset-password/page.tsx` |
| `GET` | `/api/user` | ✅ | Get current user | Available but not used yet |
| **Applications** |
| `POST` | `/api/applications` | ❌ | Submit application | `page.tsx` (Agent/Owner forms), `experts/register/page.tsx` |
| **Properties** |
| `GET` | `/api/properties` | ❌ | List properties | Available for frontend integration |
| `POST` | `/api/properties` | ✅ | Create property | Available for dashboard integration |
| `GET` | `/api/properties/{id}` | ❌ | Get property details | Available for frontend integration |
| `PUT` | `/api/properties/{id}` | ✅ | Update property | Available for dashboard integration |
| `DELETE` | `/api/properties/{id}` | ✅ | Delete property | Available for dashboard integration |
| **Dashboard** |
| `GET` | `/api/dashboard/stats` | ✅ | Dashboard statistics | Available for dashboard integration |
| `GET` | `/api/dashboard/properties` | ✅ | User's properties | Available for dashboard integration |
| **Experts** |
| `GET` | `/api/experts` | ❌ | List expert profiles | Available for frontend integration |
| `GET` | `/api/experts/{id}` | ❌ | Get expert details | Available for frontend integration |

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

## 🏠 Property Endpoints

### 8. List Properties
**Endpoint:** `GET /api/properties`  
**Authentication:** None (Public - shows active properties)  
**Description:** Get paginated list of properties with filtering options

**Query Parameters:**
- `listing_type` (optional) - Filter by `sale` or `rent`
- `status` (optional) - Filter by `available`, `taken`, or `pending`
- `min_price` (optional) - Minimum price filter
- `max_price` (optional) - Maximum price filter
- `search` (optional) - Search in title, description, or location
- `per_page` (optional) - Items per page (default: 15)

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Modern 3BR Apartment",
      "description": "...",
      "listing_type": "sale",
      "price": "18500000",
      "currency": "KSh",
      "location_text": "Westlands, Nairobi",
      "latitude": -1.268,
      "longitude": 36.811,
      "beds": 3,
      "baths": 2,
      "parking_spaces": 1,
      "area_sqm": 145,
      "year_built": 2019,
      "status": "available",
      "is_active": true,
      "images": [...],
      "amenities": [...],
      "user": {...}
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

**Note:** Authenticated users can see their own properties (including inactive) in addition to public active properties.

---

### 9. Create Property
**Endpoint:** `POST /api/properties`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Create a new property listing

**Request Body (FormData or JSON):**
```json
{
  "title": "Modern 3BR Apartment",
  "description": "Spacious apartment with modern amenities",
  "listing_type": "sale",
  "price": 18500000,
  "currency": "KSh",
  "location_text": "Westlands, Nairobi",
  "latitude": -1.268,
  "longitude": 36.811,
  "beds": 3,
  "baths": 2,
  "parking_spaces": 1,
  "area_sqm": 145,
  "year_built": 2019,
  "has_3d_tour": false,
  "has_floor_plan": true,
  "status": "available",
  "is_active": true,
  "amenities": [1, 2, 3],
  "photos": [File, File, ...],
  "videos": [File, File, ...]
}
```

**Success Response (201):**
```json
{
  "message": "Property created successfully",
  "data": {
    "id": 1,
    "title": "Modern 3BR Apartment",
    ...
  }
}
```

**File Uploads:**
- `photos`: Array of image files (max 5MB each)
- `videos`: Array of video files (max 50MB each, formats: mp4, mov, avi)
- Images are stored in `storage/app/public/property-images/`

---

### 10. Get Property Details
**Endpoint:** `GET /api/properties/{id}`  
**Authentication:** None (Public - active properties only)  
**Description:** Get detailed information about a specific property

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Modern 3BR Apartment",
    "description": "...",
    "listing_type": "sale",
    "price": "18500000",
    "view_count": 42,
    "images": [...],
    "amenities": [...],
    "user": {...}
  }
}
```

**Note:** View count is automatically incremented on access. Only active properties are visible to non-owners.

---

### 11. Update Property
**Endpoint:** `PUT /api/properties/{id}`  
**Authentication:** Required (`auth:sanctum`) - Listing owner only  
**Description:** Update an existing property. Only the user who created the listing (property owner or agent) can update it.

**Request Body (FormData or JSON):**
```json
{
  "title": "Updated Title",
  "price": 19000000,
  "status": "taken",
  "amenities": [1, 2, 3, 4],
  "photos": [File, File, ...]
}
```

**Success Response (200):**
```json
{
  "message": "Property updated successfully",
  "data": {...}
}
```

**Error Response (403):**
```json
{
  "message": "Unauthorized to update this property"
}
```

**Note:** Only the user who created the listing (property owner or agent) can update it. New photos are appended to existing ones.

---

### 12. Delete Property
**Endpoint:** `DELETE /api/properties/{id}`  
**Authentication:** Required (`auth:sanctum`) - Listing owner only  
**Description:** Soft delete a property (and associated images). Only the user who created the listing (property owner or agent) can delete it.

**Success Response (200):**
```json
{
  "message": "Property deleted successfully"
}
```

**Error Response (403):**
```json
{
  "message": "Unauthorized to delete this property"
}
```

**Note:** Performs soft delete. Associated images are deleted from storage. Both property owners and agents can delete their own listings.

---

## 📊 Dashboard Endpoints

### 13. Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/stats`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Get statistics and metrics for the authenticated user's dashboard

**Success Response (200):**
```json
{
  "data": {
    "properties": {
      "total": 12,
      "active": 10,
      "sale": 6,
      "rent": 4
    },
    "status": {
      "available": 7,
      "taken": 2,
      "pending": 1
    },
    "metrics": {
      "total_views": 245,
      "average_price": 12500000
    },
    "recent_properties": [
      {
        "id": 12,
        "title": "Property Title",
        "listing_type": "sale",
        "price": "15000000",
        "status": "available",
        "updated_at": "2024-12-20T10:30:00.000000Z"
      }
    ]
  }
}
```

---

### 14. Get User Properties
**Endpoint:** `GET /api/dashboard/properties`  
**Authentication:** Required (`auth:sanctum`)  
**Description:** Get paginated list of authenticated user's properties

**Query Parameters:**
- `listing_type` (optional) - Filter by `sale` or `rent`
- `status` (optional) - Filter by `available`, `taken`, or `pending`
- `is_active` (optional) - Filter by active status (`true`/`false`)
- `search` (optional) - Search in title, description, or location
- `sort_by` (optional) - Sort field (default: `updated_at`)
- `sort_order` (optional) - Sort direction `asc` or `desc` (default: `desc`)
- `per_page` (optional) - Items per page (default: 15)

**Success Response (200):**
```json
{
  "data": [...],
  "pagination": {...}
}
```

**Note:** Returns all user's properties (active and inactive).

---

**Note:** To create a property from the dashboard, use `POST /api/properties` endpoint.

---

## 👥 Expert Profile Endpoints

### 16. List Expert Profiles
**Endpoint:** `GET /api/experts`  
**Authentication:** None (Public)  
**Description:** Get paginated list of active and verified expert profiles

**Query Parameters:**
- `category_id` (optional) - Filter by category ID
- `category_slug` (optional) - Filter by category slug
- `location` (optional) - Filter by location (partial match)
- `min_rating` (optional) - Minimum rating (0.00 to 5.00)
- `search` (optional) - Search in name, tagline, or description
- `sort_by` (optional) - Sort field: `rating`, `review_count`, `years_of_experience`, `name`, `created_at` (default: `rating`)
- `sort_order` (optional) - Sort direction `asc` or `desc` (default: `desc`)
- `per_page` (optional) - Items per page (default: 15)

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "tagline": "Expert Real Estate Consultant",
      "description": "...",
      "location": "Nairobi, Kenya",
      "rating": 4.85,
      "review_count": 23,
      "email": "john@example.com",
      "phone": "+254700000000",
      "website": "https://johndoe.com",
      "logo": "path/to/logo.jpg",
      "is_verified": true,
      "is_active": true,
      "registration_number": "REG123456",
      "professional_board": "Real Estate Board",
      "years_of_experience": 10,
      "category": {...},
      "user": {...}
    }
  ],
  "pagination": {...}
}
```

**Note:** Only shows active and verified experts.

---

### 17. Get Expert Profile Details
**Endpoint:** `GET /api/experts/{id}`  
**Authentication:** None (Public)  
**Description:** Get detailed information about a specific expert profile

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "tagline": "Expert Real Estate Consultant",
    "description": "...",
    "location": "Nairobi, Kenya",
    "rating": 4.85,
    "review_count": 23,
    "category": {...},
    "user": {...}
  }
}
```

**Error Response (404):**
```json
{
  "message": "No query results for model [App\\Models\\ExpertProfile] {id}"
}
```

**Note:** Only active and verified experts are accessible.

---

## 🚀 Future API Endpoints (Not Yet Implemented)

These endpoints are planned but not yet created:

### Additional Features
- `POST /api/properties/{id}/images` - Add images to existing property
- `DELETE /api/properties/{id}/images/{imageId}` - Delete specific property image
- `GET /api/amenities` - List available amenities
- `GET /api/expert-categories` - List expert categories
- `PUT /api/dashboard/profile` - Update user profile
- `GET /api/dashboard/analytics` - Advanced analytics and reporting

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
**API Version:** 1.1  
**Changelog v1.1:** Added Property CRUD, Dashboard Statistics, and Expert Profile endpoints

