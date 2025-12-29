<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use App\Models\ExpertCategory;
use Illuminate\Http\Request;

class ExpertController extends Controller
{
    /**
     * Display a listing of expert profiles.
     * 
     * GET /api/experts
     * Public endpoint - shows active and verified experts
     */
    public function index(Request $request)
    {
        $query = ExpertProfile::with(['category', 'user:id,name,email'])
            ->where('is_active', true)
            ->where('is_verified', true);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by category slug
        if ($request->has('category_slug')) {
            $category = ExpertCategory::where('slug', $request->category_slug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Filter by location
        if ($request->has('location')) {
            $query->whereRaw('LOWER(location) LIKE ?', ['%' . strtolower($request->location) . '%']);
        }

        // Filter by minimum rating
        if ($request->has('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Search by name, tagline, or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(tagline) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'rating');
        $sortOrder = $request->get('sort_order', 'desc');

        // Allowed sort fields
        $allowedSortFields = ['rating', 'review_count', 'years_of_experience', 'name', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $experts = $query->paginate($perPage);

        return response()->json([
            'data' => $experts->items(),
            'pagination' => [
                'current_page' => $experts->currentPage(),
                'last_page' => $experts->lastPage(),
                'per_page' => $experts->perPage(),
                'total' => $experts->total(),
            ]
        ]);
    }

    /**
     * Display the specified expert profile.
     * 
     * GET /api/experts/{id}
     * Public endpoint - shows active and verified expert
     */
    public function show($id)
    {
        $expert = ExpertProfile::with(['category', 'user:id,name,email'])
            ->where('is_active', true)
            ->where('is_verified', true)
            ->findOrFail($id);

        return response()->json([
            'data' => $expert
        ]);
    }
}

