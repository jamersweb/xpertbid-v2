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
        Schema::create('dynamic_fields', function (Blueprint $col) {
            $col->id();
            $col->enum('listing_type', ['normal', 'auction', 'business', 'all'])->default('all');
            $col->foreignId('category_id')->nullable()->constrained('categories')->onDelete('cascade');
            $col->string('field_name');
            $col->string('label');
            $col->string('input_type'); // text, number, select, etc.
            $col->json('options')->nullable(); // For select/radio dropdown items
            $col->boolean('is_required')->default(false);
            $col->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dynamic_fields');
    }
};
