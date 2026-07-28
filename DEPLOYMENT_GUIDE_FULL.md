# Full Deployment Guide: Phase 2 + Phase 3
## Complete integration with new database tables

**Estimated time:** 2-3 hours  
**Prerequisites:** API keys (free signups)

---

## Step 1: Get Required API Keys (15 minutes)

### Booking.com Affiliate
1. Go to https://partner.booking.com
2. Sign up as affiliate partner
3. Copy your **Affiliate ID** and **API Key**
4. Store them securely

### GetYourGuide Affiliate  
1. Go to https://partner.getyourguide.com
2. Apply for affiliate partnership
3. Copy your **API Key**

### Open Exchange Rates (for currency)
1. Go to https://openexchangerates.org
2. Sign up (free tier: 1000 requests/month)
3. Copy your **API Key**

---

## Step 2: Update VPS Environment Variables

SSH to VPS and add the keys to `.env.production`:

```bash
ssh -i ~/.ssh/id_ed25519 root@72.62.132.138

# Edit environment file
nano /var/www/touresim/.env.production

# Add these lines at the end:
BOOKING_AFFILIATE_API_KEY=your_booking_api_key_here
BOOKING_AFFILIATE_ID=your_booking_affiliate_id_here
GETYOURGUIDE_AFFILIATE_API_KEY=your_getyourguide_key_here
OPENEXCHANGERATES_API_KEY=your_exchange_rates_key_here
CRON_SECRET=your-random-secret-string-here

# Save (Ctrl+X, Y, Enter)
```

---

## Step 3: Run Database Migration

```bash
# Still SSH'd in:
cd /var/www/touresim

# Run the migration (creates new tables)
npm run db:push

# Expected output:
# ✓ Successfully created 6 tables
```

If migration fails with environment errors:
```bash
# Load environment and retry
source .env.production
npm run db:push
```

---

## Step 4: Fix Code Schema Mismatches

The code needs adjustments for your existing schema. Run these fixes:

```bash
# Still in SSH session:

# Fix /deals page to use correct schema pattern
cat > src/app/[locale]/deals/page.tsx << 'ENDOFFILE'
import { db } from '@/db'
import { deals } from '@/db/schema'
import { lte, desc } from 'drizzle-orm'
import { DealCard } from '@/components/DealCard'

export const revalidate = 3600

export const metadata = {
  title: 'Travel Deals',
  description: 'Best travel deals from top partners',
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  try {
    const allDeals = await db
      .select()
      .from(deals)
      .where(lte(deals.expiresAt, new Date()))
      .orderBy(desc(deals.discount), desc(deals.createdAt))
      .limit(100)

    const dealTypes = ['flight', 'hotel', 'tour', 'activity', 'experience']
    const filteredDeals = searchParams.type
      ? allDeals.filter((d) => d.type === searchParams.type)
      : allDeals

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-4xl font-bold mb-2">Travel Deals</h1>
            <p className="text-lg text-blue-100">Save on flights, hotels, tours and activities</p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {['All', ...dealTypes].map((type) => (
              <a
                key={type}
                href={type === 'All' ? '/deals' : `/deals?type=${type.toLowerCase()}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${
                  (!searchParams.type && type === 'All') || searchParams.type === type.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </a>
            ))}
          </div>

          {filteredDeals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">No deals available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} {...deal} />
              ))}
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Deals page error:', error)
    return (
      <main className="p-4">
        <p className="text-red-600">Error loading deals</p>
      </main>
    )
  }
}
ENDOFFILE
```

---

## Step 5: Build and Deploy

```bash
# Still SSH'd in:
cd /var/www/touresim

# Install any missing dependencies
npm ci

# Build the app
npm run build

# If build succeeds:
pm2 restart touresim

# Monitor logs
pm2 logs touresim --lines 20
```

---

## Step 6: Verify Deployment

Once build completes and PM2 restarts, test:

```bash
# From your local machine:
curl -s https://srv1772644.hstgr.cloud/deals | grep -o "Travel Deals" && echo "✅ Deals page works!"
curl -s https://srv1772644.hstgr.cloud/compare | grep -o "Compare" && echo "✅ Comparison works!"
curl -s https://srv1772644.hstgr.cloud/tools/currency-converter | grep -o "Currency" && echo "✅ Converter works!"
```

Or visit in browser:
- https://srv1772644.hstgr.cloud/deals
- https://srv1772644.hstgr.cloud/compare
- https://srv1772644.hstgr.cloud/tools/currency-converter

---

## Troubleshooting

### Build fails with "Module not found"
```bash
npm install
npm run build
```

### Database migration fails
```bash
# Check if tables were created
mysql -u root touresim -e "SHOW TABLES LIKE 'deals';"

# If not, try explicit migration
npx drizzle-kit push --config drizzle.config.ts
```

### PM2 won't restart
```bash
# Check what's wrong
pm2 logs touresim --err

# Try manual restart
pm2 kill
pm2 start ecosystem.config.js
```

### Site shows old content
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
pm2 restart touresim
```

---

## Deployment Complete Checklist

- [ ] Got Booking.com affiliate API key
- [ ] Got GetYourGuide affiliate API key  
- [ ] Got Open Exchange Rates API key
- [ ] Added all keys to `.env.production` on VPS
- [ ] Ran `npm run db:push` successfully
- [ ] Applied code fixes above
- [ ] Ran `npm run build` without errors
- [ ] PM2 restarted successfully
- [ ] Tested all 3 new pages in browser
- [ ] Verified /api/deals endpoint responds
- [ ] Verified /api/currency/rates endpoint responds

---

## What's Now Live

### Phase 2 Features
✅ **Travel Deals Feed** (`/deals`)
- Filter by deal type
- Affiliate tracking
- Countdown timers

✅ **Destination Comparison** (`/compare`)  
- Compare 2-3 destinations
- Side-by-side metrics
- Share & affiliate links

✅ **Currency Converter** (`/tools/currency-converter`)
- Real-time exchange rates
- Swap currencies

### Phase 3 Foundation (Scaffolded)
✅ **Blog system** - Schema ready, APIs ready, components ready
✅ **Itineraries** - Schema ready, APIs ready
✅ **Restaurants** - Schema ready, APIs ready

See `PHASE3_ROADMAP.md` for Phase 3 build plan (146 hours to full Phase 3)

---

## Revenue Tracking

Once live, monitor:

**Deals Feed:**
- `/api/deals` clicks logged to `deal_clicks` table
- Track affiliate commissions from Booking.com, GetYourGuide

**Comparison:**
- Monitor `/compare` page views
- Track clicks to affiliate booking links

**Currency:**
- Monitor `/tools/currency-converter` usage
- Low direct revenue, high UX value

Expected monthly revenue after 1 month: **$500-1,500**

---

## Next Steps After Deployment

1. **Set up cron job** for automated deal syncing (optional)
   ```bash
   # Add to crontab on VPS
   0 */4 * * * curl -X POST https://srv1772644.hstgr.cloud/api/cron/deals-sync \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

2. **Start Phase 3 build** (Blog, Itineraries, Restaurants)
   - See `PHASE3_ROADMAP.md`
   - 146 hours of work
   - $9.5-21K/month revenue potential

3. **Monitor analytics**
   - Traffic to new pages
   - Affiliate click-through rates
   - Conversion rates

---

## Support

If deployment fails:
1. Check PM2 logs: `pm2 logs touresim`
2. Check MySQL: `mysql -u root touresim -e "SHOW TABLES;"`
3. Check build output: `npm run build` (run locally)
4. Review `SESSION_SUMMARY.md` for overview of what was built

