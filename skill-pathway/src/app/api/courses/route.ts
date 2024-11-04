import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) { // Change Request to NextRequest
  try {
    const { userId } = getAuth(request); // Use getAuth to get user info from the request
    const { title } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
