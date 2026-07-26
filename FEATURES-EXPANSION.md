# Touresim — Features Expansion Brainstorm

> Organized by impact tier. Each feature includes: what it is, why it matters for SEO/monetization/UX, and what data/schema it needs.
> 
> **Topical mapping lens:** Every feature either (a) adds a new content cluster that captures a search-intent gap, (b) generates unique structured data that passes the quality gate, or (c) serves a traveler need no competitor covers at scale across all languages.

---

## TIER 1 — Highest Impact (build first)

---

### 1. Visa Checker Tool
**What:** User selects their passport nationality → sees visa status for every country in one view. Also: select passport + destination → get full requirements (type, cost, processing time, apply link).

**Why it matters:**
- "Visa-free countries for Saudi passport" = one of the highest-volume Arabic travel queries, near-zero competition
- A single interactive tool page ranks for thousands of passport × country combinations
- Most shareable travel tool on the internet — gets backlinks naturally
- Massive Arabic SEO moat: no structured Arabic visa database exists

**Monetization:** eSIM affiliate (Airalo) + travel insurance on the result page — "you're approved, now get covered"

**Data needed:** `visa_requirements` table (already planned in expansion schema)

---

### 2. Prayer Times + Qibla Direction Per City
**What:** Every city page shows today's prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) + a Qibla compass. Integration with Aladhan API (free, accurate).

**Why it matters:**
- Zero competitors have this on travel guide pages — it's a utility only Arabic-first sites would think to build
- GCC travelers check prayer times before choosing daily itinerary timing
- Signals deep Arabic-audience understanding to Google — E-E-A-T for Muslim travel
- Drives return visits: travelers check daily during their trip
- Differentiates from every English travel site instantly

**Data needed:** City coordinates (already in schema) + Aladhan API (no cost)

---

### 3. Interactive Trip Cost Calculator
**What:** User picks destination + duration + travel style (budget/mid/luxury) + number of travelers → gets itemized cost estimate (flights, hotels, food, activities, transport) with total and daily breakdown.

**Why it matters:**
- "How much does a trip to Japan cost" = massive search volume in every language
- Interactive tools rank AND earn backlinks from bloggers who cite them
- Natural affiliate placement: "Your estimated hotel budget is $1,200 → here are options" → Booking.com deep link
- High dwell time = positive engagement signal

**Data needed:** `budget_data` table (already planned in expansion schema) + flight price ranges (can use published average data per route from GCC hubs)

---

### 4. Halal Map — Restaurant + Mosque Finder
**What:** Map-based interface per city showing: halal-certified restaurants (filterable by cuisine), mosques with prayer times, prayer rooms in malls/airports, family-section restaurants.

**Why it matters:**
- Most-requested feature by Muslim travelers, almost nowhere on the web
- Google Maps shows halal restaurants but not curated/verified halal maps per destination
- Creates a unique data moat: once you have the data, no one can replicate it quickly
- Strong return-visit use case: travelers use it live during the trip
- "Halal restaurants in Tokyo" = very high Arabic search volume, nearly zero competition

**Data needed:** `halal_locations` table (place_id, type: restaurant|mosque|prayer_room, name, address, lat/lng, verified, cuisine_type, phone, hours) + `halal_data` per city (aggregate counts already planned)

---

### 5. Itinerary PDF / Print Generator
**What:** Any itinerary page can be exported as a beautiful PDF or print-friendly version. User sees "Download this itinerary" → branded PDF with day-by-day plan, maps, tips, emergency contacts.

**Why it matters:**
- Email capture: "Enter email to get the PDF" = newsletter list building
- Backlinks: bloggers link to "download the free Japan 10-day PDF"
- WhatsApp sharing: GCC travelers share these in family/friend groups (free distribution)
- Return visits: people come back to check the online version during the trip

**Data needed:** No new schema — renders from existing `itineraries` + `itinerary_days` + `itinerary_day_pois`

---

### 6. "Best Destination for Me" Quiz
**What:** 5–7 question quiz: passport nationality → budget → travel style → interests → travel month → group type (solo/couple/family) → outputs 3–5 recommended destinations with match scores and links.

**Why it matters:**
- Extremely high engagement and share rate ("I got Japan, what did you get?")
- Captures passport data = personalizes the whole site (show visa status, halal info)
- Ranks for "where should I travel" + "best destination for [criteria]" long-tail
- Natural entry point to the whole entity graph

**Data needed:** Scoring logic using existing tag dimensions (theme, season, activity, intent) + `budget_data` ranges

---

### 7. Offline PWA + Saved Trips
**What:** Progressive Web App — travelers can save a destination guide to their phone before flying. Works fully offline: maps, itinerary, emergency contacts, phrases. "Save for offline" button on every city page.

**Why it matters:**
- GCC travelers are heavily mobile-first (high smartphone penetration)
- Major UX differentiator vs Lonely Planet (their app costs money, this is free)
- Offline access = real utility on the ground = return visits and word-of-mouth
- Push notifications: "Your trip to Tokyo is in 3 days — here's what to check"

**Data needed:** Service worker + IndexedDB caching layer. No new schema.

---

## TIER 2 — Strong Multipliers

---

### 8. Weather Comparison Tool
**What:** Compare weather across 2–3 destinations for a specific month. "Tokyo vs Paris vs Istanbul in October — which has better weather?" Side-by-side temperature, rain, humidity, crowd level.

**Why it matters:**
- Captures the entire "best time to visit" + comparison cluster simultaneously
- Unique structured data (from `months_data` table) = quality gate cleared automatically
- Highly shareable / embeddable

**Data needed:** `months_data` table (already planned in expansion schema)

