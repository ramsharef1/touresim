# Touresim — Deep SEO Topical Map Expansion

> Companion to SEO-TOPICAL-BLUEPRINT.md.
> Goal: dominate every search intent a traveler has, at every stage of their journey.
> Each section = a new content type cluster, its URL pattern, its DB needs, and its search volume rationale.

---

## The Core Mental Model: Traveler Journey × Place × Searcher Type

Every search belongs to one of three **journey stages** and one of four **traveler types**.
We must own ALL intersections.

```
STAGE                  TRAVELER TYPES
────────────────────── ─────────────────────────────────────────────
1. Dreaming/Research   Solo · Couple/Romantic · Family · Arabic/Muslim
2. Planning/Booking
3. On-the-ground
```

The original blueprint covers Stage 1 well. This document fills **Stage 2 and 3**, plus the
**Arabic-audience edge** that no major English-first competitor has built properly.

---

## New Content Type Clusters

---

### 1. MONTH × PLACE MATRIX  *(highest volume programmatic set)*

**Why:** "Japan in April", "Bali in August", "best places to visit in January" are among
the most searched travel queries globally. Month-level pages beat seasonal pages for long-tail
specificity AND they combine easily for "best [month] destinations" hubs.

**URL patterns:**
```
/{country}/{city}/in/{month}/           → "Tokyo in April" (weather + events + tips)
/{country}/in/{month}/                  → "Japan in April"
/best-places-to-visit-in/{month}/       → cross-country hub
/best-places-to-visit-in/{month}/{type}/ → "best beach destinations in December"
```

**Volume engine:**
- 195 countries × 12 months = 2,340 country-month pages
- Top ~500 cities × 12 months = 6,000 city-month pages
- 12 monthly "best destinations" hubs
- 12 × 30 tag values = 360 "best [type] in [month]" pages

**What each page carries (unique data = quality gate):**
- Temperature range, rain days, humidity (scraped/licensed weather data)
- Active events/festivals that month
- Crowd level score (peak/shoulder/off)
- What's open vs closed
- Specific what-to-wear and what-to-pack tips

**DB addition:** `months_data` table (place_id, place_level, month 1–12, avg_temp_hi/lo,
avg_rain_days, crowd_level, peak_price_index) — this structured data is the unique-data
signal that keeps these pages out of thin-content territory.

---

### 2. COMPARISON PAGES  *(money pages, massive long-tail)*

**Why:** "X vs Y" is one of the highest-converting travel search patterns. Users at decision
point. Zero major site covers this systematically — they're all organic articles, not a
structured system. We can own this entirely with programmatic generation + unique structured data.

**URL patterns:**
```
/compare/{place-a}-vs-{place-b}/        → city or country comparisons
/compare/{place-a}-vs-{place-b}/{intent}/ → "/compare/paris-vs-rome/cost/"
```

**Key comparison types (all programmatic):**
- City vs City: "Paris vs Rome", "Bangkok vs Bali", "Dubai vs Abu Dhabi"
- Country vs Country: "Thailand vs Vietnam", "Japan vs South Korea"
- Resort vs Resort: "Maldives vs Seychelles", "Phuket vs Koh Samui"
- Neighborhood vs Neighborhood (within a city)

**What each page carries:**
- Side-by-side table: cost, weather, crowds, best for (couples/family/solo), visa, flight time from hubs
- "Best for" verdict section (drives featured snippets)
- When to choose each
- Internal links to both entities' full pages

**Generates:** ~50,000 potential city-pair pages (top 500 cities × combinatorics).
Index only pairs with real search demand (validate via research data); start with
top 200 pairs and expand.

---

### 3. QUESTION / FAQ PAGES  *(featured snippet factory)*

**Why:** Google's featured snippets and People Also Ask boxes are dominated by well-structured
Q&A content. Tourism has THOUSANDS of high-volume question queries. These pages are short,
fast to produce, and link back into the entity graph.

**URL patterns:**
```
/{country}/{city}/faq/                  → hub of all FAQs for a city
/{country}/{city}/faq/{question-slug}/  → individual question page
/{country}/faq/{question-slug}/
/faq/{universal-slug}/                  → cross-destination questions
```

**High-volume question clusters (ALL programmatic):**

*"How long" cluster:*
- "How many days in [city]?" — massive volume, every major city
- "How long to spend in [landmark]?"
- "Is [N] days enough for [destination]?"

