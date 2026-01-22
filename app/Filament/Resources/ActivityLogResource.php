<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ActivityLogResource\Pages;
use App\Models\ActivityLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static ?string $navigationGroup = 'Audit Logs';
    protected static ?string $navigationLabel = 'Audit Logs';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Action Info')
                            ->schema([
                                Forms\Components\TextInput::make('event')
                                    ->label('Action Type')
                                    ->formatStateUsing(fn ($state) => ucfirst($state))
                                    ->readOnly(),
                                Forms\Components\TextInput::make('created_at')
                                    ->label('Timestamp')
                                    ->formatStateUsing(fn ($state) => $state instanceof \DateTime ? $state->format('M j, Y H:i:s') : $state)
                                    ->readOnly(),
                                Forms\Components\TextInput::make('description')
                                    ->readOnly()
                                    ->columnSpanFull(),
                            ])->columns(2),

                        Forms\Components\Section::make('Changes')
                            ->schema([
                                Forms\Components\KeyValue::make('properties.attributes')
                                    ->label('New Values')
                                    ->disabled()
                                    ->dehydrated(false),
                                Forms\Components\KeyValue::make('properties.old')
                                    ->label('Old Values')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->visible(fn ($record) => isset($record->properties['old'])),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Performed By')
                            ->schema([
                                Forms\Components\TextInput::make('causer.name')
                                    ->label('User Name')
                                    ->placeholder('System')
                                    ->readOnly(),
                                Forms\Components\TextInput::make('causer.email')
                                    ->label('User Email')
                                    ->placeholder('System / Automated')
                                    ->readOnly(),
                                Forms\Components\TextInput::make('causer.roles.0.name')
                                    ->label('Role')
                                    ->placeholder('-')
                                    ->readOnly(),
                            ]),
                        
                        Forms\Components\Section::make('Login Details')
                            ->schema([
                                Forms\Components\TextInput::make('properties.ip_address')
                                    ->label('IP Address')
                                    ->readOnly()
                                    ->visible(fn ($record) => isset($record->properties['ip_address'])),
                                Forms\Components\TextInput::make('properties.device_type')
                                    ->label('Device Type')
                                    ->readOnly()
                                    ->visible(fn ($record) => isset($record->properties['device_type'])),
                                Forms\Components\TextInput::make('properties.device_name')
                                    ->label('Device/Browser')
                                    ->readOnly()
                                    ->visible(fn ($record) => isset($record->properties['device_name'])),
                                Forms\Components\TextInput::make('properties.location')
                                    ->label('Location')
                                    ->readOnly()
                                    ->visible(fn ($record) => isset($record->properties['location'])),
                            ])
                            ->visible(fn ($record) => in_array($record->event ?? '', ['login', 'logout', 'failed_login'])),
                        
                        Forms\Components\Section::make('Target Resource')
                            ->schema([
                                Forms\Components\TextInput::make('subject_type')
                                    ->label('Model')
                                    ->formatStateUsing(fn ($state) => class_basename($state))
                                    ->readOnly(),
                                Forms\Components\TextInput::make('subject_id')
                                    ->label('Record ID')
                                    ->readOnly(),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Timestamp')
                    ->dateTime('M j, Y H:i:s')
                    ->sortable()
                    ->width('200px'),
                
                Tables\Columns\TextColumn::make('causer.name')
                    ->label('Performed By')
                    ->searchable()
                    ->description(fn ($record) => $record->causer->email ?? 'System')
                    ->icon('heroicon-m-user'),

                Tables\Columns\TextColumn::make('event')
                    ->badge()
                    ->colors([
                        'success' => 'created',
                        'warning' => 'updated',
                        'danger' => 'deleted',
                        'gray' => 'restored',
                    ])
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                Tables\Columns\TextColumn::make('subject_type')
                    ->label('Module / Resource')
                    ->formatStateUsing(function ($state) {
                        return str($state)->afterLast('\\')->title();
                    })
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('description')
                    ->label('Action Summary')
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->description),
                
                Tables\Columns\TextColumn::make('properties.ip_address')
                    ->label('IP Address')
                    ->visible(fn ($record) => isset($record->properties['ip_address']))
                    ->badge()
                    ->color('gray'),
                
                Tables\Columns\TextColumn::make('properties.device_type')
                    ->label('Device')
                    ->visible(fn ($record) => isset($record->properties['device_type']))
                    ->badge()
                    ->color('info'),
                
                Tables\Columns\TextColumn::make('properties.location')
                    ->label('Location')
                    ->visible(fn ($record) => isset($record->properties['location']))
                    ->limit(30),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('event')
                    ->options([
                        'created' => 'Created',
                        'updated' => 'Updated',
                        'deleted' => 'Deleted',
                        'restored' => 'Restored',
                        'login' => 'Login',
                        'logout' => 'Logout',
                        'failed_login' => 'Failed Login',
                    ]),
                Tables\Filters\SelectFilter::make('subject_type')
                    ->label('Resource Type')
                    ->options([
                        'App\Models\Property' => 'Properties',
                        'App\Models\User' => 'Users',
                        'App\Models\Application' => 'Applications',
                        'App\Models\NewsArticle' => 'News Articles',
                        'App\Models\ExpertProfile' => 'Expert Profiles',
                    ]),
                Tables\Filters\SelectFilter::make('log_name')
                    ->label('Log Category')
                    ->options([
                        'auth' => 'Authentication',
                        'default' => 'General',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->poll('30s');
    }

    public static function canCreate(): bool
    {
        return false;
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
            'index' => Pages\ListActivityLogs::route('/'),
        ];
    }
}