---

### 9. Country Emergency Contacts Page
**What:** Every country page has a section (and a standalone page) with: police number, ambulance, fire, tourist police, nearest embassy contacts for GCC countries, hospital names.

**Why it matters:**
- Extreme E-E-A-T signal — Google loves pages that protect user safety
- "Emergency number in Japan", "tourist police in Turkey" = queries no travel site answers properly
- Used on-ground = return visits = high engagement signal
- Very easy to build programmatically from structured data

**Data needed:** `emergency_contacts` table (country_id, type: police|ambulance|fire|tourist_police, number, notes) — small and fast to seed

---

### 10. eSIM Comparison Widget
**What:** On every country and city page: "Getting connected in [country]" section showing eSIM options (Airalo, Holafly, Nomad) side by side — price per GB, coverage, validity period, buy button.

**Why it matters:**
- Airalo pays 10% affiliate commission — high conversion because travelers need this immediately
- No travel site does this systematically at scale (they just have one affiliate link)
- Structured comparison = more clicks = more commissions vs a single text link
- GCC travelers are high-income, buy eSIM without hesitation

**Data needed:** `esim_products` table (country_id, provider, price_usd, data_gb, validity_days, affiliate_link) — can be maintained manually for top 50 countries initially

---

### 11. Live Hotel Price Widget
**What:** Embedded Booking.com search widget on every city/neighborhood page showing real-time prices for the next weekend. Not static links — live inventory.

**Why it matters:**
- Transforms editorial pages into booking pages without the user leaving
- Booking.com provides a JavaScript widget for affiliates
- Drastically increases affiliate conversion vs a text link
- Users see "prices from $45/night in Istanbul" → immediate booking intent

**Data needed:** No new schema — use Booking.com affiliate widget API, keyed by city name

---

### 12. Flight Time Calculator from GCC Hubs
**What:** On every country/city page: "Flight time from [Riyadh / Dubai / Kuwait City / Doha]" with airline options and approximate price range. Pre-computed, not live (live = complex API costs).

**Why it matters:**
- GCC travelers always start planning from their home city
- "Flight from Riyadh to Tokyo hours" = very searched, very answerable
- Adds unique structured data to every country page
- Natural upsell to Skyscanner / Wego affiliate

**Data needed:** `flight_routes` table (origin_iata, dest_country_id, duration_hours, approx_price_usd, carriers) — seed top GCC hubs (RUH, DXB, KWI, DOH, BAH, MCT) × top 50 countries

---

### 13. "Locals Recommend" Micro-Reviews
**What:** Short verified tip submissions from verified locals or frequent visitors. Not TripAdvisor-style long reviews — just 1–2 sentence practical tips ("Skip the tourist restaurant at the entrance, the stalls 200m inside are better and half the price").

**Why it matters:**
- UGC = fresh content signal for Google without editorial work
- "First-hand experience" signal = survives HCU penalties
- Community flywheel: GCC expats in Tokyo/Paris/London can contribute Arabic tips
- Differentiator from Lonely Planet (no UGC) and TripAdvisor (too noisy)

**Data needed:** `tips` table (poi_id or city_id, user_id, tip_text, locale, upvotes, verified, created_at)

---

### 14. Travel Alerts / Safety Status
**What:** Every country page shows current travel advisory level (using aggregated data from UK FCO, US State Dept, Australian DFAT) + a last-updated timestamp. Color-coded: green/yellow/orange/red.

**Why it matters:**
- "Is [country] safe to travel 2026" = extremely high search volume
- Builds trust — travelers know you're giving them real safety info
- Affiliate: "Travel with confidence — get travel insurance" on any yellow/orange country

**Data needed:** `travel_advisories` table (country_id, advisory_level, source, last_updated, notes*) — can be seeded from public sources weekly

---

### 15. Currency Converter (GCC-Optimized)
**What:** On every country page: live currency converter pre-set with GCC currencies (SAR, AED, KWD, QAR, BHD, OMR) → local currency. Shows "Your 1,000 SAR = X Japanese Yen" with a "how to pay" note (cash vs card, ATM tips).

**Why it matters:**
- "SAR to JPY" queries are high volume in Arabic
- GCC travelers specifically want to know their home currency equivalent
- Practical tool = return visits during trip
- Natural placement for travel card / forex affiliate

**Data needed:** Currency codes (already in `countries.currencyCode`) + live exchange rate API (Free tier of ExchangeRate-API or Fixer.io)

---

### 16. Crowd Calendar
**What:** Visual calendar per destination showing peak/shoulder/off-peak periods, with price index, crowd level, and key events. Like a heat map across 12 months.

**Why it matters:**
- "Best time to avoid crowds in Japan" = high intent, long-tail, poorly served
- Combines `months_data` (crowd_level, peak_price_index) + `events` into a single visual
- High-dwell UI = strong engagement signal
- Naturally links to month-specific pages (Month × Place matrix)

**Data needed:** `months_data` + `events` tables (both already in expansion schema)

---

### 17. Destination Comparison (Interactive)
**What:** User picks 2 cities/countries → side-by-side comparison across: cost, weather (by month), crowd level, visa (for their passport), halal-friendliness, flight time from [home], best for (couples/families/solo).

**Why it matters:**
- "Paris vs Rome", "Thailand vs Bali", "Dubai vs Abu Dhabi" = massive comparison search volume
- Interactive version beats static articles — users can pick their own pairs
- One tool generates coverage for thousands of comparison queries
- GCC audience loves this — "Maldives vs Bali for honeymoon" is a constantly debated question

**Data needed:** Pulls from existing entity data + `budget_data` + `months_data` + `visa_requirements` + `halal_data`

