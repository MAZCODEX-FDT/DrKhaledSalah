<?php

use App\Models\User;
use App\Support\Sync;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('clinic:sync-youtube', function () {
    $this->info('New videos: '.Sync::youtube());
})->purpose('Pull new videos and view counts from the doctor\'s YouTube channel');

Artisan::command('clinic:sync-google', function () {
    Sync::google();
    $this->info('Google rating and reviews updated');
})->purpose('Pull the Google rating, review count and latest reviews');

Artisan::command('clinic:admin {email} {--name=Admin}', function (string $email) {
    $password = $this->secret('Password (at least 10 characters)');
    if (strlen((string) $password) < 10) {
        return $this->error('Too short');
    }
    User::updateOrCreate(['email' => $email], ['name' => $this->option('name'), 'password' => $password]);
    $this->info("Dashboard user {$email} is ready");
})->purpose('Create a dashboard user, or reset their password');

// Bluehost cron (every minute): php /home/USER/clinic/artisan schedule:run
Schedule::command('clinic:sync-google')->weekly()->mondays()->at('04:00')->timezone('Africa/Cairo')->withoutOverlapping();
Schedule::command('clinic:sync-youtube')->dailyAt('04:30')->timezone('Africa/Cairo')->withoutOverlapping();
