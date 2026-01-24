<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Spatie\Activitylog\Models\Activity;

class LogLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        if ($event->user) {
            // Prevent duplicate logging within 10 seconds
            $cacheKey = 'logout_logged_' . $event->user->id;
            if (Cache::has($cacheKey)) {
                return;
            }
            Cache::put($cacheKey, true, 10); // 10 seconds debounce
            
            activity('auth')
                ->causedBy($event->user)
                ->event('logout')
                ->log('User logged out');
        }
    }
}
