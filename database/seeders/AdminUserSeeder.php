<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions if they don't exist (basic ones)
        // In a real app, Shield would generate these dynamically
        
        // Create Super Admin Role
        $role = Role::firstOrCreate(['name' => 'super_admin']);

        $user = User::firstOrCreate(
            ['email' => 'admin@ashgate.co.ke'],
            [
                'name' => 'Ashgate Super Admin',
                'password' => Hash::make('Ashgate@Admin2026!'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        $user->assignRole($role);
    }
}
