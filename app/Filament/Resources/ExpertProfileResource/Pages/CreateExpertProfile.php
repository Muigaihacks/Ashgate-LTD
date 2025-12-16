<?php

namespace App\Filament\Resources\ExpertProfileResource\Pages;

use App\Filament\Resources\ExpertProfileResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateExpertProfile extends CreateRecord
{
    protected static string $resource = ExpertProfileResource::class;
    protected static bool $canCreateAnother = false;
}
