// 修了証書詳細・発行API
// GET /api/certificates/[id] - 証書詳細
// POST /api/certificates/[id]?userId=xxx - 証書発行（コース完了時）

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { certificates, programs, users, enrollments, steps, progress, badges, userBadges } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { getCurrentUserFromRequest } from '@/lib/auth';

// 証書番号生成
function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NQ-${timestamp}-${random}`;
}

// GET: 証書詳細取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db
      .select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        issuedAt: certificates.issuedAt,
        completionDate: certificates.completionDate,
        user: {
          id: users.id,
          displayName: users.displayName,
        },
        program: {
          id: programs.id,
          title: programs.title,
          description: programs.description,
          category: programs.category,
        },
      })
      .from(certificates)
      .innerJoin(users, eq(certificates.userId, users.id))
      .innerJoin(programs, eq(certificates.programId, programs.id))
      .where(eq(certificates.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

// POST: コース完了時に証書発行
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: enrollmentId } = await params;
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // エンロールメント確認
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.id, enrollmentId),
        eq(enrollments.userId, user.id)
      ))
      .limit(1);

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // 既に証書が発行済みか確認
    const [existingCert] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.enrollmentId, enrollmentId))
      .limit(1);

    if (existingCert) {
      return NextResponse.json({
        message: 'Certificate already issued',
        certificate: existingCert,
      });
    }

    // 全ミッション完了確認
    const [totalSteps] = await db
      .select({ count: count() })
      .from(steps)
      .where(eq(steps.programId, enrollment.programId));

    const [completedSteps] = await db
      .select({ count: count() })
      .from(progress)
      .where(and(
        eq(progress.enrollmentId, enrollmentId),
        eq(progress.isCompleted, true)
      ));

    if (completedSteps.count < totalSteps.count) {
      return NextResponse.json(
        { error: 'Course not completed yet', completed: completedSteps.count, total: totalSteps.count },
        { status: 400 }
      );
    }

    // 修了証書発行
    const [newCertificate] = await db
      .insert(certificates)
      .values({
        userId: user.id,
        programId: enrollment.programId,
        enrollmentId: enrollmentId,
        certificateNumber: generateCertificateNumber(),
        completionDate: new Date(),
      })
      .returning();

    // エンロールメントのステータスを完了に更新
    await db
      .update(enrollments)
      .set({
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(enrollments.id, enrollmentId));

    // コース完了バッジがあれば付与
    const [courseBadge] = await db
      .select()
      .from(badges)
      .where(eq(badges.programId, enrollment.programId))
      .limit(1);

    let earnedBadge = null;
    if (courseBadge) {
      // まだバッジを持っていなければ付与
      const [existingUserBadge] = await db
        .select()
        .from(userBadges)
        .where(and(
          eq(userBadges.userId, user.id),
          eq(userBadges.badgeId, courseBadge.id)
        ))
        .limit(1);

      if (!existingUserBadge) {
        await db
          .insert(userBadges)
          .values({
            userId: user.id,
            badgeId: courseBadge.id,
          });
        earnedBadge = courseBadge;
      }
    }

    return NextResponse.json({
      message: 'Certificate issued successfully!',
      certificate: newCertificate,
      earnedBadge,
    });
  } catch (error) {
    console.error('Failed to issue certificate:', error);
    return NextResponse.json(
      { error: 'Failed to issue certificate' },
      { status: 500 }
    );
  }
}
