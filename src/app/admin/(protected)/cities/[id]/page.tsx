import { db } from '@/db'
import { schema } from '@/db'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const LOCALES = ['en', 'ar', 'fr', 'es', 'tr'] as const

async function saveCity(formData: FormData) {
  'use server'
  const cityId = Number(formData.get('cityId'))
  const locale = formData.get('locale') as string
  const description = formData.get('description') as string

  await db
    .update(schema.cityTranslations)
    .set({ description })
    .where(and(
      eq(schema.cityTranslations.cityId, cityId),
      eq(schema.cityTranslations.locale, locale),
    ))

  revalidatePath(`/admin/cities/${cityId}`)
  redirect(`/admin/cities/${cityId}?saved=${locale}`)
}

export default async function AdminCityEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; locale?: string }>
}) {
  const { id } = await params
  const { saved, locale: activeLocale = 'en' } = await searchParams
  const cityId = Number(id)

  const translations = await db
    .select()
    .from(schema.cityTranslations)
    .where(eq(schema.cityTranslations.cityId, cityId))

  const enName = translations.find((t) => t.locale === 'en')?.name ?? `City #${id}`
  const active = translations.find((t) => t.locale === activeLocale)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/cities" className="text-xs text-gray-400 hover:text-gray-600">← Cities</a>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{enName}</h1>
        <p className="text-xs text-gray-400">City ID: {cityId}</p>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-2.5 text-sm text-green-700">
          Saved ({saved}) ✓
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

      <form action={saveCity} className="space-y-5">
        <input type="hidden" name="cityId" value={cityId} />
        <input type="hidden" name="locale" value={activeLocale} />

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
            Description ({activeLocale})
          </label>
          <textarea
            name="description"
            defaultValue={active?.description ?? ''}
            rows={8}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-y"
            placeholder="City overview and travel description…"
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
