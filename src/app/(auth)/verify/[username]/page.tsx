"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import ApiResponseType from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
function page() {
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [loading, setLoading] = useState(false);
  const onsubmit = async function (data: z.infer<typeof verifySchema>) {
    setLoading(true);
    if (data) {
      try {
        const res = await axios.post("/api/verify-user", {
          username: params.username,
          code: data.code,
        });

        toast(res.data.success, {
          description: res.data.message,
        });
        if (res.data.success) {
          router.replace("/sign-in");
        }
        setLoading(false);
      } catch (error: any) {
        const axiosError = error as AxiosError<ApiResponseType>;
        toast("Verification Failed", {
          description:
            axiosError.response?.data.message ??
            "An error occurred. Please try again.",
        });
        setLoading(false);
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verify-Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Verify-Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{loading ? <Loader2 /> : "verify"}</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default page;
