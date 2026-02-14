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
        // Alter payment_status enum to include approved and declined for payment verification
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed', 'approved', 'declined') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending'");
    }
};
