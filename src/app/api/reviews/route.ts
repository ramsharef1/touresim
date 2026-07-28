import { NextResponse, NextRequest } from 'next/server'

// Simple email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationSlug, destinationType, rating, title, body: reviewBody, authorName, authorEmail } = body

    // Validation
    if (!destinationSlug || !destinationType || !rating || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    if (!isValidEmail(authorEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    // In production, this would insert to database
    // For now, just return success
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

    // Return empty reviews for now
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      avgRating: null,
    })
  } catch (error) {
    console.error('Review GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    )
  }
}
