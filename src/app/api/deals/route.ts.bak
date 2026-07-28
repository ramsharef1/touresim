import { db } from '@/db'
import { deals, dealClicks } from '@/db/schema'
import { eq, lte, desc, inArray } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const DEAL_TYPES = ['flight', 'hotel', 'tour', 'activity', 'experience'] as const

// Hash IP for privacy-preserving analytics
function hashIp(ip: string | null): string {
  if (!ip) return 'unknown'
  return crypto.createHash('sha256').update(ip).digest('hex')
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const partner = searchParams.get('partner')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const destination = searchParams.get('destination')

    let query = db.select().from(deals)

    // Only active deals (not expired)
    const now = new Date()
    query = query.where(lte(now, deals.expiresAt))

    // Filter by type if provided
    if (type && DEAL_TYPES.includes(type as any)) {
      query = query.where(eq(deals.type, type as any))
    }

    // Filter by partner if provided
    if (partner) {
      query = query.where(eq(deals.partner, partner as any))
    }

    // Filter by destination if provided
    if (destination) {
      query = query.where(eq(deals.destinationSlug, destination))
    }

    // Order by discount desc, then by newest
    query = query.orderBy(desc(deals.discount), desc(deals.createdAt)).limit(limit).offset(offset)

    const results = await query

    // Calculate average discount
    const avgDiscount =
      results.length > 0
        ? Math.round(results.reduce((sum, d) => sum + (d.discount || 0), 0) / results.length)
        : 0

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      avgDiscount,
      offset,
      limit,
    })
  } catch (error) {
    console.error('[GET /api/deals] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin/cron authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'dev-secret'

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

    const body = await request.json()
    const { title, description, type, partner, destinationSlug, dealPrice, originalPrice, discount, affiliateUrl, imageUrl, externalId, expiresAt, source } = body

    // Validation
    if (!title || !type || !dealPrice || !affiliateUrl || !expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!DEAL_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type: ${type}` },
        { status: 400 }
      )
    }

    // Insert deal (upsert by externalId if provided)
    const result = await db.insert(deals).values({
      title,
      description,
      type: type as any,
      partner: partner as any,
      destinationSlug,
      dealPrice: dealPrice.toString(),
      originalPrice: originalPrice ? originalPrice.toString() : null,
      discount,
      affiliateUrl,
      imageUrl,
      externalId,
      expiresAt: new Date(expiresAt),
      source,
      clickCount: 0,
      bookingCount: 0,
    })

    return NextResponse.json(
      {
        success: true,
        data: { id: result[0].insertId, ...body },
        message: 'Deal created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/deals] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Log deal click for analytics (affiliate tracking)
    const body = await request.json()
    const { dealId } = body

    if (!dealId) {
      return NextResponse.json(
        { success: false, error: 'Missing dealId' },
        { status: 400 }
      )
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip')
    const ipHash = hashIp(clientIp)
    const referrer = request.headers.get('referer') || null
    const userAgent = request.headers.get('user-agent') || null

    // Log click
    await db.insert(dealClicks).values({
      dealId,
      ipHash,
      referrer,
      userAgent,
    })

    // Increment click count on deal
    await db
      .update(deals)
      .set({ clickCount: db.raw('click_count + 1') })
      .where(eq(deals.id, dealId))

    return NextResponse.json({ success: true, message: 'Click logged' })
  } catch (error) {
    console.error('[PUT /api/deals] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to log click' },
      { status: 500 }
    )
  }
}