---

### 18. Phrase Book / Language Helper
**What:** Per destination: essential phrases in the local language with Arabic transliteration + audio pronunciation. "How to say [thank you / where is the toilet / halal food / how much does this cost] in Japanese."

**Why it matters:**
- "Basic Japanese phrases for Arabic speakers" = entirely unserved niche
- High dwell time (people practice pronunciation)
- Differentiates from every English travel site
- Natural cross-sell to language learning apps (Duolingo affiliate)

**Data needed:** `phrasebook` table (country_id, arabic_phrase, local_phrase, transliteration, audio_url, category: essential|food|transport|emergency) — seed 20–30 phrases per country for top 30 countries

---

### 19. "What's Open Now" City Layer
**What:** On city pages: real-time status of top attractions (open/closed/limited hours), factoring in local time, day of week, and upcoming holidays. "Hagia Sophia is open now — closes in 3 hours."

**Why it matters:**
- On-ground utility = travelers bookmark city pages and check daily
- Frustration-free travel planning = strong brand loyalty
- "Is [attraction] open on [holiday]" = frequently searched, poorly answered

**Data needed:** `opening_hours` in `pois` table (already JSON column in schema) + timezone per city

---

### 20. B2B Travel Data API
**What:** A paid API giving travel agencies, apps, and tourism boards access to Touresim's structured data: POIs, halal data, visa requirements, month data, itineraries.

**Why it matters:**
- Revenue diversification beyond ads/affiliate
- Legitimizes the platform as a data authority
- Travel agencies in GCC region (major B2B market) would pay for Arabic structured data
- Creates a moat: once companies integrate your API, switching cost is high

**Data needed:** No new schema — expose existing DB via authenticated REST API with rate limiting

---

## TIER 3 — Community & Engagement

---

### 21. "My Trips" Dashboard
User account feature: save trips, mark destinations visited/wishlist, track itineraries, see personalized recommendations based on where you've been.

### 22. Travel Community Forum (per destination)
Q&A threads per destination. GCC travelers asking each other: "Best halal restaurant in Tokyo?" "Visa experience for Kuwaiti passport to Japan?" Community answers = UGC fresh content.

### 23. Trip Cost Tracker
During a trip, users can log actual spending vs the estimate. Creates data for real traveler cost reports ("real traveler spent $X/day in Tokyo in April").

### 24. WhatsApp Share Integration
Every page has one-tap WhatsApp share (dominant messaging app in GCC). Pre-formats the message with the page title + URL. GCC travelers share trip ideas constantly via WhatsApp groups.

### 25. Augmented Reality Landmark Finder (Mobile)
Point phone camera at a building → overlay shows what it is, how to get inside, price, opening hours. PWA-based using device camera + GPS. Ambitious but highly differentiating.

---

## TIER 4 — Monetization Amplifiers

---

### 26. Hotel Deal Alerts
Users set a price threshold for a hotel or city ("alert me when hotels in Istanbul drop below $80/night") → email notification with Booking.com affiliate link. High conversion: user is already committed to the trip.

### 27. Tourism Board Self-Serve Ad Portal
Tourism boards (Visit Turkey, Visit Japan, Saudi Tourism Authority) can log in, upload creatives, select target pages, set budget, and go live. No sales team needed. B2B SaaS layer on top of the content platform.

### 28. Travel Package Builder
User picks: destination + dates + style → site assembles a "package" (selected hotel + top tours + eSIM + insurance) with one total price estimate and individual affiliate links for each component.

### 29. "Price History" for Destinations
Shows when prices (hotels + flights) for a destination were historically cheapest, based on aggregated data. "January is 40% cheaper for Tokyo hotels than August." Drives booking intent on off-peak months.

### 30. Verified Travel Agent Directory
Local travel agents for GCC travelers can list themselves (paid listing). "Find a Saudi-speaking travel agent for Japan." Highly monetizable in a region where many families still book through agents.

---

## TIER 1 ADDITIONS — Arabic/GCC-Specific Edge

---

### 31. GCC Embassy Finder per Destination
**What:** Every country page lists the Saudi, UAE, Kuwaiti, Qatari, Bahraini, Omani embassy in that country — address, phone, hours, appointment link, emergency consular number.

**Why it matters:**
- "Saudi embassy in Tokyo" / "UAE embassy in Paris" = high-volume queries with zero editorial coverage
- GCC travelers need this for lost passports, emergencies, visa extensions abroad
- Structured data that no competitor has aggregated for Arabic readers
- Generates a `/{country}/embassies/{nationality}/` URL pattern — 195 × 6 GCC = 1,170 indexed pages

**Data needed:** `embassies` table (country_id, nationality_iso2, address, phone, emergency_phone, hours, appointment_url, notes*)

---

### 32. Ramadan Travel Mode
**What:** A date-aware overlay across all city/country pages. When Ramadan approaches (auto-detected), each destination gets: fasting hours at that latitude, which restaurants close, where to find iftar, Tarawih prayer locations, alcohol-free zones, a "Ramadan friendliness" rating.

**Why it matters:**
- "Travelling during Ramadan [destination]" spikes 3 weeks before Ramadan every year — near-zero competition
- Completely unserved at scale — scattered blog posts only
- Positions Touresim as the only travel platform that "gets" Muslim travelers
- Drives annual recurring traffic spikes (Ramadan moves 11 days earlier each year = always relevant)

**Data needed:** `ramadan_data` per city (iftar_restaurant_count, tarawih_locations, alcohol_prevalence_ramadan, special_notes*, friendliness_rating) + calendar logic (Hijri date API)

