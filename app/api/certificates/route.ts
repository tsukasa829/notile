// ユーザーの修了証書一覧取得API
// GET /api/certificates?userId=xxx

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { certificates, programs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCertificates = await db
      .select({
        id: certificates.id,
        certificateNumber: certificates.certificateNumber,
        issuedAt: certificates.issuedAt,
        completionDate: certificates.completionDate,
        program: {
          id: programs.id,
          title: programs.title,
          category: programs.category,
        },
      })
      .from(certificates)
      .innerJoin(programs, eq(certificates.programId, programs.id))
      .where(eq(certificates.userId, user.id))
      .orderBy(certificates.issuedAt);

    return NextResponse.json(userCertificates);
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
