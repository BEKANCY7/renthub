"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function NewListingPage() {
    const router = useRouter();
    const [price, setPrice] = useState(100);
    const [loading, setLoading] = useState(false);

    const handlePriceChange = (value) => {
        setPrice(value[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // In a real application, you would submit this form to your API
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard/listings");
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Add New Listing</h1>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                        <CardDescription>
                            Provide information about your property
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a descriptive title"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your property in detail"
                                    required
                                    rows={5}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select required>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
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
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue="ACTIVE">
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Pricing and Images */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="price">Price per night: ${price}</Label>
                                <Slider
                                    id="price"
                                    defaultValue={[100]}
                                    max={1000}
                                    min={10}
                                    step={5}
                                    onValueChange={handlePriceChange}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="images">Images</Label>
                                <Input
                                    id="images"
                                    type="file"
                                    multiple
                                    className="mt-1"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Upload up to 5 images of your property
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="Enter street address"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Enter city"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        placeholder="Enter state or province"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        placeholder="Enter country"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <Label htmlFor="features">Features</Label>
                            <Textarea
                                id="features"
                                placeholder="List amenities and features (e.g., WiFi, AC, Pool)"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separate features with commas
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/dashboard/listings">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Listing"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 