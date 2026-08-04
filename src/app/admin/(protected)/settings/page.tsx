import { db } from '@/db'
import { schema } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const SETTING_KEYS = [
  { key: 'site_name', label: 'Site Name', placeholder: 'Touresim', group: 'branding' },
  { key: 'site_tagline', label: 'Tagline', placeholder: 'Discover the World', group: 'branding' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@touresim.com', group: 'branding' },
  { key: 'agency_name', label: 'Agency Name (Convertic)', placeholder: 'Convertic', group: 'branding' },
  { key: 'agency_url', label: 'Agency URL', placeholder: 'https://convertic.cloud', group: 'branding' },
  { key: 'ga4_measurement_id', label: 'GA4 Measurement ID', placeholder: 'G-XXXXXXXXXX', group: 'integrations' },
  { key: 'booking_affiliate_id', label: 'Booking.com Affiliate ID', placeholder: '123456', group: 'affiliates' },
  { key: 'airbnb_affiliate_id', label: 'Airbnb Affiliate ID', placeholder: 'your-id', group: 'affiliates' },
  { key: 'getyourguide_affiliate_id', label: 'GetYourGuide Partner ID', placeholder: 'your-id', group: 'affiliates' },
  { key: 'viator_affiliate_id', label: 'Viator Affiliate ID', placeholder: 'your-id', group: 'affiliates' },
  { key: 'anthropic_api_key', label: 'Anthropic API Key (AI Planner)', placeholder: 'sk-ant-...', group: 'integrations' },
  { key: 'mapbox_token', label: 'Mapbox Public Token', placeholder: 'pk.eyJ1...', group: 'integrations' },
] as const

async function saveSettings(formData: FormData) {
  'use server'
  const updates = SETTING_KEYS.map(({ key }) => ({
    key,
    value: (formData.get(key) as string) ?? '',
  }))

  for (const { key, value } of updates) {
    await db
      .insert(schema.settings)
      .values({ key, value, type: 'string' })
      .onDuplicateKeyUpdate({ set: { value } })
  }

  revalidatePath('/admin/settings')
  redirect('/admin/settings?saved=1')
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const { saved } = await searchParams

  const rows = await db.select().from(schema.settings).catch(() => [] as typeof schema.settings.$inferSelect[])
  const settingMap = Object.fromEntries(rows.map((r) => [r.key, r.value ?? '']))

  const groups = {
    branding: SETTING_KEYS.filter((s) => s.group === 'branding'),
    integrations: SETTING_KEYS.filter((s) => s.group === 'integrations'),
    affiliates: SETTING_KEYS.filter((s) => s.group === 'affiliates'),
  }

  const groupLabels = {
    branding: 'Branding',
    integrations: 'Integrations & API Keys',
    affiliates: 'Affiliate Partner IDs',
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Global configuration for Touresim · by Convertic</p>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-2.5 text-sm text-green-700">
          Settings saved ✓
        </div>
      )}

      <form action={saveSettings} className="space-y-8">
        {(Object.entries(groups) as [keyof typeof groups, typeof SETTING_KEYS[number][]][]).map(([group, keys]) => (
          <div key={group} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">{groupLabels[group]}</h2>
            </div>
            <div className="p-5 space-y-4">
              {keys.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    name={key}
                    defaultValue={settingMap[key] ?? ''}
                    placeholder={placeholder}
                    type={key.includes('key') || key.includes('token') ? 'password' : 'text'}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="rounded-lg bg-[#0a1628] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors"
        >
          Save all settings
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-700">
        <p className="font-medium mb-1">⚠ API keys stored in database</p>
        <p className="text-xs">Keys entered here are stored in the <code>settings</code> table. For higher security, move them to <code>.env.production</code> on the VPS and restart PM2. Database-stored keys are useful for quick updates without SSH access.</p>
      </div>
    </div>
  )
}
