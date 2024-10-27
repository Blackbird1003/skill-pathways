'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.includes('/chapter');

  return (
    <div className='ml-auto flex items-center gap-x-2'>
      {isTeacherPage || isCoursePage ? (
        <Link href={'/'}>
          <Button size={'sm'} variant={'ghost'}>
            <LogOut className='mr-2 h-4 w-4' />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant={'ghost'}>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl='/' />
    </div>
  );
};

export default NavbarRoutes;
