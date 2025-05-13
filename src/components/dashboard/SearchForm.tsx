"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchForm() {
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would search for listings
        console.log({ location, category, checkIn, checkOut });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="Where are you going?"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
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
                <div className="space-y-2">
                    <Label htmlFor="check-in">Check in</Label>
                    <Input
                        id="check-in"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="check-out">Check out</Label>
                    <Input
                        id="check-out"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                </div>
            </div>
            <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" /> Search
            </Button>
        </form>
    );
} 