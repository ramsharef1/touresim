# Tourism Platform — SEO Topical Map & Data Schema Blueprint

> The bible-for-travelers, built as an entity graph for maximum topical authority.
> Bilingual-first (Arabic default), multi-locale ready, programmatic + editorial hybrid.

---

## 0. Locked decisions

| Area | Decision |
|---|---|
| **Scope** | Whole world, all countries (seeded as data; indexed in phased tiers) |
| **Monetization** | Travel affiliate + Display ads + Sponsored/B2B |
| **Content model** | Hybrid — DB-driven programmatic + hand-written editorial |
| **Quality bar** | **Unique-data-first** — no page indexes until it carries real, unique data |
| **Languages** | Default **AR**. Launch-populate: **AR, EN, FR, TR, ES**. Schema-supported (populate later): **DE, RU, PT, IT, ZH, JA** |
| **Stack** | Next.js (App Router) + next-intl + **Drizzle ORM + MySQL** (mysql2) + custom lightweight admin. No CMS (Payload has no MySQL adapter; MySQL is a hard requirement). i18n via per-entity translation tables. |
| **Default locale** | Arabic at `/`, English at `/en`, others at `/{locale}` |

---

## 1. Core principle

Google rewards **comprehensive coverage of an entity**. We never think in "pages" — we think in **entities** (real places/things) and **tags** (the categories they belong to). One entity record is reused across unlimited category hubs, so a single landmark appears in dozens of legitimate, indexable lists **with zero duplicate content**.

```
ENTITY (one Eiffel Tower record)
   └─ surfaced on: Paris attractions · Landmarks in France · Iconic towers
                   · Romantic spots · Paid attractions · Family-friendly Paris
                   · UNESCO-adjacent · Instagrammable Paris · ...
   (each is a real hub page, all generated from tags — never copied content)
```

---

## 2. The entity graph (ERD)

```
                         ┌──────────────┐
                         │  CONTINENTS  │
                         └──────┬───────┘
                                │ 1:N
                         ┌──────▼───────┐
                         │  COUNTRIES   │──────┐
                         └──────┬───────┘      │
                                │ 1:N          │
                         ┌──────▼───────┐      │
                         │   REGIONS    │      │  (intent pages attach
                         └──────┬───────┘      │   at ANY place level)
                                │ 1:N          │
                         ┌──────▼───────┐      │
                         │    CITIES    │◄─────┤
                         └──────┬───────┘      │
                                │ 1:N          │
                         ┌──────▼───────┐      │
                         │     POIs     │ (leaf entity: attraction,
                         └──────┬───────┘  beach, museum, hotel area…)
                                │
                ┌───────────────┼────────────────┐
          M:N   │          M:N  │           M:N  │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌───────▼──────┐
        │  TAG: TYPE   │ │ TAG: THEME  │ │ TAG: ACTIVITY│   …more dimensions
        └──────────────┘ └─────────────┘ └──────────────┘

   INTENT_PAGES ── (place_id, place_level, intent_type)  → things-to-do, where-to-stay…
   GUIDES       ── editorial long-form, FK to any entity
   ITINERARIES  ── ordered list of POIs (N-day plans)
   MEDIA        ── images/galleries, FK to any entity (unique photos = quality signal)
   AFFILIATE_LINKS / SPONSORED_PLACEMENTS ── monetization, keyed to place/POI
```

---

## 3. Taxonomy — the faceted layer (your "as many categories as possible")

Each tag **dimension** is independent and generates its own hub pages. A POI carries tags across *all* relevant dimensions.

### 3.1 TYPE (what it physically is)
`beach` · `mountain` · `waterfall` · `lake` · `island` · `desert` · `cave` · `national-park` · `museum` · `gallery` · `monument` · `castle` · `palace` · `temple` · `mosque` · `church` · `ruins` · `archaeological-site` · `market` · `souk` · `square` · `bridge` · `tower` · `viewpoint` · `zoo` · `aquarium` · `theme-park` · `garden` · `hot-spring` · `glacier`

### 3.2 THEME (the vibe / who it's for)
`family-friendly` · `romantic` · `adventure` · `luxury` · `budget` · `free` · `hidden-gem` · `iconic` · `unesco` · `instagrammable` · `off-the-beaten-path` · `accessible` · `solo-travel` · `nightlife`

### 3.3 ACTIVITY (what you do there)
`hiking` · `diving` · `snorkeling` · `skiing` · `surfing` · `wildlife-safari` · `boat-tour` · `camping` · `climbing` · `cycling` · `shopping` · `food-tour` · `stargazing` · `spa-wellness`

