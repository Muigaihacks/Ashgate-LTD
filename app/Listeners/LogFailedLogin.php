<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class LogFailedLogin
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        $ip = $this->request->ip();
        $userAgent = $this->request->userAgent();
        
        // Extract device info from user agent
        $deviceType = 'Unknown';
        $deviceName = 'Unknown';
        if ($userAgent) {
            if (preg_match('/Mobile|Android|iPhone|iPad/', $userAgent)) {
                $deviceType = 'Mobile';
            } elseif (preg_match('/Tablet|iPad/', $userAgent)) {
                $deviceType = 'Tablet';
            } else {
                $deviceType = 'Desktop';
            }
            
            // Try to extract browser/device name
            if (preg_match('/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/', $userAgent, $matches)) {
                $deviceName = $matches[1];
            } elseif (preg_match('/(iPhone|iPad|Android)/', $userAgent, $matches)) {
                $deviceName = $matches[1];
            }
        }

        // Get location from IP
        $location = $this->getLocationFromIP($ip);

        activity('auth')
            ->event('failed_login')
            ->withProperties([
                'email' => $event->credentials['email'] ?? null,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
                'device_type' => $deviceType,
                'device_name' => $deviceName,
                'location' => $location,
            ])
            ->log('Failed login attempt');
    }

    /**
     * Get location from IP address (basic implementation)
     */
    protected function getLocationFromIP($ip)
    {
        // Skip private/local IPs
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return 'Local Network';
        }

        try {
            $response = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,regionName,city");
            if ($response) {
                $data = json_decode($response, true);
                if (isset($data['status']) && $data['status'] === 'success') {
                    $parts = array_filter([$data['city'] ?? '', $data['regionName'] ?? '', $data['country'] ?? '']);
                    return implode(', ', $parts) ?: 'Unknown';
                }
            }
        } catch (\Exception $e) {
            // Silently fail
        }

        return 'Unknown';
    }
}
