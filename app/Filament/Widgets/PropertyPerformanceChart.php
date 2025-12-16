<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Property;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class PropertyPerformanceChart extends ChartWidget
{
    protected static ?string $heading = 'Property Performance';
    
    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $data = Trend::model(Property::class)
            ->between(
                start: now()->subMonth(),
                end: now(),
            )
            ->perDay()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'New Properties',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