### 3.4 SEASON / TIMING
`best-in-summer` · `best-in-winter` · `best-in-spring` · `best-in-autumn` · `year-round` · `festival-season` · `rainy-season-ok`

### 3.5 TRAVELER-INTENT (Arabic-audience edge — optional but high-value)
`halal-food-nearby` · `prayer-facilities` · `family-sections` · `visa-on-arrival` · `gcc-friendly` · `english-spoken`

> Each value above = a hub page. Cross dimensions for money pages:
> `/best/romantic-beaches-in-{country}/`, `/diving/{country}/`, `/family-friendly/{city}/`

---

## 4. URL architecture

```
/                                         Arabic home (default locale)
/en, /{locale}                            localized homes

# Place spine
/{country}/                               country hub
/{country}/{region}/                      region hub (optional level)
/{country}/{city}/                        city hub
/{country}/{city}/attractions/{poi}/      POI leaf page  ← the entity

# Intent clusters (repeat at country & city level)
/{country}/{city}/things-to-do/
/{country}/{city}/where-to-stay/
/{country}/{city}/best-time-to-visit/
/{country}/{city}/getting-around/
/{country}/{city}/food/
/{country}/{city}/itineraries/{n}-days/
/{country}/{city}/budget/
/{country}/visa/                          (country-level intents)
/{country}/safety/

# Thematic / faceted hubs (cross-place authority)
/things-to-do/{activity}/                 e.g. /things-to-do/diving/
/type/{type}/                             e.g. /type/waterfalls/
/best/{theme}-in-{place}/                 e.g. /best/free-things-in-rome/
```

**Rules**
- One canonical URL per entity. Faceted hubs are *lists that link to* entities, never copies.
- `hreflang` cluster on every URL across all locales + `x-default`.
- Breadcrumbs mirror the place spine (BreadcrumbList schema).

---

## 5. Intent-cluster matrix (the evergreen engine)

Every place level gets the applicable intents. This is what makes content "evergreen + comprehensive."

| Intent | Country | City | Primary monetization |
|---|:--:|:--:|---|
| Things to do / Top attractions | ✓ | ✓ | Display + affiliate (tours) |
| Where to stay (areas + hotels) | ✓ | ✓ | **Affiliate (Booking)** |
| Best time to visit | ✓ | ✓ | Display |
| Getting there & around | ✓ | ✓ | Affiliate (transfers, eSIM) |
| Itineraries (3/5/7-day) | ✓ | ✓ | **Affiliate (tours) + Display** |
| Food & restaurants | ✓ | ✓ | Display |
| Budget / costs | ✓ | ✓ | Display |
| Visa & entry | ✓ | — | Affiliate (insurance, eSIM) |
| Safety & customs | ✓ | — | Display |
| Weather (live + climate) | ✓ | ✓ | Display |

---

## 6. Programmatic page types + the quality gate

Each page row stores a **`completeness_score`** and an **`index_status`** (`noindex` until it passes). Go wide in the DB, narrow in the index.

**Gate criteria (example — tune per type):**
- ≥ 1 unique original/licensed photo
- ≥ N unique data points (hours, price, coordinates, specific facts)
- Min word count for the *unique* (non-boilerplate) section
- ≥ N linked child entities (e.g. a city "things-to-do" needs ≥ 8 POIs)

**Indexing tiers**
1. **Tier 1 (launch-index):** top ~30–40 countries by search demand, fully built.
2. **Tier 2:** promoted automatically as rows cross the gate.
3. **Tier 3 (data-only):** exists, internally crawlable, `noindex` until populated.

This is how we honor "whole world" scope without triggering Helpful-Content penalties.

---

## 7. Data schema (Payload collections on Postgres)

All user-facing text fields are **localized** (Payload `localized: true`) across the configured locales. Slugs are per-locale.

```ts
// payload.config — locales
localization: {
  // launch-populate: ar, en, fr, tr, es
  // schema-supported, populate in later tiers: de, ru, pt, it, zh, ja
  locales: ['ar', 'en', 'fr', 'tr', 'es', 'de', 'ru', 'pt', 'it', 'zh', 'ja'],
  defaultLocale: 'ar',
  fallback: true,
}

// SEO rule: a locale only generates indexable URLs + hreflang entries once its
// content passes the quality gate. Empty-but-fallback locales stay out of sitemaps.
```

### Collections

