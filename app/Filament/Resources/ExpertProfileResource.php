<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExpertProfileResource\Pages;
use App\Models\ExpertProfile;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ExpertProfileResource extends Resource
{
    protected static ?string $model = ExpertProfile::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'Content Management';
    protected static ?string $navigationLabel = 'Expert Profiles';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Professional Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\TextInput::make('tagline')
                            ->maxLength(255)
                            ->placeholder('e.g. Property transfers, due diligence & titles'),
                        Forms\Components\Textarea::make('description')
                            ->label('Bio / Service Description')
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('location')
                            ->required()
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Contact & Verification')
                    ->schema([
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('website')
                            ->url()
                            ->prefix('https://'),
                        Forms\Components\TextInput::make('registration_number')
                            ->label('Prof. Serial Number'),
                        Forms\Components\TextInput::make('professional_board')
                            ->label('Board / Association'),
                        Forms\Components\TextInput::make('years_of_experience')
                            ->numeric()
                            ->suffix('years'),
                    ])->columns(3),

                Forms\Components\Section::make('Documents')
                    ->schema([
                        Forms\Components\FileUpload::make('documents')
                            ->multiple()
                            ->directory('expert-documents')
                            ->downloadable()
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_verified')
                            ->label('Verified Professional')
                            ->default(false),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Visible on Site')
                            ->default(true),
                        Forms\Components\TextInput::make('rating')
                            ->numeric()
                            ->default(0)
                            ->maxValue(5),
                    ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->badge(),
                Tables\Columns\TextColumn::make('location')
                    ->icon('heroicon-m-map-pin'),
                Tables\Columns\TextColumn::make('registration_number')
                    ->label('Serial No.')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\IconColumn::make('is_verified')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Verified'),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
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
            'index' => Pages\ListExpertProfiles::route('/'),
            'create' => Pages\CreateExpertProfile::route('/create'),
            'edit' => Pages\EditExpertProfile::route('/{record}/edit'),
        ];
    }
}
