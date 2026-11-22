<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The website content and the dashboard data are each stored as one JSON document,
 * the same shape the React app already uses. The dashboard document holds patient data and is encrypted.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('data');
            $table->unsignedInteger('revision')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
