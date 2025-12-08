<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Properties (Main Transactional Entity)
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed for initial launch
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Owner/Agent who created
            $table->foreignId('property_type_id')->constrained()->onDelete('restrict');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('listing_type', ['sale', 'rent']);
            $table->decimal('price', 15, 2);
            $table->string('currency', 3)->default('KES');
            $table->string('status')->default('available'); // available, taken, pending, sold
            
            // Location fields (denormalized for search performance)
            $table->string('location_text'); // Full address string
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Specifications
            $table->integer('beds')->nullable();
            $table->integer('baths')->nullable();
            $table->integer('parking_spaces')->nullable();
            $table->decimal('area_sqm', 10, 2)->nullable();
            $table->integer('year_built')->nullable();
            
            // Features
            $table->boolean('has_3d_tour')->default(false);
            $table->boolean('has_floor_plan')->default(false);
            $table->string('broker')->nullable(); // Agent/broker name if not direct owner
            
            // Metadata
            $table->integer('view_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            // Removed organization_id index - multi-tenancy not needed
            $table->index('user_id');
            $table->index('property_type_id');
            $table->index('listing_type');
            $table->index('status');
            $table->index('price');
            $table->index('is_featured');
            $table->index('is_active');
            $table->index(['latitude', 'longitude']); // For geospatial queries
            // Full-text search (PostgreSQL/MySQL only - SQLite doesn't support)
            if (config('database.default') !== 'sqlite') {
                $table->fullText(['title', 'description', 'location_text']);
            }
        });

        // Property Images (Transaction)
        Schema::create('property_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('url'); // Cloudinary URL or path
            $table->string('alt_text')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            $table->index('property_id');
            $table->index(['property_id', 'is_primary']);
        });

        // Property Amenities Junction (Transaction)
        Schema::create('property_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['property_id', 'amenity_id']);
            $table->index('property_id');
            $table->index('amenity_id');
        });

        // Inquiries (Transaction)
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message');
            $table->enum('status', ['new', 'contacted', 'resolved', 'archived'])->default('new');
            $table->text('admin_notes')->nullable();
            
            $table->timestamps();
            
            // Removed organization_id index
            $table->index('property_id');
            $table->index('status');
            $table->index('created_at');
        });

        // Appointments/Viewings (Transaction)
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->datetime('scheduled_at');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Removed organization_id index
            $table->index('property_id');
            $table->index('scheduled_at');
            $table->index('status');
        });

        // Property Views Tracking (Transaction)
        Schema::create('property_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('viewed_at');
            
            $table->index('property_id');
            $table->index('viewed_at');
            $table->index(['property_id', 'viewed_at']);
        });

        // Expert Profiles (Transaction)
        Schema::create('expert_profiles', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed
            $table->foreignId('category_id')->constrained('expert_categories')->onDelete('restrict');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('name');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('location');
            $table->decimal('rating', 3, 2)->default(0); // 0.00 to 5.00
            $table->integer('review_count')->default(0);
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Removed organization_id index
            $table->index('category_id');
            $table->index('is_active');
            // Full-text search (PostgreSQL/MySQL only - SQLite doesn't support)
            if (config('database.default') !== 'sqlite') {
                $table->fullText(['name', 'tagline', 'description']);
            }
        });

        // News Articles (Transaction - if considered transactional)
        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('view_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Removed organization_id index
            $table->index('slug');
            $table->index('status');
            $table->index('published_at');
            // Full-text search (PostgreSQL/MySQL only - SQLite doesn't support)
            if (config('database.default') !== 'sqlite') {
                $table->fullText(['title', 'excerpt', 'content']);
            }
        });

        // User Favorites (Transaction)
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['user_id', 'property_id']);
            $table->index('user_id');
            $table->index('property_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('expert_profiles');
        Schema::dropIfExists('property_views');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('property_amenities');
        Schema::dropIfExists('property_images');
        Schema::dropIfExists('properties');
    }
};
