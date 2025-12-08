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
        // Property Types (Master Data)
        Schema::create('property_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Apartment, House, Land, Commercial, Industrial
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable(); // Icon class or image
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('is_active');
        });

        // Amenities (Master Data)
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Wi-Fi, Security, Pool, Gym, etc.
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('is_active');
        });

        // Expert Categories (Master Data)
        Schema::create('expert_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Legal, Solar, Landscaping, etc.
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('is_active');
        });

        // Locations (Master Data - Reference)
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Area name
            $table->string('city'); // City name
            $table->string('county')->nullable(); // County/Region
            $table->string('country')->default('Kenya');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['city', 'name']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
        Schema::dropIfExists('expert_categories');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('property_types');
    }
};
