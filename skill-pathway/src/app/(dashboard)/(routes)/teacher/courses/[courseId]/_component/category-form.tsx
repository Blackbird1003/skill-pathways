"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import axios from "axios";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Course } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  categories: { label: string; value: string }[];
}

const CategoryFormSchema = z.object({
  categoryId: z.string().trim().min(1),
});

type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;

const CategoryForm = ({
  initialData,
  courseId,
  categories,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<CategoryFormSchemaType>({
    mode: "onBlur",
    defaultValues: { categoryId: initialData?.categoryId || "" },

    resolver: zodResolver(CategoryFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: CategoryFormSchemaType) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const selectedCategorie = categories.find(
    (category) => category.value === initialData.categoryId
  )?.label;

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Category
        <Button variant={"ghost"} onClick={toggleIsEditing}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !selectedCategorie && "italic text-slate-500"
          )}
        >
          {selectedCategorie || "No category selected"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      categories={categories.map((category) => ({
                        label: category.label,
                        value: category.value,
                      }))} // Pass the categories array
                      {...field} // Handle value changes
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
