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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->decimal('total_cost', 15, 2);
            $table->decimal('advance_payment', 15, 2);
            $table->decimal('remaining_payment', 15, 2);
            $table->decimal('vat', 15, 2);
            $table->decimal('final_cost', 15, 2);
            $table->string('status')->default('In Progress'); // Paid, In Progress, Rejected
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
