
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
req: Request,
{params}: {params: {courseId: string}}
){
    try {
       const { userId } = await auth();

       if(!userId){
        return new NextResponse("Unauthorized", {status: 401});
       }

       const { List }= await req.json();
       const ownCourse = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId
        }
       });

       for(const item of List){
        await db.chapter.update({
            where: {id: item.id},
            data: {position: item.position}
        });
       }
        return new NextResponse("success", {status: 200});
     

       if(!ownCourse){
         return new NextResponse("Unauthorized", {status: 401});
       }
    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("internal error", {status: 500});
    }
}