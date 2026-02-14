<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identity extends Model
{
    use HasFactory;

    protected $fillable = [
      	"user_id",
        "user_type",
        "full_legal_name",
        "dob",
        "nationality",
        "residential_address",
        "contact_number",
        "email_address",
        "id_documents",
        "legal_entity_name",
        "registered_address",
        "date_of_incorporation",
        "entity_type",
        "business_documents",
        "listing_type",
        "vehicle_make_model",
        "year_of_manufacture",
        "chassis_vin",
        "vehicle_documents",
        "property_type",
        "property_address",
        "title_deed_number",
        "property_documents",
        "country",
        "state",
        "city",
      	"status"
    ];

    protected $casts = [
        "id_documents" => "array",
        "business_documents" => "array",
        "vehicle_documents" => "array",
        "property_documents" => "array",
    ];
}
