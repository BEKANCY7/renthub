"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, UploadCloud, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LocationSearch } from "@/components/property/LocationSearch";
import type { LocationDetails, ImageFile, CalendarProps } from "@/types";
import Image from "next/image";
import { createListing, uploadImages } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { validateImageFiles, filterValidUrls } from "@/lib/imageUtils";

const amenities = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heating", label: "Heating" },
  { id: "parking", label: "Parking" },
  { id: "kitchen", label: "Kitchen" },
  { id: "tv", label: "TV" },
  { id: "washer", label: "Washer" },
  { id: "dryer", label: "Dryer" },
  { id: "pool", label: "Pool" },
  { id: "hot_tub", label: "Hot Tub" },
  { id: "pets", label: "Pet Friendly" },
  { id: "fireplace", label: "Fireplace" },
  { id: "workspace", label: "Workspace" },
  { id: "gym", label: "Gym" },
  { id: "security", label: "Security System" },
];

const listingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string(),
  price: z.number().min(1, "Price must be greater than 0"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().min(0).optional(),
  location: z.string().min(1, "Location is required"),
  amenities: z.array(z.string()),
  leaseTerms: z.object({
    minLeaseDuration: z.number().min(1, "Minimum lease duration required"),
    maxOccupants: z.number().min(1, "Maximum occupants required"),
    petsAllowed: z.boolean(),
    securityDeposit: z.number().min(0),
    availableFrom: z.date(),
  }),
  preferredTenants: z.object({
    noSmoking: z.boolean().optional(),
    noPets: z.boolean().optional(),
    background: z.boolean().optional(),
    credit: z.boolean().optional(),
    income: z.boolean().optional(),
  }),
  status: z.string(),
});

