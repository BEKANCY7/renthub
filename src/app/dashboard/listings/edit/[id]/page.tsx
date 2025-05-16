"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    features: z.string().optional(),
    status: z.string(),
});

export default function EditListingPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const [formattedAmenities, setFormattedAmenities] = useState<string[]>([]);

    const form = useForm<z.infer<typeof listingSchema>>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "HOUSE",
            price: 1000,
            address: "",
            city: "",
            state: "",
            country: "Ethiopia",
            features: "",
            status: "ACTIVE",
        },
    });

    // Fetch listing data
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`/api/listings/${params.id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch listing");
                }

                const listing = await response.json();

                // Set form values
                form.reset({
                    title: listing.title,
                    description: listing.description,
                    category: listing.category,
                    price: listing.price,
                    address: listing.address || "",
                    city: listing.city || "",
                    state: listing.state || "",
                    country: listing.country || "Ethiopia",
                    features: listing.features || "",
                    status: listing.status
                });

                // Parse amenities/features
                if (listing.features) {
                    setFormattedAmenities(listing.features.split(','));
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
                setError("Failed to load listing. Please try again.");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchListing();
    }, [params.id, form]);

    const onSubmit = async (data: z.infer<typeof listingSchema>) => {
        setLoading(true);
        setError("");

        try {
            // Update features from amenities selection
            const updatedData = {
                ...data,
                features: formattedAmenities.join(',')
            };

            const response = await fetch(`/api/listings/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update listing");
            }

            router.push("/dashboard/listings");
            router.refresh();
        } catch (error) {
            console.error("Error updating listing:", error);
            setError(error.message || "Failed to update listing. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p>Loading listing details...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/listings">Cancel</Link>
                </Button>
            </div>

            {error && (
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-4">
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Listing Details</CardTitle>
                    <CardDescription>
                        Update your rental property listing information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                A catchy title for your listing
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Current listing status
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your property"
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Detailed description of your property
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="HOUSE">House</SelectItem>
                                                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                                                    <SelectItem value="CABIN">Cabin</SelectItem>
                                                    <SelectItem value="VILLA">Villa</SelectItem>
                                                    <SelectItem value="CAR">Car</SelectItem>
                                                    <SelectItem value="BOAT">Boat</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Property type
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Daily rental price in Ethiopian Birr
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region/State</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                    {amenities.map((amenity) => (
                                        <div key={amenity.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={amenity.id}
                                                checked={formattedAmenities.includes(amenity.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setFormattedAmenities(prev => [...prev, amenity.id]);
                                                    } else {
                                                        setFormattedAmenities(prev =>
                                                            prev.filter(a => a !== amenity.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={amenity.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {amenity.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Listing"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 