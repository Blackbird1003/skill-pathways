'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url: string) => void;
  endpoint: keyof OurFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error('Something went wrong');
        console.log(error);
      }}
      endpoint={endpoint}
    />
  );
};

export default FileUpload;
