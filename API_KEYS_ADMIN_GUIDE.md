# API Keys Management — Admin Panel Guide

**Location:** `/admin/api-keys`  
**Authentication:** Admin Secret (set `ADMIN_SECRET` in `.env.production`)

---

## 🎯 Overview

Instead of storing API keys in environment variables, you can now manage them directly in the admin panel. The system:
- ✅ Stores keys securely in database
- ✅ Falls back to environment variables if not found in DB
- ✅ Caches keys for performance (5-minute TTL)
- ✅ Tracks usage and last-used timestamps
- ✅ Allows deactivation without deletion

---

## 🚀 Setup

### Step 1: Set Admin Secret

Add to `.env.production` on VPS:

```bash
ADMIN_SECRET=your-secure-random-secret-here
```

Or use environment variable:
```bash
echo "ADMIN_SECRET=your-secret" >> /var/www/touresim/.env.production
```

### Step 2: Run Migration

```bash
cd /var/www/touresim
npm run db:push
```

This creates two new tables:
- `api_keys` — Store API keys and their status
- `settings` — Store other configuration (future use)

### Step 3: Access Admin Panel

1. Navigate to: `https://srv1772644.hstgr.cloud/admin/api-keys`
2. Enter your `ADMIN_SECRET`
3. You're authenticated!

---

## 📋 Using the Admin Panel

### Adding an API Key

1. Click **"Add Key"** button
2. Fill in:
   - **Key Name:** `booking` (for internal reference)
   - **Provider:** `Booking.com` (display name)
   - **API Key:** Your actual API key (from partner portal)
   - **Secret Key:** (optional) Secondary key if needed
   - **Notes:** Any notes about this key

3. Click **"Save Key"**

### Viewing Keys

- **Active** keys show with green badge ✅
- **Last Used** timestamp shows when key was last accessed
- **Updated** timestamp shows when key was modified

### Deactivating a Key

1. Click **trash icon** on the key
2. Confirm deactivation
3. Key is marked as `inactive` but not deleted (can be re-activated manually in database)

### Rotating a Key

1. Get new key from partner portal
2. Click **"Add Key"** with same name
3. Enter new key value
4. Existing key is replaced automatically

---

## 🔑 Supported API Keys

| Key Name | Provider | Used For |
|----------|----------|----------|
| `booking` | Booking.com | Hotel deals & search |
| `booking_id` | Booking.com | Affiliate tracking |
| `getyourguide` | GetYourGuide | Tours & activities |
| `skyscanner` | Skyscanner | Flight deals |
| `openexchangerates` | OpenExchangeRates | Currency conversion |
| `cron_secret` | Internal | Scheduled jobs |

Add any name you want — the application will fetch it by name.

---

## 🔧 How the Application Uses Keys

When the app needs an API key:

```typescript
import { getApiKey } from '@/lib/api-keys'

const bookingKey = await getApiKey('booking')
// 1. Check in-memory cache (5 min)
// 2. Look in database (api_keys table)
// 3. Fallback to environment variable (BOOKING_AFFILIATE_API_KEY)
// 4. Return null if not found
```

**Benefits:**
- No need to redeploy to change keys
- Easy rotation without downtime
- Track which keys are active
- See usage patterns in database

---

## 🔒 Security

- ✅ Admin-only access (requires `ADMIN_SECRET`)
- ✅ Keys stored in database (not displayed in admin panel)
- ✅ 5-minute cache prevents database hits on every request
- ✅ Status tracking (active/inactive/expired)
- ✅ Audit trail (last_used, updated_at timestamps)

### Future Improvements:
- Encrypt keys at rest in database
- Add key usage statistics
- Set expiration dates
- Email notifications on key rotation
- IP whitelist per key

---

## 🐛 Troubleshooting

### "Unauthorized" error
- Check `ADMIN_SECRET` value matches env variable
- Verify secret is set on VPS: `echo $ADMIN_SECRET`
- Make sure you copied it exactly (case-sensitive)

### Keys not appearing
- Verify migration ran: `mysql -u root touresim -e "SHOW TABLES LIKE 'api_keys';"`
- Check database connection in `.env.production`

### Application still using old keys
- Clear cache: Restart application `pm2 restart touresim`
- Or wait 5 minutes for cache to expire

### "Failed to save API key"
- Check API key length (some have minimum character requirements)
- Verify special characters don't need escaping
- Check database permissions

---

## 📊 Monitoring

### View all stored keys (SQL)
```bash
mysql -u root touresim -e "SELECT name, provider, status, last_used, updated_at FROM api_keys;"
```

### View usage stats
```bash
# Which keys are active
mysql -u root touresim -e "SELECT name, COUNT(*) as usage FROM api_keys WHERE status='active' GROUP BY name;"

# Last used timestamps
mysql -u root touresim -e "SELECT name, last_used FROM api_keys ORDER BY last_used DESC;"
```

---

## 🔄 Fallback Behavior

The application has built-in fallback to environment variables:

| Scenario | Behavior |
|----------|----------|
| Key in DB + in env | Use DB value |
| Key in DB only | Use DB value |
| Key not in DB + in env | Use env value |
| Key not in DB + not in env | Return null |

This means:
- ✅ You can migrate gradually (add keys to admin panel one at a time)
- ✅ Backward compatible (old .env keys still work)
- ✅ No downtime during migration

---

## 🚀 Migration Steps

### Move from Environment Variables to Admin Panel

1. **Access admin panel** → `/admin/api-keys`
2. **Add each key:**
   ```
   Key Name: booking
   Provider: Booking.com
   API Key: [paste from BOOKING_AFFILIATE_API_KEY]
   ```
3. **Test** → Verify application still works
4. **Repeat** for getyourguide, openexchangerates, etc.
5. **Optional:** Remove from `.env.production` once moved

---

## 📝 API Reference

### GET /api/admin/api-keys
Fetch all API keys (summary only, not actual values)

```bash
curl -X GET https://srv1772644.hstgr.cloud/api/admin/api-keys \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

### POST /api/admin/api-keys
Create or update API key

```bash
curl -X POST https://srv1772644.hstgr.cloud/api/admin/api-keys \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "booking",
    "key": "your-api-key-here",
    "provider": "Booking.com",
    "status": "active"
  }'
```

### DELETE /api/admin/api-keys?id=1
Deactivate API key

```bash
curl -X DELETE https://srv1772644.hstgr.cloud/api/admin/api-keys?id=1 \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

---

## ✅ Checklist

- [ ] Set `ADMIN_SECRET` in `.env.production`
- [ ] Redeploy and run migration
- [ ] Access `/admin/api-keys` 
- [ ] Add at least one API key (booking or getyourguide)
- [ ] Test that application uses the key
- [ ] Verify cache is working (refresh page)
- [ ] Remove old keys from `.env` (optional)

---

**Status:** Ready to use! No more environment variable management needed. 🎉

