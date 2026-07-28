# Phase 3: Content Foundation Roadmap

**Target:** Weeks 6-10 (4 weeks)  
**Projected Revenue:** $9.5-21K/month  
**Key Focus:** SEO, engagement, affiliate revenue from content

---

## Overview

Phase 3 adds three major content systems:
1. **Blog System** (54h) — SEO engine, thought leadership
2. **Pre-built Itineraries** (38h) — High-intent booking tool
3. **Restaurant Guides** (26h) — Food tourism revenue

Combined, these features generate $9.5-21K/month from affiliate bookings and sponsored content.

---

## 🚀 Phase 3.1: Blog System

### Why Blog First?
- Highest SEO impact (long-tail keywords, backlinks)
- Builds authority (E-E-A-T signals)
- Drives organic traffic (30%+ of all visitors by month 2)
- Direct affiliate revenue from embedded links
- Newsletter signup for retention

### Database Ready
Schema is now in `/src/db/schema/content.ts`:
- `blog_posts` table (title, slug, body, status, category, SEO fields)
- `blog_comments` table (for engagement)

### API Endpoints to Build (Week 6)
```
POST   /api/blog/posts         — Create blog post (admin)
GET    /api/blog/posts         — List posts with filtering
GET    /api/blog/posts/[slug]  — Get single post
PUT    /api/blog/posts/[slug]  — Update post (admin)
DELETE /api/blog/posts/[slug]  — Delete post (admin)

POST   /api/blog/comments      — Submit comment
GET    /api/blog/[slug]/comments — Fetch comments
```

### Components to Build (Week 6-7)
- `BlogCard.tsx` — Post preview card (image, title, excerpt, date)
- `BlogPostDetail.tsx` — Full post with comments section
- `BlogList.tsx` — Paginated post listing with filters
- `RelatedPosts.tsx` — Show 3 related posts at bottom
- `CommentForm.tsx` — Submit/reply to comments
- `BlogSearch.tsx` — Search by title/category/tag

### Pages to Build (Week 6-7)
- `/[locale]/blog/page.tsx` — Blog listing with filters
- `/[locale]/blog/[slug]/page.tsx` — Single post detail
- `/[locale]/blog/category/[category]/page.tsx` — Category archive
- `/[locale]/blog/tag/[tag]/page.tsx` — Tag archive
- `/admin/blog/page.tsx` — Blog management dashboard
- `/admin/blog/[slug]/edit/page.tsx` — Post editor

### Content to Create (Week 8)
Write 20 initial blog posts (~2 hours each):

**Travel Tips (5 posts):**
- "Budget Travel on $50/Day"
- "Packing Tips for Digital Nomads"
- "Solo Travel Safety Guide"
- "Travel Insurance: What You Need"
- "Flying During Airline Strikes"

**Destination Guides (5 posts):**
- "Complete Guide to Paris"
- "Hidden Gems in Tokyo"
- "Exploring Barcelona Like a Local"
- "New York City 5-Day Itinerary"
- "Istanbul: East Meets West"

**Visa Guides (5 posts):**
- "Schengen Visa Explained"
- "Japan Visa for Americans"
- "Thailand Visa-Free vs Visa-On-Arrival"
- "Working Holiday Visas: Your Options"
- "Digital Nomad Visas by Country"

**Luxury Travel (5 posts):**
- "Best 5-Star Hotels in Dubai"
- "Private Island Resorts"
- "Michelin-Star Dining Worldwide"
- "Yacht Charter Guide"
- "Luxury Safari Experiences"

**SEO Requirements per Post:**
- 1500+ words (minimum)
- Internal links to destinations (3-5)
- Affiliate links embedded (2-3)
- Featured image (1200x630)
- Meta description (150 chars)
- Reading time estimate

### Revenue Model
- **Affiliate links:** $2-5 per 1K visitors (~2% CTR)
- **Sponsored posts:** $500-2000 per post (tourism boards)
- **Newsletter ads:** $200-500/month (once 1K+ subscribers)
- **Display ads:** $1-3 per 1K views

**Estimated:** $3-8K/month

---

## 🚀 Phase 3.2: Pre-built Itineraries

### Why Itineraries?
- High-intent users (ready to book)
- Direct booking integration
- Affiliate revenue from hotels + activities
- User saves = repeat engagement
- Perfect for email campaigns

