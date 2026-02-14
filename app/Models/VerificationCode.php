<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    use HasFactory;

    protected $fillable = ['email', 'code', 'expires_at'];

    public $timestamps = true;

    // Check if the code is expired
    public function isExpired()
    {
        return now()->greaterThan($this->expires_at);
    }
}
