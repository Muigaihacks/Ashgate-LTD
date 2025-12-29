<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties.
     * 
     * Public endpoint - shows active properties
     * Authenticated users can see their own properties (including inactive)
     */
    public function index(Request $request)
    {
        $query = Property::with(['images', 'amenities', 'user:id,name,email'])
            ->where('is_active', true);

        // If authenticated, also include user's own properties (active or inactive)
        if ($request->user()) {
            $query->orWhere('user_id', $request->user()->id);
        }

        // Filter by listing type (sale/rent)
        if ($request->has('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Search by title, description, or location
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(location_text) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $properties = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $properties->items(),
            'pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ]
        ]);
    }

    /**
     * Store a newly created property.
     * 
     * Requires authentication
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'listing_type' => 'required|in:sale,rent',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10|default:KSh',
            'location_text' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'beds' => 'nullable|integer|min:0',
            'baths' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'area_sqm' => 'nullable|numeric|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),
            'has_3d_tour' => 'nullable|boolean',
            'has_floor_plan' => 'nullable|boolean',
            'status' => 'nullable|string|in:available,taken,pending',
            'is_active' => 'nullable|boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:5120', // 5MB per image
            'videos' => 'nullable|array',
            'videos.*' => 'mimes:mp4,mov,avi|max:51200', // 50MB per video
        ]);

        try {
            $property = Property::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'listing_type' => $validated['listing_type'],
                'price' => $validated['price'],
                'currency' => $validated['currency'] ?? 'KSh',
                'location_text' => $validated['location_text'],
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'beds' => $validated['beds'] ?? null,
                'baths' => $validated['baths'] ?? null,
                'parking_spaces' => $validated['parking_spaces'] ?? null,
                'area_sqm' => $validated['area_sqm'] ?? null,
                'year_built' => $validated['year_built'] ?? null,
                'has_3d_tour' => $validated['has_3d_tour'] ?? false,
                'has_floor_plan' => $validated['has_floor_plan'] ?? false,
                'status' => $validated['status'] ?? 'available',
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Attach amenities
            if (isset($validated['amenities'])) {
                $property->amenities()->sync($validated['amenities']);
            }

            // Handle image uploads
            if ($request->hasFile('photos')) {
                $sortOrder = 0;
                $isFirst = true;
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('property-images', 'public');
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'url' => $path,
                        'alt_text' => $property->title,
                        'sort_order' => $sortOrder++,
                        'is_primary' => $isFirst,
                    ]);
                    $isFirst = false;
                }
            }

            // Load relationships for response
            $property->load(['images', 'amenities', 'user:id,name,email']);

            return response()->json([
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);

        } catch (\Exception $e) {
            Log::error('Property creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create property',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified property.
     */
    public function show($id)
    {
        $property = Property::with(['images', 'amenities', 'user:id,name,email'])
            ->findOrFail($id);

        // Only show inactive properties to the owner or if property is active
        if (!$property->is_active && (!$property->user_id || $property->user_id !== Auth::id())) {
            return response()->json([
                'message' => 'Property not found'
            ], 404);
        }

        // Increment view count
        $property->increment('view_count');

        return response()->json([
            'data' => $property
        ]);
    }

    /**
     * Update the specified property.
     * 
     * Requires authentication - only the listing owner (user who created it) can update.
     * This applies to both property owners and agents - whoever created the listing.
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        // Check authorization - only the user who created the listing can update
        // This allows both property owners and agents to manage their own listings
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to update this property'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'listing_type' => 'sometimes|required|in:sale,rent',
            'price' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'location_text' => 'sometimes|required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'beds' => 'nullable|integer|min:0',
            'baths' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'area_sqm' => 'nullable|numeric|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . date('Y'),
            'has_3d_tour' => 'nullable|boolean',
            'has_floor_plan' => 'nullable|boolean',
            'status' => 'sometimes|string|in:available,taken,pending',
            'is_active' => 'nullable|boolean',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:5120',
        ]);

        try {
            $property->update($validated);

            // Update amenities if provided
            if (isset($validated['amenities'])) {
                $property->amenities()->sync($validated['amenities']);
            }

            // Handle new image uploads
            if ($request->hasFile('photos')) {
                $maxSortOrder = $property->images()->max('sort_order') ?? -1;
                $sortOrder = $maxSortOrder + 1;
                
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('property-images', 'public');
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'url' => $path,
                        'alt_text' => $property->title,
                        'sort_order' => $sortOrder++,
                        'is_primary' => false,
                    ]);
                }
            }

            // Reload relationships
            $property->load(['images', 'amenities', 'user:id,name,email']);

            return response()->json([
                'message' => 'Property updated successfully',
                'data' => $property
            ]);

        } catch (\Exception $e) {
            Log::error('Property update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update property',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified property.
     * 
     * Requires authentication - only the listing owner (user who created it) can delete.
     * This applies to both property owners and agents - whoever created the listing.
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        // Check authorization - only the user who created the listing can delete
        // This allows both property owners and agents to manage their own listings
        if ($property->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to delete this property'
            ], 403);
        }

        try {
            // Delete associated images from storage
            foreach ($property->images as $image) {
                if (Storage::disk('public')->exists($image->url)) {
                    Storage::disk('public')->delete($image->url);
                }
            }

            // Delete property (soft delete)
            $property->delete();

            return response()->json([
                'message' => 'Property deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Property deletion error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete property',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

