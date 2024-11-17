
 

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    console.log("User ID:", userId);
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
    console.error('[COURSES] Internal Server Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
