<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->string('username');
        $table->string('transaction_id');
        $table->decimal('paid_amount', 10, 2);
        $table->string('payment_for');
        $table->string('pay_through');
        $table->string('payment_status');
        $table->dateTime('datetime');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
