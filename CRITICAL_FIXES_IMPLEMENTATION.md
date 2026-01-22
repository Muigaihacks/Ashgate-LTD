# Critical Fixes Implementation Guide

## Overview
This document provides step-by-step implementation guidance for all pre-deployment fixes.

---

## 🔴 CRITICAL FIXES (Implement First)

### 1. Listing Creation - Save Button Functionality

**Files to Modify:**
- `frontend/src/app/dashboard/agent/page.tsx`
- `frontend/src/app/dashboard/homeowner/page.tsx`

**Implementation Steps:**

1. **Add State for File Objects:**
```typescript
const [propertyFiles, setPropertyFiles] = useState<Record<string, { photos: File[], videos: File[], floorPlan?: File, tour3D?: File }>>({});
```

2. **Update Photo/Video Upload Handlers:**
```typescript
const handlePhotoUpload = (propertyId: string, files: FileList | null) => {
  if (!files) return;
  const fileArray = Array.from(files);
  setPropertyFiles(prev => ({
    ...prev,
    [propertyId]: {
      ...prev[propertyId],
      photos: [...(prev[propertyId]?.photos || []), ...fileArray]
    }
  }));
  // Also update preview URLs for UI
  const newPhotos = fileArray.map(file => URL.createObjectURL(file));
  setProperties(prev => prev.map(p => 
    p.id === propertyId ? { ...p, photos: [...p.photos, ...newPhotos] } : p
  ));
};
```

3. **Add Save Handler:**
```typescript
const handleSaveProperty = async (propertyId: string) => {
  const property = properties.find(p => p.id === propertyId);
  if (!property) return;

  // Get user from localStorage
  const userStr = localStorage.getItem('ashgate_user');
  if (!userStr) {
    alert('Please log in to save listings');
    router.push('/?login=true');
    return;
  }

  const user = JSON.parse(userStr);
  const token = localStorage.getItem('ashgate_auth_token');

  // Map local state to API format
  const formData = new FormData();
  formData.append('title', property.title || property.address);
  formData.append('description', property.description);
  formData.append('listing_type', property.listingType);
  formData.append('price', property.price.replace(/,/g, ''));
  formData.append('location_text', property.location);
  formData.append('latitude', property.lat || '');
  formData.append('longitude', property.lng || '');
  formData.append('beds', property.beds.na ? '0' : property.beds.value);
  formData.append('baths', property.baths.na ? '0' : property.baths.value);
  formData.append('parking_spaces', property.parking.na ? '0' : property.parking.value);
  formData.append('area_sqm', property.area.na ? '0' : property.area.value);
  formData.append('status', property.status.toLowerCase());
  formData.append('is_active', 'true');

  // Map amenities (need to get amenity IDs from backend)
  const amenityMap: Record<string, number> = {
    wifi: 1,
    washingMachine: 2,
    backupPower: 3,
    security: 4,
    gym: 5,
    pool: 6,
    dishwasher: 7
  };
  
  const selectedAmenities = Object.entries(property.amenities)
    .filter(([_, selected]) => selected)
    .map(([key]) => amenityMap[key])
    .filter(Boolean);
  
  selectedAmenities.forEach(id => formData.append('amenities[]', id.toString()));

  // Add photos
  const files = propertyFiles[propertyId];
  if (files?.photos) {
    files.photos.forEach(photo => formData.append('photos[]', photo));
  }

  // Add floor plan and 3D tour if property type supports it
  if (['House', 'Apartment', 'Commercial'].includes(property.propertyType)) {
    if (files?.floorPlan) {
      formData.append('floor_plan', files.floorPlan);
      formData.append('has_floor_plan', 'true');
    }
    if (files?.tour3D) {
      formData.append('3d_tour', files.tour3D);
      formData.append('has_3d_tour', 'true');
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert('Listing saved successfully!');
      // Optionally refresh properties list
    } else {
      alert('Failed to save listing: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving listing. Please try again.');
  }
};
```

4. **Update Save Button:**
```typescript
<button 
  onClick={() => handleSaveProperty(property.id)}
  className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
>
  Save Listing Information
</button>
```

**Backend Changes Needed:**
- Update PropertyController to handle floor_plan and 3d_tour file uploads
- Add migration for floor_plan_url and 3d_tour_url columns

---

### 2. Profile Details - Show Real User Data

**Files to Modify:**
- `frontend/src/app/dashboard/agent/page.tsx`
- `frontend/src/app/dashboard/homeowner/page.tsx`

**Implementation:**

