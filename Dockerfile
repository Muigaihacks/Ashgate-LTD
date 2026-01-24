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

# Set permissions for Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Create Caddyfile for FrankenPHP
RUN echo '{\n\
    frankenphp\n\
    order php_server before file_server\n\
}\n\
\n\
:${PORT:8080} {\n\
    root * /app/public\n\
    encode zstd br gzip\n\
    php_server\n\
}' > /etc/caddy/Caddyfile

# Expose port
EXPOSE 8080

# Start script that runs migrations then starts FrankenPHP
CMD php artisan migrate --force && \
    php artisan storage:link 2>/dev/null || true && \
    php artisan config:clear && \
    php artisan config:cache && \
    frankenphp run --config /etc/caddy/Caddyfile
