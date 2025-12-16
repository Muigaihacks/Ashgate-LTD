<?php

namespace App\Filament\Resources\ExpertProfileResource\Pages;

use App\Filament\Resources\ExpertProfileResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListExpertProfiles extends ListRecords
{
    protected static string $resource = ExpertProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
