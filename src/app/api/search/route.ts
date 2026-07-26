import { NextRequest, NextResponse } from 'next/server'
import { searchDestinations } from '@/lib/queries'
import { isSupportedLocale } from '@/lib/locales'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  const locale = req.nextUrl.searchParams.get('locale') ?? 'en'

  if (q.length < 2) return NextResponse.json([])

  const safeLocale = isSupportedLocale(locale) ? locale : 'en'
  const results = await searchDestinations(q, safeLocale)
  return NextResponse.json(results)
}
