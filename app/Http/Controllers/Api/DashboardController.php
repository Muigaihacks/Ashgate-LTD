<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics for authenticated user
     * 
     * GET /api/dashboard/stats
     */
    public function stats(Request $request)
    {
        $user = Auth::user();

        // Property statistics
        $totalProperties = Property::where('user_id', $user->id)->count();
        $activeProperties = Property::where('user_id', $user->id)
            ->where('is_active', true)
            ->count();
        $saleProperties = Property::where('user_id', $user->id)
            ->where('listing_type', 'sale')
            ->where('is_active', true)
            ->count();
        $rentProperties = Property::where('user_id', $user->id)
            ->where('listing_type', 'rent')
            ->where('is_active', true)
            ->count();

        // Properties by status
        $availableProperties = Property::where('user_id', $user->id)
            ->where('status', 'available')
            ->where('is_active', true)
            ->count();
        $takenProperties = Property::where('user_id', $user->id)
            ->where('status', 'taken')
            ->where('is_active', true)
            ->count();
        $pendingProperties = Property::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('is_active', true)
            ->count();

        // Total views across all properties
        $totalViews = Property::where('user_id', $user->id)->sum('view_count');

        // Average price
        $avgPrice = Property::where('user_id', $user->id)
            ->where('is_active', true)
            ->avg('price');

        // Recent activity (last 5 properties created/updated)
        $recentProperties = Property::where('user_id', $user->id)
            ->latest('updated_at')
            ->limit(5)
            ->get(['id', 'title', 'listing_type', 'price', 'status', 'updated_at']);

        return response()->json([
            'data' => [
                'properties' => [
                    'total' => $totalProperties,
                    'active' => $activeProperties,
                    'sale' => $saleProperties,
                    'rent' => $rentProperties,
                ],
                'status' => [
                    'available' => $availableProperties,
                    'taken' => $takenProperties,
                    'pending' => $pendingProperties,
                ],
                'metrics' => [
                    'total_views' => (int) $totalViews,
                    'average_price' => round($avgPrice ?? 0, 2),
                ],
                'recent_properties' => $recentProperties,
            ]
        ]);
    }

    /**
     * Get user's properties (paginated)
     * 
     * GET /api/dashboard/properties
     */
    public function properties(Request $request)
    {
        $user = Auth::user();

        $query = Property::with(['images', 'amenities'])
            ->where('user_id', $user->id);

        // Filter by listing type
        if ($request->has('listing_type')) {
            $query->where('listing_type', $request->listing_type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(location_text) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $properties = $query->paginate($perPage);

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

}

