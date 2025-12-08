# Authentication Integration Summary

## ✅ Completed Integrations

### 1. Login API Integration

**Endpoint:** `POST http://localhost:3001/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**Implementation:**

- API call in `src/lib/api.ts` → `loginToExternalAPI()`
- Form component in `src/components/auth/LoginForm.tsx`
- Handles `access_token` field from API response
- Stores token in localStorage and cookie
- Redirects based on user role (ADMIN/RENTER/OWNER)

### 2. Logout API Integration

**Endpoint:** `POST http://localhost:3001/auth/logout`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Implementation:**

- API call in `src/lib/api.ts` → `logoutFromExternalAPI()`
- Logout handler in `src/lib/logout.ts`
- Integrated in all components:
  - `src/components/dashboard/Sidebar.tsx`
  - `src/components/dashboard/Header.tsx`
  - `src/components/admin/UserNav.tsx`
  - `src/components/admin/AdminSidebar.tsx`
- Clears tokens, cookies, and redirects to login

## Configuration

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_DISABLE_OVERLAY=1
```

### API Base URL

All API calls use the base URL from environment variable:

- Default: `http://localhost:3001`
- Configurable via `NEXT_PUBLIC_API_BASE_URL`

## Token Management

### Storage

- **localStorage keys:**

  - `access_token` - Main authentication token
  - `auth_token` - Backup token reference
  - `user` - User data JSON

- **Cookie:**
  - `auth_token` - Used by middleware for route protection
  - Max age: 7 days

### Retrieval

Use `getAuthToken()` from `src/lib/api.ts` to get the current token.

### Authenticated Requests

Use `authenticatedFetch()` helper for API calls that require authentication:

```typescript
import { authenticatedFetch } from "@/lib/api";

const response = await authenticatedFetch("/some-endpoint", {
  method: "GET",
});
```

## Usage Examples

### Login

```typescript
import { loginToExternalAPI, storeAuthTokens, storeUser } from "@/lib/api";

const response = await loginToExternalAPI({
  email: "user@example.com",
  password: "password123",
});

storeAuthTokens(response);
if (response.user) {
  storeUser(response.user);
}
```

### Logout

```typescript
import { logout } from "@/lib/logout";

// Simple logout
logout();

// Logout with custom redirect
logout("/custom-page");
```

### Check Authentication

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome {user?.name}</div>;
}
```

## Troubleshooting

### Clear Browser Cache

If you see errors like "signOut is not defined", clear your browser cache:

**Chrome/Edge:**

1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"

**Or hard refresh:**

- Windows: `Ctrl+Shift+R`
- Mac: `Cmd+Shift+R`

### Restart Development Server

After making changes to `.env.local` or `next.config.js`:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Check API Connection

Verify your backend is running on `http://localhost:3001`:

```bash
curl http://localhost:3001/auth/login
```

## Next Steps

- [ ] Implement registration endpoint integration
- [ ] Implement forgot password endpoint integration
- [ ] Add token refresh logic
- [ ] Implement protected route middleware
- [ ] Add error handling for expired tokens
