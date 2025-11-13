"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus("success");
          // Update the session to reflect the verified status
          if (session) {
            await update();
          }
        } else {
          setVerificationStatus("error");
          setErrorMessage(data.error || "Failed to verify email");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    verifyToken();
  }, [token, session, update]);

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {verificationStatus === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p>Verifying your email address...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Verification Successful!
              </h2>
              <p className="text-center text-muted-foreground">
                Your email has been verified successfully. You can now access
                all features of RentHub.
              </p>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Verification Failed
              </h2>
              <p className="text-center text-muted-foreground mb-2">
                {errorMessage || "We couldn't verify your email address."}
              </p>
              <p className="text-center text-muted-foreground">
                Please try again or contact support for assistance.
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {verificationStatus === "success" && (
            <Button className="w-full" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          )}

          {verificationStatus === "error" && (
            <Button className="w-full" onClick={handleGoToLogin}>
              Go to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
