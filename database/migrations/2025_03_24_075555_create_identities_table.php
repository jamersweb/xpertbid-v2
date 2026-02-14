<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIdentitiesTable extends Migration
{
    public function up()
    {
        Schema::create('identities', function (Blueprint $table) {
            $table->id();
            $table->enum("user_type", ["individual", "corporate"]);
            // Individual fields
            $table->string("full_legal_name")->nullable();
            $table->date("dob")->nullable();
            $table->string("nationality")->nullable();
            $table->string("residential_address")->nullable();
            $table->string("contact_number")->nullable();
            $table->string("email_address")->nullable();
            $table->json("id_documents")->nullable();
            // Corporate fields
            $table->string("legal_entity_name")->nullable();
            $table->string("registered_address")->nullable();
            $table->date("date_of_incorporation")->nullable();
            $table->string("entity_type")->nullable();
            $table->json("business_documents")->nullable();
            // Listing fields
            $table->enum("listing_type", ["none", "vehicle", "property"])->default("none");
            // Vehicle fields
            $table->string("vehicle_make_model")->nullable();
            $table->integer("year_of_manufacture")->nullable();
            $table->string("chassis_vin")->nullable();
            $table->json("vehicle_documents")->nullable();
            // Property fields
            $table->string("property_type")->nullable();
            $table->string("property_address")->nullable();
            $table->string("title_deed_number")->nullable();
            $table->json("property_documents")->nullable();
            // Location fields
            $table->string("country")->nullable();
            $table->string("state")->nullable();
            $table->string("city")->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists("identities");
    }
}
