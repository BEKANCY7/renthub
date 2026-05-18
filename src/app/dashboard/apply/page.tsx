"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Upload,
  FileText,
  DollarSign,
  UserRound,
  Briefcase,
  Check,
  Clock,
  Home,
  Loader2,
} from "lucide-react";

const applicationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
    ssn: z
      .string()
      .regex(/^\d{3}-\d{2}-\d{4}$/, "Must be in XXX-XX-XXXX format"),
    currentAddress: z.string().min(1, "Current address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(5, "Valid ZIP code is required"),
    moveInDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  }),
  employment: z.object({
    employmentStatus: z.enum([
      "employed",
      "self-employed",
      "unemployed",
      "retired",
      "student",
    ]),
    employer: z.string().optional(),
    position: z.string().optional(),
    monthlyIncome: z.string().optional(),
    employmentLength: z.string().optional(),
    supervisorName: z.string().optional(),
    supervisorPhone: z.string().optional(),
  }),
  rentalHistory: z.object({
    currentLandlord: z.string().optional(),
    landlordPhone: z.string().optional(),
    reasonForLeaving: z.string().optional(),
    currentRent: z.string().optional(),
    lengthOfStay: z.string().optional(),
    evictionHistory: z.boolean().optional(),
    rentalAssistance: z.boolean().optional(),
  }),
  references: z
    .array(
      z.object({
        name: z.string().min(1, "Reference name is required"),
        relationship: z.string().min(1, "Relationship is required"),
        phone: z.string().min(10, "Valid phone number is required"),
      })
    )
    .min(1, "At least one reference is required"),
  authorizations: z.object({
    creditCheck: z.boolean(),
    backgroundCheck: z.boolean(),
    incomeVerification: z.boolean(),
    landlordVerification: z.boolean(),
    termsAgreement: z.boolean(),
  }),
});

function RentalApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useState([
    { name: "", relationship: "", phone: "" },
  ]);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        ssn: "",
        currentAddress: "",
        city: "",
        state: "",
        zip: "",
        moveInDate: "",
      },
      employment: {
        employmentStatus: "employed",
        employer: "",
        position: "",
        monthlyIncome: "",
        employmentLength: "",
        supervisorName: "",
        supervisorPhone: "",
      },
      rentalHistory: {
        currentLandlord: "",
        landlordPhone: "",
        reasonForLeaving: "",
        currentRent: "",
        lengthOfStay: "",
        evictionHistory: false,
        rentalAssistance: false,
      },
      references: [{ name: "", relationship: "", phone: "" }],
      authorizations: {
        creditCheck: false,
        backgroundCheck: false,
        incomeVerification: false,
        landlordVerification: false,
        termsAgreement: false,
      },
    },
  });

  const addReference = () => {
    setReferences([...references, { name: "", relationship: "", phone: "" }]);
  };

  const removeReference = (index) => {
    if (references.length > 1) {
      const newReferences = [...references];
      newReferences.splice(index, 1);
      setReferences(newReferences);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In a real app, we would submit this to an API
      console.log("Application data:", { listingId, ...data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to success page
      router.push("/dashboard/apply/success");
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextTab = () => {
    if (activeTab === "personal") setActiveTab("employment");
    else if (activeTab === "employment") setActiveTab("rental");
    else if (activeTab === "rental") setActiveTab("references");
    else if (activeTab === "references") setActiveTab("authorization");
  };

  const goToPreviousTab = () => {
    if (activeTab === "employment") setActiveTab("personal");
    else if (activeTab === "rental") setActiveTab("employment");
    else if (activeTab === "references") setActiveTab("rental");
    else if (activeTab === "authorization") setActiveTab("references");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Rental Application</h1>
        <p className="text-muted-foreground">
          {listingId
            ? "Apply for this specific property"
            : "Complete your application to rent a property"}
        </p>
      </div>

      <div className="flex flex-col space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
            <CardDescription>
              Complete all sections of the application. We'll review your
              submission within 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <div
                  className={`rounded-full p-2 ${
                    activeTab === "personal" ||
                    activeTab === "employment" ||
                    activeTab === "rental" ||
                    activeTab === "references" ||
                    activeTab === "authorization"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <UserRound className="h-5 w-5" />
                </div>
                <Separator
                  className={`w-6 md:w-12 mx-2 ${
                    activeTab === "employment" ||
                    activeTab === "rental" ||
                    activeTab === "references" ||
                    activeTab === "authorization"
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <div
                  className={`rounded-full p-2 ${
                    activeTab === "employment" ||
                    activeTab === "rental" ||
                    activeTab === "references" ||
                    activeTab === "authorization"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <Separator
                  className={`w-6 md:w-12 mx-2 ${
                    activeTab === "rental" ||
                    activeTab === "references" ||
                    activeTab === "authorization"
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <div
                  className={`rounded-full p-2 ${
                    activeTab === "rental" ||
                    activeTab === "references" ||
                    activeTab === "authorization"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <Home className="h-5 w-5" />
                </div>
                <Separator
                  className={`w-6 md:w-12 mx-2 ${
                    activeTab === "references" || activeTab === "authorization"
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
                <div
                  className={`rounded-full p-2 ${
                    activeTab === "references" || activeTab === "authorization"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <Separator
                  className={`w-6 md:w-12 mx-2 ${
                    activeTab === "authorization" ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`rounded-full p-2 ${
                    activeTab === "authorization"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <Check className="h-5 w-5" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <Clock className="inline mr-1 h-4 w-4" />
                Takes about 10-15 minutes to complete
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="rental">Rental History</TabsTrigger>
                <TabsTrigger value="references">References</TabsTrigger>
                <TabsTrigger value="authorization">Authorization</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Provide your basic contact and personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalInfo.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalInfo.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalInfo.ssn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Security Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="XXX-XX-XXXX"
                                {...field}
                                type="password"
                              />
                            </FormControl>
                            <FormDescription>
                              Securely stored and only used for background
                              checks
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="personalInfo.currentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St, Apt 4"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="personalInfo.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalInfo.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="personalInfo.zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="personalInfo.moveInDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Move-in Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/find-home">Cancel</Link>
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next: Employment
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="employment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employment Information</CardTitle>
                    <CardDescription>
                      Details about your current employment and income
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="employment.employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employed">Employed</SelectItem>
                              <SelectItem value="self-employed">
                                Self-Employed
                              </SelectItem>
                              <SelectItem value="unemployed">
                                Unemployed
                              </SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employment.employer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Employer</FormLabel>
                            <FormControl>
                              <Input placeholder="Company Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employment.position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position/Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Your job title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employment.monthlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Income</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="5000"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employment.employmentLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length of Employment</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2 years" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employment.supervisorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supervisor Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Supervisor's name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employment.supervisorPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supervisor Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousTab}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next: Rental History
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="rental" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental History</CardTitle>
                    <CardDescription>
                      Information about your current and previous rental
                      experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rentalHistory.currentLandlord"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Current Landlord/Property Manager
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rentalHistory.landlordPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Landlord Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rentalHistory.currentRent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Monthly Rent</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="1500"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rentalHistory.lengthOfStay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Length of Stay at Current Address
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2 years" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="rentalHistory.reasonForLeaving"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Reason for Leaving Current Residence
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Reason for moving" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rentalHistory.evictionHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Previous Eviction</FormLabel>
                              <FormDescription>
                                Have you ever been evicted or asked to leave a
                                rental property?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rentalHistory.rentalAssistance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Rental Assistance</FormLabel>
                              <FormDescription>
                                Will you be using any rental assistance
                                programs?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousTab}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next: References
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="references" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>References</CardTitle>
                    <CardDescription>
                      Provide personal or professional references (non-relatives
                      preferred)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {references.map((_, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">
                            Reference #{index + 1}
                          </h4>
                          {references.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReference(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`references.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`references.${index}.relationship`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. Coworker, Friend"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`references.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="(123) 456-7890"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addReference}
                    >
                      Add Another Reference
                    </Button>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousTab}
                    >
                      Previous
                    </Button>
                    <Button type="button" onClick={goToNextTab}>
                      Next: Authorization
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="authorization" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Authorizations & Agreements</CardTitle>
                    <CardDescription>
                      Final authorization to process your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="authorizations.creditCheck"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Credit Check Authorization</FormLabel>
                              <FormDescription>
                                I authorize the landlord to perform a credit
                                check as part of my rental application.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorizations.backgroundCheck"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Background Check Authorization
                              </FormLabel>
                              <FormDescription>
                                I authorize the landlord to perform a background
                                check as part of my rental application.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorizations.incomeVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Income Verification</FormLabel>
                              <FormDescription>
                                I authorize the landlord to verify my income
                                information with employers or other sources.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="authorizations.landlordVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Landlord Reference Check</FormLabel>
                              <FormDescription>
                                I authorize the landlord to contact my current
                                and previous landlords for references.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Separator className="my-6" />

                      <FormField
                        control={form.control}
                        name="authorizations.termsAgreement"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Terms Agreement</FormLabel>
                              <FormDescription>
                                I certify that all information provided is true
                                and accurate to the best of my knowledge. I
                                understand that providing false information may
                                result in rejection of my application or
                                termination of tenancy.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        By submitting this application, you acknowledge that a
                        non-refundable application fee may be charged for
                        processing. The landlord may request additional
                        documentation to verify the information provided.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousTab}
                    >
                      Previous
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function RentalApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <RentalApplicationContent />
    </Suspense>
  );
}
