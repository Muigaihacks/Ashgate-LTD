<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ApplicationResource\Pages;
use App\Models\Application;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use App\Mail\WelcomeCredentials;
use App\Mail\ExpertApplicationApproved;
use App\Models\ExpertProfile;
use App\Models\ExpertCategory;

class ApplicationResource extends Resource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationGroup = 'Verification Management';
    protected static ?string $navigationLabel = 'Applications';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Applicant Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\Select::make('type')
                            ->options([
                                'owner' => 'Property Owner',
                                'agent' => 'Real Estate Agent',
                                'expert' => 'Community Expert',
                            ])
                            ->required(),
                    ])->columns(2),

                Forms\Components\Section::make('Documents & Details')
                    ->schema([
                        Forms\Components\KeyValue::make('details')
                            ->label('Application Data (Raw)')
                            ->keyLabel('Field')
                            ->valueLabel('Value')
                            ->columnSpanFull(),
                            
                        // Helper view to show key details nicely if they exist
                        Forms\Components\Placeholder::make('structured_details')
                            ->label('Structured Details')
                            ->content(fn ($record) => new \Illuminate\Support\HtmlString(
                                '<strong>Profession:</strong> ' . ($record->details['profession'] ?? '-') . '<br>' .
                                '<strong>Serial Number:</strong> ' . ($record->details['serialNumber'] ?? '-') . '<br>' .
                                '<strong>Board:</strong> ' . ($record->details['professionalBoard'] ?? '-') . '<br>' .
                                '<strong>Experience:</strong> ' . ($record->details['yearsOfExperience'] ?? '-') . ' years<br>' .
                                '<strong>Bio:</strong> ' . ($record->details['bio'] ?? '-')
                            ))
                            ->visible(fn ($record) => $record && isset($record->details['profession'])),

                        Forms\Components\FileUpload::make('documents')
                            ->multiple()
                            ->disk('public')
                            ->directory('application-documents')
                            ->openable()
                            ->downloadable()
                            ->disabled() // Admin should view downloads here, not re-upload/modify applicant files
                            ->dehydrated(false) // Prevent re-uploading or modifying during simple view/edit
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Review Status')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required()
                            ->default('pending')
                            ->disabled(fn ($record) => $record && $record->status === 'approved'), // Disable if already approved
                        Forms\Components\Textarea::make('admin_notes')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->colors([
                        'primary' => 'owner',
                        'success' => 'agent',
                        'info' => 'expert',
                    ]),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ]),
                Tables\Columns\TextColumn::make('reviewer.name')
                    ->label('Reviewed By')
                    ->toggleable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'owner' => 'Property Owner',
                        'agent' => 'Real Estate Agent',
                        'expert' => 'Community Expert',
                    ])
                    ->label('Application Type'),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->label('Status'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label('Approve & Onboard')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Application $record) => $record->status === 'pending')
                    ->action(function (Application $record) {
                        // 1. Update Application Status
                        $record->update([
                            'status' => 'approved',
                            'reviewed_by' => auth()->id(),
                            'reviewed_at' => now(),
                        ]);

                        // --- EXPERT WORKFLOW ---
                        if ($record->type === 'expert') {
                            // Find or Create Expert Category
                            $professionSlug = Str::slug($record->details['profession'] ?? 'General');
                            $category = ExpertCategory::firstOrCreate(
                                ['slug' => $professionSlug],
                                [
                                    'name' => ucwords(str_replace('-', ' ', $professionSlug)),
                                    'is_active' => true
                                ]
                            );

                            // Create or Update Expert Profile
                            ExpertProfile::updateOrCreate(
                                ['email' => $record->email],
                                [
                                    'name' => $record->name,
                                    'phone' => $record->phone,
                                    'category_id' => $category->id,
                                    'registration_number' => $record->details['serialNumber'] ?? null,
                                    'description' => $record->details['bio'] ?? null,
                                    'location' => 'Nairobi, Kenya', // Default for now, ideally capture in form
                                    'is_verified' => true,
                                    'is_active' => true,
                                ]
                            );

                            try {
                                Mail::to($record->email)->send(new ExpertApplicationApproved($record));
                                Notification::make()
                                    ->title('Expert Approved & Profile Listed')
                                    ->body("Expert profile created and confirmation email sent to {$record->email}.")
                                    ->success()
                                    ->send();
                            } catch (\Exception $e) {
                                Notification::make()
                                    ->title('Approved but Email Failed')
                                    ->body("Profile created but email failed: {$e->getMessage()}")
                                    ->warning()
                                    ->send();
                            }
                            return;
                        }

                        // --- OWNER/AGENT WORKFLOW (User Account Creation) ---
                        // 2. Check if User exists
                        $existingUser = User::where('email', $record->email)->first();
                        
                        if ($existingUser) {
                            Notification::make()
                                ->title('User already exists')
                                ->body("A user with email {$record->email} already exists. Role updated.")
                                ->warning()
                                ->send();
                            
                            // Assign role if missing
                            $roleName = match($record->type) {
                                'owner' => 'property_owner',
                                'agent' => 'agent',
                                default => null,
                            };
                            if ($roleName) {
                                $existingUser->assignRole($roleName);
                            }
                            
                            return;
                        }

                        // 3. Create User Account (with temporary password that will be changed)
                        $tempPassword = Str::random(16); // Temporary password, user will set their own
                        
                        $user = User::create([
                            'name' => $record->name,
                            'email' => $record->email,
                            'phone' => $record->phone,
                            'password' => Hash::make($tempPassword), 
                            'is_active' => true,
                            'must_change_password' => true, // Force password change
                            'email_verified_at' => now(),
                        ]);

                        // 4. Assign Role
                        $roleName = match($record->type) {
                            'owner' => 'property_owner',
                            'agent' => 'agent',
                            default => null,
                        };
                        
                        if ($roleName) {
                            $user->assignRole($roleName);
                        }

                        // 5. Generate password setup token (using Laravel's password reset system)
                        $token = Password::createToken($user);

                        // 6. Send Welcome Email with password setup link
                        try {
                            Mail::to($user)->send(new WelcomeCredentials($user, $token));
                            
                            Notification::make()
                                ->title('Application Approved & Password Setup Email Sent')
                                ->body("User account created and password setup email sent to {$user->email}.")
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Account Created but Email Failed')
                                ->body("User created but email failed: {$e->getMessage()}")
                                ->warning()
                                ->persistent()
                                ->send();
                        }
                    }),
                    
                Tables\Actions\Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (Application $record) => $record->status === 'pending')
                    ->form([
                        Forms\Components\Textarea::make('reason')
                            ->label('Rejection Reason')
                            ->required(),
                    ])
                    ->action(function (Application $record, array $data) {
                        $record->update([
                            'status' => 'rejected',
                            'admin_notes' => $data['reason'],
                            'reviewed_by' => auth()->id(),
                            'reviewed_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Application Rejected')
                            ->success()
                            ->send();
                    }),
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
            'index' => Pages\ListApplications::route('/'),
            'create' => Pages\CreateApplication::route('/create'),
            'edit' => Pages\EditApplication::route('/{record}/edit'),
        ];
    }
}
