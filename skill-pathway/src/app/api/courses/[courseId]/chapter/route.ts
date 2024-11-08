import { db } from '@/lib/db';
import { useAuth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

interface ContextProps {
  params: {
    courseId: string;
  };
}

export async function POST(request: NextRequest, { params }: ContextProps) {
  try {
    const { userId } = useAuth();
    const { chapterTitle } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title: chapterTitle,
        position: newPosition,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTERS]', error);
  }
}
