"use client";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import axios from "axios";
import { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameUniqueMessage, setUsernameUniqueMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 700);

  const checkUsernameUniqueness = async function () {
    if (username) {
      setisCheckingUsername(true);
      setUsernameUniqueMessage("");
      try {
        const res = await axios.get(`/api/checkUsernameUnique?username=${username}`);
        console.log(res);
        
        setUsernameUniqueMessage(res.data.message);
        setisCheckingUsername(false);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponseType>;
        setUsernameUniqueMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
        setisCheckingUsername(false);
      } finally {
        setisCheckingUsername(false);
      }
    }
  };
  useEffect(() => {
    checkUsernameUniqueness();
  }, [username]);

  const onsubmit = async function (data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/signup", data);
      console.log(res);

      toast(res.data.success ? "success" : "failed", {
        description: res.data.message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      if (res.data.success) {
        router.replace(`/verify/${username}`);
      }
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");
      toast("error in singup", {
        description: errorMessage,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setIsSubmitting(false);
    }
  };
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Secrecy
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <div>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div>
                        {" "}
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                        {isCheckingUsername ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <></>
                        )}
                        {!isCheckingUsername && usernameUniqueMessage ? (
                          <p
                            className={`text-sm ${
                              usernameUniqueMessage === "Username is unique"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {usernameUniqueMessage}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>
        </Form>
                    <div className="text-center mt-4">
              <p>
                Already a member?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>
            </div>

      </div>
    </div>
  );
}
