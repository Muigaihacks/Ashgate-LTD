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

        // Create Roles if they don't exist
        $ownerRole = Role::firstOrCreate(['name' => 'property_owner']);
        $agentRole = Role::firstOrCreate(['name' => 'agent']);
        $adminRole = Role::firstOrCreate(['name' => 'super_admin']); // Already exists from previous step probably

        // Define permissions relevant to user side (optional, as Shield handles resource permissions mostly for Admin Panel)
        // Ideally we define 'policies' that check for these roles/permissions.
    }
}