*"Worth it" cluster:*
- "Is [destination] worth visiting?"
- "Is [landmark] worth the money?"
- "Is [destination] overrated?"
- "Is [destination] safe?"
- "Is [destination] good for families?"

*"Best time" questions:*
- "When is the best time to visit [destination]?"
- "What month is cheapest to visit [destination]?"
- "Should I avoid [destination] in [month]?"

*"What to know" cluster:*
- "Do I need a visa for [country]?"
- "What currency does [country] use?"
- "Do they speak English in [country]?"
- "What's the tipping culture in [country]?"
- "What to wear in [destination]?"

*"How to get" cluster:*
- "How to get from [airport] to [city center]?"
- "How to get from [city A] to [city B]?"
- "How to get around [city]?"

*Arabic-specific questions:*
- "Is [destination] halal-friendly?"
- "Can I find halal food in [city]?"
- "Are there mosques in [city]?"
- "Is [destination] safe for Muslim travelers?"
- "What is the dress code in [destination]?"
- "Is alcohol-free [destination] possible?"

**DB addition:** `faqs` table (entity_type, entity_id, question_slug, locale, question, answer,
schema_type: featured_snippet|how_to|faq) + `faq_translations`.
Each FAQ gets `FAQPage` schema.org markup — direct featured snippet bait.

---

### 4. NEIGHBORHOOD / DISTRICT PAGES  *(sub-city entity layer)*

**Why:** "best area to stay in Tokyo", "safest neighborhoods in Paris", "where to stay near
Colosseum" — these are high-intent, low-competition queries that major sites barely cover at
this granularity. Sub-city pages also give us another layer of internal linking and another
place-level for the intent clusters (things-to-do PER NEIGHBORHOOD).

**URL patterns:**
```
/{country}/{city}/neighborhoods/                → hub
/{country}/{city}/neighborhoods/{neighborhood}/ → neighborhood page
/{country}/{city}/neighborhoods/{neighborhood}/things-to-do/
/{country}/{city}/neighborhoods/{neighborhood}/where-to-stay/
/{country}/{city}/stay-in/{neighborhood}/       → "Where to stay in Shinjuku"
```

**What each page carries:**
- Character/vibe description
- Who it's best for (couples, budget travelers, families…)
- Price range for hotels
- Key POIs within the neighborhood (pulled from poi.neighborhood_id)
- Closest transit
- Adjacent neighborhoods (cross-links)
- "Best for" verdict

**DB addition:** `neighborhoods` table (city_id, boundary coordinates, vibe_tags…) + translations.
Link POIs to neighborhoods via `poi.neighborhood_id`.

---

### 5. "HOW TO GET FROM A TO B" TRANSPORT ROUTES  *(high-intent, underserved)*

**Why:** "how to get from Bangkok to Chiang Mai", "Tokyo to Kyoto by train", "airport to city
center" — these queries have enormous volume and are almost entirely underserved by dedicated
pages. They're pure Stage 2 (planning) intent and link naturally into affiliate (train booking,
bus tickets, transfers).

**URL patterns:**
```
/{country}/getting-around/{from-slug}-to-{to-slug}/  → "bangkok-to-chiang-mai"
/{country}/{city}/from-airport/                       → airport arrival guide
/{country}/{city}/day-trips/                          → hub
/{country}/{city}/day-trips/{destination-slug}/       → specific day trip
```

**Transport types per route:**
- Train (duration, cost, booking link)
- Bus (duration, cost, comfort level)
- Flight (when it makes sense)
- Car/rental
- Ferry (where applicable)

**Programmatic at scale:**
- Top 50 countries × avg 10 city-pairs = 500 route pages
- Every major city → its top 5 day-trip destinations = 500 × 5 = 2,500 day trip pages
- Every major airport → city center = ~200 airport guide pages

**DB addition:** `transport_routes` table (origin_city_id, dest_city_id, transport_type,
duration_min, cost_usd_approx, booking_affiliate_link, notes) + translations.

**Affiliate opportunity:** direct deep-links to Omio, Rome2Rio, train booking APIs, transfer
affiliate programs (Kiwitaxi etc.) — high conversion, unique to this page type.

---

### 6. EVENTS & FESTIVALS CALENDAR  *(evergreen + seasonal traffic spikes)*

