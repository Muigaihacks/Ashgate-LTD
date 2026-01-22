<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserListingResource\Pages;
use App\Models\Property;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UserListingResource extends Resource
{
    protected static ?string $model = Property::class; // Reuse the Property model

    protected static ?string $navigationIcon = 'heroicon-o-home-modern';
    protected static ?string $navigationGroup = 'Listings Management';
    protected static ?string $navigationLabel = 'User Listings';
    protected static ?string $slug = 'user-listings'; // Unique slug
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        // Only show listings that HAVE a user_id (meaning they belong to Agents/Owners, not Ashgate Admin)
        return parent::getEloquentQuery()->whereNotNull('user_id');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Listing Details')
                    ->schema([
                        Forms\Components\TextInput::make('title')->disabled()->dehydrated(false),
                        Forms\Components\TextInput::make('price')->numeric()->disabled()->dehydrated(false),
                        Forms\Components\TextInput::make('location_text')->disabled()->dehydrated(false),
                        Forms\Components\Select::make('status')
                            ->options(['available' => 'Available', 'sold' => 'Sold', 'taken' => 'Taken'])
                            ->disabled()
                            ->dehydrated(false),
                    ])->columns(2),
                
                Forms\Components\Section::make('Moderation')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Visible on Platform')
                            ->helperText('Disable this to hide the listing from the public user side.'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Owner/Agent')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('listing_type')
                    ->badge(),
                Tables\Columns\TextColumn::make('price')
                    ->money('KES'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Visible')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('listing_type')
                    ->options([
                        'sale' => 'Sale',
                        'rent' => 'Rent',
                    ]),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Visibility'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label('Moderate'),
                Tables\Actions\DeleteAction::make()
                    ->label('Remove Listing')
                    ->visible(fn () => auth()->user()->hasRole('super_admin')),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserListings::route('/'),
            'edit' => Pages\EditUserListing::route('/{record}/edit'),
        ];
    }
}
