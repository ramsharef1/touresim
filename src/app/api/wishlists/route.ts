import { db } from '@/db'
import { wishlists } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationSlug, destinationType, userId } = body

    if (!destinationSlug || !destinationType) {
      return NextResponse.json(
        { error: 'Missing required fields: destinationSlug, destinationType' },
        { status: 400 },
      )
    }

    if (!['country', 'city'].includes(destinationType)) {
      return NextResponse.json(
        { error: 'Invalid destinationType. Must be "country" or "city"' },
        { status: 400 },
      )
    }

    // Insert or update (prevent duplicates)
    const result = await db
      .insert(wishlists)
      .values({
        destinationSlug,
        destinationType,
        userId: userId || null,
      })
      .onDuplicateKeyUpdate({
        set: { updatedAt: new Date() },
      })

    return NextResponse.json(
      {
        success: true,
        data: { destinationSlug, destinationType },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'country' or 'city'
    const userId = searchParams.get('userId')

    let query = db.select().from(wishlists)

    const whereConditions = []
    if (userId) {
      whereConditions.push(eq(wishlists.userId, parseInt(userId)))
    }
    if (type && ['country', 'city'].includes(type)) {
      whereConditions.push(eq(wishlists.destinationType, type as 'country' | 'city'))
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions))
    }

    const results = await query

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    })
  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlists' },
      { status: 500 },
    )
  }
}
