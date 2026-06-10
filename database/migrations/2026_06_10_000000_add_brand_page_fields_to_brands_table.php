<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            if (!Schema::hasColumn('brands', 'banner_img')) {
                $table->string('banner_img')->nullable()->after('image');
            }

            if (!Schema::hasColumn('brands', 'banner_img_mob')) {
                $table->string('banner_img_mob')->nullable()->after('banner_img');
            }

            if (!Schema::hasColumn('brands', 'box_1_img')) {
                $table->string('box_1_img')->nullable()->after('banner_img_mob');
            }

            if (!Schema::hasColumn('brands', 'box_1_img_mob')) {
                $table->string('box_1_img_mob')->nullable()->after('box_1_img');
            }

            if (!Schema::hasColumn('brands', 'box_2_img')) {
                $table->string('box_2_img')->nullable()->after('box_1_img_mob');
            }

            if (!Schema::hasColumn('brands', 'box_2_img_mob')) {
                $table->string('box_2_img_mob')->nullable()->after('box_2_img');
            }

            if (!Schema::hasColumn('brands', 'box_3_img')) {
                $table->string('box_3_img')->nullable()->after('box_2_img_mob');
            }

            if (!Schema::hasColumn('brands', 'box_3_img_mob')) {
                $table->string('box_3_img_mob')->nullable()->after('box_3_img');
            }

            if (!Schema::hasColumn('brands', 'page_sections')) {
                $table->json('page_sections')->nullable()->after('box_3_img_mob');
            }
        });
    }

    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            foreach ([
                'page_sections',
                'box_3_img_mob',
                'box_3_img',
                'box_2_img_mob',
                'box_2_img',
                'box_1_img_mob',
                'box_1_img',
                'banner_img_mob',
                'banner_img',
            ] as $column) {
                if (Schema::hasColumn('brands', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
