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
        // Applications for Authorization (Owners, Agents, Experts)
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['owner', 'agent', 'expert']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            
            $table->string('name');
            $table->string('email')->index();
            $table->string('phone')->nullable();
            
            // Flexible columns for type-specific data
            $table->json('details')->nullable(); // Company name, license number, expert category, etc.
            $table->json('documents')->nullable(); // Paths to uploaded IDs, certificates, etc.
            
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });

        // Testimonials for User Frontend
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable(); // e.g., "Homeowner", "Tenant"
            $table->text('content');
            $table->string('image')->nullable();
            $table->integer('rating')->default(5);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Partner Brands
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo');
            $table->string('website')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('applications');
    }
};
