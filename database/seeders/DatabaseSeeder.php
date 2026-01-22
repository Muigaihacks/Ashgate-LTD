<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\AmenitiesSeeder;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\RolesSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core seed data needed for the app + admin panel workflows
        $this->call([
            RolesSeeder::class,
            AdminUserSeeder::class,
            AmenitiesSeeder::class,
        ]);

        // Optional: keep a simple test user (non-admin) for local dev
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
