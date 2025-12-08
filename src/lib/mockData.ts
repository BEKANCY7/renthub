// Mock data for UI development - Replace with actual API calls to your backend

export const mockListings = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "Beautiful 2-bedroom apartment in the heart of the city",
    category: "APARTMENT",
    price: 1500,
    imageUrls: "/images/property-placeholder.jpg",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    features: "WiFi, Parking, Gym",
    status: "ACTIVE",
    featured: true,
    ownerId: "1",
  },
];

export const mockBookings = [];
export const mockPayments = [];
export const mockNotifications = [];
export const mockUsers = [];

// Helper to simulate async data fetching
export async function getMockData<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100);
  });
}
