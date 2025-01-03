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
   




    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedChapterInCourse = await db.chapter.findMany({
        where:{
            courseId: params.courseId,
            isPublished:true,
        }
    });

    if(!publishedChapterInCourse.length){
        await db.course.update({
  where:{
            id: params.courseId,
        },
        data: {
            isPublished:false
        }

        })
    }

    return NextResponse.json(unpublishedChapter);

  } catch (error) {
    console.log('[CHAPTER_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}