**Why:** "cherry blossom Japan 2026", "Rio Carnival dates", "Diwali India celebrations" —
event queries spike massively in the lead-up period AND have strong evergreen search year-round.
An events layer also gives us structured data for `Event` schema.org markup, which gets
Google rich results.

**URL patterns:**
```
/{country}/festivals/                              → country festivals hub
/{country}/{city}/events/                          → city events hub
/{country}/{city}/events/{event-slug}/             → single event page
/festivals/{festival-slug}/                        → cross-country iconic event hub
/best/festivals-in/{month}/                        → "best festivals in March"
/best/festivals-in/{country}/                      → "best festivals in Japan"
```

**DB addition:** `events` table (city_id, name*, slug*, type: festival|holiday|sporting|cultural,
typical_month_start, typical_month_end, duration_days, recurrence: annual|variable,
description*, tips*, heroMediaId, indexStatus) + translations.

**Affiliate:** tour packages for major events (Carnival tours, Oktoberfest tickets, cherry
blossom cruise packages) = very high AOV affiliate clicks.

---

### 7. PACKING LISTS  *(passive traffic, linkable)*

**Why:** "what to pack for Japan in winter", "Bali packing list", "Morocco beach packing list"
— massive evergreen volume, almost no sites cover this with structured destination-specific
detail. They also act as natural link magnets from travel blogs.

**URL patterns:**
```
/{country}/packing-list/                           → base country packing list
/{country}/{city}/packing-list/                    → city-specific
/{country}/packing-list/{season}/                  → "Japan packing list winter"
/packing-list/{theme}/                             → "beach packing list", "hiking packing list"
```

**Structured data model:**
Each packing list = a set of `items` tagged by: essential/recommended/optional,
category (clothing/electronics/documents/toiletries), and notes per destination.
The destination-specific notes ARE the unique data. A "Japan packing list" that mentions
IC card for trains, pocket WiFi, coin locker bags, and specific adapter types beats
every generic list.

**DB addition:** `packing_lists` table (entity_type, entity_id, season, theme) +
`packing_items` (list_id, item_name, category, priority, destination_notes*) + translations.

---

### 8. PHOTO SPOTS & VIEWPOINTS  *(Instagram/social → SEO crossover)*

**Why:** "best photo spots in [city]", "best sunset spots in [destination]", "where to take
photos in [landmark]" — this cluster has exploded in search volume. Currently underserved with
structured data.

**URL patterns:**
```
/{country}/{city}/photo-spots/                     → hub
/{country}/{city}/photo-spots/{spot-slug}/         → individual spot
/{country}/{city}/photo-spots/{tag}/               → "sunset photo spots in Santorini"
/best/photo-spots-in/{place}/                      → cross-city programmatic
```

**What each page needs (unique data):**
- GPS coordinates
- Best time of day (golden hour, blue hour, midday OK)
- Season conditions
- How busy it gets (arrive early warning)
- Camera settings note (optional but differentiating)
- Nearest POI or transport

Photo spots are a **sub-type of POI** — tag them with `theme: instagrammable` in the
taxonomy AND give them their own cluster page. One DB entry, surfaced in two places.

---

### 9. HOTEL AREA GUIDES  *(high-conversion affiliate pages)*

**Why:** "best area to stay in Tokyo", "where to stay in Rome for first timers", "best
neighborhood for hotels in Paris" — these are pure booking intent. Booking.com pays some of
the highest commissions in travel affiliate.

**URL patterns:**
```
/{country}/{city}/where-to-stay/           → already exists (intent page)
/{country}/{city}/where-to-stay/{area}/    → NEW: per-area hotel guide
/{country}/{city}/best-hotels/             → hub
/{country}/{city}/best-hotels/{price-tier}/  → "best budget hotels in Tokyo"
/{country}/{city}/best-hotels/{theme}/       → "best romantic hotels in Paris"
```

**Structured data model:**
Hotel area guides pull from the `neighborhoods` table + `affiliate_links` keyed to that
neighborhood. Each area gets: price range, vibe, transit access, top 3 hotel picks with
Booking deep links, "best for" verdict.

**This is the highest-RPM page type in travel affiliate.** Prioritize early.

---

### 10. COST & BUDGET CALCULATORS  *(interactive + SEO)*

**Why:** "how much does a trip to Japan cost", "Thailand 2 weeks budget", "daily budget Tokyo"
— enormous volume. Interactive calculators rank AND generate backlinks (people cite them).
They're also natural AdSense inventory with high RPMs.

