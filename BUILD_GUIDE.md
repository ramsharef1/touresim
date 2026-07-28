# Touresim Complete Build Guide
## From Planning → Implementation

**Status:** Phase 1 Complete ✅ | Phase 2 Ready to Build 🚀

---

## 📚 DOCUMENTATION CREATED

1. **COMPLETE_ROADMAP.md** — 600+ lines
   - All 4 phases detailed
   - Revenue models
   - Tech stack & APIs
   - Database schemas
   - Implementation priority

2. **SPRINT_PLAN.md** — Week-by-week breakdown
   - 14 weeks of sprints
   - Daily standups
   - Critical path
   - Success criteria
   - Revenue ramp projections

3. **PHASE1_INTEGRATION_GUIDE.md** — Integration instructions
   - Component import locations
   - Page integration code
   - Translation keys
   - Testing checklist
   - Deployment steps

---

## 🏗️ INFRASTRUCTURE CREATED

### Phase 1 (Complete ✅)
- [x] Engagement schema (`src/db/schema/engagement.ts`)
  - `wishlists` table
  - `destination_reviews` table
- [x] API endpoints
  - `POST /api/wishlists` — Add to wishlist
  - `GET /api/wishlists` — Fetch wishlists
  - `POST /api/reviews` — Submit review
  - `GET /api/reviews` — Fetch reviews
- [x] Frontend components (6 total)
  - WishlistButton, RatingStars, ReviewForm
  - ReviewList, ShareButtons, MediaGallery
  - TrendingDestinations
- [x] Pages
  - `/[locale]/my-wishlists` — Wishlist management
  - `/admin/reviews` — Review moderation

### Phase 2 (Ready to Build 🚀)
- [x] Deals schema created (`src/db/schema/deals.ts`)
  - `deals` table
  - `deal_clicks` table (analytics)
- [ ] Deals API endpoints (TODO)
- [ ] Destination Comparison infrastructure (TODO)
- [ ] Currency Converter (TODO)
- [ ] Airport Guides (TODO)

---

## 🎯 NEXT IMMEDIATE STEPS

### Step 1: Update Schema Index (5 min)

**File:** `src/db/schema/index.ts`

Add this line:
```typescript
export * from './deals'
```

### Step 2: Generate Migration (2 min)

```bash
npx drizzle-kit generate
```

This will create migration for deals tables.

### Step 3: Build Deals API Endpoints (2-3 hours)

**Create:** `src/app/api/deals/route.ts`

```typescript
import { db } from '@/db'
import { deals } from '@/db/schema'
import { lte, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'flight', 'hotel', etc
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let query = db.select().from(deals)
    
    // Only show active deals (not expired)
    query = query.where(lte(deals.expiresAt, new Date()))
    
    if (type && ['flight', 'hotel', 'tour', 'activity', 'experience'].includes(type)) {
      query = query.where(eq(deals.type, type))
    }
    
    const results = await query
      .orderBy(desc(deals.discount), desc(deals.createdAt))
      .limit(limit)
    
    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    })
  } catch (error) {
    console.error('Deals GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Admin only: Create/update deals (called by cron job)
  // Implementation depends on which API integrations are ready
  try {
    const body = await request.json()
    // Validate + insert deal
    // See COMPLETE_ROADMAP.md for full implementation
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
```

### Step 4: Build Deals Component (2-3 hours)

**Create:** `src/components/DealCard.tsx`

```typescript
'use client'

import { Heart, Clock, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface DealCardProps {
  id: number
  title: string
  type: 'flight' | 'hotel' | 'tour' | 'activity' | 'experience'
  originalPrice?: number
  dealPrice: number
  discount?: number
  imageUrl?: string
  affiliateUrl: string
  expiresAt: Date
  partner: string
}

export function DealCard({
  id,
  title,
  type,
  originalPrice,
  dealPrice,
  discount,
  imageUrl,
  affiliateUrl,
  expiresAt,
  partner,
}: DealCardProps) {
  const hoursLeft = Math.floor(
    (new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60)
  )

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {imageUrl && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium capitalize">
            {type}
          </span>
          {discount && (
            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-bold">
              -{discount}%
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${dealPrice.toFixed(0)}
            </span>
            {originalPrice && (
              <span className="text-sm line-through text-gray-500">
                ${originalPrice.toFixed(0)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Clock size={14} />
          {hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'}
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
        >
          View Deal
        </a>

        <p className="text-xs text-gray-500 mt-2 text-center">
          via {partner}
        </p>
      </div>
    </div>
  )
}
```

### Step 5: Build Deals Page (2-3 hours)

**Create:** `src/app/[locale]/deals/page.tsx`

