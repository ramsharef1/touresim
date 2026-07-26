// Tier 1 place seed: top GCC-destination countries + major cities + flagship POIs.
// AR + EN translations. All places start as `indexed` so they appear immediately.

export interface SeedContinent {
  code: string
  ar: string
  en: string
  slug_ar: string
  slug_en: string
}

export interface SeedCountry {
  continentCode: string
  iso2: string
  iso3: string
  currencyCode: string
  lat: string
  lng: string
  ar: { name: string; slug: string; description: string; visaSummary: string; bestTimeSummary: string }
  en: { name: string; slug: string; description: string; visaSummary: string; bestTimeSummary: string }
  fr: { name: string; slug: string; description: string }
  tr: { name: string; slug: string; description: string }
  es: { name: string; slug: string; description: string }
}

export interface SeedCity {
  countryIso2: string
  lat: string
  lng: string
  ar: { name: string; slug: string; description: string }
  en: { name: string; slug: string; description: string }
  fr: { name: string; slug: string; description: string }
  tr: { name: string; slug: string; description: string }
  es: { name: string; slug: string; description: string }
}

export interface SeedPoi {
  citySlugEn: string
  lat: string
  lng: string
  priceRange: 'free' | 'budget' | 'moderate' | 'expensive' | 'luxury'
  openingHours: Record<string, string>
  ar: { name: string; slug: string; description: string; tips: string }
  en: { name: string; slug: string; description: string; tips: string }
}

// ---------------------------------------------------------------------------
// CONTINENTS
// ---------------------------------------------------------------------------
export const SEED_CONTINENTS: SeedContinent[] = [
  { code: 'EU', ar: 'أوروبا', en: 'Europe', slug_ar: 'urubba', slug_en: 'europe' },
  { code: 'AS', ar: 'آسيا', en: 'Asia', slug_ar: 'asiya', slug_en: 'asia' },
]

