<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditProperty extends EditRecord
{
    protected static string $resource = PropertyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Set has_floor_plan and has_3d_tour flags if files are uploaded
        if (isset($data['floor_plan_url']) && !empty($data['floor_plan_url'])) {
            $data['has_floor_plan'] = true;
        } else {
            $data['has_floor_plan'] = false;
        }
        
        if (isset($data['3d_tour_url']) && !empty($data['3d_tour_url'])) {
            $data['has_3d_tour'] = true;
        } else {
            $data['has_3d_tour'] = false;
        }
        
        return $data;
    }
}
