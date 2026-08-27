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
    | Hide property LISTINGS from main site discovery
    |--------------------------------------------------------------------------
    |
    | When true, property-tree products are excluded from home, marketplace,
    | search, and related public feeds on xpertbid.com. Category navigation,
    | sell form, my-listings, chat, bids, and favorites stay unchanged.
    | Direct /product/{slug} URLs redirect to the property frontend.
    |
    */

    'hide_listings_from_main_site' => filter_var(
        env('HIDE_PROPERTY_LISTINGS_FROM_MAIN', true),
        FILTER_VALIDATE_BOOLEAN
    ),

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
