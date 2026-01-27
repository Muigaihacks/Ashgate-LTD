<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\DB;

class CreateProperty extends CreateRecord
{
    protected static string $resource = PropertyResource::class;
    protected static bool $canCreateAnother = false;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Admin-created properties have null user_id (Ashgate Portfolio)
        $data['user_id'] = null;
        
        // Map property_type string to property_type_id
        if (isset($data['property_type'])) {
            $propertyTypeName = $data['property_type'];
            $propertyTypeId = DB::table('property_types')
                ->where('name', $propertyTypeName)
                ->where('is_active', true)
                ->value('id');
            
            // If property type doesn't exist, create it
            if (!$propertyTypeId) {
                $slug = strtolower(str_replace(' ', '-', $propertyTypeName));
                $baseSlug = $slug;
                $counter = 1;
                while (DB::table('property_types')->where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $propertyTypeId = DB::table('property_types')->insertGetId([
                    'name' => $propertyTypeName,
                    'slug' => $slug,
                    'is_active' => true,
                    'sort_order' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            $data['property_type_id'] = $propertyTypeId;
        }
        
        // Set has_floor_plan and has_3d_tour flags if files are uploaded
        if (isset($data['floor_plan_url']) && !empty($data['floor_plan_url'])) {
            $data['has_floor_plan'] = true;
        }
        if (isset($data['3d_tour_url']) && !empty($data['3d_tour_url'])) {
            $data['has_3d_tour'] = true;
        }
        
        // Filter out videos with null/empty URLs (prevent saving empty video entries)
        if (isset($data['videos']) && is_array($data['videos'])) {
            $data['videos'] = array_filter($data['videos'], function($video) {
                return isset($video['url']) && !empty($video['url']);
            });
        }
        
        return $data;
    }
}
