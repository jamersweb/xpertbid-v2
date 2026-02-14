<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'type',
        'subject',
        'content',
    ];

    /**
     * Relationship example (if needed in the future).
     */
    public function relatedEntity()
    {
        // Example: If there is a related model, define the relationship here.
        // return $this->belongsTo(RelatedModel::class);
    }
}
