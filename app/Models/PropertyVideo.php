<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyVideo extends Model
{
    protected $fillable = [
        'property_id',
        'url',
        'title',
        'description',
        'sort_order',
    ];

    protected static function boot()
    {
        parent::boot();

        // Prevent saving videos with null, empty, or invalid URLs
        static::saving(function ($video) {
            // Reject null or empty URLs
            if (empty($video->url) || $video->url === null || trim($video->url) === '') {
                return false; // Prevent save
            }
            // Reject arrays (Filament UUID structures from failed uploads)
            if (is_array($video->url)) {
                return false; // Prevent save
            }
            // Must be a string
            if (!is_string($video->url)) {
                return false; // Prevent save
            }
        });
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
