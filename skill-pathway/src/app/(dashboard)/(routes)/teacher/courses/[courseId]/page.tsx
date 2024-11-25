import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_component/title-form";
import DescriptionForm from "./_component/description-form";
import ImageForm from "./_component/image-form";
import CategoryForm from "./_component/category-form";
import PriceForm from "./_component/price-form";
import AttachmentForm from "./_component/attachment-form";
import ChaptersForm from "./_component/chapter-form";
import Banner from "@/components/banner";
import { Actions } from "./_component/action";
import { auth } from "@clerk/nextjs/server";

interface CourseIdProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params }: CourseIdProps) => {
  const { courseId } = params;
  const { userId } = await auth();

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      attachments: { orderBy: { createdAt: "desc" } },
      chapters: { orderBy: { position: "asc" } },
    },
  });

  if (!course || course.userId !== userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });
  console.log(categories);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
    course.price !== null,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((field) =>
    Boolean(field)
  ).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Section `Customize your course` starts */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              categories={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          {/* Section `Customize your course` ends */}
          <div className="space-y-6">
            {/* Section `Course Chapters` starts */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            {/* Section `Course Chapters` ends */}
            {/* Section `Sell your course` starts */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            {/* Section `Sell your course` ends */}
            {/* Section `Resources & Attachments` starts */}
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
            {/* Section `Resources & Attachments` ends */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
