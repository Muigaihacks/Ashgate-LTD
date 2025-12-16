<?php

namespace App\Filament\Widgets;

use App\Models\Application;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingApplications extends BaseWidget
{
    protected static ?int $sort = 3;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Application::query()->where('status', 'pending')->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Applicant')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('review')
                    ->url(fn (Application $record): string => route('filament.admin.resources.applications.edit', $record))
                    ->icon('heroicon-m-eye')
                    ->button(),
            ])
            ->paginated(false);
    }
}
