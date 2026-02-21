<?php
/**
 * ONE-TIME SETUP SCRIPT - Run from browser when you have no terminal access.
 * URL: https://api.ashgate.co.ke/setup-once.php
 *
 * This will:
 * 1. Generate APP_KEY and show it (add to .env manually)
 * 2. Create storage link if possible
 *
 * DELETE THIS FILE AFTER USE for security.
 */

// Only allow running from command line or show simple message
if (php_sapi_name() !== 'cli') {
    // When run in browser: only generate key and show instructions
    $key = 'base64:' . base64_encode(random_bytes(32));
    header('Content-Type: text/plain; charset=utf-8');
    echo "ASHGATE ONE-TIME SETUP\n";
    echo "======================\n\n";
    echo "1. APP_KEY (add this to your .env file, replace the empty APP_KEY= line):\n\n";
    echo "APP_KEY=" . $key . "\n\n";
    echo "2. After adding APP_KEY to .env, run: php artisan config:clear\n";
    echo "   (If you have no terminal, ask your host for SSH or use cPanel Terminal.)\n\n";
    echo "3. DELETE THIS FILE (setup-once.php) after copying the key - for security.\n";
    exit;
}
