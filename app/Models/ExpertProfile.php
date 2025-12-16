<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'user_id',
        'name',
        'tagline',
        'description',
        'location',
        'rating',
        'review_count',
        'email',
        'phone',
        'website',
        'logo',
        'is_verified',
        'is_active',
        'registration_number',
        'professional_board',
        'years_of_experience',
        'documents',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'rating' => 'decimal:2',
        'documents' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpertCategory::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