### Database Ready
Schema is in `/src/db/schema/content.ts`:
- `itineraries` table (destination, duration, theme)
- `itinerary_days` table (day-by-day breakdown)
- `itinerary_day_pois` table (activities per day)

### API Endpoints (Week 8)
```
POST   /api/itineraries         — Create itinerary (admin)
GET    /api/itineraries         — List with filters
GET    /api/itineraries/[slug]  — Get single itinerary
PUT    /api/itineraries/[slug]  — Update (admin)
DELETE /api/itineraries/[slug]  — Delete (admin)

POST   /api/itineraries/[slug]/save — Save to wishlist
GET    /api/itineraries/saved   — User's saved itineraries
```

### Components (Week 8-9)
- `ItineraryCard.tsx` — Preview card (image, title, duration, price)
- `ItineraryDetail.tsx` — Full itinerary with day breakdown
- `ItineraryDay.tsx` — Single day with activities + meals
- `ItineraryMap.tsx` — Google Maps showing route
- `PDFDownload.tsx` — Generate PDF itinerary
- `SaveItinerary.tsx` — Button to save to wishlists

### Pages (Week 8-9)
- `/[locale]/itineraries/page.tsx` — Browse all itineraries
- `/[locale]/itineraries/[slug]/page.tsx` — Itinerary detail
- `/[locale]/[city]/itineraries/page.tsx` — City-specific itineraries
- `/admin/itineraries/page.tsx` — Admin dashboard
- `/admin/itineraries/create/page.tsx` — Create new

### Content to Create (Week 9)
20 pre-built itineraries:

**Europe (5):**
- 7-day Paris romance
- 10-day Mediterranean cruise planning
- 5-day Amsterdam cycling
- 14-day Italy grand tour
- 3-day Barcelona city break

**Asia (5):**
- 14-day Southeast Asia (Thailand/Vietnam)
- 10-day Japan highlights
- 7-day Bali retreat
- 5-day Hong Kong urban
- 10-day India spice trail

**Americas (5):**
- 10-day Peru (Machu Picchu)
- 7-day Mexico beach + ruins
- 5-day NYC + Niagara Falls
- 14-day Brazil adventure
- 7-day Costa Rica eco-lodge

**Africa (5):**
- 10-day Kenya safari
- 7-day Egypt classics
- 5-day Morocco medinas
- 10-day South Africa wine + wildlife
- 7-day Rwanda gorilla trek

**Per Itinerary:**
- Detailed day-by-day breakdown
- 5-8 POIs per day
- Restaurant recommendations
- Accommodation suggestions
- Estimated costs
- Difficulty level
- Best time to visit
- What to pack

### Revenue Model
- **Booking.com affiliate:** $5-15 per hotel booking (5-10% commission)
- **GetYourGuide affiliate:** $2-8 per activity booking
- **Sponsored itineraries:** $1000+ from tourism boards
- **Premium itineraries:** Charge $9.99 for downloadable PDF (future)

**Estimated:** $3-8K/month

---

## 🚀 Phase 3.3: Restaurant Guides

### Why Restaurants?
- Food tourism is huge (~40% of travel budget)
- High affiliate revenue potential
- Local expertise differentiator
- Repeat visits (users browse cities multiple times)

### Database Ready
Schema in `/src/db/schema/content.ts`:
- `restaurants` table
- `restaurant_reviews` table

### Data Import (Week 9)
- Scrape 500+ restaurants per city (top 50 cities)
- Use Google Places API or manual curation
- Import: name, cuisine, price, rating, address, website
- Data sources:
  - Michelin Guide (top restaurants)
  - Google Places ratings
  - TripAdvisor reviews
  - Manual curation of local favorites

### API Endpoints (Week 9)
```
GET    /api/restaurants         — List by city/cuisine
GET    /api/restaurants/[slug]  — Restaurant detail
POST   /api/restaurants/reviews — Submit review
```

### Components (Week 10)
- `RestaurantCard.tsx` — Preview (image, name, rating, price)
- `RestaurantDetail.tsx` — Full details + reviews + map
- `RestaurantFilter.tsx` — Filter by cuisine/price/rating
- `RestaurantMap.tsx` — Google Maps location
- `ReviewForm.tsx` — Submit restaurant review
- `ReservationButton.tsx` — Link to booking (TripAdvisor, etc)

### Pages (Week 10)
- `/[locale]/[city]/restaurants/page.tsx` — Restaurant listing
- `/[locale]/[city]/restaurants/[slug]/page.tsx` — Restaurant detail
- `/[locale]/restaurants/cuisine/[cuisine]/page.tsx` — Cuisine filter

