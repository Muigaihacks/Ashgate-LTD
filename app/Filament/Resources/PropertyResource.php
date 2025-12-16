<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PropertyResource\Pages;
use App\Models\Property;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PropertyResource extends Resource
{
    protected static ?string $model = Property::class;

    protected static ?string $navigationIcon = 'heroicon-o-home-modern';
    protected static ?string $navigationGroup = 'Modules';
    protected static ?string $navigationLabel = 'Ashgate Portfolio';
    protected static ?string $modelLabel = 'Ashgate Property';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Basic Info
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Property Name')
                            ->placeholder('e.g., Skyline Residence, Kiambu')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Select::make('listing_type')
                            ->options(['sale' => 'Sale', 'rent' => 'Rent'])
                            ->required(),
                        Forms\Components\TextInput::make('price')
                            ->numeric()
                            ->prefix('KES')
                            ->required(),
                        Forms\Components\Select::make('property_type') // Just a select for now, can be relation
                            ->options([
                                'House' => 'House',
                                'Apartment' => 'Apartment',
                                'Land' => 'Land',
                                'Commercial' => 'Commercial',
                            ]),
                        Forms\Components\Select::make('status')
                            ->options(['available' => 'Available', 'taken' => 'Taken', 'sold' => 'Sold'])
                            ->default('available')
                            ->required(),
                    ])->columns(2),

                // Location
                Forms\Components\Section::make('Location')
                    ->schema([
                        Forms\Components\TextInput::make('location_text')
                            ->label('Location Address')
                            ->placeholder('Kileleshwa, Nairobi, Kenya')
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('latitude')
                            ->numeric()
                            ->placeholder('-1.2921'),
                        Forms\Components\TextInput::make('longitude')
                            ->numeric()
                            ->placeholder('36.8219'),
                    ])->columns(2),

                // Specifications
                Forms\Components\Section::make('Property Specifications')
                    ->schema([
                        Forms\Components\TextInput::make('beds')
                            ->numeric()
                            ->label('Beds'),
                        Forms\Components\TextInput::make('baths')
                            ->numeric()
                            ->label('Baths'),
                        Forms\Components\TextInput::make('parking_spaces')
                            ->numeric()
                            ->label('Parking Spaces'),
                        Forms\Components\TextInput::make('area_sqm')
                            ->numeric()
                            ->label('Area (m²)'),
                    ])->columns(4),

                // Amenities
                Forms\Components\Section::make('Amenities')
                    ->schema([
                        Forms\Components\CheckboxList::make('amenities')
                            ->relationship('amenities', 'name')
                            ->columns(3)
                            ->gridDirection('row'),
                    ]),

                // Description
                Forms\Components\Section::make('Description')
                    ->schema([
                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                // Media
                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\Repeater::make('images')
                            ->relationship()
                            ->schema([
                                Forms\Components\FileUpload::make('url')
                                    ->label('Image')
                                    ->image()
                                    ->directory('property-images')
                                    ->required(),
                                Forms\Components\TextInput::make('alt_text')
                                    ->label('Alt Text (Optional)'),
                                Forms\Components\Toggle::make('is_primary')
                                    ->label('Primary Image'),
                            ])
                            ->grid(3)
                            ->columnSpanFull(),
                    ]),

                // Settings
                Forms\Components\Section::make('Settings')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Property'),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Visible on Site')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('price')->money('KES'),
                Tables\Columns\TextColumn::make('listing_type')->badge(),
                Tables\Columns\TextColumn::make('status')->badge(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'available' => 'Available',
                        'taken' => 'Taken',
                        'sold' => 'Sold',
                    ]),
                Tables\Filters\SelectFilter::make('listing_type')
                    ->options([
                        'sale' => 'Sale',
                        'rent' => 'Rent',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Visible'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListProperties::route('/'),
            'create' => Pages\CreateProperty::route('/create'),
            'edit' => Pages\EditProperty::route('/{record}/edit'),
        ];
    }
}
