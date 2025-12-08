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
        Schema::table('users', function (Blueprint $table) {
            // Removed organization_id - multi-tenancy not needed for initial launch
            // $table->foreignId('organization_id')->nullable()->after('id')->constrained('organizations')->onDelete('cascade');
            
            $table->enum('role', ['admin', 'landlord', 'agent', 'tenant', 'general'])->default('general')->after('email');
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('remember_token');
            
            // Indexes
            // $table->index('organization_id'); // Removed
            $table->index('role');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // $table->dropForeign(['organization_id']);
            $table->dropColumn(['role', 'phone', 'avatar', 'is_active']);
        });
    }
};