### Content Strategy
- Manual curation of 5-10 best restaurants per city
- For top 50 cities, that's 250-500 restaurants
- Leverage existing `city_attractions` data for context
- Incentivize user reviews (gamification in Phase 4)

### Revenue Model
- **Reservation links (TripAdvisor, OpenTable):** $0.50-2 per reservation
- **Sponsored restaurants:** $100-500/month per restaurant
- **Restaurant ads:** Display ads on restaurant pages
- **Affiliate programs:** Restaurant booking platforms

**Estimated:** $1.5-3K/month

---

## 📋 Phase 3 Implementation Timeline

| Week | Task | Hours | Output |
|------|------|-------|--------|
| 6 | Blog schema + API + components | 20 | /blog pages live |
| 7 | Blog editor + listing | 18 | Admin dashboard |
| 8 | Write 20 blog posts | 40 | 20 posts live |
| 8 | Itinerary schema + API + components | 20 | /itineraries pages |
| 9 | 20 itineraries + restaurant data | 30 | Restaurant database |
| 10 | Restaurant pages + reviews | 18 | /restaurants pages |
| **TOTAL** | | **146 hours** | **3 systems live** |

---

## 🎯 Success Metrics

**Blog System:**
- 20 posts published ✓
- 30%+ of traffic from /blog ✓
- 500+ organic keywords ranked ✓
- 1000+ newsletter subscribers ✓
- $3K+ affiliate revenue ✓

**Itineraries:**
- 20 itineraries created ✓
- 10% of visitors view itinerary ✓
- 5% save to wishlists ✓
- 100+ PDF downloads ✓
- $2K+ affiliate revenue ✓

**Restaurants:**
- 250+ restaurants indexed ✓
- 5% of city page visitors view restaurants ✓
- 50+ user reviews ✓
- $500+ affiliate revenue ✓

---

## 🔧 Technical Setup

### Blog Setup
1. Create Tiptap rich text editor (for post body)
2. Implement markdown-to-HTML parsing
3. SEO meta tag generation
4. Reading time estimation algorithm
5. Comment moderation queue

### Itinerary Setup
1. Drag-drop POI ordering
2. PDF generation (PDFKit library)
3. Email itinerary feature
4. Map visualization (Mapbox)
5. Cost calculator

### Restaurant Setup
1. Google Places API integration
2. Star rating aggregation
3. Reservation widget
4. Review moderation
5. Location-based search

---

## 📝 Phase 3 Checklist

- [ ] Generate migration for blog_posts, restaurants tables
- [ ] Build blog API endpoints (6 hours)
- [ ] Build blog components (8 hours)
- [ ] Build blog admin (6 hours)
- [ ] Write 20 blog posts (40 hours)
- [ ] Build itinerary API (4 hours)
- [ ] Build itinerary components (8 hours)
- [ ] Create 20 itineraries (16 hours)
- [ ] Import restaurant data (4 hours)
- [ ] Build restaurant pages (6 hours)
- [ ] Test end-to-end
- [ ] Deploy to VPS

---

## 💰 Phase 3 Revenue Projection

| Month | Blog | Itineraries | Restaurants | Total |
|-------|------|-------------|-------------|-------|
| Launch (1st) | $1K | $500 | $200 | $1.7K |
| Month 2 | $3K | $2K | $500 | $5.5K |
| Month 3 | $5K | $4K | $1K | $10K |
| Month 4 | $8K | $5K | $1.5K | $14.5K |

**By end of Phase 3:** Cumulative $9.5-14K/month revenue from content

---

## Next After Phase 3

Once content foundation is live (Week 10):
- User engagement is high (10%+ return visitor rate)
- Revenue is flowing ($9.5K/month)
- Organic traffic is growing (+30% month-over-month)

**Then begin Phase 4:** Accommodations marketplace (the $50K/month driver)

---

## 📚 Resources Needed

- **Tiptap editor:** Rich text editing for blog posts
- **Google Places API:** Restaurant data (500K+ free requests/month)
- **Mapbox GL JS:** Map visualizations for itineraries
- **PDFKit:** PDF generation for itineraries
- **Nodemailer:** Email itineraries to users
- **TripAdvisor affiliate:** Restaurant reservation links

---

**Status:** Schema ready, documentation complete, ready to build when Phase 2 is live.

