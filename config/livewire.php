<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Livewire File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | Configure how Livewire handles temporary file uploads.
    | The 'max' rule value is in kilobytes.
    | Default: max:12288 (12MB)
    | We set it to 65536 (64MB) to match PHP upload limits.
    |
    */

    'temporary_file_upload' => [
        'disk' => 'local', // Explicitly use local disk
        'rules' => ['required', 'file', 'max:65536'], // 64MB in KB, relaxed validation
        'directory' => null,
        'middleware' => null,
        'preview_mimes' => [
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv',
        ],
        'max_upload_time' => 5, // Maximum time in minutes for an upload to take
        'cleanup' => true, // Clean up old temporary uploads
    ],

];
