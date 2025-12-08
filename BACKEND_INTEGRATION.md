# Backend Integration Guide

This frontend application has been cleaned to remove all backend logic and database integrations. All backend functionality should now be handled by your external backend service.

## What Was Removed

- ✅ Prisma database client and schema
- ✅ Local SQLite database files
- ✅ Database migration files
- ✅ Email service integration
- ✅ Backend scripts (create-admin, verify-admin)
- ✅ Prisma dependencies from package.json
- ✅ Environment files (.env, .env.example)

## What Remains

- ✅ UI components and pages
- ✅ Frontend routing (Next.js App Router)
- ✅ Styling (Tailwind CSS)
- ✅ Client-side state management
- ✅ API utility functions (src/lib/api.ts)

## How to Connect to Your Backend

### 1. Configure API Base URL

Set your backend API URL in environment variables:

```bash
# Create a .env.local file
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
```

### 2. Update API Calls

The `src/lib/api.ts` file provides helper functions for API calls:

```typescript
import { authenticatedFetch, getUser, storeAuthTokens } from "@/lib/api";

// Example: Fetch listings
const response = await authenticatedFetch("/listings");
const listings = await response.json();

// Example: Create a booking
const response = await authenticatedFetch("/bookings", {
  method: "POST",
  body: JSON.stringify({ listingId, startDate, endDate }),
});
```

### 3. Files That Need Backend Integration

The following files currently use mock data and need to be connected to your backend:

#### Authentication

- `src/app/login/page.tsx` - Already uses `loginToExternalAPI()`
- `src/app/register/page.tsx` - Needs registration endpoint
- `src/app/forgot-password/page.tsx` - Needs password reset endpoint

#### Listings

- `src/app/listings/page.tsx` - Fetch all listings
- `src/app/listings/[id]/page.tsx` - Fetch single listing details
- `src/app/dashboard/listings/page.tsx` - Fetch user's listings

#### Bookings

- `src/app/dashboard/bookings/page.tsx` - Fetch user's bookings
- `src/app/bookings/page.tsx` - Create/manage bookings

#### User Profile

- `src/app/dashboard/profile/page.tsx` - Fetch/update user profile
- `src/app/profile/page.tsx` - Public profile view

#### Analytics

- `src/app/dashboard/analytics/page.tsx` - Fetch analytics data
- `src/app/admin/analytics/page.tsx` - Admin analytics

#### Admin

- `src/app/admin/notifications/page.tsx` - Fetch notifications
- `src/app/admin/users/page.tsx` - User management
- `src/app/admin/listings/page.tsx` - Listing management
- `src/app/admin/payments/page.tsx` - Payment management

### 4. API Endpoints You'll Need

Your backend should provide these endpoints:

```
Authentication:
POST   /users/login/
POST   /users/register/
POST   /users/forgot-password/
POST   /users/reset-password/
GET    /users/me/

Listings:
GET    /listings/
GET    /listings/:id/
POST   /listings/
PUT    /listings/:id/
DELETE /listings/:id/

Bookings:
GET    /bookings/
GET    /bookings/:id/
POST   /bookings/
PUT    /bookings/:id/
DELETE /bookings/:id/

Payments:
GET    /payments/
POST   /payments/
PUT    /payments/:id/

Admin:
GET    /admin/users/
GET    /admin/analytics/
GET    /admin/notifications/
```

### 5. Authentication Flow

The app uses JWT tokens stored in localStorage:

1. User logs in via `loginToExternalAPI()`
2. Backend returns `{ access, refresh, user }`
3. Tokens are stored using `storeAuthTokens()`
4. Subsequent requests use `authenticatedFetch()` which adds the Bearer token

### 6. Running the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Next Steps

1. Set up your backend API URL in `.env.local`
2. Replace mock data in pages with actual API calls
3. Test authentication flow
4. Implement error handling for API failures
5. Add loading states for async operations

## Need Help?

Look for `// TODO: Connect to your external backend API` comments throughout the codebase to find places that need backend integration.
