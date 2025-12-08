"use client";

import { useAuth } from "@/contexts/AuthContext";
import { VerificationCard } from "@/components/dashboard/VerificationCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export default function VerificationPage() {
  // TODO: Get user from your backend API
  const session = { user: { emailVerified: false } };

  const isEmailVerified = session?.user?.emailVerified;
  const isPhoneVerified = session?.user?.phoneVerified;
  const isDocumentVerified = session?.user?.isVerified;
  const isOwner = session?.user?.role === "OWNER";

  // Calculate verification status
  const verificationStatus = () => {
    if (isOwner) {
      if (isEmailVerified && isPhoneVerified && isDocumentVerified) {
        return "complete";
      } else if (isEmailVerified || isPhoneVerified) {
        return "partial";
      }
      return "none";
    } else {
      if (isEmailVerified && isPhoneVerified) {
        return "complete";
      } else if (isEmailVerified || isPhoneVerified) {
        return "partial";
      }
      return "none";
    }
  };

  const status = verificationStatus();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Account Verification</h1>

      <div className="grid gap-6">
        <Card
          className={`border-l-4 ${
            status === "complete"
              ? "border-l-green-500"
              : status === "partial"
              ? "border-l-amber-500"
              : "border-l-red-500"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              {status === "complete" ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : status === "partial" ? (
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              ) : (
                <Info className="h-5 w-5 mr-2 text-red-500" />
              )}
              Verification Status
            </CardTitle>
            <CardDescription>
              {status === "complete"
                ? "Your account is fully verified"
                : status === "partial"
                ? "Your account is partially verified"
                : "Your account is not verified"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                {status === "complete"
                  ? "You have access to all features of RentHub."
                  : status === "partial"
                  ? "Complete all verification steps to access all features."
                  : "Verify your account to access all features of RentHub."}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      isEmailVerified ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm">Email Verification</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${
                      isPhoneVerified ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-sm">Phone Verification</span>
                </div>
                {isOwner && (
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 ${
                        isDocumentVerified ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-sm">Document Verification</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <VerificationCard />

        <Card>
          <CardHeader>
            <CardTitle>Why Verify Your Account?</CardTitle>
            <CardDescription>
              Verification helps us maintain a secure platform for all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Verification helps protect your account and ensures only you
                    can access it.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Build Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified users are more trusted by other members of the
                    RentHub community.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Access All Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Some features are only available to verified users to ensure
                    platform safety.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
