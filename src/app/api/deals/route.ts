import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    // Return test deals data from database
    // In production, this would query the deals table
    const testDeals = [
      {
        id: 1,
        title: 'Flights to Paris',
        description: 'Round-trip flights from NYC to Paris',
        type: 'flight',
        partner: 'skyscanner',
        destination_slug: 'paris',
        original_price: 800,
        deal_price: 499,
        discount: 38,
        affiliate_url: 'https://booking.example.com/paris',
        image_url: 'https://images.example.com/paris.jpg',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'skyscanner',
      },
      {
        id: 2,
        title: 'Tokyo Hotel Deal',
        description: 'Luxury 4-star in Shibuya',
        type: 'hotel',
        partner: 'booking.com',
        destination_slug: 'tokyo',
        original_price: 350,
        deal_price: 179,
        discount: 49,
        affiliate_url: 'https://booking.example.com/tokyo',
        image_url: 'https://images.example.com/tokyo.jpg',
        expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'booking',
      },
      {
        id: 3,
        title: 'Thailand Beach Tour',
        description: 'All-inclusive 7-day tour',
        type: 'tour',
        partner: 'getyourguide',
        destination_slug: 'bangkok',
        original_price: 1200,
        deal_price: 699,
        discount: 42,
        affiliate_url: 'https://getyourguide.example.com/thailand',
        image_url: 'https://images.example.com/thailand.jpg',
        expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'getyourguide',
      },
      {
        id: 4,
        title: 'Eiffel Tower Skip-the-Line',
        description: 'Fast-track tickets to Eiffel Tower',
        type: 'activity',
        partner: 'getyourguide',
        destination_slug: 'paris',
        original_price: 35,
        deal_price: 24,
        discount: 31,
        affiliate_url: 'https://getyourguide.example.com/eiffel',
        image_url: 'https://images.example.com/eiffel.jpg',
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'getyourguide',
      },
      {
        id: 5,
        title: 'Iceland Adventure',
        description: '5-day Golden Circle experience',
        type: 'experience',
        partner: 'viator',
        destination_slug: 'reykjavik',
        original_price: 950,
        deal_price: 599,
        discount: 37,
        affiliate_url: 'https://viator.example.com/iceland',
        image_url: 'https://images.example.com/iceland.jpg',
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'viator',
      },
    ]

    // Filter by type if provided
    const filteredDeals = type
      ? testDeals.filter((d) => d.type === type)
      : testDeals

    return NextResponse.json({
      success: true,
      data: filteredDeals.slice(0, limit),
      count: filteredDeals.length,
    })
  } catch (error) {
    console.error('Deals API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals', success: false },
      { status: 500 }
    )
  }
}
