# Touresim Full Build: 14-Week Sprint Plan
## Phase 1-4 Complete Implementation Schedule

**Start Date:** Week of July 28, 2026  
**Target Launch:** End of October 2026  
**Estimated Revenue:** $25-50K/month by Week 14  

---

## 📋 SPRINT OVERVIEW

```
PHASE 1 (Complete) ✅
├─ Week 1-2: Deploy to production

PHASE 2 (Quick Wins)
├─ Week 3-4: Travel Deals Feed 🔴 Priority 1
├─ Week 4-5: Destination Comparison 🔴 Priority 2
├─ Week 5-6: Currency Converter + Airport Guides 🟠 Priority 3-4

PHASE 3 (Content)
├─ Week 6-8: Blog System 🔴 Priority 1
├─ Week 8-9: Pre-built Itineraries 🔴 Priority 2
├─ Week 9-10: Restaurant Guides 🟠 Priority 3

PHASE 4 (Marketplace)
├─ Week 10-12: Accommodations Marketplace 🔴 Priority 1 (REVENUE!)
├─ Week 12-13: Tours & Activities + Community 🟠 Priority 2-3
├─ Week 13-14: Flight Deals + Insurance 🟡 Priority 4-5
```

---

## WEEK-BY-WEEK BREAKDOWN

### WEEK 1-2: PHASE 1 DEPLOYMENT ✅

**Goal:** Get Phase 1 live and validated

**Tasks:**
- [x] Database migration applied to VPS
- [x] APIs tested and working
- [x] Components integrated into pages
- [x] Translations added
- [x] All features tested live

**Deliverables:**
- Wishlists working on convertec.cloud
- Reviews accepting submissions
- Admin reviewing reviews

**Dependencies:** None (already complete)

---

### WEEK 3: TRAVEL DEALS FEED 🔴 PRIORITY #1

**Goal:** Launch deal aggregation → $1K/month revenue

**Daily Standup:**
- Day 1: Database schema + API setup
- Day 2: Booking.com API integration
- Day 3: GetYourGuide + Skyscanner integration
- Day 4: Cron job for deal updates
- Day 5: Frontend components + pages

**Deliverables:**
- `/deals` page showing daily deals
- Deal cards with countdown timers
- Filter by type (flight, hotel, tour)
- Affiliate tracking

**Dependencies:** GetYourGuide API key, Booking.com affiliate account

**Revenue:** $1K/month (est. 100 clicks/day × 2% conversion × $5 commission)

---

### WEEK 4-5: DESTINATION COMPARISON 🔴 PRIORITY #2

**Goal:** Unique feature differentiator → $500/month affiliate revenue

**Daily Standup:**
- Day 1: Comparison algorithm + query builder
- Day 2: Frontend search/select interface
- Day 3: Side-by-side comparison grid
- Day 4: Affiliate links integration
- Day 5: Share & save comparison

**Deliverables:**
- `/compare` — Select up to 3 countries
- `/compare/[slug1]-[slug2]-[slug3]` — Dynamic page
- Comparison metrics (visa, cost, weather, flights)
- Share & affiliate links

**Dependencies:** None (all data already exists)

**Revenue:** $500/month (affiliate links for flights/hotels)

---

### WEEK 5-6: CURRENCY CONVERTER + AIRPORT GUIDES 🟠 PRIORITY #3-4

**Parallel Track A: Currency Converter (6 hours)**
- API integration (Open Exchange Rates)
- Sticky widget component
- Historical chart
- Dedicated page

**Parallel Track B: Airport Guides (18 hours)**
- Database schema for 100 major airports
- Data import from Wikidata
- Pages: `/airports`, `/[city]/airport`
- Transport info, flight times

**Deliverables:**
- Currency converter widget
- 100 airport guides
- Transport affiliate links

**Revenue:** $300/month (converter ads) + $400/month (affiliate)

---

### WEEK 6-8: BLOG SYSTEM 🔴 PRIORITY #1

**Goal:** SEO foundation + content revenue → $5-10K/month

**Phase 1 (Week 6):** Infrastructure
- Blog schema + DB
- Blog API (create, edit, delete, publish)
- Admin interface

**Phase 2 (Week 7):** Frontend
- Blog listing page
- Blog post detail page
- Comments system
- Share & bookmark

**Phase 3 (Week 8):** Content Creation
- Write 20 initial blog posts:
  - 5 travel tips ("Budget travel on $50/day")
  - 5 destination guides
  - 5 visa guides
  - 5 travel hacks
- SEO optimization for each
- Affiliate links embedded

**Deliverables:**
- `/blog` with 20+ posts
- Category filtering
- Comments + reviews
- Email signup
- Affiliate revenue from content

