<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdentityVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'front_image',
        'back_image',
        'document_type',
        'issue_country',
        'full_name',
        'birth_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
