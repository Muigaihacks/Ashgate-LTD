<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles if they don't exist.
        // IMPORTANT: roles must match the guard used by Filament/auth ('web' here).
        $guard = 'web';

        Role::firstOrCreate(['name' => 'property_owner', 'guard_name' => $guard]);
        Role::firstOrCreate(['name' => 'agent', 'guard_name' => $guard]);
        Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => $guard]);

        // Define permissions relevant to user side (optional, as Shield handles resource permissions mostly for Admin Panel)
        // Ideally we define 'policies' that check for these roles/permissions.
    }
}
