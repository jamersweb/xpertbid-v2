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
        Schema::create('listings', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_id')->constrained()->onDelete('cascade');
            $col->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $col->enum('listing_type', ['normal', 'auction', 'business']);
            $col->string('title');
            $col->text('description')->nullable();
            $col->string('status')->default('active');
            
            // JSON columns for dynamic data
            $col->json('listing_data')->nullable(); // Stores auction prices/dates, business stock etc.
            $col->json('category_features')->nullable(); // Stores category physical attributes
            
            $col->timestamps();
            $col->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
