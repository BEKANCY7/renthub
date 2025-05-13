import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Register - RentHub",
    description: "Create a new account",
};

export default async function RegisterPage() {
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
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
                <div className="mt-8">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
} 