---

### 33. GCC School Holiday Trip Planner
**What:** Saudi/UAE/Kuwait/Qatar school calendar mapped to destination crowd levels and prices. "What to visit in Eid Al-Fitr break that isn't peak-price?" Interactive: select your country → select holiday period → get ranked destinations by value score (low crowd + good weather + affordable).

**Why it matters:**
- GCC families plan entire year's travel around school holidays — this is their #1 planning constraint
- No site addresses this systematically in Arabic
- "Where to travel in Eid 2027" = recurring high-volume query
- Generates a `/{country}/best-time-to-visit/gcc-holidays/` URL cluster

**Data needed:** `gcc_holidays` table (country_iso2, year, holiday_name, start_date, end_date) + cross-reference with `months_data.crowd_level` and `budget_data`

---

### 34. Arabic AI Trip Planner (Chat)
**What:** Claude-powered Arabic chat assistant embedded site-wide. User types in natural Arabic: "أريد رحلة ليابان 10 أيام بميزانية 15,000 ريال مع عائلتي فيها أكل حلال" → receives a tailored day-by-day itinerary, halal food notes per city, visa status for their passport, prayer time considerations, and affiliate booking links woven naturally into the response.

**Why it matters:**
- Only Arabic-first AI travel planner in existence — zero competition
- High dwell time, high intent, high conversion (itinerary → bookings)
- Each conversation surfaces entities from the database = internal linking engine
- Session data reveals which destinations users are planning → editorial priority signal
- Works in all supported languages (AR, EN, FR, TR, ES) simultaneously

**Data needed:** Reads from existing schema via API. No new tables — needs a `chat_sessions` table for persistence and analytics only.

---

### 35. Dual-Language Audio Guides per POI
**What:** Every POI page has a "Listen" button → 2–3 minute professional audio guide in Arabic (and English/French). Usable offline. AI-generated narration + human editorial review to keep cost low. Covers: what it is, why it matters, best tips, what to watch for.

**Why it matters:**
- On-ground utility — traveler stands in front of the Eiffel Tower and listens in Arabic
- Completely unserved: no Arabic audio guide exists for 99% of global attractions
- High dwell time = strong engagement metric
- Differentiates from every English travel site structurally — can't be copied without the Arabic content investment

**Data needed:** `audio_guides` table (poi_id, locale, audio_url, duration_seconds, script_text, generated_at) — storage on CDN

---

## TIER 2 ADDITIONS — Global SEO Topical Gaps

---

### 36. Solo Female Travel Safety Layer
**What:** Per city/country: a structured safety score for solo female travelers across: street harassment level (low/medium/high), solo dining comfort, night transport safety, scam targeting, dress code pressure. Plus "tips from women who've been there" micro-reviews. Covers ALL nationalities, not just GCC.

**Why it matters:**
- "Is [destination] safe for solo female travelers" = one of the highest-intent travel queries in EN/FR/ES
- HalalTrip covers Muslim women but nobody covers secular solo female travel with structured data
- Generates `/{country}/{city}/solo-female-travel/` — already in URL plan, but this gives it unique data
- Strong backlink magnet from women's travel communities

**Data needed:** `female_safety_data` table (entity_id, entity_type, harassment_level, night_transport_safety, dining_solo_comfort, overall_score, notes*) + extends existing `tips` table with `traveler_type: solo_female`

---

### 37. Travel Document Checklist Generator
**What:** User selects nationality + destination → receives a fully personalized pre-trip checklist: passport validity required (many countries need 6 months beyond stay), visa type + direct apply link, travel insurance (mandatory for some Schengen countries), vaccinations required/recommended, international driving permit, currency to bring, plug adapter type, water safety note.

**Why it matters:**
- "What documents do I need to travel to [country]" = massive volume, poorly answered with structured data
- One tool, thousands of nationality × destination combinations = programmatic SEO at scale
- PDF download = email capture + backlink bait
- Affiliate: insurance, eSIM, travel card on the result page

**Data needed:** Extends `visa_requirements` + new `entry_requirements` table (country_id, vaccination_required, vaccination_recommended, insurance_mandatory, idp_required, plug_type, water_safe, passport_validity_months_required)

---

### 38. "Things to Avoid" Cluster
**What:** Per destination: "tourist traps to avoid in [city]", "common scams in [destination]", "overrated attractions in [city]", "what NOT to do in [country]". Structured list format with brief explanations.

**Why it matters:**
- Negative content clusters are almost entirely unserved by structured databases — only scattered blog posts
- "Tourist traps in Paris" / "scams in Bangkok" = massive search volume across all languages
- Google actively surfaces these for high-competition destinations — featured snippet territory
- Unique data moat: a scored `scam_risk` field per city + `tourist_trap` flag on POIs

**Data needed:** `tourist_trap` boolean + `scam_risk_level` on `pois`; new `scam_types` table (city_id, scam_name, description*, how_to_avoid*, severity); extends existing `city` safety data

---

### 39. Dietary Filter Layer (Beyond Halal)
**What:** A site-wide dietary filter that any user can set: Halal / Vegetarian / Vegan / Gluten-free / Kosher / Pescatarian. Filters POI food recommendations, restaurant suggestions, and itinerary food stops to match. Each destination also gets a "vegetarian-friendliness" score.

**Why it matters:**
- Vegetarian/vegan travel search volume has tripled in 5 years globally
- French and German travelers heavily search "vegan [destination]" — serves those language audiences
- Kosher travel is a high-income niche with zero structured coverage outside Jewish travel blogs
- One dietary system serves 5+ distinct audience segments simultaneously

