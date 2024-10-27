'use client';

import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: { url: string }) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course updated');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success('Attachment deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Course attachments
        <Button variant={'ghost'} onClick={toggleIsEditing}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => onSubmit({ url })}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Add anything your students might need to complete the course.
          </p>
        </>
      )}

      {!isEditing && !initialData.attachments.length ? (
        <p className='mt-2 text-sm italic text-slate-500'>No attachments yet</p>
      ) : (
        <div className='space-y-2'>
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700'>
              <File className='mr-2 h-4 w-4 flex-shrink-0' />
              <p className='line-clamp-1 text-xs'>{attachment.name}</p>

              {deletingId === attachment.id ? (
                <Loader2 className='ml-2 h-4 w-4 animate-spin' />
              ) : (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className='ml-auto transition hover:opacity-75'>
                  <X className='ml-2 h-4 w-4' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
