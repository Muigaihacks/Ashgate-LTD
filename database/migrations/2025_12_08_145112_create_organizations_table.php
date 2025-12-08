<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * NOTE: Organizations table removed - multi-tenancy not needed for initial launch
     * This migration file is kept for future reference but will not create a table.
     * If multi-tenancy is needed later, uncomment and adjust as needed.
     */
    public function up(): void
    {
        // Multi-tenancy not required for current scope
        // Keeping this migration file for documentation
        // If needed later, uncomment:
        
        /*
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subdomain')->unique()->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable();
            $table->string('primary_color', 7)->default('#F59E0B');
            $table->boolean('is_active')->default(true);
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('slug');
            $table->index('subdomain');
            $table->index('is_active');
        });
        */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists('organizations');
    }
};
