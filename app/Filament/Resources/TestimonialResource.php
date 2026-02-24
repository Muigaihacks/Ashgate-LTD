<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Content Management';
    protected static ?string $navigationLabel = 'Testimonials';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Testimonial Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('role')
                            ->label('Role / Title')
                            ->placeholder('e.g. Property Owner, Nairobi')
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('image')
                            ->avatar()
                            ->image()
                            ->disk(config('filesystems.default'))
                            ->directory('testimonials')
                            ->imageEditor(),
                        Forms\Components\TextInput::make('rating')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(5)
                            ->default(5)
                            ->required(),
                        Forms\Components\Textarea::make('content')
                            ->rows(4)
                            ->columnSpanFull()
                            ->required(),
                    ])->columns(2),
                
                Forms\Components\Section::make('Social Proof')
                    ->schema([
                        Forms\Components\Select::make('platform')
                            ->options([
                                'Twitter' => 'Twitter',
                                'LinkedIn' => 'LinkedIn',
                                'Facebook' => 'Facebook',
                                'Instagram' => 'Instagram',
                            ])
                            ->placeholder('Select Platform'),
                        Forms\Components\TextInput::make('social_link')
                            ->url()
                            ->prefix('https://')
                            ->placeholder('twitter.com/username'),
                    ])->columns(2),

                Forms\Components\Section::make('Settings')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Visible on Site')
                            ->default(true),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Testimonial $record): string => $record->role ?? ''),
                Tables\Columns\TextColumn::make('rating')
                    ->badge()
                    ->color('warning')
                    ->icon('heroicon-m-star'),
                Tables\Columns\TextColumn::make('platform')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('platform')
                    ->options([
                        'Twitter' => 'Twitter',
                        'LinkedIn' => 'LinkedIn',
                        'Facebook' => 'Facebook',
                        'Instagram' => 'Instagram',
                    ]),
                Tables\Filters\Filter::make('high_rating')
                    ->query(fn ($query) => $query->where('rating', '>=', 4))
                    ->label('High Rating (4+)'),
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
