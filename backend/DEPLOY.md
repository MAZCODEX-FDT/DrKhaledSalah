# Putting the site on Bluehost (shared hosting)

The website and its dashboard run as one Laravel app with a MySQL database.
Laravel 13 needs **PHP 8.3 or newer** (cPanel → MultiPHP Manager).

## What you upload

`clinic-server.zip`: the Laravel backend with the built website inside, `vendor/` included.

- From GitHub: Actions → "Bluehost package" → latest run → Artifacts → `clinic-server`.
- Or locally, from the project root: `npm ci && npm run package:server`.

## First setup (once)

1. **Database.** In cPanel → MySQL Databases, create a database and a user. Give the user all privileges on that database. Bluehost adds your cPanel prefix to both names, for example `abcd_clinic`.
2. **Upload.** In cPanel → File Manager, upload `clinic-server.zip` to your home folder (next to `public_html`, not inside it). Extract it. This gives `~/clinic/`.
3. **Point the domain at `clinic/public`.**
   - **Option A (recommended).** cPanel → Domains → manage the domain → set its document root to `clinic/public`.
   - **Option B.** Use this if the main domain must stay on `public_html`. Move `clinic/` into `public_html/clinic/`. Then copy `clinic/deploy/public_html.htaccess` to `public_html/.htaccess`.
4. **Settings.** In `clinic/`, copy `.env.example` to `.env` and fill in these values:
   - `APP_URL`: the live address, for example `https://drkhaledsalah.com`.
   - `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD`: from step 1.
   - Optionally `GOOGLE_PLACES_API_KEY` and `YOUTUBE_API_KEY`. Keys set here never reach the browser.
5. **Finish in Terminal.** Open cPanel → Terminal, or connect over SSH. Then run:
   ```
   cd ~/clinic
   php artisan key:generate
   php artisan migrate --force
   php artisan clinic:admin you@example.com --name="Hagar"
   php artisan config:cache && php artisan route:cache
   ```
   `clinic:admin` asks for a password of at least 10 characters. Run it again for each staff member. Running it again for an existing email resets that person's password.
6. **Cron.** In cPanel → Cron Jobs, add a job that runs every minute (`* * * * *`):
   ```
   cd ~/clinic && php artisan schedule:run >> /dev/null 2>&1
   ```
   This runs the Google rating and reviews refresh every Monday at 4:00 AM Cairo time, and the YouTube videos refresh every day at 4:30 AM.
7. **HTTPS.** Turn on cPanel → SSL/TLS Status → AutoSSL for the domain.

Open `/dashboard`, sign in, and the site's built-in content is published on your first sign-in. From then on, every save in Dashboard → Website goes live for all visitors.

## Updating the site later

1. Upload and extract the new zip over `~/clinic/`.
2. Your `.env` and the images uploaded from the dashboard (`public/uploads/`) are not in the zip, so they stay as they are.
3. Then run:
   ```
   cd ~/clinic && php artisan migrate --force && php artisan config:cache && php artisan route:cache
   ```

## What lives where

| What | Where |
|---|---|
| Website content (procedures, FAQs, branches, videos, articles…) | MySQL table `documents`, key `content` |
| Patients, appointments, inquiries, review requests | MySQL table `documents`, key `dashboard`. Encrypted with `APP_KEY`. |
| Dashboard staff accounts | MySQL table `users` |
| Images uploaded in the dashboard | `public/uploads/media/` |
| Sitemap and robots.txt | Built live at `/sitemap.xml` and `/robots.txt` |

**Back up two things.** The database (cPanel → Backup) and `public/uploads/`.

**Keep `.env` safe.** If `APP_KEY` changes or is lost, the encrypted patient data cannot be read.

## API (for reference)

| Method | Path | Who |
|---|---|---|
| GET | `/api/content` | public (API keys removed) |
| POST | `/api/inquiries` | public booking form (6 per minute per visitor) |
| POST | `/api/login` | staff sign-in, returns a 12-hour token (5 tries per minute) |
| GET / PUT | `/api/admin/content` | staff |
| GET / PUT | `/api/admin/dashboard` | staff |
| POST | `/api/admin/sync/google`, `/api/admin/sync/youtube` | staff ("Update now" buttons) |
| GET | `/api/admin/places?q=` | staff (find the clinic's Google listing) |
