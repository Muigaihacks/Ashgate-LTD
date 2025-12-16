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
        Schema::table('news_articles', function (Blueprint $table) {
            $table->string('category')->nullable()->after('slug');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->string('platform')->nullable()->after('rating')->comment('e.g., Twitter, LinkedIn');
            $table->string('social_link')->nullable()->after('platform');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn(['platform', 'social_link']);
        });
    }
};
