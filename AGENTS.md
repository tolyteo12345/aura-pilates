# AGENTS.md

Guide for AI coding agents working in this repo. Human-facing setup lives in [README.md](README.md); roadmap in [MILESTONE.md](MILESTONE.md).

## What this is

Aura Pilates — a studio/gym management system forked from **LaraGym**. Three apps in one repo:

| App | Path | Stack | Dev port |
|---|---|---|---|
| REST API | repo root (`app/`, `routes/api.php`) | Laravel 9.52, Sanctum 3, spatie/laravel-query-builder 5, MySQL 8 | 8000 |
| Admin panel | `resources/apps/admin/` | SvelteKit 2 + **Svelte 5 (runes)**, Skeleton UI, Tailwind 3, axios | 5173 |
| Member PWA | `resources/apps/member/` | SvelteKit 2 + Svelte 5, Skeleton UI, Tailwind 3, vite-plugin-pwa, `fetch` | 5174 |

The root `package.json` / `vite.config.js` / `resources/js` are the unused Laravel default Vite setup — the frontends are the two SvelteKit apps, each with its own `package.json`.

Branding in code still says "LaraGym" (`laragym_token`, PWA manifest, package names). Don't rename unless asked.

## Running things

Docker is the default dev environment for the API (PHP 8.4 + MySQL + Redis + MailHog):

```bash
cp .env.example .env
docker compose up -d --build                 # first boot runs composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
```

- Run every PHP / artisan / composer command **inside the container**: `docker compose exec app <cmd>`.
- `docker-compose.yml` overrides `DB_HOST`, `REDIS_HOST` and `MAIL_HOST` for the `app` container, so `.env` keeps `127.0.0.1` and works for host-run PHP as well. Don't put `mysql` into `.env`.
- The API is served by `php -S` with Laravel's `server.php` (see `docker/php/Dockerfile`), **not** `php artisan serve`: in Laravel 9 `artisan serve` strips env vars from its child process, which would drop the compose overrides.
- PHP is 8.4 because `composer.lock` was resolved on 8.4 (some locked packages require `>=8.4`). Laravel 9 officially targets 8.0–8.2, so expect deprecation notices. Don't downgrade the image without regenerating the lock.
- Seeded admin: `admin@admin.com` / `password`. MailHog UI: http://localhost:8025.
- Frontends run on the host (Node): `cd resources/apps/<admin|member> && npm install && npm run dev`.

## Verifying changes

| Area | Command |
|---|---|
| API tests (PHPUnit, MySQL db `testing`) | `docker compose exec app ./vendor/bin/phpunit` |
| Single test | `docker compose exec app ./vendor/bin/phpunit --filter BranchStoreTest` |
| PHP style | `docker compose exec app ./vendor/bin/pint` (Laravel preset, no `pint.json`) |
| Admin | `npm run check`, `npm run lint`, `npm run test:unit` (vitest), `npm run test:integration` (playwright) |
| Member | `npm run check`, `npm run lint` (no test runner configured) |

- The `testing` database is created by `docker/mysql/init/01-create-testing-database.sql`, which only runs when `storage/mysql` is empty. On an existing data dir: `docker compose exec mysql mysql -uroot -e 'CREATE DATABASE IF NOT EXISTS testing'`.
- Known pre-existing failure: `Tests\Feature\Branch\BranchIndexTest::test_not_admin` expects 403, but `GET /api/branches` was intentionally opened to all authenticated users (Milestone 1). Not caused by your change.
- Tests use MySQL-specific SQL (`DatabaseSeeder` runs `SET foreign_key_checks`); don't switch the test DB to SQLite.

## Backend conventions

- **Routes**: `routes/api.php`, string controller syntax (`'BranchController@index'`, `apiResource('branches', 'BranchController')`) resolved against namespace `App\Http\Controllers\Api` (set in `RouteServiceProvider`). Follow that style; don't mix in `[Controller::class, 'method']`.
- **Auth**: Sanctum bearer tokens (`User::getPersonalAccessToken()`), no cookies/CSRF on the API. Groups: public `auth/*` → `auth:sanctum` (member `/me*`, `GET /branches`) → `admin` middleware (`App\Http\Middleware\UserAdmin`, checks `users.is_admin`, throws `AuthorizationException` → 403).
- **Controllers** (`app/Http/Controllers/Api/`): thin, return `response()->json(...)` directly (no API Resources). List endpoints use `QueryBuilder::for(Model::class)->allowedFilters(...)->paginate(request()->get('per_page', 15))->appends(request()->query())`.
- **Validation**: one FormRequest per write action in `app/Http/Requests/` (`Store*Request`, `Update*Request`, auth ones under `Requests/Auth/`). Controllers persist with `$request->only([...])`.
- **Business logic**: only auth has a service (`app/Services/UserAuthService.php`). Everything else lives in controllers/models; don't introduce repositories or new layers unless asked.
- **Models** (`app/Models/`): relations shared through traits in `app/Models/Traits/` (`HasUser`, `HasPackage`, `HasCycle`, …). Status strings live in `App\Models\Constants\StatusType` / `App\Constants` (`active`, `inactive`, `deleted`, `suspended`, `expired`) — reuse them.
- **Domain**: Branch, Cycle (billing cycle), Service, Package (cycle + many services), Subscription (user + package, with expiry), Attendance, Activity (audit log), Profile, user↔branch pivot `user_branch`.
- **Migrations**: add new files; never edit already-shipped migrations.
- **Tests**: Feature tests in `tests/Feature/<Resource>/<Resource><Action>Test.php` with `RefreshDatabase` + `Tests\UserSessionTrait` (`getAdminAuth()` / `getUserAuth()` return a `Bearer …` header). For each protected endpoint cover: 401 unauthenticated, 403 non-admin, 422 validation, success. Every model has a factory in `database/factories/`.

## Frontend conventions

**Admin** (`resources/apps/admin/`)
- API base URL from `PUBLIC_API_URL` (`$env/static/public`), axios via `useApi()` in `src/lib/api.js`.
- Login goes through SvelteKit server endpoints (`src/routes/(auth)/login/+server.js`) that call the API, reject non-admins and store the token in a `token` cookie. `hooks.server.js` redirects to `/login` without it; `(admin)/+layout.server.js` hands the token to the page, and `getBearerToken()` reads it from the `access_token` meta tag.
- State: one class-based store per resource with Svelte 5 runes (`$state`) in `src/lib/stores/*.store.svelte.js`, shared via `setContext`/`getContext`. Reuse the existing `*Select.svelte` and `Modal*.svelte` components.
- Formatting: Prettier with tabs, single quotes, `prettier-plugin-svelte` + tailwind plugin (`.prettierrc`).

**Member PWA** (`resources/apps/member/`)
- Plain `fetch` wrapper `apiFetch()` in `src/lib/api/client.js`; token in `localStorage` (`laragym_token`); auth state in `src/lib/stores/auth.js` (classic `writable`).
- In dev Vite proxies `/api` to `http://localhost:8000`, so `VITE_API_BASE_URL` stays empty; set it only for production builds.
- Route groups: `(auth)` for login/register/forgot/reset, `(app)` for authenticated screens with `BottomNav`.

## Working rules

- Keep changes surgical and in the existing style (4-space PHP, tabs in Svelte/JS per each app's Prettier config).
- Never commit `.env`, `vendor/`, `node_modules/`, `storage/mysql/` (all gitignored).
- When adding an API endpoint: route + FormRequest + controller method + feature test; if the admin or member app consumes it, update the matching store / `src/lib/api/*.js`.
- Update [MILESTONE.md](MILESTONE.md) checkboxes when finishing roadmap items.