**Data needed:** `dietary_options` enum extension on `pois` (halal|vegetarian|vegan|gluten_free|kosher|pescatarian as flags); `city_dietary_scores` table (city_id, diet_type, score 1-5, restaurant_count, notes*)

---

### 40. Film & TV Location Guides
**What:** Per POI/city: "As seen in [Film/Show]" tag + dedicated hub pages. "Filming locations in Iceland", "Where was Emily in Paris filmed?", "Game of Thrones locations in Croatia." Each film/show gets its own page linking back to the real-world POIs in the entity graph.

**Why it matters:**
- "Where was [show] filmed" = one of the fastest-growing travel search clusters globally
- Creates an entirely new content dimension from existing POI data — no new place data needed, just a new tag type
- Huge in all languages: French (Emily in Paris), Arabic (Turkish dramas — massive GCC audience for Turkish filming locations), English (GOT, LOTR, etc.)
- Turkish drama tourism from GCC is a documented phenomenon — "filming locations of [Turkish series]" in Arabic = very high volume, zero competition

**Data needed:** `media_productions` table (name, type: film|tv_series, year, origin_country); `poi_productions` junction (poi_id, production_id, scene_notes*); new tag dimension `filming-location`

---

### 41. Public Holiday Lookup
**What:** Per country: a structured calendar of all public holidays for current + next year, with notes on what's open/closed, travel implications ("avoid flying on [date] — prices 3× higher"), and which holidays affect tourist sites. Interactive: "Am I traveling on a holiday?" date checker.