const Textarea = ({ ...props }) => {
  return (
    <textarea
      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
};

const Calendar = ({
  selected,
  onSelect,
}: Omit<CalendarProps, "mode" | "initialFocus">) => {
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const isSelected = selected && day === selected.getDate();
            return (
              <button
                key={i}
                type="button"
                className={`h-9 w-9 rounded-md text-center text-sm ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => {
                  if (onSelect) {
                    const newDate = new Date(selected || new Date());
                    newDate.setDate(day);
                    onSelect(newDate);
                  }
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function NewListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "HOUSE",
      price: 1000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 0,
      location: "",
      amenities: [],
      leaseTerms: {
        minLeaseDuration: 12,
        maxOccupants: 2,
        petsAllowed: false,
        securityDeposit: 0,
        availableFrom: new Date(),
      },
      preferredTenants: {
        noSmoking: false,
        noPets: false,
        background: true,
        credit: true,
        income: true,
      },
      status: "ACTIVE",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    // Validate files before upload
    const validation = validateImageFiles(files);
    if (!validation.valid) {
      toast({
        title: "Invalid Files",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Check if adding these files would exceed the limit
    if (images.length + files.length > 10) {
      toast({
        title: "Too Many Images",
        description: `You can only upload ${10 - images.length} more image(s).`,
        variant: "destructive",
      });
      return;
    }

    setUploadingImages(true);

    try {
      // Upload files and get real URLs
      const uploadedUrls = await uploadImages(files);

      // Create image objects with real URLs
      const newImages = files.map((file, index) => ({
        name: file.name,
        size: file.size,
        url: uploadedUrls[index] || URL.createObjectURL(file), // Fallback to blob URL if upload failed
        file,
        uploaded: !!uploadedUrls[index], // Track if successfully uploaded
      }));

      setImages((prev) => [...prev, ...newImages].slice(0, 10));

      toast({
        title: "Success!",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);

      // Still add images with blob URLs as fallback
      const newImages = files.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        file,
        uploaded: false,
      }));
      setImages((prev) => [...prev, ...newImages].slice(0, 10));

      toast({
        title: "Upload Warning",
        description:
          error?.message || "Failed to upload images. Using temporary URLs.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (details: LocationDetails) => {
    form.setValue("location", details.address);
    setLocationDetails(details);
  };

  const onSubmit = async (data: z.infer<typeof listingSchema>) => {
    setLoading(true);

    try {
      // Check if there are any images that haven't been uploaded yet
      const unuploadedImages = images.filter(
        (img) => !img.uploaded && !img.url.startsWith("http")
      );

      let finalImageUrls: string[] = [];

      if (unuploadedImages.length > 0) {
        // Upload remaining images
        try {
          const uploadedUrls = await uploadImages(
            unuploadedImages.map((img) => img.file)
          );

          // Combine uploaded URLs with already uploaded ones
          finalImageUrls = images.map((img, index) => {
            if (img.uploaded || img.url.startsWith("http")) {
              return img.url;
            } else {
              const unuploadedIndex = unuploadedImages.findIndex(
                (unImg) => unImg === img
              );
              return uploadedUrls[unuploadedIndex] || img.url;
            }
          });
        } catch (uploadError) {
          console.error("Error uploading remaining images:", uploadError);
          toast({
            title: "Warning",
            description:
              "Some images couldn't be uploaded. Proceeding with available images.",
            variant: "destructive",
          });
          // Use only successfully uploaded images
          finalImageUrls = images
            .filter((img) => img.uploaded || img.url.startsWith("http"))
            .map((img) => img.url);
        }
      } else {
        // All images are already uploaded - filter to only include real URLs
        finalImageUrls = images
          .filter((img) => img.uploaded && img.url.startsWith("http"))
          .map((img) => img.url);
      }

      // Filter out any blob URLs that might have slipped through
      const originalCount = finalImageUrls.length;
      finalImageUrls = filterValidUrls(finalImageUrls);

      if (finalImageUrls.length < originalCount) {
        console.warn(
          `Filtered out ${
            originalCount - finalImageUrls.length
          } invalid URLs (likely blob URLs)`
        );
        toast({
          title: "Warning",
          description:
            "Some images were not uploaded properly and were excluded.",
          variant: "destructive",
        });
      }

      console.log("Final image URLs being sent:", finalImageUrls);

      // Fallback to placeholder if no valid images
      if (finalImageUrls.length === 0) {
        finalImageUrls = ["https://source.unsplash.com/random/?apartment"];
        console.log(
          "No valid images found, using placeholder:",
          finalImageUrls
        );
      }

      const listingData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        imageUrls: finalImageUrls,
        address: data.location,
        city: locationDetails?.city ?? "Addis Ababa",
        state: locationDetails?.state ?? "Addis Ababa",
        country: locationDetails?.country ?? "Ethiopia",
        features: data.amenities,
        status: data.status,
        leaseTerms: {
          minLeaseDuration: data.leaseTerms.minLeaseDuration,
          maxOccupants: data.leaseTerms.maxOccupants,
          petsAllowed: data.leaseTerms.petsAllowed,
          securityDeposit: data.leaseTerms.securityDeposit,
          availableFrom: data.leaseTerms.availableFrom.toISOString(),
        },
        preferredTenants: {
          noSmoking: data.preferredTenants.noSmoking ?? false,
          noPets: data.preferredTenants.noPets ?? false,
          backgroundCheck: data.preferredTenants.background ?? false,
          creditCheck: data.preferredTenants.credit ?? false,
          incomeVerification: data.preferredTenants.income ?? false,
        },
      };

      console.log("Sending listing data:", listingData);
      const result = await createListing(listingData);
      console.log("Listing created successfully:", result);

      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      });

      router.push("/dashboard/listings");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating listing:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        details: error?.details,
      });
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.details?.message ||
          "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Listing</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>
                Provide accurate information about your property to attract
                quality tenants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a descriptive title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property in detail"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="HOUSE">House</SelectItem>
                            <SelectItem value="APARTMENT">Apartment</SelectItem>
                            <SelectItem value="CABIN">Cabin</SelectItem>
                            <SelectItem value="VILLA">Villa</SelectItem>
                            <SelectItem value="CONDO">Condo</SelectItem>
                            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">
                              Active (Live)
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              Inactive (Hidden)
                            </SelectItem>
                            <SelectItem value="PENDING">
                              Pending (Draft)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Property Specs */}
              <div className="space-y-4">
                <h3 className="font-medium">Property Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Feet</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing and Images */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per day (ETB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the daily rate in Ethiopian Birr (ETB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label htmlFor="images">Upload Property Images</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                    />
                    <label
                      htmlFor="images"
                      className={`flex flex-col items-center ${
                        uploadingImages
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <UploadCloud className="h-10 w-10 text-gray-400" />
                      <span className="mt-2 text-sm font-medium text-gray-700">
                        {uploadingImages
                          ? "Uploading..."
                          : "Drag and drop or click to upload"}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        Upload up to 10 images (max 5MB each)
                      </span>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative rounded-md overflow-hidden h-24 border"
                        >
                          <Image
                            src={image.url}
                            alt={`Property image ${index + 1}`}
                            className="h-full w-full object-cover"
                            width={200}
                            height={96}
                          />
                          {/* Upload status indicator */}
                          {image.uploaded === false && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs">
                                Not uploaded
                              </span>
                            </div>
                          )}
                          {image.uploaded === true && (
                            <div className="absolute top-1 left-1 bg-green-500 rounded-full p-1">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Location</FormLabel>
                      <FormControl>
                        <LocationSearch
                          value={field.value}
                          onChange={field.onChange}
                          onSelectLocation={handleLocationSelect}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the full property address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {amenities.map((amenity) => (
                          <FormField
                            key={amenity.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                              <FormItem
                                key={amenity.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedAmenities = checked
                                        ? [...field.value, amenity.id]
                                        : field.value.filter(
                                            (value) => value !== amenity.id
                                          );
                                      field.onChange(updatedAmenities);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lease Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Terms & Preferences</CardTitle>
              <CardDescription>
                Set your rental terms and tenant preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaseTerms.minLeaseDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Lease Duration (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaseTerms.maxOccupants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Occupants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaseTerms.securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit (ETB)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leaseTerms.availableFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Available From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="leaseTerms.petsAllowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pets Allowed</FormLabel>
                      <FormDescription>
                        Check if you allow tenants to have pets
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="font-medium">Tenant Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferredTenants.noSmoking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>No Smoking</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTenants.noPets"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>No Pets</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTenants.background"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Background Check Required</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTenants.credit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Credit Check Required</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTenants.income"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Income Verification Required</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard/listings">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading || uploadingImages}>
                {loading
                  ? "Creating..."
                  : uploadingImages
                  ? "Uploading Images..."
                  : "Create Listing"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
