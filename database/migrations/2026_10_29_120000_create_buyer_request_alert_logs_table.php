<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyer_request_alert_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_request_id')->nullable()->constrained('buyer_requests')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('channel', 20); // email | whatsapp
            $table->string('alert_key', 40);
            $table->string('destination')->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->string('status', 20); // sent | failed | skipped
            $table->text('failure_reason')->nullable();
            $table->string('provider_response', 500)->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();

            $table->index('sent_at');
            $table->index(['channel', 'status']);
            $table->index('buyer_request_id');
            $table->index('alert_key');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyer_request_alert_logs');
    }
};
