# Deploy Ashgate Backend + Database on Google Cloud Platform – Full Guide

This guide assumes you have **never used GCP before**. We set up **one VM** with **Laravel + MySQL** and get **https://api.ashgate.co.ke/admin** working.

**Database:** We use **MySQL** on the same VM (same as the MariaDB setup you did for cPanel). You do **not** need to switch back to PostgreSQL. Your existing `.env` (DB_CONNECTION=mysql, etc.) and the **ashgate-database-schema-mariadb.sql** file work as-is.

---

# FREE TIER: When you get billed (Compute Engine)

To stay **within the free tier** and avoid charges:

| What | Free tier limit | If you exceed it |
|------|------------------|-------------------|
| **VM** | **1 × e2-micro** instance, **only** in these US regions: **us-east1** (South Carolina), **us-central1** (Iowa), **us-west1** (Oregon) | Billed for the VM (e.g. if you use europe-west1 or a bigger machine) |
| **VM uptime** | Free for **all hours in the month** (one e2-micro 24/7 in an eligible region) | No extra charge for 24/7 in eligible region |
| **Boot disk** | Standard persistent disk in the same US region; keep it **small** (e.g. 10–30 GB). Excess disk is billed | Billed for extra GB beyond free allowance |
| **Outbound traffic** | First **1 GB/month** (to North America) is often free; egress beyond can be billed | Billed for extra egress (downloads/API traffic to users) |

**Practical rules:**

- **Region:** Create the VM in **us-central1**, **us-east1**, or **us-west1** so the e2-micro is free.
- **Machine type:** Use **e2-micro** only (not e2-small).
- **Disk:** Use a **10–20 GB** boot disk; avoid large disks if you want to stay free.
- **New accounts:** You also get a **$300 free trial for 90 days**. During the trial you’re not billed; after that, only usage **above** the free tier limits is billed.

