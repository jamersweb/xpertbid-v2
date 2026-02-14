<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCorporateVerificationsTable extends Migration
{
    public function up()
    {
        Schema::create('corporate_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->string('legal_entity_name');
            $table->string('registered_address');
            $table->date('date_of_incorporation');
            $table->string('entity_type');
            $table->json('business_documents'); // store uploaded paths as JSON
            $table->string('country');
            $table->string('status')
                  ->default('not_verified')
                  ->comment('not_verified or verified');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('corporate_verifications');
    }
}