// ---------------------------------------------------------------------------
// COUNTRIES
// ---------------------------------------------------------------------------
export const SEED_COUNTRIES: SeedCountry[] = [
  {
    continentCode: 'AS',
    iso2: 'JP',
    iso3: 'JPN',
    currencyCode: 'JPY',
    lat: '36.2048',
    lng: '138.2529',
    ar: {
      name: 'اليابان',
      slug: 'japan',
      description:
        'اليابان وجهة فريدة تجمع بين الحداثة والتقاليد العريقة، مع مطبخ عالمي وطبيعة خلابة وأماكن إقامة رائعة.',
      visaSummary:
        'يحتاج مواطنو دول الخليج العربي إلى تأشيرة سياحية مسبقة للدخول إلى اليابان. يمكن التقدم بالطلب عبر السفارة اليابانية أو وكالات السفر المعتمدة. مدة الإقامة المسموح بها عادةً 15 أو 30 يومًا.',
      bestTimeSummary:
        'أفضل أوقات الزيارة: الربيع (مارس–مايو) لمشاهدة أزهار الكرز، والخريف (أكتوبر–نوفمبر) للألوان الزاهية. الصيف حار ورطب، والشتاء بارد ومناسب للتزلج في المناطق الشمالية.',
    },
    en: {
      name: 'Japan',
      slug: 'japan',
      description:
        'Japan is a unique destination blending ultramodern cities with ancient traditions, world-class cuisine, stunning nature, and exceptional hospitality.',
      visaSummary:
        'GCC nationals require a tourist visa before arrival. Apply through the Japanese embassy or authorised travel agents. Permitted stay is typically 15 or 30 days.',
      bestTimeSummary:
        'Best times: spring (March–May) for cherry blossoms, autumn (October–November) for foliage. Summer is hot and humid; winter is cold and great for skiing in the north.',
    },
    fr: {
      name: 'Japon',
      slug: 'japon',
      description:
        "Le Japon mélange harmonieusement modernité et traditions millénaires, cuisine raffinée, paysages époustouflants et hospitalité exceptionnelle.",
    },
    tr: {
      name: 'Japonya',
      slug: 'japonya',
      description:
        "Japonya, ultramodern şehirleri antik geleneklerle buluşturan, dünya mutfağı ve doğal güzellikleriyle eşsiz bir destinasyondur.",
    },
    es: {
      name: 'Japón',
      slug: 'japon',
      description:
        "Japón combina ciudades ultramodernas con tradiciones milenarias, gastronomía de clase mundial y una hospitalidad excepcional.",
    },
  },
  {
    continentCode: 'EU',
    iso2: 'FR',
    iso3: 'FRA',
    currencyCode: 'EUR',
    lat: '46.2276',
    lng: '2.2137',
    ar: {
      name: 'فرنسا',
      slug: 'france',
      description:
        'فرنسا وجهة سياحية لا مثيل لها، تضم باريس عاصمة الأنوار والقصور التاريخية وشاطئ الريفيرا الفرنسية ومطبخًا عالميًا شهيرًا.',
      visaSummary:
        'تتطلب فرنسا تأشيرة شنغن لمعظم دول الخليج. يُشترط وجود تأمين سفر ساري المفعول لتغطية الإقامة بأكملها. تُقدَّم الطلبات عبر السفارة الفرنسية أو مراكز التأشيرات المعتمدة.',
      bestTimeSummary:
        'أفضل أوقات الزيارة: الربيع (أبريل–يونيو) والخريف (سبتمبر–أكتوبر) حين يكون الطقس معتدلًا والمعالم أقل ازدحامًا. الصيف موسم الذروة وأسعار الفنادق في أعلاها.',
    },
    en: {
      name: 'France',
      slug: 'france',
      description:
        'France offers an unmatched combination of world-class art, iconic architecture, the French Riviera, Michelin-starred cuisine, and Paris — arguably the most visited city on earth.',
      visaSummary:
        'Most GCC nationals require a Schengen visa. Travel insurance covering the full stay is mandatory. Apply via the French embassy or authorised visa centres.',
      bestTimeSummary:
        'Best times: spring (April–June) and autumn (September–October) for mild weather and fewer crowds. Summer is peak season with high hotel prices.',
    },
    fr: {
      name: 'France',
      slug: 'france',
      description:
        "La France offre un mélange incomparable d'art, d'architecture iconique, de Riviera, de cuisine étoilée et de Paris, la ville lumière.",
    },
    tr: {
      name: 'Fransa',
      slug: 'fransa',
      description:
        "Fransa; dünya standartlarında sanat, ikonik mimari, Fransız Rivierası, Michelin yıldızlı mutfak ve Paris'i bir arada sunar.",
    },
    es: {
      name: 'Francia',
      slug: 'francia',
      description:
        "Francia ofrece una combinación incomparable de arte, arquitectura icónica, la Riviera Francesa, gastronomía estrellada y la ciudad de París.",
    },
  },
  {
    continentCode: 'AS',
    iso2: 'TR',
    iso3: 'TUR',
    currencyCode: 'TRY',
    lat: '38.9637',
    lng: '35.2433',
    ar: {
      name: 'تركيا',
      slug: 'turkey',
      description:
        'تركيا وجهة مفضلة لدى الخليجيين تجمع بين التاريخ الإسلامي والعمارة الرائعة والمطبخ اللذيذ والطبيعة الخلابة بأسعار معقولة.',
      visaSummary:
        'يمكن لمواطني دول الخليج الحصول على تأشيرة إلكترونية (e-Visa) عبر الإنترنت قبل السفر، أو التأشيرة عند الوصول في بعض المطارات. السعر حوالي 50 دولارًا لمدة إقامة تصل إلى 90 يومًا.',
      bestTimeSummary:
        'أفضل أوقات الزيارة: الربيع (أبريل–مايو) والخريف (سبتمبر–نوفمبر) لاعتدال الطقس. الصيف حار جدًا في الداخل لكن مثالي لشواطئ إيجة والبحر الأبيض المتوسط.',
    },
    en: {
      name: 'Turkey',
      slug: 'turkey',
      description:
        'Turkey is a top GCC-favourite destination combining Islamic history, stunning architecture, delicious cuisine, and beautiful nature at accessible prices.',
      visaSummary:
        'Most GCC nationals can obtain an e-Visa online before travel or visa-on-arrival at major airports. Cost around $50 for stays up to 90 days.',
      bestTimeSummary:
        'Best times: spring (April–May) and autumn (September–November) for mild weather. Summer is very hot inland but ideal for Aegean and Mediterranean beaches.',
    },
    fr: {
      name: 'Turquie',
      slug: 'turquie',
      description:
        "La Turquie combine histoire islamique, architecture époustouflante, cuisine délicieuse et nature magnifique à des prix accessibles.",
    },
    tr: {
      name: 'Türkiye',
      slug: 'turkiye',
      description:
        "Türkiye; İslam tarihi, muhteşem mimari, lezzetli mutfak ve güzel doğayı uygun fiyatlarla bir araya getirir.",
    },
    es: {
      name: 'Turquía',
      slug: 'turquia',
      description:
        "Turquía combina historia islámica, arquitectura impresionante, deliciosa gastronomía y naturaleza hermosa a precios accesibles.",
    },
  },
  {
    continentCode: 'AS',
    iso2: 'TH',
    iso3: 'THA',
    currencyCode: 'THB',
    lat: '15.8700',
    lng: '100.9925',
    ar: {
      name: 'تايلاند',
      slug: 'thailand',
      description:
        'تايلاند وجهة مثالية للعائلات والأفراد تجمع بين الشواطئ النقية والمعابد البوذية والمطبخ الشهير والأسعار الاقتصادية.',
      visaSummary:
        'يحق لمواطني معظم دول الخليج الدخول إلى تايلاند بدون تأشيرة لمدة تصل إلى 30 يومًا. يمكن التمديد للمقيمين داخل البلاد.',
      bestTimeSummary:
        'أفضل أوقات الزيارة: نوفمبر–فبراير حين يكون الطقس جافًا وبارد نسبيًا. الصيف موسم الأمطار لكن الأسعار أقل والازدحام أخف.',
    },
    en: {
      name: 'Thailand',
      slug: 'thailand',
      description:
        'Thailand is a paradise for families and solo travelers alike, offering pristine beaches, Buddhist temples, world-famous street food, and exceptional value.',
      visaSummary:
        'Most GCC nationals can enter Thailand visa-free for up to 30 days. Extensions are available in-country.',
      bestTimeSummary:
        'Best time: November–February for dry, cooler weather. Summer is rainy season but prices are lower and crowds thinner.',
    },
    fr: {
      name: 'Thaïlande',
      slug: 'thailande',
      description:
        "La Thaïlande est un paradis pour les familles et les voyageurs solo : plages immaculées, temples bouddhistes et street food mondialement célèbre.",
    },
    tr: {
      name: 'Tayland',
      slug: 'tayland',
      description:
        "Tayland, aileler ve yalnız gezginler için cennet gibi bir destinasyondur; bozulmamış plajlar, Budist tapınaklar ve ünlü sokak yemekleri sunar.",
    },
    es: {
      name: 'Tailandia',
      slug: 'tailandia',
      description:
        "Tailandia es un paraíso para familias y viajeros en solitario: playas vírgenes, templos budistas y comida callejera mundialmente famosa.",
    },
  },
  {
    continentCode: 'EU',
    iso2: 'IT',
    iso3: 'ITA',
    currencyCode: 'EUR',
    lat: '41.8719',
    lng: '12.5674',
    ar: {
      name: 'إيطاليا',
      slug: 'italy',
      description:
        'إيطاليا كنز لا ينضب من الفن والتاريخ والعمارة والمطبخ والطبيعة، وتضم أكبر عدد من مواقع التراث العالمي لليونسكو في العالم.',
      visaSummary:
        'تتطلب إيطاليا تأشيرة شنغن لمعظم دول الخليج. التأمين على السفر إلزامي. تُقدَّم الطلبات عبر السفارة الإيطالية أو مراكز التأشيرات المعتمدة.',
      bestTimeSummary:
        'أفضل أوقات الزيارة: أبريل–يونيو وسبتمبر–أكتوبر لاعتدال الطقس وانخفاض الازدحام نسبيًا. الصيف حار جدًا وأسعار السياحة في ذروتها.',
    },
    en: {
      name: 'Italy',
      slug: 'italy',
      description:
        'Italy is an inexhaustible treasury of art, history, architecture, cuisine, and landscape — home to more UNESCO World Heritage Sites than any other country.',
      visaSummary:
        'Most GCC nationals require a Schengen visa. Travel insurance is mandatory. Apply via the Italian embassy or authorised visa centres.',
      bestTimeSummary:
        'Best times: April–June and September–October for mild weather and manageable crowds. Summer is extremely hot and peak-priced.',
    },
    fr: {
      name: 'Italie',
      slug: 'italie',
      description:
        "L'Italie est un trésor inépuisable d'art, d'histoire, d'architecture, de gastronomie et de paysages, avec le plus grand nombre de sites UNESCO au monde.",
    },
    tr: {
      name: 'İtalya',
      slug: 'italya',
      description:
        "İtalya; sanat, tarih, mimari, mutfak ve doğanın tükenmez hazinesini barındırır ve dünyada en fazla UNESCO Dünya Mirası Alanı'na sahip ülkedir.",
    },
    es: {
      name: 'Italia',
      slug: 'italia',
      description:
        "Italia es un tesoro inagotable de arte, historia, arquitectura, gastronomía y paisajes, con más Sitios Patrimonio de la UNESCO que cualquier otro país.",
    },
  },
]

