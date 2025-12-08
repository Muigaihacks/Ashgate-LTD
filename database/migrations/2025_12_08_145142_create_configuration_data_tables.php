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
        // System Settings (Configuration)
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed for initial launch
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->string('group')->default('general'); // general, email, payment, etc.
            $table->timestamps();
            
            // Removed organization_id from index
            $table->index('key');
            $table->index('group');
        });

        // Feature Flags (Configuration)
        Schema::create('feature_flags', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed for initial launch
            $table->string('key')->unique();
            $table->boolean('is_enabled')->default(false);
            $table->text('description')->nullable();
            $table->json('conditions')->nullable(); // Advanced conditions (e.g., percentage rollout)
            $table->timestamps();
            
            // Removed organization_id from index
            $table->index('key');
            $table->index('is_enabled');
        });

        // Email Templates (Configuration)
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed for initial launch
            $table->string('key')->unique();
            $table->string('subject');
            $table->text('body_html');
            $table->text('body_text')->nullable();
            $table->json('variables')->nullable(); // Available template variables
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Removed organization_id from index
            $table->index('key');
            $table->index('is_active');
        });

        // Notification Settings (Configuration)
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('email_inquiries')->default(true);
            $table->boolean('email_appointments')->default(true);
            $table->boolean('email_property_updates')->default(true);
            $table->boolean('email_marketing')->default(false);
            $table->boolean('sms_notifications')->default(false);
            $table->timestamps();
            
            $table->unique('user_id');
            $table->index('user_id');
        });

        // SEO Settings (Configuration)
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            // Removed organization_id - multi-tenancy not needed for initial launch
            // Single global SEO settings for the platform
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('og_image')->nullable();
            $table->string('twitter_card')->default('summary_large_image');
            $table->boolean('enable_structured_data')->default(true);
            $table->timestamps();
            
            // Removed unique organization_id constraint
            // Only one SEO settings record for the platform
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
        Schema::dropIfExists('notification_settings');
        Schema::dropIfExists('email_templates');
        Schema::dropIfExists('feature_flags');
        Schema::dropIfExists('system_settings');
    }
};