**Why it matters:**
- "Public holidays in [country] 2027" = high-volume, simple query, currently won by government sites
- Travelers need this to plan — editorial context (what's actually affected) beats a raw gov list
- Seasonal event cross-link: holiday dates → festivals/events layer
- Generates `/{country}/public-holidays/` + `/{country}/public-holidays/{year}/` — fresh content annually

**Data needed:** `public_holidays` table (country_id, name*, date, type: national|religious|regional, affects_tourism: boolean, notes*)

---

### 42. Plug & Adapter Guide
**What:** Per country: which plug type(s) are used, voltage, frequency, whether a converter is needed for GCC/EU/US devices. Visual illustration of the plug types. "Do I need an adapter in Japan from Saudi Arabia?"

**Why it matters:**
- "Plug adapter [country]" = millions of searches, currently owned by WikiVoyage and thin affiliate blogs
- Unique data (plug_type, voltage, frequency) = quality gate passes automatically per country
- Natural affiliate: "Buy the right adapter → Amazon link"
- Dead simple to build for 195 countries — pure programmatic

**Data needed:** `plug_types` column on `countries` (JSON array: e.g. ["A","B"]), `voltage`, `frequency` — 3 fields on the existing countries table

---

### 43. Jet Lag Calculator
**What:** User enters origin city + destination city + departure time → gets a personalized jet lag plan: when to sleep on the plane, when to get sunlight at destination, when to avoid caffeine, optimal first-day schedule. Based on circadian rhythm science.

**Why it matters:**
- "How to beat jet lag [destination]" = high volume in EN/FR/DE
- No travel site has a structured jet lag tool — only generic health articles
- Highly shareable (people tweet their jet lag plans)
- Uses city timezone data already in schema — minimal new data

**Data needed:** City timezone (add `timezone` varchar to `cities` table) + client-side calculation logic

---

### 44. Sports & Events Tourism Hub
**What:** Major recurring sporting events (Formula 1 calendar, World Cup, Olympics, tennis Grand Slams, Champions League finals) with dedicated hub pages: host city guide, ticket affiliate links, hotel price surge warnings, local fan culture notes.

**Why it matters:**
- F1 Grand Prix tourism is extremely popular with GCC audience (Saudi GP, Abu Dhabi GP are home races)
- "Where to stay for [F1 race / World Cup match]" = high-intent, high-AOV queries
- Sports tourism is a multi-billion dollar market with almost no structured editorial coverage
- Hotel bookings around major events = peak Booking.com affiliate commissions

**Data needed:** `sporting_events` table (name*, slug*, city_id, event_type, typical_month, recurrence, ticket_affiliate_url, notes*) — extends existing `events` table concept

---

### 45. Travel Insurance Comparison Widget
**What:** Per country page: structured comparison of 3–4 travel insurance options (AXA, SafetyWing, Allianz, World Nomads) with: price range for 1 week, medical coverage limit, COVID cover, adventure sports cover, emergency evacuation. "Get a quote" affiliate button.

**Why it matters:**
- Airalo pays 10%, SafetyWing pays 10–15% — comparable commissions, higher average order value
- Schengen countries REQUIRE travel insurance → France/Italy/Spain pages = 100% conversion funnel
- Currently no Arabic travel site shows structured insurance comparison
- Natural placement on visa guides: "France requires insurance → here's what to buy"

**Data needed:** `insurance_products` table (country_id, provider, weekly_price_usd, medical_limit_usd, covid_covered, adventure_covered, affiliate_url) — maintain manually for top 50 countries

---

### 46. GCC Embassy Finder per Destination *(moved to #31)*

### 46. "Book a Local Arabic-Speaking Guide" Marketplace
**What:** Arabic-speaking guides in popular destinations (Tokyo, Paris, Istanbul, Barcelona, London) list themselves with: languages spoken, specialties, price per day/half-day, photos, reviews. GCC traveler books directly. Commission: 15–20% per booking.

**Why it matters:**
- "Arabic-speaking guide in Tokyo" = frequently searched, zero structured marketplace
- Addresses the #1 service gap for GCC travelers abroad
- Community flywheel: expat Arabic communities in major cities are the supply side
- B2B potential: tour groups from Saudi Arabia book guides in bulk

**Data needed:** `guides_marketplace` table (city_id, name, bio*, languages[], specialties[], price_half_day, price_full_day, photo_url, rating, review_count, booking_url) + `guide_reviews` table

---

### 47. Children's Activity Filter + Family Score
**What:** A persistent family filter toggle on all POI and things-to-do pages. Set "traveling with children under [age]" → filters out inappropriate content, flags minimum age requirements, shows stroller accessibility, highlights kids' menus, prioritizes short-duration activities.

**Why it matters:**
- GCC families travel with 3–6 children on average — largest family travel audience globally
- "Things to do in [city] with kids" = massive search volume across ALL languages
- Currently requires manual research — no site offers a filter at destination-guide level
- Generates `/{country}/{city}/for-families/` pages with genuinely differentiated filtered content

**Data needed:** `min_age` + `stroller_accessible` + `kids_menu` + `duration_minutes` fields on `pois`; `family_score` (1-5) on cities

---

### 48. Destination Waitlist / Notify Me
**What:** For Tier 3 countries (data in DB, `noindex` until populated) — a "Notify me when [country] guide launches" button. Collects email + destination interest. Sends automated email when that country crosses the quality gate and gets indexed.

**Why it matters:**
- Builds a segmented email list organized by destination interest — free marketing channel
- Shows which countries have demand → informs which to populate next
- Zero dev complexity — just an email capture form + a trigger on `index_status` change

**Data needed:** `waitlist` table (email, entity_type, entity_id, created_at) + email provider integration (Resend/Mailgun)

---

## TIER 3 ADDITIONS — Topical Coverage Completeness

---

### 49. Medical Tourism Guide
**What:** Per country: quality rating of private hospitals, popular medical procedures travelers seek (dental, cosmetic, eye surgery, IVF), estimated cost vs home country, accreditation status (JCI), visa options for medical travel. Hub: "best countries for medical tourism."

**Why it matters:**
- Medical tourism from GCC is a multi-billion dollar market (treatment in Germany, India, Thailand, Turkey)
- "Medical tourism in [country]" = high-volume, high-intent, well-funded audience
- No Arabic guide covers this with structured data
- `/{country}/medical-tourism/` cluster + "best countries for [procedure]" hubs

**Data needed:** `medical_tourism` table (country_id, hospital_quality_score, jci_accredited_hospitals, popular_procedures[], cost_index_vs_us, medical_visa_available, notes*)

---

### 50. Shopping Guide Layer
**What:** Per city: major shopping districts, malls with notable stores, local markets, luxury brand availability, VAT refund availability + how to claim. "Can I find [brand] in [city]?" "Is [city] good for luxury shopping?"

**Why it matters:**
- Shopping is the #1 motivator for GCC travelers to Europe (London, Paris, Milan, Dubai-to-Europe)
- "Shopping in [city]" + "luxury shopping [destination]" = very high Arabic search volume
- VAT refund guides (France, UK, Italy) = practical unique content with affiliate angle (VAT refund service apps)
- Generates `/{country}/{city}/shopping/` intent cluster

**Data needed:** Extend `intentTypeValues` with `shopping`; `shopping_data` table (city_id, luxury_district, local_market, vat_refund_available, vat_rate_pct, top_malls[], notes*)

---

### 51. Tipping Guide by Country
**What:** Per country: is tipping expected? How much in restaurants / hotels / taxis / tour guides / spas? Is it rude to tip in some countries (Japan)? What currency to tip in?

**Why it matters:**
- "Tipping in [country]" = top-10 most-searched travel FAQ in every language
- Currently owned by scattered blog posts — no structured database site dominates this
- Very easy to produce: one structured row per country
- `FAQPage` schema → featured snippet on almost every query

**Data needed:** `tipping_culture` table (country_id, restaurant_pct, hotel_usd_per_night, taxi_pct, guide_usd_per_day, is_mandatory, is_insulting, notes*)

---

### 52. Water Safety & Health Guide
**What:** Per country/city: is tap water safe to drink? Is ice safe? Local health risks (dengue, malaria, altitude sickness zones), recommended vaccinations. "Can I drink tap water in [country]?"

**Why it matters:**
- "Is tap water safe in [country]" = millions of monthly searches across all languages
- Health content = high E-E-A-T signal when backed by structured, sourced data
- Natural affiliate: water purification tablets, filtered bottles (Amazon)
- Vaccination data + health advisories = content no general travel site handles with structured data

**Data needed:** `health_data` table (country_id, tap_water_safe, ice_safe, altitude_risk_zones, malaria_risk_level, dengue_risk, recommended_vaccinations[], health_notes*) 

---

### 53. Driving & Car Rental Guide per Country
**What:** Per country: which side of the road, speed limits (urban/rural/highway), blood alcohol limit, international driving permit required, road quality score, toll roads, parking tips, best car rental areas.

**Why it matters:**
- "Driving in [country] as a foreigner" = high-intent, Stage 2 planning query
- Generates `/{country}/driving/` intent cluster
- Natural affiliate: Rentalcars.com, Discover Cars — 40–70% of their margin
- Road trip pages (already planned) need this as a foundation

**Data needed:** `driving_rules` table (country_id, drive_side: left|right, speed_urban_kmh, speed_rural_kmh, speed_highway_kmh, bac_limit, idp_required, road_quality_score, toll_roads, notes*)

---

### 54. Backpacker Route Hub
**What:** Pre-built multi-country backpacker routes: "Southeast Asia backpacker route", "Balkan loop", "Central America route", "South America Gringo Trail." Each route = an ordered sequence of cities with duration, transport links, budget per leg.

**Why it matters:**
- "Backpacking [region]" = extremely high-volume long-tail cluster in EN/FR/ES/DE
- Route pages are among the highest dwell-time content in travel
- Each city in the route links back to its city page → strong internal linking
- Hostel + budget hotel affiliate (Booking.com + Hostelworld)

**Data needed:** `backpacker_routes` table (name*, slug*, region, total_days, total_budget_usd) + `backpacker_route_stops` (route_id, city_id, recommended_days, budget_per_day_usd, transport_from_prev*, notes*)

---

### 55. "Best Free Things To Do" Filter
**What:** A free-only filter across all things-to-do pages. "Free things to do in [city]" — filters POIs with `price_range = free`, surfaces free events, free museum days, free walking routes.

**Why it matters:**
- "Free things to do in [city]" = top-5 travel search pattern in every language
- Currently requires manual filtering — no travel site offers this as a structured database query
- Strong SEO: `/{country}/{city}/things-to-do/free/` = low-competition, high-intent
- Requires zero new schema — `price_range` already exists on `pois`

**Data needed:** No new schema — query existing `pois.price_range = 'free'` + extend intent page with free-filter variant

---

### 56. Sunset & Sunrise Times per City
**What:** Every city page shows today's sunrise/sunset times + best viewpoints for golden hour. Calculated from coordinates (already in schema). "What time is sunset in Santorini in September?"

**Why it matters:**
- "Sunset time in [city]" = millions of monthly queries — currently owned by timeanddate.com
- Photographers, instagrammers, romantic couples all search this
- Zero travel editorial sites answer this with structured data + best viewpoints linked
- Requires zero new data — compute from existing city coordinates using a sun position library

**Data needed:** Computed from `cities.latitude/longitude` + date — no new table needed. Links to existing `photo-spots` POIs tagged `viewpoint`

---

### 57. City Timezone Clock
**What:** Every city page shows a live clock in the local timezone. "What time is it in Tokyo right now?" with the time difference from Riyadh / Dubai / London pre-displayed.

**Why it matters:**
- "What time is it in [city]" = one of the highest-volume Google queries period
- Currently owned by timeanddate.com and worldtimeserver.com — no travel editorial site captures this
- Drives direct traffic from people who just searched the city name
- Minimal implementation: JS + timezone from city record

**Data needed:** `timezone` varchar on `cities` (e.g. "Asia/Tokyo") — one field addition

---

### 58. "Best Restaurants in [City]" Editorial Layer
**What:** Per city: curated editorial top-10 restaurants by category (fine dining, street food, local experience, best for families, vegetarian). Not a full Yelp-clone — curated editorial picks with narrative, linked to affiliate booking (TheFork/OpenTable/Sevenrooms).

**Why it matters:**
- "Best restaurants in [city]" = one of the most searched travel queries in every language
- Currently dominated by TripAdvisor (reviews, not editorial) and food-specific blogs
- An editorial pick with narrative + unique photos beats generic review aggregation post-HCU
- TheFork affiliate pays per reservation made through affiliate links

**Data needed:** `restaurants` table (city_id, name, cuisine_type, price_tier, vibe_tags[], halal_certified, vegetarian_friendly, reservation_url, affiliate_url, notes*) + translations

---

### 59. National Parks & UNESCO Sites Cluster
**What:** Dedicated hub pages for: all UNESCO World Heritage Sites per country, all national parks per country, their entry requirements, best seasons, what to see inside. Cross-linked from POIs tagged `national-park` and `unesco`.

**Why it matters:**
- UNESCO and national park tourism is a massive global travel niche
- "UNESCO sites in [country]" + "national parks in [country]" = high-volume, clear intent
- These POIs already exist in the taxonomy (tags: `national-park`, `unesco`) — just needs hub pages
- Natural affiliate: GetYourGuide tours for UNESCO sites

**Data needed:** No new schema — hub pages are tag-driven from existing `tags` table + `poi_tags`. Add `unesco_id` field to `pois` for official UNESCO references.

---

### 60. "Hidden Fees" & Tourist Taxes Alert
**What:** Per destination: structured list of tourist taxes (Italy's city tax, Bali's new levy, Amsterdam's overnight tax), resort fees not shown on Booking, unexpected costs at attractions. "What extra costs should I expect in [destination]?"

**Why it matters:**
- "Tourist tax in [country]" searches have exploded as more cities introduce them
- Travelers are frequently surprised — a page that alerts them builds deep trust
- Unique structured data = quality gate + featured snippet opportunity
- "Hidden fees in Bali", "tourist levy Japan" = easy quick-win keywords

**Data needed:** `tourist_taxes` table (country_id, city_id nullable, tax_name, amount, currency, per: per_night|per_person|per_entry, applies_to, notes*, source_url, updated_date)

---

## Feature Priority Matrix (Full)

| # | Feature | SEO Impact | Monetization | Arabic Edge | Build Effort |
|---|---|:---:|:---:|:---:|:---:|
| 1 | Visa Checker Tool | ★★★★★ | ★★★★ | ★★★★★ | Medium |
| 2 | Prayer Times + Qibla | ★★★ | ★★ | ★★★★★ | Low |
| 3 | Trip Cost Calculator | ★★★★ | ★★★★★ | ★★★ | Medium |
| 4 | Halal Map | ★★★★ | ★★★ | ★★★★★ | High |
| 5 | PDF Itinerary Export | ★★★ | ★★★ | ★★★ | Low |
| 6 | "Best for Me" Quiz | ★★★★ | ★★★ | ★★★ | Medium |
| 7 | Offline PWA | ★★ | ★★ | ★★★★ | High |
| 8 | Weather Comparison | ★★★★ | ★★★ | ★★★ | Low |
| 9 | Emergency Contacts | ★★★ | ★★ | ★★★★ | Low |
| 10 | eSIM Widget | ★★★ | ★★★★★ | ★★★ | Low |
| 11 | Live Hotel Widget | ★★★ | ★★★★★ | ★★★ | Low |
| 12 | Flight Time from GCC | ★★★★ | ★★★ | ★★★★★ | Low |
| 13 | Locals Recommend | ★★★ | ★★ | ★★★ | Medium |
| 14 | Travel Alerts | ★★★★ | ★★★ | ★★★ | Low |
| 15 | Currency Converter | ★★★ | ★★★ | ★★★★★ | Low |
| 16 | Crowd Calendar | ★★★★ | ★★★ | ★★★ | Medium |
| 17 | Destination Comparison | ★★★★★ | ★★★ | ★★★ | Medium |
| 18 | Phrase Book | ★★★ | ★★ | ★★★★★ | Medium |
| 19 | What's Open Now | ★★★ | ★★ | ★★★ | Medium |
| 20 | B2B Data API | ★★ | ★★★★★ | ★★★ | High |
| 31 | GCC Embassy Finder | ★★★★ | ★★ | ★★★★★ | Low |
| 32 | Ramadan Travel Mode | ★★★★★ | ★★★ | ★★★★★ | Medium |
| 33 | GCC School Holiday Planner | ★★★★ | ★★★ | ★★★★★ | Medium |
| 34 | Arabic AI Trip Planner | ★★★★★ | ★★★★★ | ★★★★★ | High |
| 35 | Audio Guides per POI | ★★★★ | ★★★ | ★★★★★ | High |
| 36 | Solo Female Safety Layer | ★★★★★ | ★★★ | ★★★ | Medium |
| 37 | Document Checklist Generator | ★★★★★ | ★★★★ | ★★★★ | Medium |
| 38 | "Things to Avoid" Cluster | ★★★★ | ★★ | ★★★ | Low |
| 39 | Dietary Filter Layer | ★★★★ | ★★★ | ★★★ | Medium |
| 40 | Film & TV Locations | ★★★★ | ★★★ | ★★★★ | Medium |
| 41 | Public Holiday Lookup | ★★★★ | ★★ | ★★★ | Low |
| 42 | Plug & Adapter Guide | ★★★ | ★★★ | ★★★ | Low |
| 43 | Jet Lag Calculator | ★★★ | ★★ | ★★★ | Low |
| 44 | Sports & Events Tourism | ★★★★ | ★★★★ | ★★★★ | Medium |
| 45 | Insurance Comparison Widget | ★★★★ | ★★★★ | ★★★ | Low |
| 46 | Local Arabic-Speaking Guide Marketplace | ★★★ | ★★★★★ | ★★★★★ | High |
| 47 | Children's Activity Filter | ★★★★★ | ★★★ | ★★★★★ | Medium |
| 48 | Destination Waitlist | ★★ | ★★★ | ★★★ | Low |
| 49 | Medical Tourism Guide | ★★★★ | ★★★ | ★★★★ | Medium |
| 50 | Shopping Guide Layer | ★★★★ | ★★★ | ★★★★★ | Medium |
| 51 | Tipping Guide | ★★★★★ | ★★ | ★★★ | Low |
| 52 | Water Safety & Health | ★★★★ | ★★★ | ★★★ | Low |
| 53 | Driving & Car Rental Guide | ★★★★ | ★★★★ | ★★★ | Low |
| 54 | Backpacker Route Hub | ★★★★ | ★★★ | ★★ | Medium |
| 55 | Free Things Filter | ★★★★ | ★★ | ★★★ | Low |
| 56 | Sunset & Sunrise Times | ★★★★ | ★★ | ★★★ | Low |
| 57 | City Timezone Clock | ★★★★ | ★★ | ★★★ | Low |
| 58 | Best Restaurants Layer | ★★★★ | ★★★★ | ★★★ | Medium |
| 59 | UNESCO & National Parks Cluster | ★★★★ | ★★★ | ★★★ | Low |
| 60 | Hidden Fees & Tourist Taxes | ★★★★ | ★★ | ★★★ | Low |

---

## Topical Coverage Matrix (what we now own)

Every cell = an indexable content cluster. ✓ = planned/built. → = from this expansion.

| Traveler Stage | Family | Solo | Couple | Muslim/GCC | Nomad | Budget | Luxury |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dreaming** | ✓ quiz | ✓ quiz | ✓ quiz | ✓ quiz | ✓ nomad hubs | ✓ budget hubs | ✓ luxury tag |
| **Planning** | → #47 filter | → #36 safety | ✓ romantic tag | → #33 holiday planner | ✓ nomad data | ✓ budget calc | ✓ hotel guides |
| **Booking** | ✓ hotel widget | ✓ visa tool | ✓ hotel widget | ✓ visa checker | ✓ cost-of-living | → #55 free filter | ✓ live hotel price |
| **Pre-departure** | → #37 doc checklist | → #37 doc checklist | → #37 doc checklist | → #32 Ramadan mode | → #42 plug guide | → #51 tipping guide | → #45 insurance |
| **On ground** | → #47 kids filter | → #36 safety layer | → #56 sunset times | ✓ prayer times | → #57 timezone clock | → #55 free filter | → #46 guide marketplace |
| **Post-trip** | → #48 journal | → #48 journal | → #48 journal | → #48 journal | → #23 cost tracker | → #23 cost tracker | → #23 cost tracker |
