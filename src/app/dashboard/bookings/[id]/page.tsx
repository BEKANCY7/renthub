"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Home,
  Check,
  Copy,
  X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data for the booking details
const mockBookingDetails = {
  id: "booking-123",
  property: {
    id: "prop1",
    title: "Modern Apartment in Bole",
    imageUrl: "https://source.unsplash.com/random/?apartment,modern",
    address: "Bole Road, Near Bole Medhanialem Church",
    city: "Addis Ababa",
    state: "Ethiopia",
    features: [
      "2 Bedrooms",
      "2 Bathrooms",
      "Air Conditioning",
      "WiFi",
      "Kitchen",
    ],
    latitude: 9.0084,
    longitude: 38.7648,
  },
  host: {
    id: "host1",
    name: "Alem Bekele",
    phone: "+251 91 234 5678",
    email: "alem.bekele@example.com",
    imageUrl: null,
    responseRate: 95,
    responseTime: "within 1 hour",
  },
  startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
  guests: 2,
  totalPrice: 25000,
  paidAmount: 5000,
  paymentStatus: "PARTIALLY_PAID",
  bookingStatus: "CONFIRMED",
  paymentMethods: [
    { id: "telebirr", name: "TeleBirr", image: "/images/telebirr.png" },
    {
      id: "cbe",
      name: "Commercial Bank of Ethiopia",
      image: "/images/cbe.png",
    },
    { id: "cash", name: "Cash on Arrival", image: "/images/cash.png" },
  ],
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  cancellationPolicy:
    "Free cancellation up to 5 days before check-in. After that, the first night is non-refundable.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [copied, setCopied] = useState(false);

  // In a real app, you would fetch the booking details from your API
  const booking = mockBookingDetails;

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent to the host");
    setMessage("");
    setIsSending(false);
  };

  const copyHostContact = async () => {
    await navigator.clipboard.writeText(booking.host.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Phone number copied to clipboard");
  };

  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      case "PARTIALLY_PAID":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{booking.property.title}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="mr-1 h-4 w-4" />
              <span>
                {booking.property.address}, {booking.property.city}
              </span>
            </div>
          </div>
          <Badge
            className={`${getStatusColor(
              booking.bookingStatus
            )} px-3 py-1 text-sm`}
          >
            {booking.bookingStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={booking.property.imageUrl}
                alt={booking.property.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="px-6 pt-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="contact">Contact Host</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Booking Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Check-in</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.startDate)} (
                            {booking.checkInTime})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Check-out</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.endDate)} (
                            {booking.checkOutTime})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(
                              (booking.endDate.getTime() -
                                booking.startDate.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Guests</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "person" : "people"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Property Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {booking.property.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-100"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-medium mt-4 mb-2">
                      Cancellation Policy
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.cancellationPolicy}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="p-6 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Payment Status</h3>
                    <Badge
                      className={getPaymentStatusColor(booking.paymentStatus)}
                    >
                      {booking.paymentStatus === "PAID"
                        ? "Paid"
                        : booking.paymentStatus === "PARTIALLY_PAID"
                        ? "Partially Paid"
                        : "Unpaid"}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Amount
                        </span>
                        <span className="font-medium">
                          ETB {booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Paid Amount
                        </span>
                        <span className="font-medium">
                          ETB {booking.paidAmount.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Remaining Balance</span>
                        <span className="font-medium">
                          ETB{" "}
                          {(
                            booking.totalPrice - booking.paidAmount
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.paymentStatus !== "PAID" && (
                    <>
                      <h3 className="font-medium mt-6">Payment Methods</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {booking.paymentMethods.map((method) => (
                          <Card key={method.id} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">
                                {method.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <Button
                                variant="default"
                                className="w-full"
                                onClick={() => {
                                  toast.success(
                                    `Payment method ${method.name} selected`
                                  );
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay Now
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="contact" className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Contact Host</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{booking.host.phone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyHostContact}
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{booking.host.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Response rate: {booking.host.responseRate}%</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Response time: {booking.host.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Send Message</h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <Button
                        className="w-full"
                        onClick={handleMessageSend}
                        disabled={!message.trim() || isSending}
                      >
                        {isSending ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Host Information</CardTitle>
              <CardDescription>
                Contact your host for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {booking.host.imageUrl ? (
                    <img
                      src={booking.host.imageUrl}
                      alt={booking.host.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium">
                      {booking.host.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{booking.host.name}</p>
                  <p className="text-sm text-muted-foreground">Host</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mb-2"
                onClick={() => setActiveTab("contact")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Host
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `tel:${booking.host.phone}`;
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Host
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="#">
                  <X className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="#">
                  <Calendar className="mr-2 h-4 w-4" />
                  Modify Dates
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/support">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
