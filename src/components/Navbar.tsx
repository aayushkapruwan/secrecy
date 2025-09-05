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
function Navbar() {
  const router = useRouter()
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <div className="w-screen bg-gray-600">
      <div className="max-w-5xl mx-auto h-15 flex justify-between items-center">
        <div>
          <button className=" font-extrabold font-serif text-3xl">
            secrecy
          </button>
        </div>
        <div>
          {session ? (
            <>
              <div className=" flex justify-between items-center gap-4">
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
                <Button
                  onClick={() => {
                    async function signout() {
                      await signOut({
                        redirect: true,
                        callbackUrl: "/sign-in", // Redirect to sign-in page after logout
                      });
                      toast("signed out successfully");
                      router.push('/sign-in')
                    }
                    signout()
                  }}
                >
                  Log-out
                </Button>
                <Popover >
                  <PopoverTrigger><UserIcon size={24} color="black" /></PopoverTrigger>
                  <PopoverContent className="bg-amber-400 text-gray-800">
                    welcome to secrecy {user.username || user.email} !
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <div className=" flex justify-between items-center gap-4">
              <Link href="/sign-in">
                <Button>Sign-in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign-up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
