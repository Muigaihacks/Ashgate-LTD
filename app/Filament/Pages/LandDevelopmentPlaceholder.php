<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class LandDevelopmentPlaceholder extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-map';
    protected static ?string $navigationGroup = 'Modules';
    protected static ?string $navigationLabel = 'Land Advisory';
    protected static ?string $title = 'Land Development Advisory';
    protected static ?int $navigationSort = 3;

    protected static string $view = 'filament.pages.land-development-placeholder';
}
