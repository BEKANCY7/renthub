import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminListingsPage() {
  // In a real app, you would fetch listings from the database
  const listings = [
    {
      id: "1",
      title: "Luxury Apartment in Downtown",
      category: "APARTMENT",
      price: 1200,
      status: "ACTIVE",
      owner: "John Doe",
      location: "New York, NY",
      createdAt: "2023-11-15",
    },
    {
      id: "2",
      title: "Cozy Cabin by the Lake",
      category: "CABIN",
      price: 850,
      status: "ACTIVE",
      owner: "Jane Smith",
      location: "Lake Tahoe, CA",
      createdAt: "2023-11-20",
    },
    {
      id: "3",
      title: "Modern Loft in the City",
      category: "APARTMENT",
      price: 1500,
      status: "ACTIVE",
      owner: "Michael Johnson",
      location: "Chicago, IL",
      createdAt: "2023-11-25",
    },
    {
      id: "4",
      title: "Beach House with Ocean View",
      category: "HOUSE",
      price: 2200,
      status: "INACTIVE",
      owner: "Sarah Williams",
      location: "Miami, FL",
      createdAt: "2023-11-28",
    },
    {
      id: "5",
      title: "Mountain Villa with Hot Tub",
      category: "VILLA",
      price: 1800,
      status: "ACTIVE",
      owner: "Robert Brown",
      location: "Aspen, CO",
      createdAt: "2023-12-01",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Manage property listings on the platform
          </p>
        </div>
        <Button>Add New Listing</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Listings</CardTitle>
          <CardDescription>
            Find listings by title, location, or owner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search listings..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Listings</CardTitle>
          <CardDescription>
            Showing {listings.length} total listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Category</th>
                  <th className="py-3 text-left font-medium">Price</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Owner</th>
                  <th className="py-3 text-left font-medium">Location</th>
                  <th className="py-3 text-left font-medium">Created</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b">
                    <td className="py-3 font-medium">{listing.title}</td>
                    <td className="py-3">{listing.category}</td>
                    <td className="py-3">${listing.price}/month</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          listing.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="py-3">{listing.owner}</td>
                    <td className="py-3">{listing.location}</td>
                    <td className="py-3">{listing.createdAt}</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to <strong>5</strong> of <strong>5</strong>{" "}
          listings
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
