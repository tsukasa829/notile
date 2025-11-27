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

// 修了証書
export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  programId: uuid('program_id').references(() => programs.id).notNull(),
  enrollmentId: uuid('enrollment_id').references(() => enrollments.id).notNull(),
  certificateNumber: text('certificate_number').notNull().unique(), // 証書番号
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  completionDate: timestamp('completion_date').notNull(), // 修了日
});

// バッジ定義
export const badgeRarityEnum = pgEnum('badge_rarity', ['common', 'rare', 'epic', 'legendary']);

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  rarity: badgeRarityEnum('rarity').notNull().default('common'),
  programId: uuid('program_id').references(() => programs.id), // コース完了バッジの場合
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ユーザー獲得バッジ
export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  badgeId: uuid('badge_id').references(() => badges.id).notNull(),
  earnedAt: timestamp('earned_at').defaultNow().notNull(),
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
export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
