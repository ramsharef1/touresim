import { NextRequest, NextResponse } from 'next/server'
import { syncAllDeals, cleanupExpiredDeals } from '@/lib/affiliates'

/**
 * Cron endpoint for syncing deals from affiliate partners
 * Called automatically every 4 hours by Hostinger cron job
 *
 * Setup on VPS:
 * curl -X POST https://convertec.cloud/api/cron/deals-sync \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET not set in environment')
      return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 })
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Missing Bearer token' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token !== cronSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid token' },
        { status: 401 }
      )
    }

    console.log('[Cron] Starting deals sync...')

    // Sync all deals from partners
    const syncResult = await syncAllDeals()

    // Clean up expired deals
    const cleaned = await cleanupExpiredDeals()

    return NextResponse.json({
      success: true,
      message: 'Deals sync completed',
      sync: syncResult,
      cleaned,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    )
  }
}
