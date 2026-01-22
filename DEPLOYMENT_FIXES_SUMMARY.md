# Ashgate Platform - Pre-Deployment Fixes Summary

## Status: IN PROGRESS

This document tracks all fixes and improvements needed before deployment.

---

## ✅ COMPLETED

1. **Password Change Fix** - Updated to use authenticated user, 4-change limit (not 5), account lockout with notification
2. **Roles Seeder** - Fixed to only create: super_admin, agent, property_owner (removed expert/general)

---

## 🔴 CRITICAL (Must Fix Before Deployment)

### 1. Listing Creation - Save Button Functionality
**Status:** IN PROGRESS
- Add onClick handler to "Save Listing Information" button in agent/homeowner dashboards
- Map local state to API format (PropertyController expects specific fields)
- Handle file uploads (photos, floor plans, 3D tours)
- Show success/error messages
- Refresh listings after save

### 2. Profile Details - Show Real User Data
**Status:** PENDING
- Fetch user data from API on dashboard load
- Display: name, email, phone from User model
- For agents: show company name from Application details
- Remove mock data

### 3. Forgot Password - Full Implementation
**Status:** PENDING
- Ensure forgot password sends email with reset link
- Create reset-password page (similar to set-password)
- Validate token and allow password reset
- Redirect to login after successful reset

### 4. Security Hardening
**Status:** PENDING
- Verify PostgreSQL database usage
- Configure SHA-256 hashing (Laravel uses bcrypt by default - need to verify/configure)
- Add SQL injection protection (Laravel Eloquent already protects, but verify all queries)
- Add CSRF protection (already in place via Sanctum)
- Add rate limiting on sensitive endpoints

---

## 🟡 HIGH PRIORITY

### 5. Floor Plans & 3D Tours
- Add file upload fields for floor_plan and 3d_tour in PropertyController
- Update Property model migration to include these fields
- Add upload UI in dashboards (only for House/Apartment/Commercial)
- Add message about 3D tour service (contact info@ashgate.co.ke)
- Make fields optional

### 6. Email Configuration
- Update all email templates to use info@ashgate.co.ke as sender
- Configure MAIL_FROM_ADDRESS in .env
- Update WelcomeCredentials, ExpertApplicationApproved mails

### 7. Featured Listings - Admin Control
- Add `is_featured` toggle in PropertyResource (admin panel)
- Add validation to limit featured listings to 10
- Update frontend to only show featured listings where is_featured = true
- Add featured listings management page in admin

### 8. Search Functionality
- Make "What are you looking for" dropdown show actual categories
- Make "Where" show actual locations from properties (dynamic)
- Implement search API endpoint with filters
- Update listings page to accept search params
- Show filtered results

### 9. Admin Panel Updates
- Rename "Property Management" navigation group to "Listings Management"
- Restrict delete action in UserListingsResource to super_admin only
- Ensure agents/owners can only create/edit/toggle availability

---

## 🟢 MEDIUM PRIORITY

### 10. Social Media Links - Footer
- Add Instagram: https://www.instagram.com/ashgatepropertieskenya/
- Add X: https://x.com/ashgateproperty?s=21
- Add Facebook: https://www.facebook.com/ashgateproperty
- Add YouTube icon (no link yet)

### 11. Expert "Other" Category
- Add "Other" option in expert registration form
- Add text input field when "Other" is selected
- Store custom category in application details
- Allow admin to create new category from application

### 12. Terms & Conditions Page
- Add Ashgate logo (top center)
- Add address: Nairobi, Kenya
- Add phone: +254 700 580 379
- Apply multi-colored theme matching platform
- Update footer link

### 13. Remove Placeholders
- Remove placeholder partner brands
- Remove mock news articles (keep testimonials)
- Ensure all resources are functional

### 14. Cookie Policy
- Add cookie icon (from provided image)
- Implement cookie consent functionality
- Configure for SEO improvement

---

## 🔵 LOWER PRIORITY

### 15. Accessibility Features
- Add ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode option

### 16. Audit Logs - Comprehensive Tracking
- Track login events
- Track listing create/edit
- Track password changes
- Track all user activities
- Display in admin panel

### 17. Category Counts - Dynamic
- Calculate actual listing counts per category
- Update landing page cards dynamically
- Cache for performance

### 18. Listing Contact Details
- Show agent company name on listing cards
- Show "Direct Owner" for property owners
- Display accurate contact info (email/phone) from user profile
- Update listing detail modal

### 19. Remove Test Credentials
- Remove test credentials section from sign-in form

---

## Implementation Notes

### Database
- Ensure PostgreSQL is configured
- Verify all migrations are run
- Check foreign key constraints

### Security
- Laravel uses bcrypt by default (not SHA-256)
- To use SHA-256, would need custom hasher (not recommended - bcrypt is more secure)
- All Eloquent queries are protected from SQL injection
- CSRF protection via Sanctum middleware
- Rate limiting should be added to API routes

### Email
- Configure .env: MAIL_FROM_ADDRESS=info@ashgate.co.ke
- Configure .env: MAIL_FROM_NAME="Ashgate Limited"
- Test email sending before deployment

---

## Testing Checklist

- [ ] Listing creation works from agent dashboard
- [ ] Listing creation works from homeowner dashboard
- [ ] Listings appear on listings page
- [ ] Featured listings show correctly
- [ ] Password change works (test 4-change limit)
- [ ] Account lockout works after 4 changes
- [ ] Forgot password flow works end-to-end
- [ ] Profile shows real user data
- [ ] Floor plans/3D tours can be uploaded
- [ ] Search functionality works
- [ ] Admin can select featured listings
- [ ] Admin can delete user listings (agents/owners cannot)
- [ ] All email notifications work
- [ ] Social media links work
- [ ] Terms & Conditions page displays correctly

---

**Last Updated:** 2025-01-15
**Status:** Pre-Deployment Phase
