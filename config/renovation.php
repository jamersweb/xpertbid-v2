<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Home Renovation Root Category
    |--------------------------------------------------------------------------
    |
    | Listings under this category (and its 20 subcategories + 110 child categories)
    | are treated as Home Renovation items for the public API and frontend.
    |
    */

    'root_category_id' => (int) env('RENOVATION_ROOT_CATEGORY_ID', 1163),

    /*
    |--------------------------------------------------------------------------
    | Renovation Frontend URL
    |--------------------------------------------------------------------------
    */

    'frontend_url' => rtrim(env('FRONTEND_RENOVATION_URL', 'https://renovation.xpertbid.com'), '/'),

    /*
    |--------------------------------------------------------------------------
    | Featured flag for Renovation items
    |--------------------------------------------------------------------------
    */

    'featured_name' => 'renovation_featured',

    /*
    |--------------------------------------------------------------------------
    | Public attribute whitelist (from listing_data / category_features)
    |--------------------------------------------------------------------------
    */

    'attribute_keys' => [
        'service_type',        // e.g. Complete Renovation, Material Supply, Labor Only, Consultation
        'project_scope',       // e.g. Residential, Commercial, Industrial
        'area_sqft',           // Area in square feet
        'duration_days',       // Estimated project completion days
        'warranty_period',     // e.g. 1 Year, 5 Years, Lifetime
        'material_included',   // Boolean or string description
        'consultation_fee',    // Free or numeric amount
        'experience_years',    // Contractor experience
        'rating',              // Average customer rating
        'service_location',    // On-site / Workshop
        'packages',            // Package tiers (Basic, Standard, Premium)
        'map_url',
        'latitude',
        'longitude',
        'address',
    ],

];
