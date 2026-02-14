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
        // Drop it first to ensure we start clean (fixes issues if table exists with wrong schema)
        Schema::dropIfExists('email_logs');

        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('recipient_email');
            $table->string('subject');
            $table->string('type')->nullable(); // e.g. "BidOutbidNotification"
            $table->timestamp('sent_at')->useCurrent();
            $table->string('status')->default('sent');
            $table->timestamps();

            $table->index('user_id');
            $table->index('recipient_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
