"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher"; // Assuming isTeacher function exists

export const NavbarRoutes = () => {
  const { userId } = useAuth(); // Get userId from useAuth hook
  const pathname = usePathname(); // Get current path to determine which page we're on

  // Check if the user is on specific pages
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapters");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  // Safely check if userId exists before using it with isTeacher function
  const isTeacherUser = userId ? isTeacher(userId) : false;

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="ml-auto flex items-center gap-x-2">
        {/* Show 'Exit' button if on teacher or course page */}
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut size={14} className="mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacherUser ? (
          // Show 'Teacher Mode' button if the user is a teacher
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher Mode
            </Button>
          </Link>
        ) : null}

        {/* Show User Button if user is signed in */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* Show Sign In Button if user is signed out */}
        <SignedOut>
          <SignInButton>
            <Button size={"sm"} variant={"partner"}>
              <LogIn size={24} className="mr-2" />
              Login
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </>
  );
};

export default NavbarRoutes;
