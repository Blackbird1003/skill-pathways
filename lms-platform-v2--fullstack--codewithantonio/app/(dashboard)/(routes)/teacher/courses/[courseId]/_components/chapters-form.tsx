'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const chaptersFormSchema = z.object({
  chapterTitle: z.string().trim().min(1, 'Chapter title is required'),
});

type ChaptersFormSchemaType = z.infer<typeof chaptersFormSchema>;

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const form = useForm<ChaptersFormSchemaType>({
    mode: 'onBlur',
    defaultValues: { chapterTitle: '' },

    resolver: zodResolver(chaptersFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsCreating = () => setIsCreating((current) => !current);

  const onSubmit = async (values: ChaptersFormSchemaType) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter created');
      toggleIsCreating();
      form.reset();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course Chapters
        <Button variant={'ghost'} onClick={toggleIsCreating}>
          {isCreating ? (
            'Cancel'
          ) : (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='chapterTitle'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. Introduction to the course'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <>
          {initialData.chapters.length === 0 && (
            <p className='mt-2 text-sm italic text-slate-500'>No chapters</p>
          )}
          {initialData.chapters.length > 0 && (
            <ChaptersList items={initialData.chapters} />
          )}
        </>
      )}
    </div>
  );
};

export default ChaptersForm;
