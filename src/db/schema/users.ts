import { int, mysqlEnum, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'
import { NAME_LEN, timestamps, userRoleValues } from './_shared'

// =====================================================================
// USERS — for the custom lightweight admin (auth + authorship).
// =====================================================================

export const users = mysqlTable(
  'users',
  {
    id: int('id').autoincrement().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: NAME_LEN }),
    role: mysqlEnum('role', userRoleValues).default('editor').notNull(),
    ...timestamps(),
  },
  (t) => [uniqueIndex('users_email_unq').on(t.email)],
)
