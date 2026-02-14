<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehicleVerificationsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()            // references users.id
                  ->cascadeOnDelete();
            $table->string('vehicle_make_model');
            $table->integer('year_of_manufacture');
            $table->string('chassis_vin');
            $table->json('vehicle_documents'); // stores array of paths
            $table->string('country');
            $table->enum('status', ['not_verified', 'verified'])
                  ->default('not_verified');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_verifications');
    }
}
