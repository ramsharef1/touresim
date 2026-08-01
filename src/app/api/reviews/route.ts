import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { destinationReviews } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationSlug, destinationType, rating, title, body: reviewBody, authorName, authorEmail } = body

    if (!destinationSlug || !destinationType || !rating || !authorName || !authorEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }
    if (!isValidEmail(authorEmail)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await db.insert(destinationReviews).values({
      destinationSlug,
      destinationType,
      rating,
      title: title ?? '',
      body: reviewBody ?? null,
      authorName,
      authorEmail,
      isApproved: false,
    })

    return NextResponse.json({ success: true, message: 'Review submitted for approval' }, { status: 201 })
  } catch (error) {
    console.error('Review POST error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destination = searchParams.get('destination')
    const type = searchParams.get('type') as 'country' | 'city' | null

    if (!destination || !type) {
      return NextResponse.json({ error: 'destination and type are required' }, { status: 400 })
    }

    const rows = await db
      .select()
      .from(destinationReviews)
      .where(
        and(
          eq(destinationReviews.destinationSlug, destination),
          eq(destinationReviews.destinationType, type),
          eq(destinationReviews.isApproved, true),
        ),
      )
      .orderBy(desc(destinationReviews.createdAt))
      .limit(20)

    const avgRating = rows.length
      ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10
      : null

    return NextResponse.json({ success: true, data: rows, count: rows.length, avgRating })
  } catch (error) {
    console.error('Review GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
