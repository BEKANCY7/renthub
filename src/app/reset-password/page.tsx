"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form validation schema
const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Verify token when component mounts
  useEffect(() => {
    if (!token || !email) {
      setTokenValid(false);
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    // For demo purposes, we'll assume any token is valid
    // In a real app, you would validate the token against your database
    setTokenValid(true);
  }, [token, email]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token || !email) {
      setError("Missing required parameters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would send a request to reset the password
      // For demo purposes, we'll just simulate a successful password reset

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success
      setIsSuccess(true);
    } catch (error) {
      setError((error as Error).message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  // Return different UI based on states
  if (isSuccess) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-medium text-xl">Password Reset Successful</p>
              <p className="text-sm text-gray-500">
                Your password has been reset successfully.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full mt-4"
              >
                Sign in with new password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="font-medium text-xl">Invalid Reset Link</p>
              <p className="text-sm text-gray-500">
                This password reset link is invalid or has expired.
              </p>
              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full mt-4"
              >
                Request a new link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <Link
            href="/login"
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
