# Dev image for the Laravel API.
# PHP 8.4 because composer.lock was resolved on 8.4 (doctrine/instantiator 2.1,
# symfony/css-selector 8 require >=8.4), even though Laravel 9 officially targets 8.0–8.2.
FROM php:8.4-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip bcmath pcntl \
    && pecl install redis && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/* /tmp/pear

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Match the host user's UID/GID so files written into the bind mount
# (vendor/, storage/) stay owned by you on Linux. Harmless on macOS.
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} app && useradd -m -u ${UID} -g ${GID} app

WORKDIR /var/www/html
USER app

EXPOSE 8000

# Install PHP deps on first boot if vendor/ is missing, then start the API.
# Intentionally PHP's built-in dev server (not php-fpm + nginx): good enough for
# local development; PHP_CLI_SERVER_WORKERS (docker-compose.yml) lets it serve
# requests in parallel. Use php-fpm + a web server for staging/production.
# Not `php artisan serve`: in Laravel 9 it strips env vars from the child server,
# so the DB_HOST/REDIS_HOST overrides from docker-compose.yml would be lost.
# server.php resolves the public dir from the CWD, hence `cd public`.
CMD ["sh", "-c", "[ -f vendor/autoload.php ] || composer install; cd public && exec php -S 0.0.0.0:8000 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php"]
