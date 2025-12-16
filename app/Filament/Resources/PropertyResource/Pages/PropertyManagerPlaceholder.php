<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Resources\Pages\Page;

class PropertyManagerPlaceholder extends Page
{
    protected static string $resource = PropertyResource::class;

    protected static string $view = 'filament.resources.property-resource.pages.property-manager-placeholder';
}