**Revenue:** $5-10K/month (affiliate links + sponsored posts)

---

### WEEK 8-9: PRE-BUILT ITINERARIES 🔴 PRIORITY #2

**Goal:** High engagement + conversion → $3-8K/month

**Phase 1 (Week 8):** Infrastructure
- Itinerary schema
- Itinerary API
- Admin interface for creation

**Phase 2 (Week 9):** Content + Frontend
- Create 20 itineraries (3/5/7-day options)
  - 5 Europe itineraries
  - 5 Asia itineraries
  - 5 Americas itineraries
  - 5 themed (luxury, budget, adventure)
- Itinerary pages
- PDF download
- Save to wishlist
- Book accommodation/activities

**Deliverables:**
- `/itineraries` browsing page
- `/[locale]/[city]/itineraries` for each city
- `/itineraries/[slug]` detail page
- Day-by-day breakdown
- PDF download + affiliate links

**Revenue:** $3-8K/month (hotel + activity bookings)

---

### WEEK 9-10: RESTAURANT GUIDES 🟠 PRIORITY #3

**Goal:** Food tourism trend → $1.5-3K/month

**Phase 1 (Week 9):** Data
- Scrape 500 restaurants from Google Places
- Manual curation of top restaurants
- Import rating/review data

**Phase 2 (Week 10):** Frontend
- Restaurant listing pages
- Filter by cuisine, price, rating
- Booking links (Google Maps, TripAdvisor)
- User reviews integration

**Deliverables:**
- `/[city]/restaurants` pages
- 500+ restaurant listings
- Reviews + ratings
- Reservation links

**Revenue:** $1.5-3K/month (restaurant affiliate + ads)

---

### WEEK 10-12: ACCOMMODATIONS MARKETPLACE 🔴 PRIORITY #1 (REVENUE!)

**Goal:** MAJOR revenue driver → $5-10K/month

**Phase 1 (Week 10):** API Integration
- Booking.com Search API setup
- Database schema
- Accommodation query builder
- Data sync cron job (5K+ properties)

**Phase 2 (Week 11):** Frontend
- Search interface (date, location, price)
- Results page with filtering
- Map view (Mapbox)
- Detail pages
- Availability calendar

**Phase 3 (Week 12):** Polish
- Reviews display
- Photo gallery
- Responsive design
- Performance optimization

**Deliverables:**
- `/[city]/accommodations` search
- Filter by type, price, amenities
- Book via Booking.com
- User reviews

**Revenue:** $5-10K/month (5-10% commission on bookings)

---

### WEEK 12-13: TOURS & ACTIVITIES + COMMUNITY 🟠 PRIORITY #2-3

**Parallel Track A: Tours & Activities (24 hours)**
- GetYourGuide + Viator API integration
- Activity search pages
- Activity detail pages
- Booking links

**Parallel Track B: Community Q&A (44 hours)**
- Community schema
- Q&A database
- Local guides database
- Travel stories database
- Community pages

**Deliverables:**
- `/[city]/activities` pages
- `/community` hub
- User can ask questions
- Users can write local guides
- Reputation system

**Revenue:** 
- Activities: $1-3K/month
- Community: $500-1K/month (sponsorships)

---

### WEEK 13-14: FLIGHT DEALS + INSURANCE 🟡 PRIORITY #4-5

**Parallel Track A: Flight Deals Tracker (24 hours)**
- Skyscanner API integration
- Price alert system
- Email notifications
- Deals feed page

**Parallel Track B: Insurance Comparison (18 hours)**
- World Nomads API integration
- Insurance plan comparison
- Quote calculator
- Booking links

**Deliverables:**
- `/flights` deals feed
- Price alert dashboard
- `/travel-insurance` comparison
- Quote calculator

**Revenue:**
- Flight deals: $1-2K/month
- Insurance: $3-6K/month

---

## 📊 EFFORT ALLOCATION

### By Week

| Week | Phase | Focus | Dev Hours | Priority |
|------|-------|-------|-----------|----------|
| 1-2 | 1 | Deploy | 20 | ✅ Done |
| 3 | 2 | Deals Feed | 16 | 🔴 #1 |
| 4-5 | 2 | Comparison | 10 | 🔴 #2 |
| 5-6 | 2 | Currency + Airports | 24 | 🟠 #3-4 |
| 6-8 | 3 | Blog | 54 | 🔴 #1 |
| 8-9 | 3 | Itineraries | 38 | 🔴 #2 |
| 9-10 | 3 | Restaurants | 26 | 🟠 #3 |
| 10-12 | 4 | Accommodations | 68 | 🔴 #1 |
| 12-13 | 4 | Tours + Community | 68 | 🟠 #2-3 |
| 13-14 | 4 | Flights + Insurance | 42 | 🟡 #4-5 |
| **TOTAL** | | | **~416 hours** | |