So: **one e2-micro in us-central1 (or us-east1 / us-west1), small disk, normal API traffic** = typically $0. Once you add a second VM, or use a non‑US region, or a bigger machine, you start being billed. See [Google Cloud Free Tier](https://cloud.google.com/free/docs/free-cloud-features) for the official limits.

---

# PART 0: Google Cloud account and billing

1. Go to **https://cloud.google.com/** and sign in with your Google account (or create one).
2. Click **Get started for free** or **Try for free**.
3. You will be asked for:
   - **Country** and **Terms of Service** – accept.
   - **Billing:** Google requires a billing account (card) even for free tier. You will **not** be charged as long as you stay within the free tier (e.g. one e2-micro VM in an eligible region). Set up billing if prompted.
4. After that, go to **https://console.cloud.google.com/**. You should see the Cloud Console.

---

# PART 1: Create a project and enable Compute Engine

1. At the top of the console, click the **project dropdown** (it may say “Select a project” or show a project name).
2. Click **New Project**.
   - **Project name:** e.g. `ashgate-prod`
   - **Location:** leave as “No organization” if you’re personal. Click **Create**.
3. Wait for the project to be created, then **select that project** from the dropdown.
4. Open the **navigation menu** (☰ top left) → **APIs & Services** → **Library**.
5. Search for **Compute Engine API** → click it → click **Enable** (for the project you just created).

---

# PART 2: Create the VM (step by step)

1. In the left menu go to **Compute Engine** → **VM instances**.
2. If prompted, click **Enable** for Compute Engine API (if you didn’t in Part 1).
3. Click **CREATE INSTANCE** at the top.

Fill in the form as follows:

- **Name:** `ashgate-backend` (or any name you like).
- **Region:** For **free tier**, you must use one of: **us-central1** (Iowa), **us-east1** (South Carolina), or **us-west1** (Oregon). Other regions (e.g. europe-west1) will bill you for the VM. Pick e.g. **us-central1**.
- **Zone:** Leave default (e.g. `us-central1-a`).
- **Machine configuration:**
  - **Series:** E2.
  - **Machine type:** **e2-micro** (0.25 vCPU, 1 GB memory – free tier eligible in eligible regions). If you need more power later, you can use e2-small (paid).
- **Boot disk:** Click **Change**:
  - **Operating system:** Ubuntu.
  - **Version:** Ubuntu 22.04 LTS.
  - **Boot disk type:** Standard persistent disk.
  - **Size:** 20 GB (or 10 GB minimum).
  - Click **Select**.
- **Firewall:**
  - Check **Allow HTTP traffic**.
  - Check **Allow HTTPS traffic**.

Do **not** enable “Allow HTTPS traffic” from a load balancer unless you know you need it; the two checkboxes above are enough for now.

4. Click **Create** at the bottom. Wait until the VM shows a green tick and an **External IP** (e.g. `34.xxx.xxx.xxx`). Note this IP; you’ll use it for DNS and for testing.

---

# PART 3: Reserve a static IP (so the IP doesn’t change)

1. In the left menu: **VPC network** → **IP addresses**.
2. At the top, click **Reserve external static address**.
3. **Name:** e.g. `ashgate-api-ip`.
4. **Region:** Must be the **same region** as your VM (e.g. `us-central1`).
5. **Attach to:** Choose **VM instance** and select your `ashgate-backend` VM.
6. Click **Reserve**. The new static IP will be listed. **Use this IP** for DNS (e.g. A record for `api.ashgate.co.ke`). If you had an ephemeral IP before, the VM will now show this static one.

---

# PART 4: Connect to the VM with SSH (terminal)

1. Go to **Compute Engine** → **VM instances**.
2. Find your VM and click **SSH** in the “Connect” column (or the SSH button in the row).
3. A browser-based SSH window opens (or a popup). You may need to allow the popup once.
4. You’ll see a black terminal with a prompt like `username@ashgate-backend:~$`. This is your **terminal** on the VM. All commands below are run here unless we say “on your PC”.

---

# PART 5: Install Nginx, PHP, MySQL, and Composer (on the VM)

Run each block below in the SSH terminal. Copy-paste one block, press Enter, wait for it to finish, then do the next.

**5.1 – Update the system**

```bash
sudo apt update && sudo apt upgrade -y
```

**5.2 – Install Nginx and PHP**

Ubuntu 22.04 often has PHP 8.1 in the default repo. We install PHP and the extensions Laravel needs:

```bash
sudo apt install -y nginx unzip git
sudo apt install -y php-fpm php-mysql php-xml php-mbstring php-curl php-zip php-bcmath php-gd
```

Check the PHP version:

```bash
php -v
```

You should see something like `PHP 8.1.x` or `8.2.x`. **Remember this number** (e.g. 8.1 or 8.2); you’ll use it later in the Nginx config (e.g. `php8.1-fpm` or `php8.2-fpm`). If you see 8.3, use `php8.3-fpm` in the config.

**5.3 – Install Composer**

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

You should see a Composer version.

**5.4 – Install MySQL server**

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

---

# PART 6: Secure MySQL and create the Ashgate database

**6.1 – Run the security script**

```bash
sudo mysql_secure_installation
```

Answer as follows (adjust if you prefer a different root password):

- **Validate password plugin:** `n` (No), then Enter (unless you want strict passwords).
- **Set root password:** `Y`, then choose a **strong password** and remember it (you need it only for admin).
- **Remove anonymous users:** `Y`.
- **Disallow root login remotely:** `Y`.
- **Remove test database:** `Y`.
- **Reload privilege tables:** `Y`.

**6.2 – Create database and user**

Log into MySQL (use the root password you just set):

```bash
sudo mysql -u root -p
```

In the `mysql>` prompt, run (replace `YOUR_STRONG_PASSWORD` with a real password and remember it for `.env`):

```sql
CREATE DATABASE ashgate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ashgate'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON ashgate.* TO 'ashgate'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

You’re back at the normal terminal. The database `ashgate` and user `ashgate` are ready.

---

# PART 7: Deploy the Laravel application

**7.1 – Create web directory and get the code**

**Option A – You have the code in a GitHub repo**

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/YOUR_ORG/Ashgate-LTD.git ashgate
cd ashgate
```

Replace the repo URL with your real one. If the repo is private, you’ll need to set up deploy keys or use a personal access token.

**Option B – You upload the zip (no GitHub)**

1. On **your computer**, you have `Ashgate-LTD-updated.zip`.
2. In the GCP Console, go to **Compute Engine** → **VM instances** → click your VM name.
3. Click **Edit** (top). Scroll to **Custom metadata**. Add a key (we won’t use this for upload; we use a different method).
4. **Easier method – use the SSH terminal upload:**
   - In the **browser SSH window**, click the **gear icon** (⚙) or the three dots menu → **Upload file**.
   - Select `Ashgate-LTD-updated.zip` from your PC. It will upload to the home directory of the user (e.g. `/home/your_username/Ashgate-LTD-updated.zip`).
5. On the VM, run:

```bash
sudo mkdir -p /var/www
cd /var/www
sudo unzip ~/Ashgate-LTD-updated.zip -d ashgate-temp
cd ashgate-temp
ls
```

If you see a single folder (e.g. `Ashgate-LTD`), move its contents up and use that as the app root:

```bash
sudo mv Ashgate-LTD/* . 2>/dev/null || true
sudo mv Ashgate-LTD/.* . 2>/dev/null || true
sudo rmdir Ashgate-LTD 2>/dev/null || true
cd /var/www
sudo mv ashgate-temp ashgate
cd ashgate
ls
```

You should see `artisan`, `app`, `config`, `public`, etc. If the zip extracted directly into `ashgate-temp` (no nested folder), then:

```bash
cd /var/www
sudo mv ashgate-temp ashgate
cd ashgate
```

**7.2 – Install PHP dependencies and set permissions**

```bash
cd /var/www/ashgate
composer install --optimize-autoloader --no-dev
sudo chown -R www-data:www-data /var/www/ashgate
sudo chmod -R 755 /var/www/ashgate
sudo chmod -R 775 /var/www/ashgate/storage /var/www/ashgate/bootstrap/cache
```

---

# PART 8: Create and edit the .env file

```bash
cd /var/www/ashgate
cp .env.example .env
nano .env
```

Set these (use the same values you already configured; only DB and APP_URL might change):

- **APP_NAME** – e.g. `"Ashgate Limited"`
- **APP_ENV** – `production`
- **APP_KEY** – paste your existing key from Railway (or leave empty and we’ll generate in Part 9).
- **APP_DEBUG** – `false` (or `true` only for quick debugging, then set back to `false`).
- **APP_URL** – `https://api.ashgate.co.ke` (or for now `http://YOUR_STATIC_IP` if you haven’t set DNS/HTTPS yet).
- **DB_CONNECTION** – `mysql`
- **DB_HOST** – `127.0.0.1`
- **DB_PORT** – `3306`
- **DB_DATABASE** – `ashgate`
- **DB_USERNAME** – `ashgate`
- **DB_PASSWORD** – the password you set for the `ashgate` MySQL user.
- **CORS_ALLOWED_ORIGINS** – `https://www.ashgate.co.ke,https://ashgate.co.ke,https://api.ashgate.co.ke`
- **SANCTUM_STATEFUL_DOMAINS** – `www.ashgate.co.ke,ashgate.co.ke,api.ashgate.co.ke`
- **FILESYSTEM_DISK** – `r2` (or `public` if not using R2 yet).
- **Mail and Cloudflare R2** – same as you already have.

Save and exit: in `nano`, press **Ctrl+O**, Enter, then **Ctrl+X**.

---

# PART 9: Generate key, run migrations, storage link, cache

Run these in order (still in `/var/www/ashgate`):

```bash
cd /var/www/ashgate
php artisan key:generate
```

(Only if APP_KEY was empty; otherwise it will just show the current key.)

**Option A – Use migrations (recommended)**

```bash
php artisan migrate --force
```

**Option B – Import the MariaDB schema (if you prefer)**

First copy the schema file onto the VM (e.g. upload `ashgate-database-schema-mariadb.sql` via the SSH “Upload file” in the browser, so it’s in your home folder), then:

```bash
mysql -u ashgate -p ashgate < ~/ashgate-database-schema-mariadb.sql
```

Use the `ashgate` user password when prompted. Then:

```bash
php artisan config:clear
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

---

# PART 10: Create the first admin user

```bash
php artisan tinker
```

In the `>>>` prompt, paste this (change email and password as you like):

```php
$u = new \App\Models\User();
$u->name = 'Admin';
$u->email = 'admin@ashgate.co.ke';
$u->password = bcrypt('YourSecurePassword');
$u->email_verified_at = now();
$u->role = 'admin';
$u->is_active = true;
$u->save();
exit
```

Type `exit` and press Enter if tinker doesn’t exit after the last line. You now have an admin user to log in with.

---

# PART 11: Configure Nginx

**11.1 – Create the site config**

```bash
sudo nano /etc/nginx/sites-available/ashgate
```

Paste the block below. **Important:** replace `php8.2-fpm` with your actual PHP version if different (e.g. `php8.1-fpm` or `php8.3-fpm`). You can check with: `ls /var/run/php/`.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.ashgate.co.ke;
    root /var/www/ashgate/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
}
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

**11.2 – Enable the site and disable the default site**

```bash
sudo ln -s /etc/nginx/sites-available/ashgate /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```

You should see `syntax is ok` and `test is successful`. Then:

```bash
sudo systemctl reload nginx
```

**11.3 – Test with the VM IP**

In your browser open: **http://YOUR_STATIC_IP**  
You should see the Laravel welcome page or your app. Then try **http://YOUR_STATIC_IP/admin** – you should see the Filament login. If you get a 502, see Troubleshooting below.

---

# PART 12: Point your domain to the VM (DNS)

1. Log in to where **api.ashgate.co.ke** is managed (e.g. Cloudflare, Namecheap, etc.).
2. Add or edit a **DNS record**:
   - **Type:** A  
   - **Name:** `api` (so the full name is `api.ashgate.co.ke`).  
     Or if your panel uses full name, use `api.ashgate.co.ke`.
   - **Value / Target:** Your VM’s **static IP** (from Part 3).
   - **TTL:** 300 or Auto. Save.
3. Wait a few minutes, then in a browser try **http://api.ashgate.co.ke**. It should show the same as the IP.

---

# PART 13: Enable HTTPS with Certbot

On the VM:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.ashgate.co.ke
```

- Enter your email when asked (for expiry notices).
- Agree to terms.
- Choose whether to share email with EFF (optional).
- Certbot will get a certificate and adjust Nginx. When it asks to redirect HTTP to HTTPS, choose **Yes** (recommended).

Then update Laravel:

```bash
cd /var/www/ashgate
nano .env
```

Set **APP_URL=https://api.ashgate.co.ke**, save, then:

```bash
php artisan config:cache
```

Test in the browser: **https://api.ashgate.co.ke** and **https://api.ashgate.co.ke/admin**. Log in with the admin email and password you set in Part 10.

---

# PART 14: Final checklist

- [ ] GCP project created, Compute Engine API enabled.
- [ ] VM created (e2-micro), HTTP/HTTPS allowed, static IP reserved.
- [ ] SSH’d into VM, installed Nginx, PHP, MySQL, Composer.
- [ ] MySQL secured, database `ashgate` and user `ashgate` created.
- [ ] Laravel code in `/var/www/ashgate`, document root = `/var/www/ashgate/public`.
- [ ] `.env` created with APP_KEY, APP_URL, DB_*, CORS, Sanctum, Mail, R2.
- [ ] `composer install`, `php artisan migrate` (or schema import), `storage:link`, `config:cache`, `route:cache`.
- [ ] First admin user created via tinker.
- [ ] Nginx site `ashgate` enabled, default removed, `nginx -t` ok, nginx reloaded.
- [ ] DNS A record for api.ashgate.co.ke → static IP.
- [ ] Certbot run for api.ashgate.co.ke, APP_URL set to https, config cached.
- [ ] https://api.ashgate.co.ke/admin works and you can log in.

---

# TROUBLESHOOTING

**502 Bad Gateway**  
- Nginx can’t talk to PHP-FPM. Check the PHP version in the Nginx config:  
  `fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;`  
  Match the number to your `php -v` (e.g. 8.1 or 8.3). Then run:  
  `sudo systemctl status php8.2-fpm` (or php8.1-fpm / php8.3-fpm). If it’s inactive, run:  
  `sudo systemctl start php8.2-fpm` and `sudo systemctl reload nginx`.

**500 Internal Server Error**  
- Turn on Laravel errors: in `.env` set `APP_DEBUG=true`, then run `php artisan config:clear`. Reload the page and check the error. Check `storage/logs/laravel.log` on the VM. Fix the issue, then set `APP_DEBUG=false` and run `php artisan config:cache` again.

**Permission denied / 403**  
- Ensure ownership:  
  `sudo chown -R www-data:www-data /var/www/ashgate`  
  and  
  `sudo chmod -R 775 /var/www/ashgate/storage /var/www/ashgate/bootstrap/cache`.

**Admin page blank or CSS/JS missing**  
- Run:  
  `php artisan storage:link`  
  and  
  `php artisan config:cache`.

**Database connection refused**  
- Confirm MySQL is running: `sudo systemctl status mysql`.  
- In `.env`: DB_HOST=127.0.0.1, DB_DATABASE=ashgate, DB_USERNAME=ashgate, DB_PASSWORD=correct password. Then `php artisan config:clear` and `php artisan config:cache`.

---

You’re using **MySQL** on GCP (same as your MariaDB setup). No need to bring anything “back to PostgreSQL”; this guide and your existing `.env` and MariaDB schema are enough to deploy and run the admin at **https://api.ashgate.co.ke/admin**.
