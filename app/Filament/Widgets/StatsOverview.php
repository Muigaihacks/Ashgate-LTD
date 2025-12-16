<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use App\Models\ExpertProfile;
use App\Models\Application;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Active Listings', Property::where('status', 'available')->count())
                ->description('Properties available for sale/rent')
                ->descriptionIcon('heroicon-m-home')
                ->color('success'),
            
            Stat::make('Verified Experts', ExpertProfile::where('is_verified', true)->count())
                ->description('Community professionals')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('primary'),
            
            Stat::make('Pending Applications', Application::where('status', 'pending')->count())
                ->description('Requires review')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('warning'),
                
            Stat::make('Registered Users', User::count())
                ->description('Total platform users')
                ->descriptionIcon('heroicon-m-users')
                ->color('gray'),
        ];
    }
}