### By Resource Type

- **Backend Development:** 180 hours (43%)
- **Frontend Development:** 160 hours (38%)
- **Content Creation:** 60 hours (14%)
- **Testing & QA:** 16 hours (4%)

---

## 💰 REVENUE RAMP

### Conservative (2% conversion)
| Week | Cumulative | Monthly Run-Rate |
|------|-----------|-----------------|
| 4 | $500 | $2K |
| 8 | $3K | $12K |
| 10 | $5K | $20K |
| 12 | $13K | $50K |
| 14 | $18K | $70K |

### Aggressive (5% conversion)
| Week | Cumulative | Monthly Run-Rate |
|------|-----------|-----------------|
| 4 | $2K | $8K |
| 8 | $10K | $40K |
| 10 | $20K | $80K |
| 12 | $35K | $140K |
| 14 | $50K | $200K |

---

## 🎯 CRITICAL PATH (What Blocks What)

```
Phase 1 (Complete) ✅
    ↓
Phase 2 (Deals, Comparison, Converter, Airports)
    ↓
Phase 3 (Blog, Itineraries, Restaurants) ← Can start in parallel with Phase 2 Week 5+
    ↓
Phase 4 (Accommodations) ← REVENUE DRIVER
    ↓
Phase 4 (Tours, Community, Flights, Insurance) ← Complementary features
```

**CRITICAL:** Accommodations marketplace (Week 10-12) is the major revenue inflection point. Everything before Week 10 is setup.

---

## 🚀 EXECUTION STRATEGY

### Daily Standup Format
- **What's done:** Completed features/PRs
- **What's in progress:** Current sprint tasks
- **Blockers:** Any issues or dependencies

### Testing Strategy
- **Feature testing:** Same day as development
- **Integration testing:** End of week
- **Live testing on VPS:** Before moving to next feature

### Deployment Strategy
- **Phase 2:** Deploy each feature to VPS as complete
- **Phase 3:** Deploy blog first (foundational)
- **Phase 4:** Deploy accommodations → MAJOR LAUNCH

### Database Migration Strategy
- **Run migrations** before each phase deployment
- **Backup production** before each migration
- **Test migrations locally** first

---

## 📱 API INTEGRATIONS CHECKLIST

**Before Week 3 Start:**
- [ ] Booking.com affiliate account + API key
- [ ] GetYourGuide affiliate account + API key
- [ ] Skyscanner affiliate account + API key
- [ ] Open Exchange Rates API key
- [ ] Google Maps API key (for coordinates, places)
- [ ] Wikidata (free, no key needed)

**Before Week 10 Start:**
- [ ] Viator affiliate account
- [ ] World Nomads affiliate account
- [ ] Klook affiliate account
- [ ] TripAdvisor API key

---

## 💾 DATABASE SCHEMA CHECKLIST

**Phase 2:**
- [ ] `deals` table
- [ ] `airports` table
- [ ] `airport_transport` table

**Phase 3:**
- [ ] `blog_posts` + `blog_comments`
- [ ] `restaurants` + `restaurant_reviews`
- [ ] `itineraries` + `itinerary_days` + `itinerary_pois`

**Phase 4:**
- [ ] `accommodations` + `accommodation_reviews`
- [ ] `local_guides` + `community_questions` + `travel_stories`
- [ ] `flight_alerts`

---

## ✅ SUCCESS CRITERIA BY PHASE

### Phase 2 (Weeks 3-6)
- ✅ Traffic from deals feed (1K+ visitors/day)
- ✅ 5% affiliate CTR
- ✅ Destination comparison used 10%+ of visitors
- ✅ $2.2K/month revenue

### Phase 3 (Weeks 6-10)
- ✅ 20+ blog posts published
- ✅ Blog getting 30% of traffic
- ✅ 20 itineraries with booking integration
- ✅ 500+ restaurants indexed
- ✅ $10K/month revenue (cumulative)

### Phase 4 (Weeks 10-14)
- ✅ 5K+ accommodations searchable
- ✅ 50+ activity categories
- ✅ Community questions getting answers
- ✅ $25-50K/month revenue (run-rate)

---

## 🎬 READY TO BUILD?

**Start Today:**
- [ ] Finalize API integrations
- [ ] Set up database migrations
- [ ] Create feature branches
- [ ] Begin Phase 2 Week 3

**Status:** SPRINT READY ✅