```typescript
import { getTranslations } from 'next-intl'
import { DealCard } from '@/components/DealCard'
import { db } from '@/db'
import { deals } from '@/db/schema'
import { lte, desc } from 'drizzle-orm'

export const metadata = {
  title: 'Travel Deals',
  description: 'Best travel deals from Booking, GetYourGuide, and more',
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const t = getTranslations()

  const allDeals = await db
    .select()
    .from(deals)
    .where(lte(deals.expiresAt, new Date()))
    .orderBy(desc(deals.discount), desc(deals.createdAt))
    .limit(100)

  const filteredDeals = searchParams.type
    ? allDeals.filter((d) => d.type === searchParams.type)
    : allDeals

  const dealTypes = ['flight', 'hotel', 'tour', 'activity', 'experience']

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Deals</h1>
      <p className="text-gray-600 mb-8">
        Best travel deals updated daily from top partners
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        <a
          href="/deals"
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            !searchParams.type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Deals
        </a>
        {dealTypes.map((type) => (
          <a
            key={type}
            href={`/deals?type=${type}`}
            className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
              searchParams.type === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
          </a>
        ))}
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No deals available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              {...deal}
            />
          ))}
        </div>
      )}
    </main>
  )
}
```

---

## 📋 REMAINING BUILD TASKS BY PHASE

### Phase 2 (4 weeks | 50 hours)

**2.1 Travel Deals Feed** ✅ Schema created
- [ ] API endpoints (5 hours)
- [ ] Components (5 hours)
- [ ] Pages (3 hours)
- [ ] Booking.com API integration (2 hours)
- [ ] Cron job for updates (1 hour)

**2.2 Destination Comparison** (10 hours)
- [ ] Comparison algorithm
- [ ] Frontend interface
- [ ] Grid/table display
- [ ] Share functionality

**2.3 Currency Converter** (6 hours)
- [ ] API integration
- [ ] Widget component
- [ ] Dedicated page

**2.4 Airport Guides** (18 hours)
- [ ] Database schema
- [ ] Data import (Wikidata)
- [ ] Pages & components

### Phase 3 (4 weeks | 118 hours)
- [ ] Blog system (54 hours)
- [ ] Pre-built itineraries (38 hours)
- [ ] Restaurant guides (26 hours)

### Phase 4 (4 weeks | 178 hours)
- [ ] Accommodations marketplace (68 hours)
- [ ] Tours & activities (24 hours)
- [ ] Community features (44 hours)
- [ ] Flight deals tracker (24 hours)
- [ ] Insurance comparison (18 hours)

---

## 🔑 API KEYS NEEDED

Before proceeding with implementation, get these:

**Required for Phase 2:**
- [ ] Booking.com Affiliate API key (sign up at partner.booking.com)
- [ ] GetYourGuide Affiliate key (partner.getyourguide.com)
- [ ] Skyscanner Affiliate key (skyscanner.com)
- [ ] Open Exchange Rates key (openexchangerates.org)

**Required for Phase 3:**
- [ ] Google Maps API key (console.cloud.google.com)
- [ ] TripAdvisor API key (tripadvisor.com)

**Required for Phase 4:**
- [ ] Booking.com Search API (escalate from affiliate)
- [ ] Viator API key (partner.viator.com)
- [ ] Klook API key (partner.klook.com)

---

## 🚀 HOW TO PROCEED

**Option 1: Continue Building (I build next features)**
I'll build Phase 2.2-2.4 and Phase 3 systematically, following the sprint plan.

**Option 2: You Build with Guidance**
I provide templates and guidance; you implement features.

**Option 3: Hybrid**
I build core infrastructure (APIs, components), you handle data/content.

---

## ⏱️ TIME ESTIMATES

Assuming 1 developer working full-time:
- **Phase 1:** 2 weeks (done ✅)
- **Phase 2:** 4 weeks 
- **Phase 3:** 4 weeks
- **Phase 4:** 4 weeks
- **Total:** 14 weeks to full platform

**Or:** Parallelize with 2-3 developers:
- **Phase 2 + Phase 3:** 4 weeks (parallel)
- **Phase 4:** 4 weeks (once marketplace framework ready)
- **Total:** 8 weeks to full platform

---

## 💰 REVENUE TIMELINE

- **Week 4:** Phase 2 live → $2.2K/month
- **Week 8:** Phase 3 live → $12K/month
- **Week 10:** Accommodations beta → $18K/month
- **Week 14:** Full platform → $25-50K/month

---

## ✅ QUICK CHECKLIST

Before building each phase:

- [ ] API keys obtained
- [ ] Database schema created & migrated
- [ ] API endpoints implemented
- [ ] Frontend components built
- [ ] Pages created
- [ ] Tested locally
- [ ] Deployed to VPS

---

**Status:** Ready to begin Phase 2 implementation 🚀

What's next?

