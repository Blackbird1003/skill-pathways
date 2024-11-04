import { db } from "@/lib/db";
import { useAuth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH  (
req: Request,
{ params }: { params: { courseId: string}}
) {
    try {
        const { userId }= useAuth();
         const { courseId}= params;

         if(!userId){
            return new NextResponse("unauthorized" , {status: 401 });
         }

          const values = await req.json();


         const course =await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                ...values,
            }
         });

         return NextResponse.json(course);

    } catch (error) {
       console.log("[COURSE_ID]", error); 
      return new NextResponse("internal error" , {status: 500 });
    }
}