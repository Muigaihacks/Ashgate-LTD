# Using MySQL/MariaDB on cPanel/InMotion (instead of PostgreSQL)

The **ashgate-database-schema.sql** file is for **PostgreSQL only**. If your host only has **MySQL or MariaDB** (common on cPanel/InMotion), **do not import that file** — it will fail with syntax errors.

Use Laravel migrations instead. Laravel will create all tables in the correct MySQL/MariaDB syntax.

---

## Steps for MySQL/MariaDB on cPanel

### 1. Create a MySQL database and user in cPanel

- In cPanel: **MySQL Databases** → create a database (e.g. `username_ashgate`) and a user with a password.
- Add the user to the database with **ALL PRIVILEGES**.

### 2. Configure Laravel to use MySQL

In the project `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_ashgate
DB_USERNAME=username_dbuser
DB_PASSWORD=your_password
```

(Use the exact database name, username, and host cPanel shows — sometimes the host is `localhost` or something like `localhost:/tmp/mysql.sock`.)

### 3. Run migrations (creates all tables)

```bash
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
```

This creates all tables in MySQL/MariaDB. No SQL file import needed.

### 4. Create the first admin user

```bash
php artisan tinker
```

Then in Tinker:

```php
$u = new \App\Models\User();
$u->name = 'Admin';
$u->email = 'admin@ashgate.co.ke';
$u->password = bcrypt('YourStrongPassword');
$u->email_verified_at = now();
$u->save();
exit
```

---

## Summary

| If you have…        | Do this |
|---------------------|--------|
| **PostgreSQL**      | Create DB, import `ashgate-database-schema.sql`, set `DB_CONNECTION=pgsql` in `.env`. |
| **MySQL/MariaDB**   | Create DB, set `DB_CONNECTION=mysql` in `.env`, run `php artisan migrate`. Do **not** import the .sql file. |

The `.sql` file we provide is **PostgreSQL-only**. For MySQL/MariaDB, use migrations.
