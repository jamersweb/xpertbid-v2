<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Excluded Routes (Public Safety & Payload Hygiene)
    |--------------------------------------------------------------------------
    */
    'except' => [
        'admin.*',
        'debugbar.*',
        'horizon.*',
        'telescope.*',
        'sanctum.*',
        'ignition.*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Route Groups for @routes('public') vs @routes('admin')
    |--------------------------------------------------------------------------
    */
    'groups' => [
        'public' => [
            '!admin.*',
            '!debugbar.*',
            '!horizon.*',
            '!telescope.*',
            '!sanctum.*',
            '!ignition.*',
            '!kyc.*',
            '!individual-verifications.*',
            '!corporate-verifications.*',
            '!verification.identity.store',
        ],
        'admin' => [
            '!debugbar.*',
            '!horizon.*',
            '!telescope.*',
            '!sanctum.*',
            '!ignition.*',
        ],
    ],
];


