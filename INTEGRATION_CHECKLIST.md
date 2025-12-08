# Backend Integration Checklist

Use this checklist to track your progress connecting the frontend to your backend API.

## ✅ Setup

- [ ] Backend API is running and accessible
- [ ] Created `.env.local` file with `NEXT_PUBLIC_API_BASE_URL`
- [ ] Installed dependencies with `npm install --legacy-peer-deps`
- [ ] Frontend dev server runs without errors (`npm run dev`)

## 🔐 Authentication

- [x] `/auth/login` - Login endpoint integrated (POST http://localhost:3001/auth/login)
- [ ] `/register` - Registration endpoint working
- [ ] `/forgot-password` - Password reset endpoint working
- [x] Token storage and retrieval working
- [ ] Protected routes redirect to login when not authenticated
- [x] `/auth/logout` - Logout endpoint integrated (POST http://localhost:3001/auth/logout)

## 🏠 Listings

- [ ] `GET /listings` - Fetch all listings
- [ ] `GET /listings/:id` - Fetch single listing
- [ ] `POST /listings` - Create new listing
- [ ] `PUT /listings/:id` - Update listing
- [ ] `DELETE /listings/:id` - Delete listing
- [ ] Image upload working
- [ ] Search and filters working
- [ ] Map view displaying correct locations

## 📅 Bookings

- [ ] `GET /bookings` - Fetch user's bookings
- [ ] `GET /bookings/:id` - Fetch single booking
- [ ] `POST /bookings` - Create new booking
- [ ] `PUT /bookings/:id` - Update booking status
- [ ] `DELETE /bookings/:id` - Cancel booking
- [ ] Booking requests for property owners
- [ ] Date availability checking

## 💳 Payments

- [ ] `GET /payments` - Fetch payment history
- [ ] `POST /payments` - Process payment
- [ ] `PUT /payments/:id` - Update payment status
- [ ] Payment method selection working
- [ ] Payment verification for admins
- [ ] Receipt generation

## 👤 User Profile

- [ ] `GET /users/me` - Fetch current user
- [ ] `PUT /users/me` - Update profile
- [ ] `PUT /users/me/password` - Change password
- [ ] Profile image upload
- [ ] Phone verification
- [ ] Email verification

## 💬 Messaging

- [ ] `GET /conversations` - Fetch conversations
- [ ] `GET /conversations/:id/messages` - Fetch messages
- [ ] `POST /conversations/:id/messages` - Send message
- [ ] Real-time message updates (WebSocket/polling)
- [ ] Message filtering working
- [ ] Unread message count

## 📊 Analytics (Owner/Admin)

- [ ] `GET /analytics/overview` - Dashboard stats
- [ ] `GET /analytics/bookings` - Booking analytics
- [ ] `GET /analytics/earnings` - Revenue analytics
- [ ] `GET /analytics/listings` - Listing performance
- [ ] Charts displaying correctly
- [ ] Date range filters working

## 👑 Admin Features

- [ ] `GET /admin/users` - User management
- [ ] `PUT /admin/users/:id` - Update user (suspend, verify, etc.)
- [ ] `GET /admin/listings` - All listings management
- [ ] `PUT /admin/listings/:id` - Approve/flag listings
- [ ] `GET /admin/payments` - Payment management
- [ ] `PUT /admin/payments/:id` - Verify/flag payments
- [ ] `GET /admin/notifications` - System notifications
- [ ] `GET /admin/reports` - Generate reports

## 🔔 Notifications

- [ ] `GET /notifications` - Fetch notifications
- [ ] `PUT /notifications/:id/read` - Mark as read
- [ ] `PUT /notifications/read-all` - Mark all as read
- [ ] Real-time notification updates
- [ ] Notification badges showing count

## 🗺️ Maps & Location

- [ ] Google Maps API key configured
- [ ] Listings showing on map
- [ ] Location search/autocomplete working
- [ ] Geocoding addresses to coordinates
- [ ] Map markers clickable with property info

## 🎨 UI/UX

- [ ] Loading states for all async operations
- [ ] Error messages displaying correctly
- [ ] Success messages/toasts working
- [ ] Form validation working
- [ ] Responsive design on mobile
- [ ] Dark mode working (if applicable)
- [ ] Images loading correctly
- [ ] Navigation working smoothly

## 🧪 Testing

- [ ] Login/logout flow tested
- [ ] Create listing flow tested
- [ ] Booking flow tested
- [ ] Payment flow tested
- [ ] Admin operations tested
- [ ] Error handling tested
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing done

## 🚀 Deployment

- [ ] Environment variables set in production
- [ ] Backend API accessible from production frontend
- [ ] CORS configured correctly
- [ ] SSL/HTTPS working
- [ ] Build succeeds without errors
- [ ] Production deployment tested

## 📝 Documentation

- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] User guide created (if needed)
- [ ] Admin guide created (if needed)

## 🐛 Known Issues

List any known issues or limitations:

1.
2.
3.

## 📌 Notes

Add any additional notes or reminders:

-
-
- ***

  **Progress**: \_\_\_/100 items completed

  **Last Updated**: **\*\***\_**\*\***

  **Updated By**: **\*\***\_**\*\***
