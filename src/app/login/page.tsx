import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login - RentHub",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Left side - Login form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-sm md:max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold tracking-tight text-primary"
            >
              RentHub
            </Link>
            <h2 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue your home search journey
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
          <div className="mt-6 md:mt-8">
            <LoginForm />
          </div>

          {/* Mobile-only features highlights */}
          <div className="md:hidden mt-8 bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
            <h3 className="text-base font-semibold text-primary mb-3 text-center">
              Why Choose RentHub?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-xs">
                  Browse thousands of rental properties
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-xs">
                  Save favorites and get notifications
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-xs">Connect with property owners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image and features */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/api/placeholder?width=1200&height=900&quality=80"
            alt="Modern apartment living room"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm"></div>
        </div>

        <div className="z-10 p-6 md:p-8 max-w-md text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            Find Your Perfect Home
          </h3>
          <ul className="space-y-3 md:space-y-4">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Browse thousands of rental properties across Ethiopia</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Save your favorite listings and get notifications</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Connect directly with property owners and agents</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Schedule viewings and manage your applications</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
