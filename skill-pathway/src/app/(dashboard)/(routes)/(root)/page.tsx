import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
// import { redirect } from 'next/navigation';
import { InfoCard } from "./_components/info-card";

import ReAuth from "@/lib/reauth";
import { isTeacher } from "@/lib/teacher";

export default async function Dashboard() {
  try {
    const { userId } = await auth();

    const isAutorized = isTeacher(userId);

    // if (!userId) {
    //   return redirect("/");
    // }

    if (!userId) {
      <ReAuth />;
    }

    const { completedCourses, coursesInProgress } = await getDashboardCourses(
      userId
    );

    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
          />
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
          />
        </div>
        <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      </div>
    );
  } catch (error) {
    console.log("[DASHBOARD]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
      userId: null,
    };
  }
}