import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getVisaDestinationsForPassport } from '@/lib/queries'
import { NATIONALITIES, NATIONALITY_COOKIE, getNationality } from '@/lib/nationality'
import type { Locale } from '@/lib/locales'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ from?: string }>
}

const T = {
  title: { ar: 'مدقق التأشيرات', en: 'Visa Checker', fr: 'Vérificateur de visa', tr: 'Vize Kontrolü', es: 'Comprobador de visados' },
  lead: {
    ar: 'اختر جواز سفرك لمعرفة الوجهات التي يمكنك زيارتها بدون تأشيرة.',
    en: 'Pick your passport to see where you can travel — visa-free, on arrival, or with an eVisa.',
    fr: 'Choisissez votre passeport pour voir où vous pouvez voyager — sans visa, à l’arrivée ou avec un eVisa.',
    tr: 'Pasaportunuzu seçin ve nereye vizesiz, kapıda vizeyle veya eVize ile gidebileceğinizi görün.',
    es: 'Elige tu pasaporte para ver a dónde puedes viajar — sin visado, a la llegada o con eVisa.',
  },
  passport: { ar: 'جواز السفر', en: 'Your passport', fr: 'Votre passeport', tr: 'Pasaportunuz', es: 'Tu pasaporte' },
  check: { ar: 'تحقق', en: 'Check', fr: 'Vérifier', tr: 'Kontrol et', es: 'Comprobar' },
  destinations: { ar: 'وجهة', en: 'destinations', fr: 'destinations', tr: 'destinasyon', es: 'destinos' },
  pick: { ar: 'اختر جواز سفرك أعلاه للبدء.', en: 'Select your passport above to get started.', fr: 'Sélectionnez votre passeport ci-dessus.', tr: 'Başlamak için pasaportunuzu seçin.', es: 'Selecciona tu pasaporte para empezar.' },
  days: { ar: 'يوم', en: 'days', fr: 'jours', tr: 'gün', es: 'días' },
} as const

const REQ_META: Record<string, { label: Record<string, string>; cls: string; dot: string }> = {
  visa_free: {
    label: { ar: 'بدون تأشيرة', en: 'Visa-free', fr: 'Sans visa', tr: 'Vizesiz', es: 'Sin visado' },
    cls: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500',
  },
  visa_on_arrival: {
    label: { ar: 'تأشيرة عند الوصول', en: 'Visa on arrival', fr: 'Visa à l’arrivée', tr: 'Kapıda vize', es: 'Visado a la llegada' },
    cls: 'border-blue-200 bg-blue-50', dot: 'bg-blue-500',
  },
  evisa: {
    label: { ar: 'تأشيرة إلكترونية', en: 'eVisa', fr: 'eVisa', tr: 'eVize', es: 'eVisa' },
    cls: 'border-sky-200 bg-sky-50', dot: 'bg-sky-500',
  },
  visa_required: {
    label: { ar: 'تأشيرة مطلوبة', en: 'Visa required', fr: 'Visa requis', tr: 'Vize gerekli', es: 'Visado requerido' },
    cls: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500',
  },
  not_allowed: {
    label: { ar: 'الدخول غير مسموح', en: 'Entry not permitted', fr: 'Entrée non autorisée', tr: 'Giriş yasak', es: 'Entrada no permitida' },
    cls: 'border-red-200 bg-red-50', dot: 'bg-red-500',
  },
}

const ORDER = ['visa_free', 'visa_on_arrival', 'evisa', 'visa_required', 'not_allowed']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = (m: Record<string, string>) => m[locale] ?? m.en
  return { title: t(T.title), description: t(T.lead) }
}

export default async function VisaCheckerPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const { from } = await searchParams
  const jar = await cookies()
  const passport = (from ?? jar.get(NATIONALITY_COOKIE)?.value ?? '').toUpperCase()

  const t = (m: Record<string, string>) => m[locale] ?? m.en
  const data = passport ? await getVisaDestinationsForPassport(passport, locale as Locale) : null
  const nat = passport ? getNationality(passport) : null

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
      <h1 className="text-4xl font-bold text-[var(--navy)]">{t(T.title)}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--muted)]">{t(T.lead)}</p>

      {/* Passport selector — plain GET form, shareable URL, no JS needed */}
      <form className="mt-8 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="from" className="mb-1 block text-xs uppercase tracking-wide text-[var(--muted)]">
            {t(T.passport)}
          </label>
          <select
            id="from"
            name="from"
            defaultValue={passport}
            className="min-w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--navy)] shadow-sm focus:border-[var(--gold)] focus:outline-none"
          >
            <option value="">—</option>
            {NATIONALITIES.map((n) => (
              <option key={n.iso2} value={n.iso2}>
                {n.flag} {(n as Record<string, string>)[locale] ?? n.en}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[var(--navy)] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-[var(--navy-700)]"
        >
          {t(T.check)}
        </button>
      </form>

      {!data && <p className="mt-10 text-[var(--muted)]">{t(T.pick)}</p>}

      {data && (
        <>
          {/* Summary counts */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {nat && <span className="text-2xl">{nat.flag}</span>}
            <span className="text-sm text-[var(--muted)]">
              {data.total} {t(T.destinations)}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ORDER.filter((r) => data.groups[r]?.length).map((r) => (
              <a
                key={r}
                href={`#${r}`}
                className={`rounded-xl border p-4 text-center shadow-sm transition hover:shadow-md ${REQ_META[r].cls}`}
              >
                <p className="text-2xl font-bold text-[var(--navy)]">{data.groups[r].length}</p>
                <p className="mt-0.5 text-xs font-medium text-[var(--navy)]">{t(REQ_META[r].label)}</p>
              </a>
            ))}
          </div>

          {/* Grouped destination lists */}
          {ORDER.filter((r) => data.groups[r]?.length).map((r) => (
            <section key={r} id={r} className="mt-10 scroll-mt-24">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[var(--navy)]">
                <span className={`h-2.5 w-2.5 rounded-full ${REQ_META[r].dot}`} />
                {t(REQ_META[r].label)}
                <span className="text-base font-normal text-[var(--muted)]">({data.groups[r].length})</span>
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {data.groups[r].map((d) => (
                  <Link
                    key={d.countryId}
                    href={`/${d.slug}`}
                    className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm shadow-sm transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
                  >
                    <span className="font-medium text-[var(--navy)] transition-colors group-hover:text-[var(--gold)]">
                      {d.name}
                    </span>
                    {d.maxStayDays ? (
                      <span className="ms-1 text-xs text-[var(--muted)]">
                        · {d.maxStayDays} {t(T.days)}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  )
}
