# RentHub Frontend

A modern property rental platform built with Next.js 15, React 19, and Tailwind CSS. This is a **frontend-only** application designed to connect to an external backend API.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A running backend API (see Backend Integration section)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.local.example .env.local

# Update .env.local with your backend API URL
# NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Project Structure

```
renthub/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── dashboard/    # User dashboard pages
│   │   ├── listings/     # Property listings pages
│   │   ├── login/        # Authentication pages
│   │   └── ...
│   ├── components/       # Reusable React components
│   │   ├── ui/          # UI components (buttons, cards, etc.)
│   │   ├── map/         # Map components
│   │   └── ...
│   ├── lib/             # Utility functions
│   │   ├── api.ts       # API integration helpers
│   │   ├── mockData.ts  # Mock data for development
│   │   └── utils.ts     # General utilities
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── ...
```

## 🔌 Backend Integration

This frontend application requires a backend API to function fully. Currently, pages use mock data for UI development.

### Setting Up Backend Connection

1. **Configure API URL**

   ```bash
   # .env.local
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
   ```

2. **API Helper Functions**
   The `src/lib/api.ts` file provides utilities for backend communication:

   ```typescript
   import { authenticatedFetch, getUser } from "@/lib/api";

   // Make authenticated API calls
   const response = await authenticatedFetch("/listings");
   const data = await response.json();
   ```

3. **Find Integration Points**
   Search for `// TODO: Connect to your external backend API` comments in the codebase to find pages that need backend integration.

4. **Read the Integration Guide**
   See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed instructions.

## 🎨 Features

### Current Features (UI)

- ✅ Responsive design with Tailwind CSS
- ✅ Property listings with grid and map views
- ✅ User dashboard
- ✅ Admin panel
- ✅ Booking management interface
- ✅ Payment tracking interface
- ✅ User profile management
- ✅ Dark mode support
- ✅ Interactive maps (Google Maps)
- ✅ Modern UI components (Radix UI)

### Requires Backend Connection

- 🔄 User authentication & registration
- 🔄 Property CRUD operations
- 🔄 Booking creation & management
- 🔄 Payment processing
- 🔄 Real-time messaging
- 🔄 Analytics & reporting
- 🔄 Admin operations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.0
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Maps**: Google Maps API
- **Charts**: Chart.js, Recharts
- **Forms**: React Hook Form + Zod
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔐 Authentication

The app uses JWT token-based authentication:

1. User logs in via `/login`
2. Backend returns access/refresh tokens
3. Tokens stored in localStorage
4. Subsequent requests include Bearer token
5. Middleware protects authenticated routes

## 🗺️ Key Routes

### Public Routes

- `/` - Homepage
- `/login` - User login
- `/register` - User registration
- `/listings` - Browse properties
- `/listings/[id]` - Property details
- `/search` - Search properties

### Protected Routes (User)

- `/dashboard` - User dashboard
- `/dashboard/profile` - User profile
- `/dashboard/bookings` - User bookings
- `/dashboard/listings` - User's listings (owners)
- `/dashboard/payments` - Payment history
- `/messages` - Messaging

### Protected Routes (Admin)

- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/listings` - Listing management
- `/admin/payments` - Payment management
- `/admin/analytics` - Analytics

## 🚧 Development Notes

### Mock Data

Pages currently use mock data from `src/lib/mockData.ts`. Replace with actual API calls when backend is ready.

### Peer Dependencies

Use `--legacy-peer-deps` flag when installing packages due to React 19 compatibility:

```bash
npm install --legacy-peer-deps
```

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## 📚 Documentation

- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Backend integration guide
- [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) - Summary of backend removal changes

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clean .next folder
rm -rf .next
npm run build
```

### Dependency Issues

```bash
# Reinstall with legacy peer deps
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### API Connection Issues

1. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
2. Verify backend is running
3. Check browser console for CORS errors
4. Verify API endpoints match backend routes

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Note**: This is a frontend-only application. All backend functionality must be provided by an external API service.
