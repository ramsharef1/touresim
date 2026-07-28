/**
 * API Keys management
 * Fetch keys from database with fallback to environment variables
 */

import { db } from '@/db'
import { apiKeys } from '@/db/schema/admin'
import { eq } from 'drizzle-orm'

const keyCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Get API key by name
 * Falls back to environment variable if not in database
 */
export async function getApiKey(keyName: string): Promise<string | null> {
  const cacheKey = `api_key_${keyName}`

  // Check cache first
  const cached = keyCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value
  }

  try {
    // Try database first
    const dbKey = await db
      .select({ key: apiKeys.key })
      .from(apiKeys)
      .where(eq(apiKeys.name, keyName))
      .limit(1)

    if (dbKey.length > 0) {
      const value = dbKey[0].key
      keyCache.set(cacheKey, { value, timestamp: Date.now() })
      return value
    }
  } catch (error) {
    console.warn(`[API Keys] Database lookup failed for ${keyName}, falling back to env`)
  }

  // Fallback to environment variables
  const envKey = {
    'booking': process.env.BOOKING_AFFILIATE_API_KEY,
    'booking_id': process.env.BOOKING_AFFILIATE_ID,
    'getyourguide': process.env.GETYOURGUIDE_AFFILIATE_API_KEY,
    'skyscanner': process.env.SKYSCANNER_AFFILIATE_API_KEY,
    'openexchangerates': process.env.OPENEXCHANGERATES_API_KEY,
    'cron_secret': process.env.CRON_SECRET,
  }[keyName]

  if (envKey) {
    keyCache.set(cacheKey, { value: envKey, timestamp: Date.now() })
    return envKey
  }

  return null
}

/**
 * Get all active API keys (for admin panel)
 */
export async function getAllApiKeys() {
  try {
    return await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        provider: apiKeys.provider,
        status: apiKeys.status,
        lastUsed: apiKeys.lastUsed,
        updatedAt: apiKeys.updatedAt,
        // Don't select the actual key for security
      })
      .from(apiKeys)
      .orderBy(apiKeys.updatedAt)
  } catch (error) {
    console.error('[API Keys] Error fetching keys:', error)
    return []
  }
}

/**
 * Clear cache when keys updated
 */
export function clearApiKeyCache() {
  keyCache.clear()
}
