<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Property extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'user_id',
        'property_type_id', // Needs PropertyType model, can be nullable if we use text
        'location_id',
        'title',
        'description',
        'listing_type',
        'property_type', // Category: House, Apartment, Commercial, Land
        'price',
        'currency',
        'status',
        'location_text',
        'latitude',
        'longitude',
        'beds',
        'baths',
        'parking_spaces',
        'area_sqm',
        'year_built',
        'has_3d_tour',
        'has_floor_plan',
        'floor_plan_url',
        '3d_tour_url',
        'broker',
        'view_count',
        'is_featured',
        'is_active',
        // 'amenities', // if using json but we use relation
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'has_3d_tour' => 'boolean',
        'has_floor_plan' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['title', 'status', 'price', 'is_active'])
        ->logOnlyDirty()
        ->dontSubmitEmptyLogs();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }
}
