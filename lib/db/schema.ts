import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name'),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
