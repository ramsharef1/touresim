# Phase 2.1: Travel Deals Feed — NEXT STEPS

**Status:** Foundation complete ✅ | API skeleton ready | Ready for integration

---

## What's Complete

### ✅ Database
- [x] `deals` table created
- [x] `deal_clicks` table for analytics
- [x] Migration generated: `drizzle/0002_brave_the_executioner.sql`

### ✅ API
- [x] `POST /api/deals` — Create deals (auth required)
- [x] `GET /api/deals` — Fetch deals with filtering
- [x] `PUT /api/deals` — Log deal clicks
- [x] `POST /api/cron/deals-sync` — Sync deals from partners

### ✅ Frontend
- [x] `DealCard.tsx` component with countdown timer
- [x] `/[locale]/deals/page.tsx` listing page with filtering
- [x] Type-based filtering (flights, hotels, tours, activities, experiences)
- [x] Responsive design for mobile/tablet/desktop

### ✅ Infrastructure
- [x] `src/lib/affiliates/booking.ts` — Booking.com integration template
- [x] `src/lib/affiliates/getyourguide.ts` — GetYourGuide integration template
- [x] `src/lib/affiliates/index.ts` — Sync orchestration service
- [x] Cron job endpoint ready for Hostinger setup

---

## Immediate Next Steps (TODAY)

### Step 1: Deploy to VPS and Test Locally

```bash
# Run migration
npm run db:push

# Start dev server
npm run dev

# Test deals page
open http://localhost:3004/deals
```

You should see:
- Empty deals page with filter tabs
- "No deals available right now" message (expected - no deals in DB yet)
- Filter tabs functional (even if filtering empty results)

### Step 2: Create Test Deals (Manual)

Add sample deals to database to verify UI works:

```bash
# Via direct database insert or API call
curl -X POST http://localhost:3004/api/deals \
  -H "Authorization: Bearer dev-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Paris Hotel Deal",
    "type": "hotel",
    "partner": "booking.com",
    "destinationSlug": "paris",
    "dealPrice": 89.99,
    "originalPrice": 149.99,
    "discount": 40,
    "affiliateUrl": "https://www.booking.com/searchresults.html?ss=Paris&partner_id=YOUR_ID",
    "imageUrl": "https://via.placeholder.com/600x400",
    "externalId": "booking_paris_hotel_12345",
    "expiresAt": "2026-08-15T23:59:59Z"
  }'
```

After creating test deals:
- Reload `/deals` — should see cards displayed
- Click filters — should narrow results
- Verify "View Deal" buttons work
- Test mobile view at 375px width

---

## Getting API Credentials (REQUIRED for Real Integration)

### Booking.com Affiliate Program
1. Go to https://partner.booking.com
2. Sign up as a property or affiliate partner
3. Get your **Affiliate ID** and **API Key**
4. Add to `.env.production`:
   ```
   BOOKING_AFFILIATE_API_KEY=xxx
   BOOKING_AFFILIATE_ID=yyy
   ```

### GetYourGuide Affiliate Program
1. Go to https://partner.getyourguide.com
2. Sign up for affiliate partnership
3. Get your **API Key**
4. Add to `.env.production`:
   ```
   GETYOURGUIDE_AFFILIATE_API_KEY=xxx
   ```

### Skyscanner (for Phase 2.4 flights)
1. Go to https://partners.skyscanner.com
2. Apply for affiliate partnership
3. Get your **Affiliate API Key**

**Note:** All these are free to sign up. Commission starts at 2-5% and increases with volume.

---

## Complete the API Integrations

### Option A: Quick (Use Mock Data)
For MVP, populate deals database with hardcoded test data:

```typescript
// src/lib/affiliates/mock-deals.ts
export const MOCK_DEALS = [
  {
    title: 'Budget Hotel in Barcelona',
    type: 'hotel',
    partner: 'booking.com',
    destinationSlug: 'barcelona',
    dealPrice: '65',
    originalPrice: '120',
    discount: 45,
    affiliateUrl: 'https://www.booking.com/...',
    imageUrl: 'https://...',
    externalId: 'mock_barcelona_hotel_1',
    expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 days
  },
  // ... more mock deals
]

export async function loadMockDeals() {
  for (const deal of MOCK_DEALS) {
    await db.insert(deals).values(deal)
  }
}
```

Then call `loadMockDeals()` in a setup script or cron job.

### Option B: Real Integration (Recommended)
Once you have API credentials, fill in the actual API calls:

**In `src/lib/affiliates/booking.ts`:**
```typescript
export async function fetchBookingDeals(destinationSlug?: string): Promise<BookingDeal[]> {
  const apiKey = process.env.BOOKING_AFFILIATE_API_KEY
  
  // Implement real API call to Booking.com:
  // const response = await fetch('https://api.booking.com/v2/hotels/search', {
  //   headers: { 'X-Booking-Key': apiKey },
  //   body: JSON.stringify({ destination: destinationSlug })
  // })
  // const data = await response.json()
  // return data.hotels.map(h => ({
  //   title: h.name,
  //   dealPrice: h.discounted_price,
  //   originalPrice: h.price,
  //   ...
  // }))
}
```