// ---------------------------------------------------------------------------
// CITIES
// ---------------------------------------------------------------------------
export const SEED_CITIES: SeedCity[] = [
  // Japan
  {
    countryIso2: 'JP',
    lat: '35.6762',
    lng: '139.6503',
    ar: { name: 'طوكيو', slug: 'tokyo', description: 'طوكيو عاصمة اليابان، مزيج مثير من الحداثة والتقاليد مع مطبخ عالمي لا مثيل له وحياة ليلية نابضة.' },
    en: { name: 'Tokyo', slug: 'tokyo', description: 'Tokyo is Japan\'s capital — a thrilling mix of ultramodern skyscrapers and ancient temples, world-class food, and electric nightlife.' },
    fr: { name: 'Tokyo', slug: 'tokyo', description: 'Tokyo est la capitale du Japon, un mélange fascinant de gratte-ciels ultramodernes et de temples anciens, de gastronomie mondiale et de vie nocturne électrique.' },
    tr: { name: 'Tokyo', slug: 'tokyo', description: 'Tokyo, Japonya\'nın başkenti; ultramodern gökdelenler ve antik tapınakların, dünya mutfağının ve elektrikli gece hayatının büyüleyici karışımıdır.' },
    es: { name: 'Tokio', slug: 'tokio', description: 'Tokio, la capital de Japón, es una emocionante mezcla de rascacielos ultramodernos y templos ancestrales, gastronomía de clase mundial y vida nocturna electrizante.' },
  },
  {
    countryIso2: 'JP',
    lat: '35.0116',
    lng: '135.7681',
    ar: { name: 'كيوتو', slug: 'kyoto', description: 'كيوتو عاصمة اليابان القديمة، تضم أكثر من ألفي معبد وضريح وحدائق تقليدية يابانية خلابة.' },
    en: { name: 'Kyoto', slug: 'kyoto', description: 'Kyoto is Japan\'s ancient imperial capital, home to over 2,000 temples, shrines, and exquisite traditional Japanese gardens.' },
    fr: { name: 'Kyoto', slug: 'kyoto', description: 'Kyoto est l\'ancienne capitale impériale du Japon, avec plus de 2 000 temples, sanctuaires et jardins japonais traditionnels exquis.' },
    tr: { name: 'Kyoto', slug: 'kyoto', description: 'Kyoto, Japonya\'nın antik imparatorluk başkenti; 2.000\'den fazla tapınak, türbe ve geleneksel Japon bahçesine ev sahipliği yapar.' },
    es: { name: 'Kioto', slug: 'kioto', description: 'Kioto es la antigua capital imperial de Japón, con más de 2.000 templos, santuarios y exquisitos jardines japoneses tradicionales.' },
  },
  // France
  {
    countryIso2: 'FR',
    lat: '48.8566',
    lng: '2.3522',
    ar: { name: 'باريس', slug: 'paris', description: 'باريس عاصمة الأنوار، وجهة أحلام كل مسافر تضم برج إيفل والمتاحف الشهيرة والمطبخ الفرنسي الأصيل وأجمل حدائق العالم.' },
    en: { name: 'Paris', slug: 'paris', description: 'Paris, the City of Light, is a dream destination for every traveler — home to the Eiffel Tower, world-famous museums, authentic French cuisine, and some of the world\'s most beautiful gardens.' },
    fr: { name: 'Paris', slug: 'paris', description: 'Paris, la Ville Lumière, est la destination de rêve par excellence, avec la Tour Eiffel, des musées mondialement célèbres, la gastronomie française et de magnifiques jardins.' },
    tr: { name: 'Paris', slug: 'paris', description: 'Işıklar Şehri Paris, her gezginin rüyasındaki destinasyon; Eyfel Kulesi, dünyaca ünlü müzeler, otantik Fransız mutfağı ve dünyanın en güzel bahçeleri burada.' },
    es: { name: 'París', slug: 'paris', description: 'París, la Ciudad de la Luz, es el destino de ensueño de todo viajero: la Torre Eiffel, museos mundialmente famosos, auténtica gastronomía francesa y los jardines más bellos del mundo.' },
  },
  // Turkey
  {
    countryIso2: 'TR',
    lat: '41.0082',
    lng: '28.9784',
    ar: { name: 'إسطنبول', slug: 'istanbul', description: 'إسطنبول مدينة تجمع قارتين تاريخيًا وجغرافيًا، تضم آيا صوفيا والمسجد الأزرق والأسواق التقليدية والمطبخ التركي الشهير.' },
    en: { name: 'Istanbul', slug: 'istanbul', description: 'Istanbul bridges two continents historically and geographically, home to Hagia Sophia, the Blue Mosque, vibrant bazaars, and world-renowned Turkish cuisine.' },
    fr: { name: 'Istanbul', slug: 'istanbul', description: 'Istanbul relie deux continents historiquement et géographiquement, avec Sainte-Sophie, la Mosquée Bleue, des bazars animés et une cuisine turque mondialement reconnue.' },
    tr: { name: 'İstanbul', slug: 'istanbul', description: 'İstanbul, tarihsel ve coğrafi olarak iki kıtayı birleştiren bir şehirdir; Ayasofya, Sultanahmet Camii, canlı çarşılar ve dünyaca ünlü Türk mutfağına ev sahipliği yapar.' },
    es: { name: 'Estambul', slug: 'estambul', description: 'Estambul une dos continentes histórica y geográficamente; alberga Santa Sofía, la Mezquita Azul, animados bazares y la mundialmente reconocida gastronomía turca.' },
  },
  {
    countryIso2: 'TR',
    lat: '38.4237',
    lng: '27.1428',
    ar: { name: 'إزمير', slug: 'izmir', description: 'إزمير ثالث أكبر مدن تركيا، مدينة ساحلية حديثة بجانب آثار أفسس التاريخية الرائعة وشواطئ بحر إيجة.' },
    en: { name: 'Izmir', slug: 'izmir', description: 'Izmir is Turkey\'s third-largest city, a cosmopolitan coastal gem close to the ancient ruins of Ephesus and the beautiful Aegean beaches.' },
    fr: { name: 'Izmir', slug: 'izmir', description: 'Izmir est la troisième ville de Turquie, un joyau côtier cosmopolite proche des ruines antiques d\'Éphèse et des belles plages de la mer Égée.' },
    tr: { name: 'İzmir', slug: 'izmir', description: 'İzmir, Türkiye\'nin üçüncü büyük şehri; antik Efes harabelerine ve güzel Ege plajlarına yakın, kozmopolit bir kıyı şehridir.' },
    es: { name: 'Esmirna', slug: 'esmirna', description: 'Esmirna es la tercera ciudad más grande de Turquía, una cosmopolita joya costera cercana a las ruinas antiguas de Éfeso y las hermosas playas del Egeo.' },
  },
  // Thailand
  {
    countryIso2: 'TH',
    lat: '13.7563',
    lng: '100.5018',
    ar: { name: 'بانكوك', slug: 'bangkok', description: 'بانكوك عاصمة تايلاند النابضة بالحياة، تضم المعابد الذهبية والأسواق العائمة والمطبخ الشهير والحياة الليلية الأسطورية.' },
    en: { name: 'Bangkok', slug: 'bangkok', description: 'Bangkok is Thailand\'s pulsating capital — golden temples, floating markets, legendary street food, and a nightlife scene unlike anywhere else on earth.' },
    fr: { name: 'Bangkok', slug: 'bangkok', description: 'Bangkok est la capitale palpitante de la Thaïlande : temples dorés, marchés flottants, street food légendaire et vie nocturne incomparable.' },
    tr: { name: 'Bangkok', slug: 'bangkok', description: 'Bangkok, Tayland\'ın hayat dolu başkenti; altın tapınaklar, yüzen pazarlar, efsanevi sokak yemekleri ve eşsiz bir gece hayatı sunar.' },
    es: { name: 'Bangkok', slug: 'bangkok', description: 'Bangkok es la pulsante capital de Tailandia: templos dorados, mercados flotantes, comida callejera legendaria y una vida nocturna incomparable.' },
  },
  // Italy
  {
    countryIso2: 'IT',
    lat: '41.9028',
    lng: '12.4964',
    ar: { name: 'روما', slug: 'rome', description: 'روما "المدينة الأبدية"، تضم أعظم آثار الحضارة الرومانية والفنون العالمية والمطبخ الإيطالي الأصيل في قلب أوروبا.' },
    en: { name: 'Rome', slug: 'rome', description: 'Rome, the Eternal City, houses the greatest monuments of Roman civilisation, world-class art, and authentic Italian cuisine at the heart of Europe.' },
    fr: { name: 'Rome', slug: 'rome', description: 'Rome, la Ville Éternelle, abrite les plus grands monuments de la civilisation romaine, un art de classe mondiale et une gastronomie italienne authentique.' },
    tr: { name: 'Roma', slug: 'roma', description: 'Ebedi Şehir Roma; Roma medeniyetinin en büyük anıtlarını, dünya standartlarında sanatı ve otantik İtalyan mutfağını barındırır.' },
    es: { name: 'Roma', slug: 'roma', description: 'Roma, la Ciudad Eterna, alberga los mayores monumentos de la civilización romana, arte de clase mundial y auténtica gastronomía italiana.' },
  },
]

