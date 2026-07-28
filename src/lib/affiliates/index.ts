/**
 * Deals Sync Service
 * Aggregates deals from all affiliate partners
 * Called by cron job every 4 hours
 */

import { db } from '@/db'
import { deals } from '@/db/schema'
import { eq, lte } from 'drizzle-orm'
import { fetchBookingDeals, buildBookingAffiliateUrl } from './booking'
import { fetchGetYourGuideDeals, buildGetYourGuideAffiliateUrl } from './getyourguide'

export interface SyncResult {
  created: number
  updated: number
  deleted: number
  errors: string[]
}

/**
 * Main sync function - called by cron job
 */
export async function syncAllDeals(): Promise<SyncResult> {
  const result: SyncResult = {
    created: 0,
    updated: 0,
    deleted: 0,
    errors: [],
  }

  try {
    // Fetch from all partners
    const [bookingDeals, gyeDeals] = await Promise.allSettled([
      fetchBookingDeals(),
      fetchGetYourGuideDeals(),
    ]).then((results) => [
      results[0].status === 'fulfilled' ? results[0].value : [],
      results[1].status === 'fulfilled' ? results[1].value : [],
    ])

    // Log fetch summary
    console.log(`[Deals Sync] Fetched: ${bookingDeals.length} from Booking, ${gyeDeals.length} from GetYourGuide`)

    // Combine and process deals
    const allDeals = [
      ...bookingDeals.map((d) => ({ ...d, partner: 'booking.com' as const })),
      ...gyeDeals.map((d) => ({ ...d, partner: 'getyourguide' as const })),
    ]

    // For MVP: Just log deals (no actual sync yet)
    if (allDeals.length === 0) {
      console.log('[Deals Sync] No deals to sync - APIs not integrated yet')
      return result
    }

    // TODO: Implement deal upsert logic
    // for (const deal of allDeals) {
    //   try {
    //     const existing = await db.select().from(deals).where(eq(deals.externalId, deal.externalId))
    //     if (existing.length > 0) {
    //       result.updated++
    //     } else {
    //       result.created++
    //     }
    //   } catch (error) {
    //     result.errors.push(`Failed to process deal: ${error}`)
    //   }
    // }

    console.log(`[Deals Sync] Complete: ${result.created} created, ${result.updated} updated`)
    return result
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    result.errors.push(errorMsg)
    console.error('[Deals Sync] Error:', errorMsg)
    return result
  }
}

/**
 * Clean up expired deals (run daily)
 */
export async function cleanupExpiredDeals(): Promise<number> {
  try {
    const before = await db.select({ id: deals.id }).from(deals)
    await db.delete(deals).where(lte(deals.expiresAt, new Date()))
    const after = await db.select({ id: deals.id }).from(deals)
    const deleted = before.length - after.length

    console.log(`[Deals Cleanup] Removed ${deleted} expired deals`)
    return deleted
  } catch (error) {
    console.error('[Deals Cleanup] Error:', error)
    return 0
  }
}

/**
 * Get partner affiliate URL for a destination
 */
export function getAffiliateUrl(partner: string, destination: string): string {
  switch (partner) {
    case 'booking.com':
      return buildBookingAffiliateUrl(destination)
    case 'getyourguide':
      return buildGetYourGuideAffiliateUrl(destination)
    default:
      return ''
  }
}

// Export all utilities
export { fetchBookingDeals, buildBookingAffiliateUrl } from './booking'
export { fetchGetYourGuideDeals, buildGetYourGuideAffiliateUrl } from './getyourguide'
