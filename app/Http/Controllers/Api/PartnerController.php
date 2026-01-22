<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    /**
     * Get active partner brands
     */
    public function index(Request $request)
    {
        $partners = Partner::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $partnersData = $partners->map(function ($partner) {
            return [
                'id' => $partner->id,
                'name' => $partner->name,
                'logo' => $partner->logo 
                    ? (str_starts_with($partner->logo, 'http') 
                        ? $partner->logo 
                        : asset('storage/' . $partner->logo))
                    : null,
                'website' => $partner->website,
            ];
        });

        return response()->json([
            'data' => $partnersData
        ]);
    }
}
