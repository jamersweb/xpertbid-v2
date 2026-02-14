<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void
{
    Schema::create('property_verifications', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('property_type');
        $table->string('property_address');
        $table->string('title_deed_number');
        $table->json('property_documents');        // store array of paths
        $table->string('country');
        $table->enum('status', ['not_verified','verified'])
              ->default('not_verified');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_verifications');
    }
};
