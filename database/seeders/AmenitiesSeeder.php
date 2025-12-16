<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Amenity;
use Illuminate\Support\Str;

class AmenitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            'Wi-Fi',
            'Washing Machine',
            'Backup Power',
            '24/7 Security',
            'Gym',
            'Pool',
            'Dishwasher',
        ];

        foreach ($amenities as $name) {
            Amenity::firstOrCreate(
                ['name' => $name],
                [
                    'slug' => Str::slug($name),
                    'is_active' => true,
                ]
            );
        }
    }
}
