<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique();         // e.g., AED, PKR, USD
            $table->string('symbol', 10);                // e.g., د.إ, ₨, $
            $table->string('name');                      // e.g., UAE Dirham
            $table->unsignedTinyInteger('decimals')->default(2);
            $table->enum('position', ['left','right'])->default('left'); // symbol position
            $table->boolean('enabled')->default(true);
            // Optional (future) manual conversion: 1 AED → X (quote)
            $table->decimal('manual_rate_to_aed', 18, 8)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('currencies');
    }
};
