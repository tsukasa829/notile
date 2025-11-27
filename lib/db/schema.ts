import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const enrollmentStatusEnum = pgEnum('enrollment_status', ['active', 'completed', 'dropped']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name'),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorId: uuid('creator_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  isFree: boolean('is_free').notNull().default(true),
  category: text('category'),
  aiGenerated: boolean('ai_generated').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').references(() => programs.id).notNull(),
  orderIndex: integer('order_index').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  resourceUrl: text('resource_url'),
  estimatedMinutes: integer('estimated_minutes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  programId: uuid('program_id').references(() => programs.id).notNull(),
  status: enrollmentStatusEnum('status').notNull().default('active'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id').references(() => enrollments.id).notNull(),
  stepId: uuid('step_id').references(() => steps.id).notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type Step = typeof steps.$inferSelect;
export type NewStep = typeof steps.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
