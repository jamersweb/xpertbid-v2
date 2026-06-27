<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT', env('APP_URL') . '/auth/google/callback'),
    ],

    'apple' => [
        'client_id' => env('APPLE_CLIENT_ID'),
        'client_secret' => env('APPLE_CLIENT_SECRET'),
        'redirect' => env('APPLE_REDIRECT'),
    ],

    'exchange_rate_api' => [
        'url' => env('EXCHANGE_RATE_API_URL', 'https://open.er-api.com/v6/latest/USD'),
    ],

    'payfast' => [
        'merchant_id' => env('PAYFAST_MERCHANT_ID'),
        'secured_key' => env('PAYFAST_SECURED_KEY'),
        'merchant_name' => env('PAYFAST_MERCHANT_NAME', env('APP_NAME', 'XpertBid')),
        'currency' => env('PAYFAST_CURRENCY', 'PKR'),
        'sandbox' => (bool) env('PAYFAST_SANDBOX', false),
        'token_url' => env('PAYFAST_TOKEN_URL', 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken'),
        'post_url' => env('PAYFAST_POST_URL', 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction'),
    ],

];
