"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function VerificationCard() {
  const { data: session, update } = useSession();
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    session?.user?.phoneNumber || ""
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  const isEmailVerified = session?.user?.emailVerified;
  const isPhoneVerified = session?.user?.phoneVerified;
  const isDocumentVerified = session?.user?.isVerified;
  const isOwner = session?.user?.role === "OWNER";

  const handleSendEmailVerification = async () => {
    if (!session?.user?.email) return;

    setEmailLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent! Please check your inbox.");

        // In development, show the verification link
        if (process.env.NODE_ENV === "development" && data.verificationLink) {
          toast.info(`Dev mode: ${data.verificationLink}`);
        }
      } else {
        toast.error(data.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendPhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setPhoneLoading(true);
    try {
      const response = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification code sent to your phone!");
        setShowVerificationInput(true);

        // In development, show the verification code
        if (process.env.NODE_ENV === "development" && data.code) {
          toast.info(`Dev mode: Verification code is ${data.code}`);
        }
      } else {
        toast.error(data.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Error sending phone verification:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setPhoneLoading(true);
    try {
      const response = await fetch("/api/auth/verify-phone", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Phone number verified successfully!");
        setShowVerificationInput(false);
        setVerificationCode("");
        // Update session to reflect the verified status
        await update();
      } else {
        toast.error(data.error || "Failed to verify phone number");
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleUploadDocuments = async () => {
    // In a real app, you would handle file uploads here
    // For demo purposes, we'll simulate document upload with dummy URLs
    const dummyUrls = [
      "https://example.com/id-document.jpg",
      "https://example.com/proof-of-address.jpg",
    ];

    setDocumentLoading(true);
    try {
      const response = await fetch("/api/auth/verify-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentUrls: dummyUrls,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Documents uploaded successfully and pending review!");
        setDocumentUrls(dummyUrls);
      } else {
        toast.error(data.error || "Failed to upload documents");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDocumentLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Verification</CardTitle>
        <CardDescription>
          Verify your account to access all features of RentHub
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {/* Email Verification */}
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div>
              {isEmailVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm">Verified</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendEmailVerification}
                  disabled={emailLoading}
                >
                  {emailLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Phone Verification */}
          <div className="flex flex-col p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  {isPhoneVerified ? (
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.phoneNumber}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not verified
                    </p>
                  )}
                </div>
              </div>
              <div>
                {isPhoneVerified ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                ) : showVerificationInput ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVerificationInput(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendPhoneVerification}
                    disabled={phoneLoading}
                  >
                    {phoneLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Verify Phone"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {!isPhoneVerified && (
              <div className="mt-3">
                {!showVerificationInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+251 9xxxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">
                        Verification Code
                      </Label>
                      <Input
                        id="verificationCode"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                    <Button
                      onClick={handleVerifyPhone}
                      disabled={phoneLoading}
                      className="w-full"
                    >
                      {phoneLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Submit Code"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Document Verification (Only for Owners) */}
          {isOwner && (
            <div className="flex flex-col p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Identity Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Required for property owners
                    </p>
                  </div>
                </div>
                <div>
                  {isDocumentVerified ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm">Verified</span>
                    </div>
                  ) : documentUrls.length > 0 ? (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm">Pending Review</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUploadDocuments}
                      disabled={documentLoading}
                    >
                      {documentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Documents"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {documentUrls.length > 0 && !isDocumentVerified && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    Your documents are being reviewed by our team. This usually
                    takes 1-2 business days.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          <p>Verification helps us maintain a secure platform for all users.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
