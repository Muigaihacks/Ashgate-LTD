<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use App\Models\PropertyVideo;

class EditProperty extends EditRecord
{
    protected static string $resource = PropertyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load existing videos into the file upload field
        $data['video_files'] = $this->record->videos->pluck('url')->toArray();
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Set has_floor_plan and has_3d_tour flags if files are uploaded
        if (isset($data['floor_plan_url']) && !empty($data['floor_plan_url'])) {
            $data['has_floor_plan'] = true;
        } else {
            $data['has_floor_plan'] = false;
        }
        
        if (isset($data['3d_tour_url']) && !empty($data['3d_tour_url'])) {
            $data['has_3d_tour'] = true;
        } else {
            $data['has_3d_tour'] = false;
        }
        
        return $data;
    }
    
    protected function afterSave(): void
    {
        // Handle video files sync
        $uploadedFiles = $this->data['video_files'] ?? [];
        
        // 1. Get existing videos
        $existingVideos = $this->record->videos;
        $existingUrls = $existingVideos->pluck('url')->toArray();
        
        // 2. Delete videos that are no longer in the uploaded list
        $videosToDelete = $existingVideos->filter(function ($video) use ($uploadedFiles) {
            return !in_array($video->url, $uploadedFiles);
        });
        
        foreach ($videosToDelete as $video) {
            $video->delete();
        }
        
        // 3. Create new videos
        foreach ($uploadedFiles as $file) {
            if (!in_array($file, $existingUrls)) {
                PropertyVideo::create([
                    'property_id' => $this->record->id,
                    'url' => $file,
                    'title' => 'Video', // Default title
                    'sort_order' => 0
                ]);
            }
        }
    }
}