// ---------------------------------------------------------------------------
// POIs
// ---------------------------------------------------------------------------
export const SEED_POIS: SeedPoi[] = [
  // Tokyo
  {
    citySlugEn: 'tokyo',
    lat: '35.7148',
    lng: '139.7967',
    priceRange: 'free',
    openingHours: { mon: '24 hours', tue: '24 hours', wed: '24 hours', thu: '24 hours', fri: '24 hours', sat: '24 hours', sun: '24 hours' },
    ar: {
      name: 'معبد سينسو-جي',
      slug: 'sensoji-temple',
      description: 'أشهر معابد اليابان وأقدمها في طوكيو، يقع في حي أساكوسا التاريخي. بُني عام 645 م وتزوره ملايين الزوار سنويًا.',
      tips: 'زر المعبد باكرًا صباحًا لتجنب ازدحام السياح. ارتدِ ملابس محترمة. لا تفوّت السوق التقليدي في شارع ناكامياسي المحاذي للمعبد.',
    },
    en: {
      name: 'Senso-ji Temple',
      slug: 'sensoji-temple',
      description: 'Japan\'s most famous and oldest temple in Tokyo, located in the historic Asakusa district. Built in 645 AD, it welcomes millions of visitors each year.',
      tips: 'Visit early morning to avoid crowds. Dress respectfully. Don\'t miss the Nakamise shopping street leading to the temple.',
    },
  },
  {
    citySlugEn: 'tokyo',
    lat: '35.6586',
    lng: '139.7454',
    priceRange: 'expensive',
    openingHours: { tue: '09:00–23:00', wed: '09:00–23:00', thu: '09:00–23:00', fri: '09:00–23:00', sat: '09:00–23:00', sun: '09:00–23:00' },
    ar: {
      name: 'برج طوكيو',
      slug: 'tokyo-tower',
      description: 'أيقونة طوكيو المضيئة، برج أحمر وأبيض ارتفاعه 333 مترًا يطل على المدينة. يوفر مستويين للمشاهدة مع مناظر بانورامية مذهلة.',
      tips: 'أفضل وقت لزيارته عند الغروب لمشاهدة المدينة والبرج مضاءين معًا. احجز التذاكر مسبقًا في عطلات نهاية الأسبوع.',
    },
    en: {
      name: 'Tokyo Tower',
      slug: 'tokyo-tower',
      description: 'Tokyo\'s iconic red-and-white lattice tower stands 333 m tall with two observation decks offering sweeping panoramic views of the city.',
      tips: 'Visit at sunset to see the city and tower illuminated together. Book tickets in advance on weekends.',
    },
  },
  {
    citySlugEn: 'tokyo',
    lat: '35.6594',
    lng: '139.7006',
    priceRange: 'free',
    openingHours: { mon: '05:00–23:00', tue: '05:00–23:00', wed: '05:00–23:00', thu: '05:00–23:00', fri: '05:00–23:00', sat: '05:00–23:00', sun: '05:00–23:00' },
    ar: {
      name: 'حديقة شيبويا',
      slug: 'shibuya',
      description: 'ملتقى شيبويا هو تقاطع الشوارع الأكثر ازدحامًا في العالم، يعبره أكثر من مليون شخص يوميًا. قلب التسوق والثقافة الشبابية في طوكيو.',
      tips: 'استقل مترو طوكيو للوصول بسهولة. شاهد التقاطع من مقهى القهوة في الطابق العلوي للحصول على أفضل صورة.',
    },
    en: {
      name: 'Shibuya Crossing',
      slug: 'shibuya',
      description: 'Shibuya Crossing is the world\'s busiest pedestrian intersection, crossed by over a million people daily. It\'s the heart of Tokyo\'s shopping and youth culture.',
      tips: 'Take the Tokyo Metro for easy access. View the crossing from the upper-floor coffee shop for the best shot.',
    },
  },
  // Paris
  {
    citySlugEn: 'paris',
    lat: '48.8584',
    lng: '2.2945',
    priceRange: 'expensive',
    openingHours: { mon: '09:30–23:45', tue: '09:30–23:45', wed: '09:30–23:45', thu: '09:30–23:45', fri: '09:30–23:45', sat: '09:30–23:45', sun: '09:30–23:45' },
    ar: {
      name: 'برج إيفل',
      slug: 'eiffel-tower',
      description: 'الرمز الأبرز لفرنسا والأكثر زيارةً في العالم. بُني عام 1889 ويبلغ ارتفاعه 330 مترًا. يوفر ثلاثة مستويات للزيارة مع مطعم راقٍ في الطابق الثاني.',
      tips: 'احجز التذاكر مسبقًا عبر الإنترنت لتفادي الطوابير. الزيارة ليلًا عند إضاءة البرج تجربة لا تُنسى. تجنب أيام السبت في موسم الصيف.',
    },
    en: {
      name: 'Eiffel Tower',
      slug: 'eiffel-tower',
      description: 'France\'s most iconic landmark and the world\'s most-visited monument. Built in 1889 and standing 330 m tall, it offers three visitor levels including a gourmet restaurant on the second floor.',
      tips: 'Book tickets online in advance to skip the queues. Visit at night when the tower is illuminated — unforgettable. Avoid Saturday afternoons in summer.',
    },
  },
  {
    citySlugEn: 'paris',
    lat: '48.8606',
    lng: '2.3376',
    priceRange: 'moderate',
    openingHours: { mon: '09:00–18:00', wed: '09:00–21:45', thu: '09:00–18:00', fri: '09:00–21:45', sat: '09:00–18:00', sun: '09:00–18:00' },
    ar: {
      name: 'متحف اللوفر',
      slug: 'louvre-museum',
      description: 'أكبر متحف فني في العالم وأكثرها زيارةً. يضم أكثر من 35,000 قطعة فنية أبرزها لوحة الموناليزا وتمثال فينوس ميلو.',
      tips: 'خصص 3 ساعات على الأقل. احجز التذاكر إلكترونيًا لتفادي الانتظار. الدخول مجاني للشباب دون 26 عامًا من الاتحاد الأوروبي.',
    },
    en: {
      name: 'Louvre Museum',
      slug: 'louvre-museum',
      description: 'The world\'s largest and most-visited art museum, home to over 35,000 works including the Mona Lisa and the Venus de Milo.',
      tips: 'Allocate at least 3 hours. Book tickets online to skip the queue. Free entry for EU residents under 26.',
    },
  },
  // Istanbul
  {
    citySlugEn: 'istanbul',
    lat: '41.0086',
    lng: '28.9802',
    priceRange: 'moderate',
    openingHours: { mon: '09:00–17:00', tue: '09:00–17:00', wed: '09:00–17:00', thu: '09:00–17:00', fri: '09:00–17:00', sat: '09:00–17:00', sun: '09:00–17:00' },
    ar: {
      name: 'آيا صوفيا',
      slug: 'hagia-sophia',
      description: 'تحفة معمارية بيزنطية بُنيت عام 537 م، تحولت عبر تاريخها من كنيسة إلى مسجد إلى متحف وأعيدت مسجدًا في 2020. من أعظم المعالم في التاريخ الإنساني.',
      tips: 'الدخول مجاني لأوقات الصلاة. ارتدِ ملابس محتشمة وغطاء للرأس للسيدات. احذر من الباعة الجائلين خارج المبنى.',
    },
    en: {
      name: 'Hagia Sophia',
      slug: 'hagia-sophia',
      description: 'A Byzantine architectural masterpiece built in 537 AD, which has served as a church, a mosque, a museum, and was reconverted to a mosque in 2020. One of history\'s greatest monuments.',
      tips: 'Entry is free during prayer times. Dress modestly; women must cover their hair. Be cautious of street vendors outside.',
    },
  },
  {
    citySlugEn: 'istanbul',
    lat: '41.0054',
    lng: '28.9768',
    priceRange: 'free',
    openingHours: { mon: '08:30–17:00', tue: '08:30–17:00', wed: '08:30–17:00', thu: '08:30–17:00', fri: '08:30–17:00', sat: '08:30–17:00', sun: '08:30–17:00' },
    ar: {
      name: 'المسجد الأزرق',
      slug: 'blue-mosque',
      description: 'المسجد الأزرق أو مسجد السلطان أحمد تحفة عثمانية بُنيت بين 1609 و1616، سُمّي بالأزرق لأكثر من 20,000 بلاطة إزنيق الزرقاء في داخله.',
      tips: 'مفتوح للزوار خارج أوقات الصلاة الخمس. ارتدِ ملابس محتشمة وخلّع حذاءك عند الدخول. الدخول مجاني.',
    },
    en: {
      name: 'Blue Mosque',
      slug: 'blue-mosque',
      description: 'The Blue Mosque (Sultan Ahmed Mosque) is an Ottoman masterpiece built between 1609 and 1616, named for its more than 20,000 blue Iznik tiles decorating its interior.',
      tips: 'Open to visitors outside the five daily prayer times. Dress modestly and remove shoes at the entrance. Free entry.',
    },
  },
  // Bangkok
  {
    citySlugEn: 'bangkok',
    lat: '13.7516',
    lng: '100.4920',
    priceRange: 'moderate',
    openingHours: { mon: '08:00–18:30', tue: '08:00–18:30', wed: '08:00–18:30', thu: '08:00–18:30', fri: '08:00–18:30', sat: '08:00–18:30', sun: '08:00–18:30' },
    ar: {
      name: 'معبد الفجر (وات أرون)',
      slug: 'wat-arun',
      description: 'واحد من أيقونات بانكوك، معبد بوذي مزين بالخزف والزجاج المُطعَّم يقف على ضفة نهر تشاو فرايا. يُضيء بشكل ساحر عند الغروب.',
      tips: 'عبر النهر بالقارب (6 بات فقط). ارتدِ ملابس محتشمة وإلا ستضطر لاستئجار ثياب عند المدخل. أفضل وقت للتصوير عند الغروب.',
    },
    en: {
      name: 'Wat Arun (Temple of Dawn)',
      slug: 'wat-arun',
      description: 'One of Bangkok\'s most iconic landmarks, this Buddhist temple adorned with colourful porcelain and glass mosaics stands on the bank of the Chao Phraya River and glows magnificently at sunset.',
      tips: 'Cross the river by ferry (6 baht). Dress modestly or rent clothes at the entrance. Best photography at sunset.',
    },
  },
  // Rome
  {
    citySlugEn: 'rome',
    lat: '41.8902',
    lng: '12.4922',
    priceRange: 'expensive',
    openingHours: { mon: '09:00–19:00', tue: '09:00–19:00', wed: '09:00–19:00', thu: '09:00–19:00', fri: '09:00–19:00', sat: '09:00–14:00' },
    ar: {
      name: 'الكولوسيوم',
      slug: 'colosseum',
      description: 'أعظم مبنى روماني قديم باقٍ على وجه الأرض. بُني في القرن الأول الميلادي ويتسع لأكثر من 50,000 مشاهد. موقع تراث عالمي لليونسكو.',
      tips: 'احجز التذاكر عبر الإنترنت حتمًا — طوابير الكولوسيوم تستغرق ساعات بدون حجز مسبق. التذكرة تشمل الفوروم الروماني وهضبة بالاتين.',
    },
    en: {
      name: 'Colosseum',
      slug: 'colosseum',
      description: 'The greatest ancient Roman building still standing, built in the 1st century AD with capacity for over 50,000 spectators. A UNESCO World Heritage Site.',
      tips: 'Book tickets online without fail — Colosseum queues can take hours. The ticket includes the Roman Forum and Palatine Hill.',
    },
  },
]
