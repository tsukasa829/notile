import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enrollments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUserFromRequest } from '@/lib/auth';

// コースに受講登録
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: programId } = await params;
    const user = await getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 既に受講登録されているかチェック
    const [existing] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, user.id),
          eq(enrollments.programId, programId)
        )
      );

    if (existing) {
      return NextResponse.json({
        ok: true,
        enrollment: existing,
        message: 'Already enrolled',
      });
    }

    // 新規受講登録
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        userId: user.id,
        programId,
        status: 'active',
      })
      .returning();

    return NextResponse.json({
      ok: true,
      enrollment,
      message: 'Successfully enrolled',
    });
  } catch (error) {
    console.error('Enroll failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to enroll' },
      { status: 500 }
    );
  }
}
