<?php

$propertyOrigins = array_values(array_filter(array_unique([
    env('FRONTEND_PROPERTY_URL', 'https://property.xpertbid.com'),
    'https://property.xpertbid.com',
    'http://property.xpertbid.com',
    'https://www.property.xpertbid.com',
    'http://www.property.xpertbid.com',
    env('FRONTEND_RENOVATION_URL', 'https://build.xpertbid.com'),
    'https://build.xpertbid.com',
    'http://build.xpertbid.com',
    'https://www.build.xpertbid.com',
    'http://www.build.xpertbid.com',
    'https://home.xpertbid.com',
    'http://home.xpertbid.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
])));

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'HEAD', 'OPTIONS', 'POST'],

    'allowed_origins' => $propertyOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 60 * 60,

    'supports_credentials' => false,

];
