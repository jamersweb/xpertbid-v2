<?php
require __DIR__ . '/vendor/autoload.php';

if (class_exists('Pusher\Pusher')) {
    echo "SUCCESS: Pusher\Pusher exists." . PHP_EOL;
} else {
    echo "FAILURE: Pusher\Pusher not found." . PHP_EOL;
    // Check if the directory exists
    if (is_dir(__DIR__ . '/vendor/pusher/pusher-php-server')) {
        echo "Directory vendor/pusher/pusher-php-server exists." . PHP_EOL;
    } else {
        echo "Directory vendor/pusher/pusher-php-server MISSING." . PHP_EOL;
    }
}
