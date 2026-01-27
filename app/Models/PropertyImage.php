<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'url',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    protected $appends = ['full_url'];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the full URL for the image
     */
    public function getFullUrlAttribute()
    {
        if (!$this->attributes['url'] ?? null) {
            return null;
        }
        
        $url = $this->attributes['url'];
        
        // If it's already a full URL, return it
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }
        
        // Otherwise, generate storage URL
        try {
            return Storage::disk('public')->url($url);
        } catch (\Exception $e) {
            // Fallback to manual URL construction
            $baseUrl = rtrim(config('app.url'), '/');
            return $baseUrl . '/storage/' . ltrim($url, '/');
        }
    }
}
