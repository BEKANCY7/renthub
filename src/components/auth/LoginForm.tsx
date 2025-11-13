"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { storeUser } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import ClientOnly from "@/components/ClientOnly";
import { loginToExternalAPI, storeAuthTokens, ApiError } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      // Login with external API
      const response = await loginToExternalAPI({
        email: values.email,
        password: values.password,
      });

      console.log("API Response:", response);

      // Store tokens and user data
      if (response.access || response.token) {
        storeAuthTokens(response);

        // Set cookie for middleware
        const token = response.access || response.token;
        if (token) {
          document.cookie = `auth_token=${token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }`; // 7 days
        }

        if (response.user) {
          storeUser(response.user);
        }

        console.log("Login successful, redirecting...");

        // Redirect based on user role
        const userRole = response.user?.role?.toUpperCase();

        if (userRole === "ADMIN") {
          console.log("Admin user detected, redirecting to admin dashboard");
          window.location.href = "/admin/dashboard";
        } else if (userRole === "RENTER") {
          console.log("Redirecting to find-home");
          window.location.href = "/find-home";
        } else if (userRole === "OWNER") {
          console.log("Redirecting to owner dashboard");
          window.location.href = "/dashboard";
        } else {
          // Default fallback
          console.log("Redirecting to default dashboard");
          window.location.href = "/dashboard";
        }
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (apiError) {
      const error = apiError as ApiError;
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Something went wrong with Google sign in.");
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly>
      <motion.div
        className="space-y-4 md:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 md:space-y-4"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-9 md:h-10 text-sm md:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 h-9 md:h-10 text-sm md:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                    <div className="text-right">
                      <Link
                        href="/forgot-password"
                        className="text-xs md:text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Alert
                  variant="destructive"
                  className="border-red-500/50 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 py-2 text-xs md:text-sm"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full h-9 md:h-10 text-sm md:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            type="button"
            className="w-full h-9 md:h-10 text-sm md:text-base"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100"
        >
          <h3 className="text-xs md:text-sm font-medium text-blue-800 mb-1 md:mb-2">
            Why join RentHub?
          </h3>
          <p className="text-xs text-blue-700">
            Create an account to save your favorite properties, get personalized
            recommendations, and receive updates on new listings that match your
            criteria.
          </p>
        </motion.div>
      </motion.div>
    </ClientOnly>
  );
}
