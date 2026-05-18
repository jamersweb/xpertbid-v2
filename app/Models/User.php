<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Auction;
use App\Models\Country;
use App\Models\Wallet;
use App\Models\Address;
use App\Models\IndividualVerification;
use App\Models\CorporateVerification;
use App\Models\NewNotification;
use App\Models\CustomerOutreach;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'phone',
        'role',
        'country_id',
        'city_id',
        'address',
        'status',
        'profile_pic',
        'vat_number',    // add karein
        'company_name',
        'referral_code',
        'referred_by',
        'api_token',  // add karein
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'provider',
        'provider_id',
        'signup_source',
        'is_phone_verified',
        'phone_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = ['password', 'remember_token', 'api_token'];

    /**
     * The attributes to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'address_line1',
        'address_line2',
        'city',
        'state',
        'country',
        'postal_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_phone_verified' => 'boolean',
        ];
    }
    protected static function booted()
    {
        static::creating(function ($user) {
            if (Schema::hasColumn('users', 'referral_code') && empty($user->referral_code)) {
                $base = Str::upper(Str::slug($user->name ?: 'USER', ''));
                $base = Str::limit($base !== '' ? $base : 'USER', 8, '');

                do {
                    $code = $base . random_int(1000, 9999);
                } while (static::query()->where('referral_code', $code)->exists());

                $user->referral_code = $code;
            }
        });

        // wallet create on user creation
        static::created(function ($user) {
            $user->wallet()->create(['balance' => 0]);
            $user->customerOutreach()->create([
                'call_status' => 'Pending',
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ]);
        });

        // Sync updates to CustomerOutreach
        static::updated(function ($user) {
            if ($user->customerOutreach) {
                $user->customerOutreach->update([
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ]);
            }
        });

        // soft-delete related auctions when user is soft-deleted
        static::deleting(function ($user) {
            $user->auctions()->delete();
        });
    }
    // define auctions relation
    public function auctions()
    {
        return $this->hasMany(Auction::class, 'user_id');
    }
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function shippingAddress()
    {
        return $this->hasOne(Address::class);
    }

    public function notifications()
    {
        return $this->hasOne(Notification::class);
    }

    public function identity_verification()
    {
        return $this->hasOne(IdentityVerification::class);
    }
    public function individualVerification()
    {
        return $this->hasOne(IndividualVerification::class);
    }

    public function corporateVerification()
    {
        return $this->hasOne(CorporateVerification::class);
    }

    public function NewNotification()
    {
        return $this->hasMany(NewNotification::class);
    }
    // In App\Models\User.php

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function referralRewards()
    {
        return $this->hasMany(ReferralReward::class, 'referrer_id');
    }

    public function earnedReferralRewards()
    {
        return $this->hasMany(ReferralReward::class, 'referred_user_id');
    }

    public function customerOutreach()
    {
        return $this->hasOne(CustomerOutreach::class);
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    /**
     * Accessors for frontend compatibility (mapping shippingAddress fields)
     */
    public function getAddressLine1Attribute()
    {
        return $this->shippingAddress->addressLine1 ?? null;
    }

    public function getAddressLine2Attribute()
    {
        return $this->shippingAddress->addressLine2 ?? null;
    }

    public function getCityAttribute()
    {
        return $this->shippingAddress->city ?? null;
    }

    public function getStateAttribute()
    {
        return $this->shippingAddress->state ?? null;
    }

    public function getCountryAttribute()
    {
        return $this->shippingAddress->country ?? null;
    }

    public function getPostalCodeAttribute()
    {
        return $this->shippingAddress->postalCode ?? null;
    }
}