1. **Add State and Fetch User Data:**
```typescript
const [userData, setUserData] = useState<any>(null);
const [userApplication, setUserApplication] = useState<any>(null);

useEffect(() => {
  const fetchUserData = async () => {
    const userStr = localStorage.getItem('ashgate_user');
    if (!userStr) {
      router.push('/?login=true');
      return;
    }
    
    const user = JSON.parse(userStr);
    setUserData(user);
    
    // Fetch application details for company name (agents) or address (owners)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications?email=${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ashgate_auth_token')}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const apps = await response.json();
        const userApp = apps.find((app: any) => app.email === user.email && app.status === 'approved');
        setUserApplication(userApp);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };
  
  fetchUserData();
}, []);
```

2. **Update Profile Modal:**
```typescript
{showProfileModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className="text-lg font-semibold mb-4">Profile</h3>
      {userData && (
        <div className="space-y-2">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
          {userApplication && userApplication.type === 'agent' && (
            <p><strong>Company:</strong> {userApplication.details?.agency || userApplication.details?.professionalBoard || 'N/A'}</p>
          )}
          {userApplication && userApplication.type === 'owner' && (
            <p><strong>Address:</strong> {userApplication.details?.address || 'N/A'}</p>
          )}
        </div>
      )}
    </div>
  </div>
)}
```

---

### 3. Forgot Password - Full Implementation

**Files to Create/Modify:**
- `frontend/src/app/reset-password/page.tsx` (new file)

**Implementation:**

Create a new file similar to `set-password/page.tsx` but for password reset:

```typescript
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// ... (similar to set-password but uses /api/reset-password endpoint)
```

**Backend:**
- Update `forgotPassword` in AuthController to send email with frontend URL
- Ensure reset link points to `/reset-password?token=...&email=...`

---

### 4. Security Hardening

**Laravel Configuration:**

