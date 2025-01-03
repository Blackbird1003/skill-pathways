import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface ContextProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PATCH(request: Request, { params }: ContextProps) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
    });

    if (!ownCourse) {
      return new NextResponse('Not Found', { status: 404 });
    }
    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        }
    })

    const muxData = await db.muxData.findUnique({
         where: {
            chapterId: params.chapterId,
         }
    });

    

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl || !muxData) {
      return new NextResponse('Missing required fields', { status: 400 });
    };

    const pubishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(pubishedChapter);

  } catch (error) {
    console.log('[CHAPTER_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}