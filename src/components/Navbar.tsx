"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logo from "./Logo";
function Navbar() {
  const router = useRouter()
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="w-full bg-purple-300/90 backdrop-blur-md border-b border-purple-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <Logo size="md" />
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-purple-700 hover:text-purple-900 hover:bg-purple-200">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-purple-700 hover:text-purple-900 hover:bg-purple-200"
                onClick={() => {
                  async function signout() {
                    await signOut({
                      redirect: true,
                      callbackUrl: "/sign-in",
                    });
                    toast("Signed out successfully");
                    router.push('/sign-in')
                  }
                  signout()
                }}
              >
                Sign out
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-purple-200 hover:bg-purple-300">
                    <UserIcon className="w-5 h-5 text-purple-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-white border-purple-200">
                  <div className="text-sm text-purple-600">
                    Welcome to Secrecy, <span className="font-medium text-purple-900">{user.username || user.email}</span>!
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-purple-700 hover:text-purple-900 hover:bg-purple-200">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-purple-900 hover:bg-purple-800 text-white">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
