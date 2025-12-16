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
        Schema::table('expert_profiles', function (Blueprint $table) {
            $table->integer('years_of_experience')->nullable()->after('registration_number');
            $table->json('documents')->nullable()->after('years_of_experience');
            // 'professional_board' can be part of description or a new column? Let's add it.
            $table->string('professional_board')->nullable()->after('registration_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expert_profiles', function (Blueprint $table) {
            $table->dropColumn(['years_of_experience', 'documents', 'professional_board']);
        });
    }
};
