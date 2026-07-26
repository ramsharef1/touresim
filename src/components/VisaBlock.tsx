import { getNationality } from '@/lib/nationality'

type VisaRequirement = {
  requirement: 'visa_free' | 'visa_on_arrival' | 'evisa' | 'visa_required' | 'not_allowed'
  maxStayDays: number | null
  notes: string | null
  lastVerifiedAt: Date | string | null
  officialSourceUrl: string | null
}

const BADGE_CONFIG = {
  visa_free:       { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  visa_on_arrival: { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  evisa:           { bg: 'bg-sky-50',     border: 'border-sky-200',     text: 'text-sky-700',     dot: 'bg-sky-500' },
  visa_required:   { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  not_allowed:     { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     dot: 'bg-red-500' },
}

const REQUIREMENT_LABEL: Record<string, Record<VisaRequirement['requirement'], string>> = {
  ar: {
    visa_free:       'بدون تأشيرة',
    visa_on_arrival: 'تأشيرة عند الوصول',
    evisa:           'تأشيرة إلكترونية',
    visa_required:   'تأشيرة مطلوبة',
    not_allowed:     'الدخول غير مسموح',
  },
  en: {
    visa_free:       'Visa-free',
    visa_on_arrival: 'Visa on arrival',
    evisa:           'eVisa',
    visa_required:   'Visa required',
    not_allowed:     'Entry not permitted',
  },
  fr: {
    visa_free:       'Sans visa',
    visa_on_arrival: 'Visa à l\'arrivée',
    evisa:           'eVisa',
    visa_required:   'Visa requis',
    not_allowed:     'Entrée non autorisée',
  },
  tr: {
    visa_free:       'Vizesiz',
    visa_on_arrival: 'Kapıda vize',
    evisa:           'eVize',
    visa_required:   'Vize gerekli',
    not_allowed:     'Giriş yasak',
  },
  es: {
    visa_free:       'Sin visado',
    visa_on_arrival: 'Visado a la llegada',
    evisa:           'eVisa',
    visa_required:   'Visado requerido',
    not_allowed:     'Entrada no permitida',
  },
}

const OFFICIAL_SOURCE_LABEL: Record<string, string> = {
  ar: 'تحقق من المصدر الرسمي',
  en: 'Check official source',
  fr: 'Vérifier la source officielle',
  tr: 'Resmi kaynağı kontrol et',
  es: 'Verificar fuente oficial',
}

const VERIFIED_LABEL: Record<string, string> = {
  ar: 'تم التحقق',
  en: 'Verified',
  fr: 'Vérifié',
  tr: 'Doğrulandı',
  es: 'Verificado',
}

function formatDate(val: Date | string, locale: string): string {
  try {
    return new Date(val).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return String(val)
  }
}

interface Props {
  passportIso2: string
  visa: VisaRequirement | null
  locale: string
}

export function VisaBlock({ passportIso2, visa, locale }: Props) {
  const nationality = getNationality(passportIso2)
  const labels = REQUIREMENT_LABEL[locale] ?? REQUIREMENT_LABEL.en

  const stayLabel: Record<string, string> = {
    ar: 'مدة الإقامة المسموحة',
    en: 'Permitted stay',
    fr: 'Durée de séjour autorisée',
    tr: 'İzin verilen kalış süresi',
    es: 'Estancia permitida',
  }
  const daysLabel: Record<string, string> = {
    ar: 'يوم',
    en: 'days',
    fr: 'jours',
    tr: 'gün',
    es: 'días',
  }
  const forLabel: Record<string, string> = {
    ar: 'لحاملي جوازات السفر',
    en: 'For passport holders from',
    fr: 'Pour les passeports de',
    tr: 'Pasaport sahipleri için',
    es: 'Para pasaportes de',
  }
  const noDataLabel: Record<string, string> = {
    ar: 'لا تتوفر معلومات تأشيرة لجنسيتك حالياً.',
    en: 'Visa information for your nationality is not available yet.',
    fr: 'Les informations de visa pour votre nationalité ne sont pas encore disponibles.',
    tr: 'Milliyetiniz için vize bilgisi henüz mevcut değil.',
    es: 'La información de visado para tu nacionalidad aún no está disponible.',
  }

  if (!visa) {
    return (
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)]">
        {nationality && <span>{nationality.flag} </span>}
        {noDataLabel[locale] ?? noDataLabel.en}
      </div>
    )
  }

  const cfg = BADGE_CONFIG[visa.requirement]
  const reqLabel = labels[visa.requirement]

  return (
    <div className={`mt-6 rounded-xl border ${cfg.border} ${cfg.bg} p-5`}>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {nationality && <span className="text-xl">{nationality.flag}</span>}
          <span className="text-sm text-[var(--muted)]">
            {forLabel[locale] ?? forLabel.en}{' '}
            <strong className="text-[var(--navy)]">
              {nationality
                ? ((nationality as Record<string, string>)[locale] ?? nationality.en)
                : passportIso2}
            </strong>
          </span>
        </div>
        {/* Status badge */}
        <span className={`flex items-center gap-1.5 rounded-full border ${cfg.border} bg-white px-3 py-1 text-sm font-semibold ${cfg.text}`}>
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          {reqLabel}
        </span>
      </div>

      {/* Stay duration */}
      {visa.maxStayDays && (
        <p className="mt-3 text-sm text-[var(--foreground)]">
          <span className="font-medium">{stayLabel[locale] ?? stayLabel.en}:</span>{' '}
          {visa.maxStayDays} {daysLabel[locale] ?? daysLabel.en}
        </p>
      )}

      {/* Notes */}
      {visa.notes && (
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{visa.notes}</p>
      )}

      {/* Footer: verified date + official source */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-3">
        {visa.lastVerifiedAt && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="text-emerald-600">✓</span>
            {VERIFIED_LABEL[locale] ?? VERIFIED_LABEL.en}{' '}
            {formatDate(visa.lastVerifiedAt, locale)}
          </span>
        )}
        {visa.officialSourceUrl && (
          <a
            href={visa.officialSourceUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--gold)] transition-colors"
          >
            {OFFICIAL_SOURCE_LABEL[locale] ?? OFFICIAL_SOURCE_LABEL.en}
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