**URL patterns:**
```
/{country}/budget/                         → already exists (intent page — expand it)
/{country}/{city}/budget/                  → city-level cost breakdown
/trip-cost-calculator/                     → interactive tool (sitewide SEO anchor)
/cost-of-living/{city}/                    → digital nomad angle
```

**Structured approach:**
- `budget_data` table: (place_id, place_level, currency, meal_budget_low/mid/high,
  accommodation_low/mid/high, transport_daily, activity_avg, total_daily_low/mid/high,
  updated_at)
- Interactive calculator on the page (React component): user enters days + travel style →
  gets total estimate → affiliate links to flights, hotels
- This is one of the most shareable/linkable content types in travel

---

### 11. VISA GUIDES BY PASSPORT  *(Arabic-audience killer feature)*

**Why:** This is the #1 underserved niche for Arabic-speaking travelers. Saudi, UAE, Kuwaiti,
Qatari, etc. passport holders have COMPLETELY different visa requirements than Europeans.
No major English travel site covers this properly. This is a moat.

**URL patterns:**
```
/{country}/visa/                                    → already exists (intent page)
/{country}/visa/{nationality}/                      → "Japan visa for Saudi passport"
/visa-free-countries/{nationality}/                 → "visa-free countries for UAE passport"
/visa-on-arrival/{nationality}/                     → "visa on arrival for Saudi passport"
/e-visa/{country}/                                  → "Turkey e-visa guide"
```

**Volume:**
- 195 countries × top 20 nationalities (esp. GCC) = 3,900 pages
- "Visa-free for [passport]" pages = 20 nationalities = 20 high-traffic hubs
- These rank almost instantly because competition is nearly zero in Arabic

**DB addition:** `visa_requirements` table (country_id, passport_iso2, requirement_type:
visa_required|visa_on_arrival|e_visa|visa_free, max_stay_days, cost_usd, processing_days,
notes*, source_url, updated_date) + translations for the notes.

**This alone could drive significant Arabic organic traffic with very low competition.**

---

### 12. HALAL TRAVEL GUIDES  *(uncontested niche, Arabic-first edge)*

**Why:** 1.8 billion Muslims travel globally. Halal travel search volume has grown 400%+
in five years. Almost zero structured, reliable, comprehensive halal travel content exists.
This is an entirely open niche.

**URL patterns:**
```
/{country}/halal-travel/                           → country halal guide
/{country}/{city}/halal-food/                      → halal food guide
/{country}/{city}/mosques/                         → mosque finder
/{country}/muslim-friendly/                        → Muslim-friendly country overview
/halal-travel/{country}/                           → alternate URL style
/best/muslim-friendly-destinations/                → top-level hub (huge traffic)
/halal-travel/guide/                               → "Ultimate halal travel guide"
```

**What each page carries (unique data moat):**
- Number of halal-certified restaurants
- Notable mosques with addresses/prayer times
- Alcohol prevalence (low/medium/high)
- Dress code requirements/recommendations
- Ramadan considerations
- Family section availability
- Overall Muslim-friendliness score (1–5)

**DB addition:** `halal_data` table (city_id/country_id, halal_restaurants_count,
mosque_count, alcohol_prevalence, dress_code_required, ramadan_notes*, friendliness_score,
family_sections, prayer_room_airports) + translations.

---

### 13. ROAD TRIP ROUTES  *(long-form, high dwell time, strong affiliate)*

**Why:** "Japan road trip", "Morocco road trip itinerary", "Pacific Coast Highway guide" —
these are high-dwell-time pages (people study them for hours), rank for dozens of long-tail
keywords each, and carry strong rental car + hotel affiliate.

**URL patterns:**
```
/{country}/road-trips/                             → hub
/{country}/road-trips/{route-slug}/                → specific route
/{country}/road-trips/{route-slug}/{day-n}/        → day-by-day breakdown
/road-trips/{theme}/                               → "coastal road trips", "mountain road trips"
```

**Structured data model:**
`road_trips` table (country_id, route_name*, slug*, total_km, duration_days, start_city_id,
end_city_id, theme_tags, difficulty: easy|moderate|challenging) +
`road_trip_stops` (road_trip_id, city_id/poi_id, day_number, position, driving_time_from_prev,
notes*).

Affiliate: car rental (Rentalcars.com), hotels along route (Booking).

