<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('store_name');
            $table->string('store_logo_url')->nullable();
            $table->string('favicon_url')->nullable();
            $table->string('primary_color')->default('#8B7355');
            $table->string('secondary_color')->nullable();
            $table->string('hero_title')->default('ATELYA');
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_cta_primary_text')->nullable();
            $table->string('hero_cta_primary_url')->nullable();
            $table->string('hero_cta_secondary_text')->nullable();
            $table->string('hero_cta_secondary_url')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->text('address')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('tiktok')->nullable();
            $table->boolean('shipping_enabled')->default(true);
            $table->decimal('shipping_flat_rate', 10, 2)->nullable();
            $table->decimal('tax_rate', 10, 2)->nullable();
            $table->string('currency')->default('MAD');
            $table->boolean('maintenance_mode')->default(false);
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
