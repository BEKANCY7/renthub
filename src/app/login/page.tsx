import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Login - RentHub",
    description: "Login to your account",
};

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <Link href="/" className="text-3xl font-bold tracking-tight">
                        RentHub
                    </Link>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Or{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-primary hover:underline"
                        >
                            create an account
                        </Link>
                    </p>
                </div>
                <div className="mt-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
} 