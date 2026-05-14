<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('referred_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->foreignId('listing_id')->nullable()->constrained('listings')->nullOnDelete();
            $table->string('trigger_type', 40);
            $table->string('source_type', 40);
            $table->unsignedBigInteger('source_id')->nullable();
            $table->decimal('amount_base', 15, 2)->default(0);
            $table->decimal('reward_percent', 5, 2)->default(1);
            $table->decimal('reward_amount', 15, 2)->default(0);
            $table->string('status', 30)->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->unique(['referred_user_id', 'source_type', 'source_id'], 'referral_rewards_source_unique');
            $table->index(['referrer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_rewards');
    }
};
