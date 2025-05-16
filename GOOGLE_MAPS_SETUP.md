# Google Maps API Setup for RentHub

This guide explains how to set up the Google Maps API for the RentHub project to enable the map features properly centered on Ethiopia.

## Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for and enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy your newly created API key
8. (Optional but recommended) Restrict the API key to specific APIs and HTTP referrers for security

## Adding the API Key to RentHub

1. In the root of your project, create a `.env.local` file if it doesn't exist already
2. Add the following line to the file:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. Replace `your_api_key_here` with the API key you obtained from Google Cloud Console
4. Save the file
5. Restart your development server if it's running

## Testing the Map Integration

1. Visit the `/test-maps` page in your application
2. Verify that the Google Maps is loading correctly
3. Check that the map is centered on Ethiopia (around latitude 9.145, longitude 40.4897)
4. Confirm that markers appear in major Ethiopian cities

## Troubleshooting

If the map doesn't display correctly:

1. Check the browser console for errors
2. Verify that your API key is correctly set in the `.env.local` file
3. Make sure you've enabled all the required APIs in Google Cloud Console
4. Check that the API key doesn't have overly restrictive referrer limitations

## Default Map Configuration

The map is configured with the following defaults:

- Default center: Ethiopia (lat: 9.145, lng: 40.4897)
- Default zoom level: 7
- Major cities included: Addis Ababa, Dire Dawa, Mekelle, Gondar, Adama, Hawassa, Bahir Dar 