<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alter payment_method enum to include bank_transfer
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_method ENUM('stripe', 'cod', 'bank_transfer') DEFAULT 'cod'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_method ENUM('stripe', 'cod') DEFAULT 'cod'");
    }
};

