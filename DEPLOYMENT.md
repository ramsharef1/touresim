# Touresim Deployment Guide

**Target:** Hostinger VPS (`72.62.132.138`) as `convertec.cloud`  
**Status:** Production-ready

## Prerequisites

- [ ] SSH access to VPS (have key/password for `root@72.62.132.138`)
- [ ] Domain DNS pointing to VPS IP (or ready to configure)
- [ ] Node.js 18+ on VPS
- [ ] MySQL 8.0+ on VPS (managed or self-hosted)

## Steps

### 1. Prepare the VPS

```bash
# SSH into Hostinger VPS
ssh root@72.62.132.138

# Install Node.js + PM2 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs
npm install -g pm2

# Create app directory
mkdir -p /var/www/touresim
cd /var/www/touresim
```

### 2. Clone & Install

```bash
# Clone repo (replace with your Git URL)
git clone https://github.com/your-username/touresim.git .
npm ci  # or npm install

# Build
npm run build
```

### 3. Set up Environment

Create `.env.production` on VPS (or copy from local `.env.local`):

```bash
cat > /var/www/touresim/.env.production << 'EOF'
# Database (Hostinger MySQL, replace with your actual credentials)
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/touresim?charset=utf8mb4"

# Anthropic API (for ongoing city intent generation)
ANTHROPIC_API_KEY="sk-ant-..."

# Optional: Next.js
NODE_ENV="production"
EOF
```

### 4. Migrate Database

Option A: **Export from local, import to VPS**
```bash
# On local machine
mysqldump -u root touresim > /tmp/touresim.sql

# Copy to VPS
scp /tmp/touresim.sql root@72.62.132.138:/tmp/

# On VPS, restore
mysql -u root -p touresim < /tmp/touresim.sql
```

Option B: **VPS connects to local DB** (temporary, for testing)
```bash
DATABASE_URL="mysql://root:PASSWORD@192.168.0.6:3306/touresim"
```

### 5. Start with PM2

```bash
cd /var/www/touresim

# Start the app
pm2 start npm --name "touresim" -- run start

# Save PM2 config so it restarts on reboot
pm2 startup
pm2 save
```

Verify it's running:
```bash
pm2 logs touresim  # Watch logs
curl http://localhost:3000/  # Test locally
```

### 6. Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/touresim`:

```nginx
server {
    listen 80;
    server_name convertec.cloud www.convertec.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
ln -s /etc/nginx/sites-available/touresim /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl restart nginx
```

### 7. SSL Certificate (Let's Encrypt)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d convertec.cloud -d www.convertec.cloud
```

### 8. Test Live

- Visit `http://convertec.cloud` → Should redirect to HTTPS
- Check homepage loads
- Test visa checker: `https://convertec.cloud/visa-checker?from=US`
- Test search: `https://convertec.cloud/[en or other locale]` (search bar)
- Check a country page: `https://convertec.cloud/france`

## Ongoing

### Resume City Intent Generation (when Anthropic credits available)

```bash
cd /var/www/touresim
npx tsx scripts/generate-city-intents.ts

# Monitor in background
pm2 start "npx tsx scripts/generate-city-intents.ts" --name "intent-gen" --cron "0 2 * * *"
```

### Logs & Monitoring

```bash
# View app logs
pm2 logs touresim

# Monitor resource usage
pm2 monit

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

### Database Backups

```bash
# Daily backup to /var/backups
pm2 start "mysqldump -u root -pPASSWORD touresim | gzip > /var/backups/touresim-\$(date +%Y%m%d).sql.gz" --cron "0 3 * * *"
```

## Rollback

If something breaks:

```bash
# Stop the app
pm2 stop touresim

# Revert to last known-good commit
git revert HEAD
npm run build

# Restart
pm2 start touresim
```

## Troubleshooting

| Issue | Solution |
|---|---|
| Port 3000 already in use | `lsof -iTCP:3000 -sTCP:LISTEN` then `kill -9 <PID>` |
| Database connection refused | Check MySQL is running: `systemctl status mysql` |
| Nginx not forwarding | Test: `curl -H "Host: convertec.cloud" http://localhost:3000/` |
| Slow pages | Check: `pm2 logs touresim` for errors, MySQL indexes via `ANALYZE TABLE` |
| SSL certificate renewal fails | `certbot renew --dry-run` to debug |

---

**Once deployed:** Post the live link in your browser and test the 576+ pages from the public internet. The visa checker + search are your strongest features for SEO + organic traffic.
