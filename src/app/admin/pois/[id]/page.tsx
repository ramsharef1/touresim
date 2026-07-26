import { notFound, redirect } from 'next/navigation'
import { requireAdminAuth } from '../../auth'
import { adminGetPoi, adminUpdatePoi, LOCALES } from '../../lib'
import { AdminNav } from '../../nav'

type Props = { params: Promise<{ id: string }> }

async function save(id: number, formData: FormData) {
  'use server'
  const translations = LOCALES.map((locale) => ({
    locale,
    name: (formData.get(`${locale}_name`) as string) ?? '',
    slug: (formData.get(`${locale}_slug`) as string) ?? '',
    description: (formData.get(`${locale}_description`) as string) || null,
    tips: (formData.get(`${locale}_tips`) as string) || null,
  })).filter((t) => t.name)

  await adminUpdatePoi(id, {
    indexStatus: (formData.get('indexStatus') as 'draft' | 'noindex' | 'indexed') ?? 'draft',
    completenessScore: parseInt((formData.get('completenessScore') as string) ?? '0', 10),
    priceRange: (formData.get('priceRange') as string) || null,
    latitude: (formData.get('latitude') as string) || null,
    longitude: (formData.get('longitude') as string) || null,
    openingHours: (formData.get('openingHours') as string) || null,
    translations,
  })
  redirect(`/admin/pois/${id}?saved=1`)
}

export default async function PoiEditPage({ params }: Props) {
  await requireAdminAuth()
  const { id } = await params
  const poi = await adminGetPoi(parseInt(id, 10))
  if (!poi) notFound()

  const tr = (locale: string) => poi.translations.find((t) => t.locale === locale)
  const saveWithId = save.bind(null, poi.id)

  return (
    <>
      <AdminNav />
      <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/pois" className="text-zinc-400 hover:text-white">← POIs</a>
        <h1 className="text-2xl font-bold">Edit POI #{poi.id}</h1>
      </div>

      <form action={saveWithId} className="space-y-8">
        <section className="rounded-xl border border-zinc-800 p-6 space-y-4">
          <h2 className="font-semibold text-amber-400 mb-4">Meta</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Index Status" name="indexStatus" defaultValue={poi.indexStatus} as="select">
              <option value="draft">draft</option>
              <option value="noindex">noindex</option>
              <option value="indexed">indexed</option>
            </Field>
            <Field label="Completeness Score" name="completenessScore" type="number" defaultValue={String(poi.completenessScore)} />
            <Field label="Price Range" name="priceRange" defaultValue={poi.priceRange ?? ''} as="select">
              <option value="">—</option>
              <option value="free">free</option>
              <option value="budget">budget</option>
              <option value="moderate">moderate</option>
              <option value="expensive">expensive</option>
              <option value="luxury">luxury</option>
            </Field>
            <div />
            <Field label="Latitude" name="latitude" defaultValue={poi.latitude ?? ''} />
            <Field label="Longitude" name="longitude" defaultValue={poi.longitude ?? ''} />
          </div>
          <Field
            label='Opening Hours (JSON, e.g. {"mon":"09:00-17:00","tue":"09:00-17:00"})'
            name="openingHours"
            as="textarea"
            defaultValue={poi.openingHours ? JSON.stringify(poi.openingHours, null, 2) : ''}
          />
        </section>

        {LOCALES.map((locale) => {
          const t = tr(locale)
          return (
            <section key={locale} className="rounded-xl border border-zinc-800 p-6 space-y-4">
              <h2 className="font-semibold text-amber-400 mb-4 uppercase">{locale}</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" name={`${locale}_name`} defaultValue={t?.name ?? ''} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
                <Field label="Slug" name={`${locale}_slug`} defaultValue={t?.slug ?? ''} />
              </div>
              <Field label="Description" name={`${locale}_description`} as="textarea" defaultValue={t?.description ?? ''} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
              <Field label="Tips" name={`${locale}_tips`} as="textarea" defaultValue={t?.tips ?? ''} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
            </section>
          )
        })}

        <button type="submit" className="rounded-lg bg-amber-400 px-6 py-2.5 font-semibold text-zinc-900 hover:bg-amber-300">
          Save
        </button>
      </form>
      </main>
    </>
  )
}

function Field({
  label, name, defaultValue, type = 'text', as, dir, children
}: {
  label: string; name: string; defaultValue?: string; type?: string
  as?: 'select' | 'textarea'; dir?: string; children?: React.ReactNode
}) {
  const base = 'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-amber-400 focus:outline-none text-sm'
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-400">{label}</label>
      {as === 'select' ? (
        <select name={name} defaultValue={defaultValue} className={base}>{children}</select>
      ) : as === 'textarea' ? (
        <textarea name={name} defaultValue={defaultValue} dir={dir} rows={3} className={`${base} resize-y`} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} dir={dir} className={base} />
      )}
    </div>
  )
}
