<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('individual_verifications', function (Blueprint $table) {
            if (!Schema::hasColumn('individual_verifications', 'document_type')) {
                $table->string('document_type')->after('country')->nullable();
            }
            if (!Schema::hasColumn('individual_verifications', 'decline_reason')) {
                $table->text('decline_reason')->after('status')->nullable();
            }
        });

        Schema::table('corporate_verifications', function (Blueprint $table) {
            if (!Schema::hasColumn('corporate_verifications', 'decline_reason')) {
                $table->text('decline_reason')->after('status')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('individual_verifications', function (Blueprint $table) {
            $table->dropColumn(['document_type', 'decline_reason']);
        });

        Schema::table('corporate_verifications', function (Blueprint $table) {
            $table->dropColumn(['decline_reason']);
        });
    }
};
