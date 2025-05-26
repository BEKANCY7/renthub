"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema
const contactFormSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [listingLoading, setListingLoading] = useState(true);

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setListingLoading(true);
        const response = await fetch(`/api/listings/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to load listing");
        }

        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error loading listing:", error);
        setError("Failed to load listing details");
      } finally {
        setListingLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/listings/${params.id}/contact`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: listing?.userId,
          listingId: params.id,
          initialMessage: values.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await response.json();
      router.push(`/messages?conversation=${data.id}`);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push(`/login?callbackUrl=/listings/${params.id}/contact`);
    return null;
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/listings/${params.id}`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listing
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Property Owner</CardTitle>
        </CardHeader>
        <CardContent>
          {listingLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">{listing?.title}</h2>
                <p className="text-muted-foreground">
                  ETB {listing?.price.toLocaleString()}/month ·{" "}
                  {listing?.location?.city || "Addis Ababa"}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hi, I'm interested in this property. Is it still available?"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about what you'd like to know about the
                          property
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    <AlertTitle className="text-yellow-800">
                      Important
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      For your security, please do not share personal contact
                      information until your booking is confirmed. All
                      communication should happen through our messaging system.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
