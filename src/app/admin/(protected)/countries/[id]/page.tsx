import { db } from '@/db'
import { schema } from '@/db'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const LOCALES = ['en', 'ar', 'fr', 'es', 'tr'] as const

async function saveTranslation(formData: FormData) {
  'use server'
  const countryId = Number(formData.get('countryId'))
  const locale = formData.get('locale') as string
  const description = formData.get('description') as string
  const visaSummary = formData.get('visaSummary') as string
  const bestTimeSummary = formData.get('bestTimeSummary') as string

  await db
    .update(schema.countryTranslations)
    .set({ description, visaSummary, bestTimeSummary })
    .where(and(
      eq(schema.countryTranslations.countryId, countryId),
      eq(schema.countryTranslations.locale, locale),
    ))

  revalidatePath(`/admin/countries/${countryId}`)
  redirect(`/admin/countries/${countryId}?saved=${locale}`)
}

export default async function AdminCountryEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; locale?: string }>
}) {
  const { id } = await params
  const { saved, locale: activeLocale = 'en' } = await searchParams
  const countryId = Number(id)

  const translations = await db
    .select()
    .from(schema.countryTranslations)
    .where(eq(schema.countryTranslations.countryId, countryId))

  const country = await db
    .select()
    .from(schema.countries)
    .where(eq(schema.countries.id, countryId))
    .limit(1)

  const enName = translations.find((t) => t.locale === 'en')?.name ?? `Country #${id}`
  const active = translations.find((t) => t.locale === activeLocale)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/countries" className="text-xs text-gray-400 hover:text-gray-600">← Countries</a>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{enName}</h1>
        <p className="text-xs text-gray-400">ISO: {country[0]?.iso2} · ID: {countryId}</p>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-2.5 text-sm text-green-700">
          Saved ({saved} locale) ✓
        </div>
      )}

      {/* Locale tabs */}
      <div className="flex gap-1 mb-6">
        {LOCALES.map((loc) => {
          const has = translations.find((t) => t.locale === loc)?.description
          return (
            <a
              key={loc}
              href={`?locale=${loc}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                loc === activeLocale
                  ? 'bg-[#0a1628] text-white border-[#0a1628]'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {loc.toUpperCase()}
              {!has && <span className="ml-1 text-amber-400">•</span>}
            </a>
          )
        })}
      </div>

      {/* Edit form */}
      <form action={saveTranslation} className="space-y-5">
        <input type="hidden" name="countryId" value={countryId} />
        <input type="hidden" name="locale" value={activeLocale} />

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Description ({activeLocale})
          </label>
          <textarea
            name="description"
            defaultValue={active?.description ?? ''}
            rows={6}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-y"
            placeholder="Country overview and travel description…"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Visa Summary ({activeLocale})
          </label>
          <textarea
            name="visaSummary"
            defaultValue={active?.visaSummary ?? ''}
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-y"
            placeholder="Visa requirements summary…"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Best Time Summary ({activeLocale})
          </label>
          <textarea
            name="bestTimeSummary"
            defaultValue={active?.bestTimeSummary ?? ''}
            rows={3}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-y"
            placeholder="Best time to visit…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-[#0a1628] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors"
          >
            Save changes
          </button>
          <a
            href={`/${activeLocale}/${active?.slug ?? ''}`}
            target="_blank"
            className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View live ↗
          </a>
        </div>
      </form>
    </div>
  )
}