**`continents`** — `name*`, `slug*`, `description*`
**`countries`** — `name*`, `slug*`, `continent` (rel), `iso2`, `capital`, `currency`, `languages`, `visaSummary*`, `bestTimeSummary*`, `safetyLevel`, `heroMedia` (rel), `description*`, `completenessScore`, `indexStatus`
**`regions`** — `name*`, `slug*`, `country` (rel), `description*`
**`cities`** — `name*`, `slug*`, `country` (rel), `region` (rel, optional), `coordinates`, `population`, `description*`, `heroMedia`, `completenessScore`, `indexStatus`
**`pois`** *(the leaf entity)* — `name*`, `slug*`, `city` (rel), `coordinates`, `typeTags` (rel M:N), `themeTags` (rel M:N), `activityTags` (rel M:N), `seasonTags` (rel M:N), `intentTags` (rel M:N), `openingHours`, `priceRange`, `description*`, `tips*`, `media` (rel M:N), `affiliateProducts` (array: provider, productId, deepLink), `completenessScore`, `indexStatus`
**`tags`** — `dimension` (select: type|theme|activity|season|intent), `value`, `label*`, `slug*`, `hubIntro*` — *one table, dimension-scoped; powers every facet hub*
**`intentPages`** — `place` (polymorphic rel), `placeLevel`, `intentType` (select), `body*`, `linkedPois` (rel M:N), `completenessScore`, `indexStatus`
**`guides`** *(editorial)* — `title*`, `slug*`, `body* (rich text)`, `author`, `relatedEntities` (polymorphic), `updatedAt`, `indexStatus`
**`itineraries`** — `title*`, `slug*`, `city` (rel), `days` (array of `{dayN, pois[]}`), `body*`, `indexStatus`
**`media`** — `file`, `alt*`, `credit`, `license`, `entityRefs`
**`sponsoredPlacements`** — `advertiser`, `place` (rel), `slotType`, `creative`, `startDate`, `endDate`, `active`

> `*` = localized field. Polymorphic relations let intents/guides/media attach to any place level.

---

## 8. SEO technical layer

- **hreflang:** full reciprocal cluster per URL across all locales + `x-default` → Arabic.
- **Structured data (JSON-LD):** `TouristDestination` (places), `TouristAttraction` (POIs), `BreadcrumbList`, `FAQPage` (intent FAQs), `ItemList` (facet hubs), `Article` (guides), `LocalBusiness` where applicable.
- **Sitemaps:** segmented by type + locale (`sitemap-countries-ar.xml`…), only `index_status = indexed` URLs included; sitemap index at root.
- **Internal-link engine:** auto every POI → up to all its tag hubs + parent place; place hubs → child entities; sibling cross-links. This mesh is the topical-authority driver.
- **Rendering:** SSG/ISR for indexed pages (fast = ranking + ad viewability); revalidate on Payload publish.
- **Core Web Vitals:** image CDN, lazy media, ad-slot reservation to avoid CLS.
- **Canonical + noindex** driven directly by `index_status`.

---

## 9. Monetization wiring

| Stream | Where it lives | Schema hook |
|---|---|---|
| **Affiliate** | where-to-stay, attractions, itineraries | `pois.affiliateProducts[]`, city→Booking deep links |
| **Display** | all long-tail intent + facet hubs | ad slots in templates; AdSense → Mediavine/Raptive at ~50k sessions/mo |
| **Sponsored/B2B** | city/region hubs | `sponsoredPlacements` table, no re-architecture |

---

## 10. Phased roadmap

1. **Foundation** — Payload+Postgres, all collections, taxonomy seed, URL routing, hreflang, quality-gate/`index_status` logic, programmatic templates.
2. **Flagship build** — fully populate top ~30 countries (data + flagship editorial guides) → Tier-1 index.
3. **SEO infra** — segmented sitemaps, JSON-LD, internal-link engine.
4. **Monetize** — affiliate slots live, AdSense on.
5. **Scale outward** — auto-promote countries past the gate; expand itineraries & "best of" hubs; open sponsored slots.

---

## 11. Open items
- [ ] **Confirm launch locale list** (AR + EN + ?) — needed to finalize `payload.config` localization.
- [ ] Affiliate network sign-ups (Booking, GetYourGuide/Viator, insurance, eSIM).
- [ ] Original-photo sourcing strategy (the core unique-data signal).
- [ ] Hosting/DB choice (Vercel + managed Postgres e.g. Neon/Supabase).

> Project home (confirmed): `/Users/ramialsharef/Desktop/CLoudPros/touresim`. Separate from `telescope`.
```
