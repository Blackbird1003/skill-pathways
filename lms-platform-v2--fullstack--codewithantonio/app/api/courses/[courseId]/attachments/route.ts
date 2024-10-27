import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface ContextProps {
  params: { courseId: string };
}

export async function POST(request: Request, { params }: ContextProps) {
  try {
    const { userId } = auth();
    const { url } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        courseId: params.courseId,
        name: url.split('/').pop(),
        url,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[ATTACHMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
