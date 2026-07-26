import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

// Reuse a single pool across hot-reloads in dev.
const globalForDb = globalThis as unknown as { _touresimPool?: mysql.Pool }

const pool =
  globalForDb._touresimPool ??
  mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
    charset: 'utf8mb4',
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb._touresimPool = pool
}

export const db = drizzle(pool, { schema, mode: 'default' })
export { schema }
