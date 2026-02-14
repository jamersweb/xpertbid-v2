<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'paymentMethod', 'token', 'is_default','bank_name','iban_number','swift_code','account_title','country_id','paypal_id','branch_address'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
