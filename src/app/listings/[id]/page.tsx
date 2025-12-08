// TODO: Connect to your external backend API
// import { authenticatedFetch } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Home,
  Calendar,
  Users,
  BedDouble,
  Bath,
  Clock,
  ArrowLeft,
} from "lucide-react";
import ListingsMap from "@/components/map/ListingsMap";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Fetch from your backend API
  // const response = await authenticatedFetch(`/listings/${params.id}`);
  // const listing = await response.json();

  // Mock data for UI demonstration
  const listing = {
    id: params.id,
    title: "Modern Downtown Apartment",
    description:
      "Beautiful 2-bedroom apartment in the heart of the city with stunning views",
    category: "APARTMENT",
    price: 1500,
    imageUrls: "/images/property-placeholder.jpg",
    address: "123 Main St",
    city: "Addis Ababa",
    state: "",
    country: "Ethiopia",
    features: "wifi,ac,parking,kitchen,tv",
    status: "ACTIVE",
    createdAt: new Date(),
    owner: {
      name: "Property Owner",
      image: null,
      id: "1",
    },
  };

  if (!listing) {
    notFound();
  }

  // Parse features/amenities
  const amenities = listing.features ? listing.features.split(",") : [];

  // Generate random coordinates near Ethiopia's center for demo
  // In a real app, you would have actual coordinates stored
  const randomLat = 9.145 + (Math.random() - 0.5) * 2;
  const randomLng = 40.4897 + (Math.random() - 0.5) * 2;

  // Format date
  const listedDate = new Date(listing.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Define amenity icons (simple version)
  const amenityIcons = {
    wifi: "📶",
    ac: "❄️",
    heating: "🔥",
    parking: "🅿️",
    kitchen: "🍳",
    tv: "📺",
    washer: "🧺",
    dryer: "👕",
    pool: "🏊",
    hot_tub: "♨️",
    pets: "🐾",
    fireplace: "🔥",
    workspace: "💻",
    gym: "🏋️",
    security: "🔒",
  };

  const mapLocation = {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    lat: randomLat,
    lng: randomLng,
    imageUrl:
      listing.imageUrls?.split(",")[0] ||
      "https://source.unsplash.com/random/?property,ethiopia",
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/listings">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>
            {listing.city || "Addis Ababa"},{" "}
            {listing.state || listing.country || "Ethiopia"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={
                listing.imageUrls?.split(",")[0] ||
                "https://source.unsplash.com/random/?property,ethiopia"
              }
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">About this property</h2>
              <p className="text-gray-700 mb-6">{listing.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Home className="h-5 w-5 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600">
                    {listing.category}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600">Available Now</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <BedDouble className="h-5 w-5 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600">2 Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-5 w-5 text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600">1 Bathroom</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              {amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <span className="mr-2">
                        {amenityIcons[amenity] || "✓"}
                      </span>
                      <span className="text-sm capitalize">
                        {amenity.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No amenities listed</p>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="h-[300px] bg-gray-100 rounded-md overflow-hidden">
                <ListingsMap locations={[mapLocation]} height="300px" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {listing.address ||
                  `${listing.city || "Addis Ababa"}, ${
                    listing.state || listing.country || "Ethiopia"
                  }`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold">
                    ETB {listing.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <Badge>{listing.status}</Badge>
              </div>

              <div className="border-t border-b py-4 my-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Listed on {listedDate}</span>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Listed by {listing.owner.name}</span>
                </div>
              </div>

              <Button className="w-full mb-3">Book Now</Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/listings/${listing.id}/contact`}>
                  Contact Owner
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
