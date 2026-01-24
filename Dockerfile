# Laravel application Dockerfile for Railway deployment
# Using FrankenPHP for production-ready serving
FROM dunglas/frankenphp:latest-php8.3

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (including intl and zip that Filament requires)
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    intl \
    zip \
    opcache \
    pcntl \
    bcmath \
    exif

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install PHP dependencies (without dev dependencies for production)
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Copy the rest of the application
COPY . .

# Run composer scripts after copying all files
RUN composer dump-autoload --optimize

# Publish Filament assets during build (before setting permissions)
RUN php artisan vendor:publish --tag=filament-config --force || true
RUN php artisan filament:assets || true

# Set permissions for Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port
EXPOSE 8080

# Create an entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Run migrations\n\
php artisan migrate --force\n\
\n\
# Run seeders (creates admin user if not exists)\n\
php artisan db:seed --force 2>/dev/null || true\n\
\n\
# Create storage link (ignore if exists)\n\
php artisan storage:link 2>/dev/null || true\n\
\n\
# Publish Filament assets\n\
php artisan filament:assets 2>/dev/null || true\n\
\n\
# Clear and rebuild caches with production env vars\n\
php artisan config:clear\n\
php artisan cache:clear\n\
php artisan route:clear\n\
php artisan view:clear\n\
\n\
# Start FrankenPHP\n\
exec frankenphp run --config /etc/caddy/Caddyfile\n\
' > /entrypoint.sh && chmod +x /entrypoint.sh

# Use the entrypoint script
CMD ["/entrypoint.sh"]
