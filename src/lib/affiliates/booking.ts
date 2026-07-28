/**
 * Booking.com Affiliate API Integration
 * Fetches hotel deals and returns formatted deal objects
 */

interface BookingDeal {
  title: string
  description?: string
  destinationSlug: string
  dealPrice: number
  originalPrice?: number
  affiliateUrl: string
  imageUrl?: string
  externalId: string
  expiresAt: Date
}

export async function fetchBookingDeals(destinationSlug?: string): Promise<BookingDeal[]> {
  const apiKey = process.env.BOOKING_AFFILIATE_API_KEY
  const partnerId = process.env.BOOKING_AFFILIATE_ID

  if (!apiKey || !partnerId) {
    console.warn('[Booking API] Missing credentials - BOOKING_AFFILIATE_API_KEY or BOOKING_AFFILIATE_ID not set')
    return []
  }

  try {
    // Example: Use Booking.com's hotel search API
    // Docs: https://partner.booking.com/en/api

    // For MVP: Return empty array with instructions
    // In production, integrate with actual Booking.com API
    console.log('[Booking API] Integration pending - requires API credentials')

    // Placeholder: Fetch popular hotel deals
    const deals: BookingDeal[] = []

    // TODO: Implement actual API call
    // const response = await fetch('https://api.booking.com/v2/deals', {
    //   headers: { 'X-Booking-Key': apiKey }
    // })
    // const data = await response.json()
    // return data.deals.map(d => ({...}))

    return deals
  } catch (error) {
    console.error('[Booking API] Error fetching deals:', error)
    return []
  }
}

/**
 * Build affiliate URL for Booking.com hotel search
 */
export function buildBookingAffiliateUrl(destination: string, checkIn?: Date, checkOut?: Date): string {
  const partnerId = process.env.BOOKING_AFFILIATE_ID || 'YOUR_PARTNER_ID'

  const params = new URLSearchParams({
    ss: destination,
    partner_id: partnerId,
    no_rooms: '1',
    group_adults: '2',
  })

  if (checkIn) {
    params.set('checkin', checkIn.toISOString().split('T')[0])
  }

  if (checkOut) {
    params.set('checkout', checkOut.toISOString().split('T')[0])
  }

  return `https://www.booking.com/searchresults.html?${params.toString()}`
}