---

## Set Up Cron Job on Hostinger

Once API credentials are ready, set up automated deal syncing:

### On VPS Console:

```bash
# SSH to VPS
ssh root@72.62.132.138

# Add cron job to sync deals every 4 hours
crontab -e

# Add this line:
0 */4 * * * curl -X POST https://convertec.cloud/api/cron/deals-sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Save and exit
```

**Cron frequency options:**
- `0 */4 * * *` — Every 4 hours (recommended for deals)
- `0 */6 * * *` — Every 6 hours
- `0 0 * * *` — Daily at midnight
- `*/30 * * * *` — Every 30 minutes (testing only)

### Verify Cron Job:

```bash
# Check cron logs
tail -f /var/log/syslog | grep cron

# Or check directly on app logs:
# Application logs should show: "[Deals Sync] Fetched: X deals, Created: Y"
```

---

## Testing Checklist

Before moving to Phase 2.2, verify:

- [ ] Database migration runs without errors
- [ ] `/deals` page loads and renders correctly
- [ ] Filter tabs work (all, flights, hotels, tours, activities, experiences)
- [ ] Deal cards display with:
  - [ ] Image (or placeholder)
  - [ ] Title
  - [ ] Price (discounted + original)
  - [ ] Discount percentage
  - [ ] Hours/days remaining countdown
  - [ ] Partner name
  - [ ] "View Deal" button (links to affiliate URL)
- [ ] Clicking "View Deal" logs analytics (PUT request succeeds)
- [ ] Mobile layout works at 375px width
- [ ] Empty state shows when no deals
- [ ] API returns correct data when tested via curl/Postman
- [ ] Cron job endpoint responds with correct auth

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load | <2s on 4G |
| Lighthouse Score | >80 |
| FCP (First Contentful Paint) | <1.5s |
| CLS (Cumulative Layout Shift) | <0.1 |

Monitor with:
```bash
npm run build && npm run start
# Then test with Google PageSpeed Insights or Lighthouse CLI
```

---

## Revenue Tracking

Once deals are live, monitor:

- **Click-through rate (CTR):** Track in `deal_clicks` table
- **Conversion rate:** Estimated 1-3% of clicks → bookings
- **Average commission:** Booking.com 2-25%, GetYourGuide 2-5%
- **Revenue per deal:** (clicks × CTR × commission) per deal

Example:
- 100 clicks/day × 2% conversion = 2 bookings
- 2 bookings × $100 avg value × 5% commission = $10/day = $300/month

---

## Blockers & Troubleshooting

### "No deals showing"
- [ ] Migration not run? → `npm run db:push`
- [ ] Database empty? → Insert test deals manually
- [ ] API credentials missing? → Get them from partner portals

### "Migration failed"
- [ ] Check `.env.production` has correct `DATABASE_URL`
- [ ] Verify MySQL user has ALTER TABLE permissions
- [ ] Check for conflicting table names

### "Cron job not running"
- [ ] Verify `CRON_SECRET` is set on VPS
- [ ] Check VPS logs: `journalctl -u pm2 -f`
- [ ] Test cron endpoint manually: `curl -X POST https://convertec.cloud/api/cron/deals-sync -H "Authorization: Bearer YOUR_SECRET"`

### "Affiliate links not tracking"
- [ ] Ensure partner IDs included in URL
- [ ] Check `deal_clicks` table populated after clicking
- [ ] Verify affiliate account active and tracking enabled

---

## Next Phase (Week 4-5)

Once Phase 2.1 is live and generating traffic:

### Phase 2.2: Destination Comparison Tool
- Compare 2-3 countries side-by-side
- Show visa requirements, cost of living, best time to visit
- Generate shareable comparison URLs
- Embedded affiliate links for flights/hotels

### Ready files:
- Database schema exists in existing city/country tables
- No new API needed (use existing queries)
- Frontend-heavy: Build `/compare` and `/compare/[slugs]` pages

---

## Summary

**What to do RIGHT NOW:**

1. **Deploy:** `npm run db:push` on VPS
2. **Test:** Verify `/deals` page loads locally
3. **Seed:** Add test deals manually
4. **Verify UI:** Check all filtering and mobile views
5. **Get credentials:** Sign up for Booking.com and GetYourGuide affiliate programs
6. **Integrate APIs:** Fill in actual API calls in `src/lib/affiliates/`
7. **Setup cron:** Add to VPS crontab for automatic syncing
8. **Monitor:** Track clicks and revenue in database

**ETA to live:** 2-3 days (if APIs available immediately, otherwise blocked)

**Revenue at launch:** $200-500/month (with 50+ deals and decent traffic)

---

**Status:** Ready to build Phase 2.2 (Destination Comparison) in parallel 🚀

