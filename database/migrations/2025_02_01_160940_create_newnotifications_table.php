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
        Schema::create('newnotifications', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('user_id');
            $table->string('title');
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->string('type')->after('message'); // e.g., 'wallet', 'bid'
            $table->string('image_url')->nullable()->after('type'); // Optional image URL
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newnotifications');
    }
    // public function down() {
    //     Schema::table('newnotifications', function (Blueprint $table) {
    //         $table->dropColumn(['type', 'image_url']);
    //     });
    // }
};
