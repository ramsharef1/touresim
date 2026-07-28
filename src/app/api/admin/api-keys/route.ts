import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { apiKeys } from '@/db/schema/admin'
import { eq } from 'drizzle-orm'
import { clearApiKeyCache } from '@/lib/api-keys'

/**
 * Admin API for managing API keys
 */

// Verify admin authentication
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET || 'admin-secret'

  return authHeader === `Bearer ${adminSecret}`
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        provider: apiKeys.provider,
        status: apiKeys.status,
        lastUsed: apiKeys.lastUsed,
        updatedAt: apiKeys.updatedAt,
        // Exclude actual key values for security
      })
      .from(apiKeys)

    return NextResponse.json({ success: true, data: keys })
  } catch (error) {
    console.error('[Admin API Keys] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, key, secretKey, provider, status, notes } = body

    if (!name || !key) {
      return NextResponse.json(
        { error: 'name and key required' },
        { status: 400 }
      )
    }

    // Check if key exists
    const existing = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.name, name))

    if (existing.length > 0) {
      // Update existing
      await db
        .update(apiKeys)
        .set({ key, secretKey, provider, status, notes })
        .where(eq(apiKeys.name, name))

      clearApiKeyCache()

      return NextResponse.json(
        { success: true, message: 'API key updated', action: 'updated' },
        { status: 200 }
      )
    } else {
      // Create new
      await db.insert(apiKeys).values({
        name,
        key,
        secretKey,
        provider,
        status: (status as any) || 'active',
        notes,
      })

      clearApiKeyCache()

      return NextResponse.json(
        { success: true, message: 'API key created', action: 'created' },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('[Admin API Keys] POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    await db
      .update(apiKeys)
      .set({ status: 'inactive' as any })
      .where(eq(apiKeys.id, parseInt(id)))

    clearApiKeyCache()

    return NextResponse.json({ success: true, message: 'API key deactivated' })
  } catch (error) {
    console.error('[Admin API Keys] DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
