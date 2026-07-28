import { db } from '@/db'
import { destinationReviews } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// Simple email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationSlug, destinationType, rating, title, body: reviewBody, authorName, authorEmail } = body

    // Validation
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

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    if (!title || title.length === 0 || title.length > 255) {
      return NextResponse.json(
        { error: 'Title is required and must be ≤255 characters' },
        { status: 400 },
      )
    }

    if (reviewBody && reviewBody.length > 5000) {
      return NextResponse.json(
        { error: 'Review body must be ≤5000 characters' },
        { status: 400 },
      )
    }

    if (!authorName || authorName.length === 0) {
      return NextResponse.json(
        { error: 'Author name is required' },
        { status: 400 },
      )
    }

    if (!authorEmail || !isValidEmail(authorEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    // Insert review (unpublished by default)
    const result = await db.insert(destinationReviews).values({
      destinationSlug,
      destinationType,
      rating,
      title,
      body: reviewBody || null,
      authorName,
      authorEmail,
      isApproved: false,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted for approval',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Review POST error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const destination = searchParams.get('destination')
    const type = searchParams.get('type')
    const includeUnapproved = searchParams.get('includeUnapproved') === 'true'

    let query = db.select().from(destinationReviews)

    const whereConditions = []

    if (destination) {
      whereConditions.push(eq(destinationReviews.destinationSlug, destination))
    }

    if (type && ['country', 'city'].includes(type)) {
      whereConditions.push(eq(destinationReviews.destinationType, type as 'country' | 'city'))
    }

    // Only show approved reviews unless explicitly requested otherwise (admin)
    if (!includeUnapproved) {
      whereConditions.push(eq(destinationReviews.isApproved, true))
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions)) as any
    }

    const results = await (query as any).orderBy(desc(destinationReviews.createdAt))

    // Calculate average rating
    const avgRating = results.length > 0
      ? (results.reduce((sum, r) => sum + r.rating, 0) / results.length).toFixed(1)
      : null

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      avgRating: avgRating ? parseFloat(avgRating) : null,
    })
  } catch (error) {
    console.error('Review GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    )
  }
}
