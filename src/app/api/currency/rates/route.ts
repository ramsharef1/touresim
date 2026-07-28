import { NextResponse } from 'next/server'

/**
 * Fetch current exchange rates from Open Exchange Rates API
 * Cached for 24 hours via ISR
 */

interface RatesCache {
  rates: Record<string, number>
  timestamp: string
  expiresAt: number
}

let cachedRates: RatesCache | null = null

export async function GET() {
  try {
    const now = Date.now()

    // Return cached rates if still valid (24 hour cache)
    if (cachedRates && cachedRates.expiresAt > now) {
      return NextResponse.json(cachedRates)
    }

    const apiKey = process.env.OPENEXCHANGERATES_API_KEY

    // Mock rates for MVP (no API key required)
    if (!apiKey) {
      const mockRates: RatesCache = {
        rates: {
          USD: 1.0,
          EUR: 0.92,
          GBP: 0.79,
          JPY: 149.5,
          AUD: 1.52,
          CAD: 1.36,
          CHF: 0.89,
          CNY: 7.24,
          INR: 83.2,
          MXN: 17.05,
          BRL: 4.97,
          ZAR: 18.65,
        },
        timestamp: new Date().toISOString(),
        expiresAt: now + 24 * 60 * 60 * 1000,
      }
      cachedRates = mockRates
      return NextResponse.json(mockRates)
    }

    // Fetch from Open Exchange Rates API
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=USD`
    )

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const data = await response.json()

    const result: RatesCache = {
      rates: data.rates,
      timestamp: new Date().toISOString(),
      expiresAt: now + 24 * 60 * 60 * 1000,
    }

    cachedRates = result
    return NextResponse.json(result)
  } catch (error) {
    console.error('[Currency API] Error:', error)

    // Fallback to cached rates or mock rates
    if (cachedRates) {
      return NextResponse.json(cachedRates)
    }

    // Last resort: mock rates
    const fallback: RatesCache = {
      rates: {
        USD: 1.0,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        AUD: 1.52,
        CAD: 1.36,
        CHF: 0.89,
        CNY: 7.24,
        INR: 83.2,
        MXN: 17.05,
        BRL: 4.97,
        ZAR: 18.65,
      },
      timestamp: new Date().toISOString(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    }

    return NextResponse.json(fallback)
  }
}
