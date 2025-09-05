"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import Logo from "@/components/Logo";
export default function signup() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmit = async function (data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast("login failed", {
            description: "Incorrect username or password",
          });
        } else {
          toast("Error", {
            description: result.error,
          });
        }
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
      setIsSubmitting(false)
    } catch (error) {
      toast("error while signing in");
      setIsSubmitting(false)
    }
    setIsSubmitting(false)
  };
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-purple-200/50">
        <div className="text-center">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-purple-900">
            Welcome Back
          </h1>
          <p className="mb-4 text-purple-600">Sign in to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <div>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} type="text" />
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
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
}
