// Full faceted taxonomy vocabulary (SEO-TOPICAL-BLUEPRINT.md §3).
// Each entry becomes a `tags` row + AR/EN `tag_translations`.
// Add more locales later; AR + EN seed at launch.

export type TagDimension = 'type' | 'theme' | 'activity' | 'season' | 'intent'

export interface SeedTag {
  dimension: TagDimension
  value: string // stable kebab key, also the English slug
  en: string
  ar: string
}

export const SEED_TAGS: SeedTag[] = [
  // ---- TYPE: what it physically is ----
  { dimension: 'type', value: 'beach', en: 'Beaches', ar: 'الشواطئ' },
  { dimension: 'type', value: 'mountain', en: 'Mountains', ar: 'الجبال' },
  { dimension: 'type', value: 'waterfall', en: 'Waterfalls', ar: 'الشلالات' },
  { dimension: 'type', value: 'lake', en: 'Lakes', ar: 'البحيرات' },
  { dimension: 'type', value: 'island', en: 'Islands', ar: 'الجزر' },
  { dimension: 'type', value: 'desert', en: 'Deserts', ar: 'الصحاري' },
  { dimension: 'type', value: 'cave', en: 'Caves', ar: 'الكهوف' },
  { dimension: 'type', value: 'national-park', en: 'National parks', ar: 'الحدائق الوطنية' },
  { dimension: 'type', value: 'museum', en: 'Museums', ar: 'المتاحف' },
  { dimension: 'type', value: 'gallery', en: 'Art galleries', ar: 'صالات العرض الفنية' },
  { dimension: 'type', value: 'monument', en: 'Monuments', ar: 'المعالم التذكارية' },
  { dimension: 'type', value: 'castle', en: 'Castles', ar: 'القلاع' },
  { dimension: 'type', value: 'palace', en: 'Palaces', ar: 'القصور' },
  { dimension: 'type', value: 'temple', en: 'Temples', ar: 'المعابد' },
  { dimension: 'type', value: 'mosque', en: 'Mosques', ar: 'المساجد' },
  { dimension: 'type', value: 'church', en: 'Churches', ar: 'الكنائس' },
  { dimension: 'type', value: 'ruins', en: 'Ruins', ar: 'الأطلال' },
  { dimension: 'type', value: 'archaeological-site', en: 'Archaeological sites', ar: 'المواقع الأثرية' },
  { dimension: 'type', value: 'market', en: 'Markets', ar: 'الأسواق' },
  { dimension: 'type', value: 'souk', en: 'Souks', ar: 'الأسواق الشعبية' },
  { dimension: 'type', value: 'square', en: 'Squares', ar: 'الساحات' },
  { dimension: 'type', value: 'bridge', en: 'Bridges', ar: 'الجسور' },
  { dimension: 'type', value: 'tower', en: 'Towers', ar: 'الأبراج' },
  { dimension: 'type', value: 'viewpoint', en: 'Viewpoints', ar: 'نقاط المشاهدة' },
  { dimension: 'type', value: 'zoo', en: 'Zoos', ar: 'حدائق الحيوان' },
  { dimension: 'type', value: 'aquarium', en: 'Aquariums', ar: 'أحواض السمك' },
  { dimension: 'type', value: 'theme-park', en: 'Theme parks', ar: 'مدن الملاهي' },
  { dimension: 'type', value: 'garden', en: 'Gardens', ar: 'الحدائق' },
  { dimension: 'type', value: 'hot-spring', en: 'Hot springs', ar: 'الينابيع الحارة' },
  { dimension: 'type', value: 'glacier', en: 'Glaciers', ar: 'الأنهار الجليدية' },

  // ---- THEME: the vibe / who it's for ----
  { dimension: 'theme', value: 'family-friendly', en: 'Family-friendly', ar: 'مناسب للعائلات' },
  { dimension: 'theme', value: 'romantic', en: 'Romantic', ar: 'رومانسي' },
  { dimension: 'theme', value: 'adventure', en: 'Adventure', ar: 'المغامرة' },
  { dimension: 'theme', value: 'luxury', en: 'Luxury', ar: 'الفخامة' },
  { dimension: 'theme', value: 'budget', en: 'Budget', ar: 'اقتصادي' },
  { dimension: 'theme', value: 'free', en: 'Free', ar: 'مجاني' },
  { dimension: 'theme', value: 'hidden-gem', en: 'Hidden gems', ar: 'الجواهر المخفية' },
  { dimension: 'theme', value: 'iconic', en: 'Iconic', ar: 'المعالم الأيقونية' },
  { dimension: 'theme', value: 'unesco', en: 'UNESCO sites', ar: 'مواقع اليونسكو' },
  { dimension: 'theme', value: 'instagrammable', en: 'Instagrammable', ar: 'مثالي للتصوير' },
  { dimension: 'theme', value: 'off-the-beaten-path', en: 'Off the beaten path', ar: 'بعيدًا عن الزحام' },
  { dimension: 'theme', value: 'accessible', en: 'Accessible', ar: 'مهيأ لذوي الاحتياجات' },
  { dimension: 'theme', value: 'solo-travel', en: 'Solo travel', ar: 'السفر الفردي' },
  { dimension: 'theme', value: 'nightlife', en: 'Nightlife', ar: 'الحياة الليلية' },

  // ---- ACTIVITY: what you do there ----
  { dimension: 'activity', value: 'hiking', en: 'Hiking', ar: 'المشي لمسافات طويلة' },
  { dimension: 'activity', value: 'diving', en: 'Diving', ar: 'الغوص' },
  { dimension: 'activity', value: 'snorkeling', en: 'Snorkeling', ar: 'الغطس' },
  { dimension: 'activity', value: 'skiing', en: 'Skiing', ar: 'التزلج' },
  { dimension: 'activity', value: 'surfing', en: 'Surfing', ar: 'ركوب الأمواج' },
  { dimension: 'activity', value: 'wildlife-safari', en: 'Wildlife safari', ar: 'رحلات السفاري' },
  { dimension: 'activity', value: 'boat-tour', en: 'Boat tours', ar: 'الجولات البحرية' },
  { dimension: 'activity', value: 'camping', en: 'Camping', ar: 'التخييم' },
  { dimension: 'activity', value: 'climbing', en: 'Climbing', ar: 'التسلق' },
  { dimension: 'activity', value: 'cycling', en: 'Cycling', ar: 'ركوب الدراجات' },
  { dimension: 'activity', value: 'shopping', en: 'Shopping', ar: 'التسوق' },
  { dimension: 'activity', value: 'food-tour', en: 'Food tours', ar: 'جولات الطعام' },
  { dimension: 'activity', value: 'stargazing', en: 'Stargazing', ar: 'مراقبة النجوم' },
  { dimension: 'activity', value: 'spa-wellness', en: 'Spa & wellness', ar: 'المنتجعات الصحية' },

  // ---- SEASON / TIMING ----
  { dimension: 'season', value: 'best-in-summer', en: 'Best in summer', ar: 'الأفضل في الصيف' },
  { dimension: 'season', value: 'best-in-winter', en: 'Best in winter', ar: 'الأفضل في الشتاء' },
  { dimension: 'season', value: 'best-in-spring', en: 'Best in spring', ar: 'الأفضل في الربيع' },
  { dimension: 'season', value: 'best-in-autumn', en: 'Best in autumn', ar: 'الأفضل في الخريف' },
  { dimension: 'season', value: 'year-round', en: 'Year-round', ar: 'طوال العام' },
  { dimension: 'season', value: 'festival-season', en: 'Festival season', ar: 'موسم المهرجانات' },
  { dimension: 'season', value: 'rainy-season-ok', en: 'Good in rainy season', ar: 'مناسب في موسم الأمطار' },

  // ---- TRAVELER-INTENT (Arabic-audience edge) ----
  { dimension: 'intent', value: 'halal-food-nearby', en: 'Halal food nearby', ar: 'طعام حلال قريب' },
  { dimension: 'intent', value: 'prayer-facilities', en: 'Prayer facilities', ar: 'مصليات متوفرة' },
  { dimension: 'intent', value: 'family-sections', en: 'Family sections', ar: 'أقسام عائلية' },
  { dimension: 'intent', value: 'visa-on-arrival', en: 'Visa on arrival', ar: 'تأشيرة عند الوصول' },
  { dimension: 'intent', value: 'gcc-friendly', en: 'GCC-friendly', ar: 'مناسب لمواطني الخليج' },
  { dimension: 'intent', value: 'english-spoken', en: 'English spoken', ar: 'الإنجليزية متداولة' },
]

/** Build a URL slug from a label (keeps Arabic letters; spaces → hyphens). */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}
