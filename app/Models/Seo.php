<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo extends Model
{
    protected $fillable = [
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'og_image',
        'schema_markup',
        'canonical_url',
    ];
}
