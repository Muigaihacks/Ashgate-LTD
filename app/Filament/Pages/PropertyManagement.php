<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class PropertyManagement extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationGroup = 'Modules';
    protected static ?string $navigationLabel = 'Property Management';
    protected static ?string $title = 'Ashgate Property Manager';
    protected static ?int $navigationSort = 2;

    protected static string $view = 'filament.pages.property-management';
}