1. **Password Hashing:**
Laravel uses bcrypt by default (more secure than SHA-256). To verify:
- Check `config/hashing.php` - should use `driver => 'bcrypt'`
- Bcrypt is actually MORE secure than SHA-256 for passwords (it's designed for password hashing with built-in salt)

2. **SQL Injection Protection:**
- All Eloquent queries are automatically protected
- Verify no raw DB::raw() queries without parameter binding
- Check all `whereRaw()` calls use parameter binding

3. **Add Rate Limiting:**
In `routes/api.php`:
```php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});
```

4. **CSRF Protection:**
- Already handled by Sanctum middleware
- Verify `config/sanctum.php` is configured correctly

---

## 🟡 HIGH PRIORITY FIXES

### 5. Floor Plans & 3D Tours

**Backend Changes:**

1. **Add Migration:**
```bash
php artisan make:migration add_floor_plan_and_3d_tour_to_properties_table
```

```php
public function up()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->string('floor_plan_url')->nullable()->after('has_floor_plan');
        $table->string('3d_tour_url')->nullable()->after('has_3d_tour');
    });
}
```

2. **Update PropertyController:**
```php
// In store() method, after handling photos:
if ($request->hasFile('floor_plan')) {
    $floorPlanPath = $request->file('floor_plan')->store('property-floor-plans', 'public');
    $property->update(['floor_plan_url' => $floorPlanPath]);
}

if ($request->hasFile('3d_tour')) {
    $tourPath = $request->file('3d_tour')->store('property-3d-tours', 'public');
    $property->update(['3d_tour_url' => $tourPath]);
}
```

3. **Frontend - Add Upload Fields:**
Only show for House/Apartment/Commercial:
```typescript
{['House', 'Apartment', 'Commercial'].includes(property.propertyType) && (
  <>
    <div>
      <label>Floor Plan (Optional)</label>
      <input 
        type="file" 
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPropertyFiles(prev => ({
              ...prev,
              [property.id]: { ...prev[property.id], floorPlan: file }
            }));
          }
        }}
      />
    </div>
    <div>
      <label>3D Tour (Optional)</label>
      <input 
        type="file" 
        accept=".mp4,.mov,.avi"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPropertyFiles(prev => ({
              ...prev,
              [property.id]: { ...prev[property.id], tour3D: file }
            }));
          }
        }}
      />
      <p className="text-xs text-gray-500">
        Don't have a 3D tour? We can help create one for your listing. 
        Contact us at <a href="mailto:info@ashgate.co.ke" className="text-primary-600">info@ashgate.co.ke</a>
      </p>
    </div>
  </>
)}
```

---

### 6. Email Configuration

**Backend .env:**
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=info@ashgate.co.ke
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info@ashgate.co.ke
MAIL_FROM_NAME="Ashgate Limited"
```

**Update Email Templates:**
- `resources/views/emails/welcome-credentials.blade.php`
- `app/Mail/ExpertApplicationApproved.php`
- All should use `config('mail.from.address')` which will be `info@ashgate.co.ke`

---

### 7. Featured Listings - Admin Control

**Backend:**
1. Property model already has `is_featured` column
2. Update PropertyResource to add toggle:
```php
Forms\Components\Toggle::make('is_featured')
    ->label('Featured Listing')
    ->helperText('Only 10 listings can be featured at a time')
    ->afterStateUpdated(function ($state, $set) {
        if ($state) {
            $featuredCount = Property::where('is_featured', true)->count();
            if ($featuredCount >= 10) {
                $set('is_featured', false);
                throw new \Exception('Maximum 10 featured listings allowed');
            }
        }
    }),
```

**Frontend:**
Update listings page to filter:
```typescript
const featuredListings = properties.filter(p => p.is_featured === true).slice(0, 10);
```

---

### 8. Search Functionality

**Backend - Add Search Endpoint:**
```php
// In PropertyController
public function search(Request $request)
{
    $query = Property::with(['images', 'amenities', 'user'])
        ->where('is_active', true);

    if ($request->has('category')) {
        $query->where('property_type', $request->category);
    }

    if ($request->has('location')) {
        $query->where('location_text', 'LIKE', '%' . $request->location . '%');
    }

    return response()->json($query->get());
}
```

**Frontend - Update Search:**
```typescript
const handleSearch = async () => {
  const params = new URLSearchParams();
  if (searchQuery) params.append('category', searchQuery);
  if (searchLocation) params.append('location', searchLocation);
  
  router.push(`/listings?${params.toString()}`);
};
```

---

### 9. Admin Panel Updates

**Rename Navigation Group:**
In `app/Filament/Resources/UserListingResource.php`:
```php
protected static ?string $navigationGroup = 'Listings Management';
```

**Restrict Delete:**
```php
public static function table(Table $table): Table
{
    return $table
        ->actions([
            Tables\Actions\DeleteAction::make()
                ->visible(fn () => auth()->user()->hasRole('super_admin')),
        ]);
}
```

---

## 🟢 MEDIUM PRIORITY

### 10. Social Media Links - Footer

Update footer in `frontend/src/app/page.tsx`:
```typescript
<div className="flex gap-4">
  <a href="https://www.instagram.com/ashgatepropertieskenya/" target="_blank" rel="noopener noreferrer">
    <Instagram className="w-6 h-6" />
  </a>
  <a href="https://x.com/ashgateproperty?s=21" target="_blank" rel="noopener noreferrer">
    {/* X icon */}
  </a>
  <a href="https://www.facebook.com/ashgateproperty" target="_blank" rel="noopener noreferrer">
    <Facebook className="w-6 h-6" />
  </a>
  <a href="#" className="opacity-50 cursor-not-allowed">
    <Youtube className="w-6 h-6" />
  </a>
</div>
```

---

### 11. Expert "Other" Category

**Frontend:**
```typescript
{formData.profession === 'other' && (
  <div>
    <label>Specify Category</label>
    <input 
      type="text"
      name="customCategory"
      value={formData.customCategory}
      onChange={handleInputChange}
      required
    />
  </div>
)}
```

**Backend:**
Store in application details:
```php
'details' => [
    // ... other fields
    'custom_category' => $request->customCategory ?? null,
],
```

---

### 12. Terms & Conditions Page

Create/update `frontend/public/terms-and-conditions.html`:
- Add logo at top (center aligned)
- Add address: Nairobi, Kenya
- Add phone: +254 700 580 379
- Apply theme colors (use CSS matching platform theme)

---

### 13. Remove Placeholders

- Remove partner brands from `frontend/src/app/page.tsx`
- Remove mock news articles (keep testimonials)
- Test all admin resources

---

### 14. Cookie Policy

- Add cookie icon image to public folder
- Implement cookie consent banner
- Store consent in localStorage
- Add to footer

---

## Testing Checklist

Before deployment, test:
- [ ] Listing creation from both dashboards
- [ ] Listings appear on listings page
- [ ] Featured listings work
- [ ] Password change (test 4-change limit)
- [ ] Account lockout after 4 changes
- [ ] Forgot password flow
- [ ] Profile shows real data
- [ ] Floor plans/3D tours upload
- [ ] Search functionality
- [ ] Admin featured listings selection
- [ ] Email notifications
- [ ] All admin resources functional

---

**Next Steps:**
1. Implement critical fixes first
2. Test thoroughly
3. Implement high priority fixes
4. Final testing
5. Deploy