---

### 14. FIRST-TIMER VS RETURN VISITOR GUIDES  *(traveler-intent split)*

**Why:** "first time in Japan", "Tokyo beyond the tourist trail", "Japan for the second time" —
this split doubles your content for top destinations without duplication. The content genuinely
differs. And it captures both new AND experienced travelers in the same entity.

**URL patterns:**
```
/{country}/{city}/first-time/                      → first-timer guide
/{country}/{city}/beyond-the-tourist-trail/        → return visitor guide
/{country}/{city}/hidden-gems/                     → overlaps with theme tag hub
```

These are **editorial guides** (rich text body) linked to existing entities —
no new DB table needed, just new intent_type values: `first-time` and `return-visitor`.

---

### 15. DIGITAL NOMAD GUIDES  *(fast-growing niche, high-RPM ads)*

**Why:** "best cities for digital nomads", "cost of living Chiang Mai", "best co-working
spaces in Bali" — the digital nomad search cluster has doubled in 3 years. High-income
audience = premium ad RPM + affiliate for accommodation and travel insurance.

**URL patterns:**
```
/{country}/{city}/digital-nomad/                   → city digital nomad hub
/digital-nomad/{region}/                           → "best digital nomad cities in Asia"
/best/cities-for-digital-nomads/                   → global hub
/cost-of-living/{city}/                            → detailed cost breakdown
```

**DB addition:** `nomad_data` table (city_id, coworking_spaces_count, avg_monthly_rent_usd,
avg_meal_usd, internet_speed_mbps, visa_options_note*, overall_nomad_score,
best_neighborhoods_for_nomads*) + translations.

---

### 16. CRUISE PORT GUIDES  *(niche, almost no competition)*

**Why:** "what to do in [port] on a cruise stop", "best shore excursions in [port]" — cruise
travelers have 4–8 hours in port, specific needs, and very few resources serve them well.
Low competition, decent affiliate from tour operators.

**URL patterns:**
```
/{country}/{city}/cruise-port/                     → port guide
/{country}/{city}/cruise-port/excursions/          → shore excursion hub
/cruise-ports/{region}/                            → regional cruise hub
```

Add `is_cruise_port: boolean` to the `cities` table — that's all the schema needs.

---

### 17. TRAVELER-TYPE GUIDES  *(doubles coverage on existing destinations)*

Each destination gets a version for each traveler type. Same entity, completely different
content. Google treats these as separate pages with separate intents.

**URL patterns:**
```
/{country}/{city}/for-families/
/{country}/{city}/for-couples/
/{country}/{city}/for-solo-travelers/
/{country}/{city}/for-seniors/
/{country}/{city}/honeymoon/
/{country}/{city}/solo-female-travel/
/{country}/{city}/lgbtq-travel/
/{country}/{city}/budget-travel/
/{country}/{city}/luxury-travel/
```

These map to new `intent_type` values — no new table needed.

---

### 18. AIRPORT GUIDES  *(bottom of funnel, high conversion)*

**Why:** "Heathrow airport guide", "things to do at Dubai airport", "Tokyo Narita layover" —
travelers search these RIGHT BEFORE they travel. Very high purchase intent for airport hotels,
lounges, transport, eSIM.

**URL patterns:**
```
/{country}/{city}/airports/{airport-slug}/         → main airport guide
/{country}/{city}/airports/{airport-slug}/layover/ → layover guide
/{country}/{city}/from-airport/                    → getting to city (already planned)
```

**DB addition:** `airports` table (city_id, iata_code, name*, slug*, type:
international|regional, terminal_count, has_transit_hotel, has_day_use_lounge,
notes*) + translations.

Affiliate: airport hotels, lounge access (LoungeKey/Priority Pass), eSIM, car rental.

---

### 19. WEATHER PAGES (MONTH-LEVEL GRANULARITY)

