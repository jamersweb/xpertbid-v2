<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Property Root Category
    |--------------------------------------------------------------------------
    |
    | Listings under this category (and its sub/child tree) are treated as
    | properties for the public Property API and property.xpertbid.com site.
    |
    */

    'root_category_id' => (int) env('PROPERTY_ROOT_CATEGORY_ID', 222),

    /*
    |--------------------------------------------------------------------------
    | Property Frontend URL
    |--------------------------------------------------------------------------
    */

    'frontend_url' => rtrim(env('FRONTEND_PROPERTY_URL', 'https://property.xpertbid.com'), '/'),

    /*
    |--------------------------------------------------------------------------
    | Featured flag
    |--------------------------------------------------------------------------
    */

    'featured_name' => 'realstate_featured',

    /*
    |--------------------------------------------------------------------------
    | Public attribute whitelist (from listing_data / category_features)
    |--------------------------------------------------------------------------
    */

    'attribute_keys' => [
        'property_type',
        'bedrooms',
        'bathrooms',
        'size_sqft',
        'area',
        'area_unit',
        'purpose',
        'furnished',
        'parking',
        'floors',
        'year_built',
        'map_url',
        'latitude',
        'longitude',
        'address',
    ],

];
