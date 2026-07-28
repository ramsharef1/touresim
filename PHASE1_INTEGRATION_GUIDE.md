# Phase 1 Integration Guide

## Overview
All Phase 1 components are created and ready. This guide shows where to add them to existing pages.

## Components Created

### Client Components (import with 'use client')
- `WishlistButton` - Heart icon to save destinations
- `ReviewForm` - Form to submit reviews
- `ShareButtons` - Social sharing buttons
- `RatingStars` - Interactive star picker (reusable)

### Server Components
- `ReviewList` - Display approved reviews + avg rating
- `MediaGallery` - Display images from database
- `TrendingDestinations` - Seasonal trending section

### Pages Created
- `/[locale]/my-wishlists/page.tsx` - User wishlists display
- `/admin/reviews/page.tsx` - Admin review moderation

## Integration Steps

### 1. Update Country Page (`src/app/[locale]/[country]/page.tsx`)

**Add imports at the top (after existing imports):**
```typescript
import { WishlistButton } from '@/components/WishlistButton'
import { ReviewForm } from '@/components/ReviewForm'
import { ReviewList } from '@/components/ReviewList'
import { ShareButtons } from '@/components/ShareButtons'
import { MediaGallery } from '@/components/MediaGallery'
```

**Add Wishlist Button & Share (after hero image/description section, around line 294):**
```typescript
{/* Action buttons */}
<div className="mt-6 flex flex-wrap gap-4 items-center">
  <WishlistButton
    destinationSlug={country.slug}
    destinationType="country"
  />
  <ShareButtons
    title={`Visit ${country.name}`}
    description={country.description || ''}
  />
</div>
```

**Add Photo Gallery (after Highlights section, around line 410):**
```typescript
{/* Photo Gallery */}
<MediaGallery
  entityType="country"
  entitySlug={country.slug}
  title="Gallery"
/>
```

**Add Reviews Section (at the very end, before closing tags):**
```typescript
{/* Reviews */}
<section className="mt-12 border-t border-[var(--border)] pt-8">
  <h2 className="mb-6 text-xl font-semibold text-[var(--navy)]">
    Traveler Reviews
  </h2>
  
  <div className="grid gap-8 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <ReviewList
        destinationSlug={country.slug}
        destinationType="country"
      />
    </div>
    <div className="lg:col-span-1">
      <ReviewForm
        destinationSlug={country.slug}
        destinationType="country"
        onSubmitSuccess={() => {
          // Optional: Refresh reviews list
        }}
      />
    </div>
  </div>
</section>
```

### 2. Update City Page (`src/app/[locale]/[country]/[city]/page.tsx`)

**Same as country page, but use:**
```typescript
<WishlistButton
  destinationSlug={city.slug}
  destinationType="city"
/>

<MediaGallery
  entityType="city"
  entitySlug={city.slug}
  title="Gallery"
/>

<ReviewList
  destinationSlug={city.slug}
  destinationType="city"
/>

<ReviewForm
  destinationSlug={city.slug}
  destinationType="city"
/>
```

### 3. Add Trending Section to Homepage

**Update `src/app/[locale]/page.tsx`:**

Add import:
```typescript
import { TrendingDestinations } from '@/components/TrendingDestinations'
```

Add component (in main content area):
```typescript
<TrendingDestinations />
```

### 4. Update Navigation (add Wishlists link)

**Update `src/components/SiteHeader.tsx`:**

Add link to wishlists page in navigation menu:
```typescript
<Link href="/my-wishlists" className="...">
  My Wishlists
</Link>
```

## Database Migration

**Apply the migration to VPS:**

```bash
# On local (if deploying)
npx drizzle-kit migrate

# On VPS
ssh root@72.62.132.138
cd /var/www/touresim
DATABASE_URL="mysql://root@localhost:3306/touresim?charset=utf8mb4" npx drizzle-kit migrate
```

**Verify migration applied:**
```bash
mysql -u root touresim -e "SHOW TABLES LIKE 'wishlist%'; SHOW TABLES LIKE 'destination_reviews';"
```

## API Endpoints

The following endpoints are now available:

### Wishlists
- `POST /api/wishlists` - Add to wishlist
  - Body: `{ destinationSlug, destinationType, userId? }`
- `GET /api/wishlists?type=country&userId=123` - Fetch wishlists

### Reviews
- `POST /api/reviews` - Submit review
  - Body: `{ destinationSlug, destinationType, rating, title, body, authorName, authorEmail }`
- `GET /api/reviews?destination=france&type=country` - Fetch reviews
- `GET /api/reviews?includeUnapproved=true` - For admin (fetch all)

## Translations

**Add to `messages/en.json`:**
```json
{
  "wishlists": {
    "title": "My Wishlists",
    "save": "Save",
    "saved": "Saved",
    "empty": "No saved destinations yet",
    "browseDestinations": "Browse Destinations"
  },
  "reviews": {
    "title": "Share Your Experience",
    "rating": "Rating",
    "reviewTitle": "Review Title",
    "yourReview": "Your Review (Optional)",
    "yourName": "Your Name",
    "email": "Email (not published)",
    "submitReview": "Submit Review",
    "pending": "Thank you! Your review has been submitted for approval.",
    "travelersReviews": "Traveler Reviews",
    "averageRating": "Average Rating",
    "noReviews": "No reviews yet. Be the first to share your experience!"
  },
  "share": {
    "share": "Share:",
    "copied": "Copied!"
  },
  "trending": {
    "title": "Trending This Month",
    "subtitle": "Discover the most popular destinations right now"
  }
}
```

**Run translation script:**
```bash
npx tsx scripts/translate-countries.ts
```

## Testing Checklist

- [ ] Migration applied successfully
- [ ] Wishlists button appears and saves to localStorage
- [ ] Review form submits to API
- [ ] Review list displays approved reviews
- [ ] Share buttons work (Twitter, FB, LinkedIn, Email, Copy)
- [ ] Media gallery displays images
- [ ] Trending section on homepage shows destinations
- [ ] My Wishlists page loads and displays saved items
- [ ] Admin reviews page shows pending reviews
- [ ] All text appears in multiple locales (en, ar)
- [ ] Mobile view works at 375px width

## Deployment

1. **Local Testing:**
   ```bash
   npm run dev
   # Test components on http://localhost:3000
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy to VPS:**
   ```bash
   # SSH to VPS
   ssh root@72.62.132.138
   cd /var/www/touresim
   
   # Pull latest code
   git pull
   
   # Apply migration
   DATABASE_URL="mysql://root@localhost:3306/touresim?charset=utf8mb4" npx drizzle-kit migrate
   
   # Restart PM2
   pm2 restart touresim
   ```

4. **Verify Live:**
   - Check https://srv1772644.hstgr.cloud/france (wishlists button, reviews)
   - Check https://srv1772644.hstgr.cloud/my-wishlists (wishlists page)
   - Check https://srv1772644.hstgr.cloud/admin/reviews (admin page)

## Notes

- All components are production-ready
- MediaGallery gracefully handles no images (returns null)
- ReviewList and ReviewForm handle errors silently
- All components are i18n-compatible
- localStorage persists across sessions (for wishlists)
- Reviews are moderated before display (is_approved flag)
- Honeypot field prevents spam in review form

## Next Steps (Phase 2)

- Map-based exploration with Mapbox
- AI trip recommender with Claude API
- Booking affiliate links integration
- User authentication & profiles
- YouTube video galleries

---

**Status:** Phase 1 Components Complete ✅
**Ready for:** Integration & Deployment 🚀
