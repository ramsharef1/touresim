/**
 * GetYourGuide Affiliate API Integration
 * Fetches tour and activity deals
 */

interface GetYourGuideDeal {
  title: string
  description?: string
  destinationSlug: string
  dealPrice: number
  originalPrice?: number
  affiliateUrl: string
  imageUrl?: string
  externalId: string
  expiresAt: Date
  type: 'tour' | 'activity' | 'experience'
}

export async function fetchGetYourGuideDeals(destinationSlug?: string): Promise<GetYourGuideDeal[]> {
  const apiKey = process.env.GETYOURGUIDE_AFFILIATE_API_KEY

  if (!apiKey) {
    console.warn('[GetYourGuide API] Missing credentials - GETYOURGUIDE_AFFILIATE_API_KEY not set')
    return []
  }

  try {
    // GetYourGuide API documentation: https://partner.getyourguide.com/

    // For MVP: Return empty array with instructions
    console.log('[GetYourGuide API] Integration pending - requires API credentials')

    const deals: GetYourGuideDeal[] = []

    // TODO: Implement actual API call
    // const response = await fetch('https://api.getyourguide.com/activities/deals', {
    //   headers: { 'Authorization': `Bearer ${apiKey}` }
    // })
    // const data = await response.json()
    // return data.activities.map(a => ({...}))

    return deals
  } catch (error) {
    console.error('[GetYourGuide API] Error fetching deals:', error)
    return []
  }
}

/**
 * Build affiliate URL for GetYourGuide activity search
 */
export function buildGetYourGuideAffiliateUrl(destination: string): string {
  const params = new URLSearchParams({
    cmp: 'touresim_affiliate',
  })

  return `https://www.getyourguide.com/search?q=${encodeURIComponent(destination)}&${params.toString()}`
}
