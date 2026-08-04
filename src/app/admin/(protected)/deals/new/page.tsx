import { db } from '@/db'
import { schema } from '@/db'
import { redirect } from 'next/navigation'

const DEAL_TYPES = ['flight', 'hotel', 'tour', 'activity', 'experience'] as const
const PARTNERS = ['booking.com', 'getyourguide', 'skyscanner', 'viator', 'airbnb', 'klook', 'expedia'] as const

async function createDeal(formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const type = formData.get('type') as typeof DEAL_TYPES[number]
  const partner = formData.get('partner') as typeof PARTNERS[number]
  const destinationSlug = formData.get('destinationSlug') as string
  const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null
  const dealPrice = Number(formData.get('dealPrice'))
  const discount = formData.get('discount') ? Number(formData.get('discount')) : null
  const affiliateUrl = formData.get('affiliateUrl') as string
  const imageUrl = formData.get('imageUrl') as string
  const expiresAt = new Date(formData.get('expiresAt') as string)

  await db.insert(schema.deals).values({
    title,
    description: description || null,
    type,
    partner,
    destinationSlug: destinationSlug || null,
    originalPrice: originalPrice ? String(originalPrice) : null,
    dealPrice: String(dealPrice),
    discount,
    affiliateUrl,
    imageUrl: imageUrl || null,
    expiresAt,
  })

  redirect('/admin/deals')
}

export default function AdminNewDealPage() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 30)
  const defaultExpiry = tomorrow.toISOString().split('T')[0]

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <a href="/admin/deals" className="text-xs text-gray-400 hover:text-gray-600">← Deals</a>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">Add Deal</h1>
      </div>

      <form action={createDeal} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Title *</label>
            <input name="title" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="3 nights in Bali from $299" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Type *</label>
            <select name="type" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              {DEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Partner *</label>
            <select name="partner" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              {PARTNERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Deal price ($) *</label>
            <input name="dealPrice" type="number" step="0.01" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="299" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Original price ($)</label>
            <input name="originalPrice" type="number" step="0.01" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="499" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Discount %</label>
            <input name="discount" type="number" min="0" max="99" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="40" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Expires *</label>
            <input name="expiresAt" type="date" required defaultValue={defaultExpiry} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Destination slug</label>
            <input name="destinationSlug" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="bali or indonesia" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Affiliate URL *</label>
            <input name="affiliateUrl" type="url" required className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="https://booking.com/..." />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Image URL</label>
            <input name="imageUrl" type="url" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="https://..." />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-none" placeholder="Short deal description…" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-[#0a1628] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors">
            Create deal
          </button>
          <a href="/admin/deals" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