**Why:** Weather is one of the most-searched travel topics. Month-level pages ("Japan weather
in April") capture much more than seasonal pages ("Japan spring"). Already planned in cluster
#1 above but worth noting as its own content type — weather pages double as the unique-data
backbone of the Month × Place matrix.

**URL patterns:**
```
/{country}/weather/                                → climate overview
/{country}/weather/{month}/                        → "Japan weather in April"
/{country}/{city}/weather/                         → city weather hub
/{country}/{city}/weather/{month}/                 → "Tokyo weather in April"
```

Weather data (licensed or scraped) IS the unique data that gates these pages for indexing.

---

## Expanded URL Map (complete picture)

```
PLACE SPINE (unchanged)
/{country}/
/{country}/{region}/
/{country}/{city}/
/{country}/{city}/attractions/{poi}/

INTENT CLUSTERS (expanded)
/{country}/{city}/things-to-do/
/{country}/{city}/where-to-stay/
/{country}/{city}/where-to-stay/{area}/         ← NEW
/{country}/{city}/best-time-to-visit/
/{country}/{city}/getting-around/
/{country}/{city}/itineraries/{n}-days/
/{country}/{city}/food/
/{country}/{city}/budget/
/{country}/visa/
/{country}/visa/{nationality}/                  ← NEW
/{country}/safety/
/{country}/weather/
/{country}/weather/{month}/                     ← NEW
/{country}/{city}/weather/{month}/              ← NEW

NEW CONTENT CLUSTERS
/{country}/{city}/in/{month}/                   ← month matrix
/{country}/in/{month}/
/best-places-to-visit-in/{month}/
/compare/{place-a}-vs-{place-b}/               ← comparisons
/{country}/{city}/faq/                          ← FAQ hub
/{country}/{city}/faq/{question-slug}/          ← individual FAQ
/{country}/{city}/neighborhoods/                ← neighborhood layer
/{country}/{city}/neighborhoods/{neighborhood}/
/{country}/{city}/from-airport/                ← transport
/{country}/getting-around/{from}-to-{to}/
/{country}/{city}/day-trips/
/{country}/{city}/day-trips/{destination}/
/{country}/festivals/                           ← events
/{country}/{city}/events/
/festivals/{festival-slug}/
/best/festivals-in/{month}/
/{country}/{city}/photo-spots/                  ← photo spots
/{country}/{city}/packing-list/                 ← packing
/{country}/packing-list/{season}/
/{country}/halal-travel/                        ← halal layer
/{country}/{city}/halal-food/
/{country}/{city}/mosques/
/best/muslim-friendly-destinations/
/{country}/road-trips/                          ← road trips
/{country}/road-trips/{route-slug}/
/{country}/{city}/digital-nomad/               ← digital nomad
/best/cities-for-digital-nomads/
/{country}/{city}/cruise-port/                  ← cruise ports
/{country}/{city}/airports/{iata}/              ← airports
/{country}/{city}/for-families/                 ← traveler types
/{country}/{city}/for-couples/
/{country}/{city}/honeymoon/
/{country}/{city}/solo-female-travel/
/{country}/{city}/first-time/                   ← visitor experience level
/{country}/{city}/beyond-the-tourist-trail/

THEMATIC / FACETED HUBS (unchanged + new)
/type/{type}/
/things-to-do/{activity}/
/best/{theme}-in-{place}/
/best/{type}-in-{place}/
/visa-free-countries/{nationality}/             ← NEW visa hubs
/visa-on-arrival/{nationality}/
/halal-travel/{region}/                         ← NEW halal hubs
/road-trips/{theme}/                            ← NEW road trip hubs
```

---

## Search Term Clusters — Master Matrix

These are the programmatic "fill the grid" patterns. Each row × column = a page.

### Matrix 1: Place × Intent (the original — already planned)
| | Things to do | Where to stay | Best time | Itinerary | Food | Budget | Visa | Safety |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Country | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| City | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |

### Matrix 2: Place × Month *(NEW — highest volume)*
195 countries × 12 months = 2,340
Top 500 cities × 12 months = 6,000
**Total: ~8,340 new indexable pages**

### Matrix 3: City × Traveler Type *(NEW)*
Top 500 cities × 9 traveler types = 4,500 pages

### Matrix 4: Country × Nationality (visa) *(NEW — Arabic edge)*
195 countries × 20 GCC/Arab nationalities = 3,900 pages
(These rank fast because competition is near zero in Arabic)

### Matrix 5: City × Duration (itinerary variants) *(expand existing)*
1 day / 2 days / 3 days / 5 days / 7 days / 10 days / 2 weeks
Top 300 cities × 7 durations = 2,100 pages

### Matrix 6: Place × Season/Month × Tag *(compound hubs)*
"Best beaches in Thailand in December" = place × type tag × month
Top 50 countries × 30 type tags × 12 months = 18,000 potential pages
(Index only where data + demand exist — but the structure is ready)

### Matrix 7: Comparison pairs *(NEW)*
Top 500 cities → ~1,000 high-demand city pairs

---

## New Question Clusters (featured snippet targets)

Group A — "How many days" (massive, almost no structured competition)
- "How many days in [city]?" → for every top 300 cities
- "Is [N] days enough for [city]?"
- "How long to spend in [landmark]?"

Group B — "Worth it" (decision-stage, high conversion)
- "Is [destination] worth visiting?"
- "Is [destination] worth it?"
- "Is [destination] overrated?"

Group C — "Best month / time"
- "Best month to visit [destination]"
- "What month is cheapest to visit [destination]?"
- "When to avoid [destination]?"

Group D — "Halal/Muslim-specific" (Arabic edge — almost zero competition)
- "Is [destination] halal-friendly?"
- "Halal food in [city]"
- "Mosques in [city]"
- "Is [destination] safe for Muslim travelers?"
- "[Destination] during Ramadan"
- "Hijab in [country] — is it required?"

Group E — "From [airport]" (bottom of funnel)
- "How to get from [airport] to [city]"
- "[Airport] to [city center] — cheapest way"
- "Taxi vs metro from [airport]"

Group F — Cost questions
- "How much does a trip to [destination] cost?"
- "[Destination] daily budget"
- "[Destination] on a shoestring budget"
- "Average hotel price in [city]"

Group G — Visa questions (Arabic edge)
- "Do [nationality] need a visa for [country]?"
- "Visa on arrival for [nationality] in [country]"
- "Visa-free countries for [nationality] passport"
- "[Country] tourist visa for [nationality] — how to apply"

---

## DB Schema Additions Required

```sql
-- Month × place data (weather, crowd, events summary)
months_data (
  place_id, place_level, month TINYINT,
  avg_temp_hi_c DECIMAL, avg_temp_lo_c DECIMAL,
  avg_rain_days TINYINT, avg_humidity_pct TINYINT,
  crowd_level ENUM('low','shoulder','peak'),
  peak_price_index DECIMAL, -- 1.0 = average, 2.0 = double
  summary* LOCALIZED TEXT
)

-- Comparisons (programmatic)
place_comparisons (
  place_a_type, place_a_id,
  place_b_type, place_b_id,
  slug, verdict_a*, verdict_b*, table_data JSON, -- side-by-side structured data
  index_status, completeness_score
)

-- FAQs (attach to any entity)
faqs (
  entity_type, entity_id,
  question_slug, question*, answer*, schema_type,
  index_status, position
)

-- Neighborhoods
neighborhoods (
  city_id, name*, slug*, vibe_tags, price_tier,
  transit_notes*, best_for_tags, hero_media_id,
  index_status, completeness_score
)

-- Transport routes
transport_routes (
  origin_city_id, dest_city_id, transport_type ENUM('train','bus','fly','ferry','drive'),
  duration_min INT, cost_usd_approx DECIMAL,
  booking_affiliate_url, frequency_note*, notes*,
  index_status
)

-- Events & festivals
events (
  city_id, name*, slug*, type ENUM('festival','holiday','sporting','cultural','market'),
  typical_month_start TINYINT, typical_month_end TINYINT,
  duration_days INT, recurrence ENUM('annual','biennial','variable'),
  description*, practical_tips*, hero_media_id,
  index_status, completeness_score
)

-- Halal data
halal_data (
  entity_type, entity_id,
  halal_restaurants_count INT, mosque_count INT,
  alcohol_prevalence ENUM('none','low','medium','high'),
  dress_code_required BOOLEAN, dress_code_notes*,
  ramadan_notes*, friendliness_score TINYINT, -- 1-5
  family_sections BOOLEAN, prayer_rooms_in_airports BOOLEAN
)

-- Visa requirements
visa_requirements (
  country_id, passport_iso2 VARCHAR(2),
  requirement_type ENUM('visa_required','visa_on_arrival','e_visa','visa_free','eta'),
  max_stay_days INT, cost_usd DECIMAL,
  processing_days_min INT, processing_days_max INT,
  apply_url VARCHAR(512), notes*, updated_date DATE
)

-- Airports
airports (
  city_id, iata_code VARCHAR(3), name*, slug*,
  type ENUM('international','regional'),
  terminal_count TINYINT, has_transit_hotel BOOLEAN,
  has_day_use_lounge BOOLEAN, notes*
)

-- Budget data
budget_data (
  place_id, place_level, currency VARCHAR(3),
  meal_budget_low DECIMAL, meal_mid DECIMAL, meal_high DECIMAL,
  hotel_budget_low DECIMAL, hotel_mid DECIMAL, hotel_high DECIMAL,
  transport_daily_avg DECIMAL, activity_avg DECIMAL,
  total_daily_low DECIMAL, total_daily_mid DECIMAL, total_daily_high DECIMAL,
  updated_at TIMESTAMP
)

-- Road trips
road_trips (city_id FK → start, total_km, duration_days, name*, slug*, theme_tags, difficulty)
road_trip_stops (road_trip_id, city_id, poi_id, day_number, position, driving_time_from_prev, notes*)

-- Nomad data
nomad_data (
  city_id, coworking_spaces_count INT,
  avg_monthly_rent_usd DECIMAL, avg_meal_usd DECIMAL,
  internet_speed_mbps INT, overall_nomad_score TINYINT,
  visa_options_note*, best_neighborhoods_note*
)
```

---

## Content Priority Stack (what to build in what order)

Ordered by: *traffic volume × competition gap × build effort × monetization*

| Priority | Content type | Why first |
|---|---|---|
| 1 | **Visa guides + visa by nationality** | Huge Arabic-audience gap, near-zero competition, ranks fast |
| 2 | **Month × place matrix** | Highest raw volume, structured data makes it quality-gateable |
| 3 | **FAQ pages** | Fastest to produce, featured snippet wins, links into everything |
| 4 | **Halal travel layer** | Uncontested niche, Arabic SEO moat, strong audience fit |
| 5 | **Hotel area guides** | Highest affiliate RPM, builds on existing city/neighborhood data |
| 6 | **Neighborhood pages** | Unlocks sub-city intent, feeds hotel area guides |
| 7 | **Transport A→B routes** | Unique data = affiliate links (Omio, Kiwitaxi), strong demand |
| 8 | **Comparisons** | Decision-stage traffic, high conversion for affiliate |
| 9 | **Events/festivals** | Seasonal spikes, schema.org rich results, tour affiliate |
| 10 | **Traveler-type pages** | Doubles city coverage, natural long-tail expansion |
| 11 | **Budget calculators** | Linkable, shareable, display-ad friendly |
| 12 | **Digital nomad guides** | High-RPM audience, clear content formula |
| 13 | **Photo spots** | Social crossover, strong backlink magnet |
| 14 | **Packing lists** | Passive long-tail traffic, easy to produce at scale |
| 15 | **Road trips** | Dwell time, affiliate, but more editorial effort |
| 16 | **Cruise port guides** | Niche moat, low competition, tour affiliate |
| 17 | **Airport guides** | High-intent bottom-of-funnel, eSIM/lounge affiliate |

---

## Total Indexable Page Estimate (quality-gated)

| Content type | Pages (gated quality) |
|---|---|
| Place spine (existing) | ~50,000 |
| Intent clusters (existing) | ~200,000 |
| Month × place matrix | ~8,000 |
| Comparisons | ~1,000 |
| FAQ pages | ~50,000 |
| Visa by nationality | ~4,000 |
| Halal guides | ~5,000 |
| Neighborhood pages | ~10,000 |
| Transport routes | ~3,000 |
| Events/festivals | ~5,000 |
| Hotel area guides | ~8,000 |
| Traveler-type pages | ~4,500 |
| Budget/calculator pages | ~3,000 |
| Photo spot pages | ~10,000 |
| Packing lists | ~3,000 |
| Digital nomad | ~500 |
| Cruise port guides | ~1,000 |
| Airport guides | ~500 |
| **TOTAL (fully built)** | **~366,000 quality pages** |

At Mediavine's ~$20 RPM (travel is premium), with 50% of pages averaging 500 sessions/month,
that's ~9.1M sessions → **~$182k/month** display alone, before affiliate.

---

## Open Items (from this expansion)
- [ ] Add new DB schema tables to Drizzle migrations
- [ ] Add new intent_type values to the `_shared.ts` enum
- [ ] Seed nationality list for visa matrix
- [ ] Decide Arabic URL slug strategy for halal/visa pages (Arabic slugs vs transliterated)
- [ ] Research which GCC nationalities to seed visa data for first
```
