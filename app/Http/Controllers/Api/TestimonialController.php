<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    /**
     * Get active testimonials
     */
    public function index(Request $request)
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        $testimonialsData = $testimonials->map(function ($testimonial) {
            // Extract initials from name
            $nameParts = explode(' ', $testimonial->name);
            $initials = '';
            if (count($nameParts) >= 2) {
                $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[count($nameParts) - 1], 0, 1));
            } else {
                $initials = strtoupper(substr($testimonial->name, 0, 2));
            }

            return [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'title' => $testimonial->role ?? 'Customer',
                'text' => $testimonial->content,
                'rating' => $testimonial->rating,
                'image' => $testimonial->image 
                    ? (str_starts_with($testimonial->image, 'http') 
                        ? $testimonial->image 
                        : Storage::disk(config('filesystems.default'))->url($testimonial->image))
                    : null,
                'initials' => $initials,
                'platform' => $testimonial->platform,
                'socialMedia' => $testimonial->social_link,
            ];
        });

        return response()->json([
            'data' => $testimonialsData
        ]);
    }
}
