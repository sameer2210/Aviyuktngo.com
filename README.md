# Aviyukt NGO - Full Stack Platform

Official web platform for Aviyukt NGO with:


## Project Overview

Aviyukt NGO is a community-focused platform designed to present social initiatives and support operational workflows like onboarding, donations, and user profile access.


The platform supports:
- Google-only authentication
- Donation and membership payments via Razorpay
- Payment verification and history lookup
- Contact email capture
- NGO service showcase pages and team/credits sections


## Core Features

- Google OAuth sign-in (no email/password auth flow)
- Session handling with JWT in HTTP-only cookies
- Donation flow and membership payment flow
- Razorpay order creation and signature verification
- Receipt generation (PDF) on the frontend after successful payment
- Payment history lookup by Aadhaar number
- Contact/volunteer form email capture
- Service pages across agriculture, health, education, legal/insurance, and household support
- Responsive UI with React Router-based navigation

## Services Covered

The platform currently highlights the following service categories:

1. Agriculture
2. Medicine
3. Health
4. Placement
5. Education
6. Rental Work
7. Property (Purchase, Loan, Registry, Mutation)
8. Insurance (Legal and Court Case Work)
9. Household Services


## Repository Structure

```text
Aviyuktngo/
|- frontend/
|  |- src/
|  |  |- Components/
|  |  |- context/
|  |  |- data/
|  |  |- instant/
|  |  |- pages/
|  |  |- routes/
|  |- package.json
|  |- vite.config.js
|  |- vercel.json
|- BackEnd/
|  |- src/
|  |  |- controller/
|  |  |- db/
|  |  |- middleware/
|  |  |- models/
|  |  |- routes/
|  |  |- app.js
|  |- server.js
|  |- package.json
|- README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Razorpay test/live keys
- Google OAuth Client ID

### 1) Backend Setup

```bash
cd BackEnd
npm install
```

Create `BackEnd/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URLS=http://localhost:5173,https://your-frontend-domain.com
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

Start backend:

```bash
npm start
```

Backend default URL: `http://localhost:3000`

### 2) Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start frontend:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Environment Variables

### Backend (`BackEnd/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No | API server port (default: `3000`) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth token audience verification |
| `FRONTEND_URLS` | Recommended | Comma-separated CORS allowlist additions |
| `RAZORPAY_KEY_ID` | Yes (payments) | Razorpay key ID for order creation |
| `RAZORPAY_KEY_SECRET` | Yes (payments) | Razorpay key secret for signature verification |
| `NODE_ENV` | Recommended | Cookie behavior (`production` enables secure cookie flags) |

Default CORS frontend origins already included in code:
- `http://localhost:5173`
- `https://aviyuktngo.vercel.app`
- `https://www.aviyuktngo.org`

### Frontend (`frontend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend base URL for API calls |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID (if omitted, frontend fetches from backend) |
| `VITE_RAZORPAY_KEY_ID` | Yes (payments) | Razorpay publishable key used in checkout |

## Scripts

### Frontend (`frontend`)

```bash
npm run dev      # start Vite dev server
npm run build    # build production bundle
npm run lint     # lint source
npm run preview  # preview production build
```

### Backend (`BackEnd`)

```bash
npm start        # run server.js
```

## API Reference

Base URL (local): `http://localhost:3000`

### Auth Routes (`/api/auth`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/google-client-id` | Returns configured Google client ID |
| `POST` | `/google` | Verifies Google ID token, upserts user, sets auth cookie |
| `GET` | `/me` | Returns current logged-in user (requires token/cookie) |
| `POST` | `/logout` | Clears auth cookie |

### Contact Routes (`/contact`)

| Method | Route | Description |
|---|---|---|
| `POST` | `/email` | Stores contact email in DB |

### Payment Routes (`/razorpay`)

| Method | Route | Description |
|---|---|---|
| `POST` | `/paymentcreate` | Creates Razorpay order and stores pending payment |
| `POST` | `/paymentverify` | Verifies Razorpay signature and marks payment completed |
| `POST` | `/payHistory` | Returns payment history by Aadhaar number |

## Data Models

### `users` collection
- `name` (required)
- `email` (required, unique)
- `profilePic`
- `googleId` (unique, sparse)
- timestamps

### `payment` collection
- `orderId` (required)
- `paymentId`
- `signature`
- `amount` (required)
- `currency` (required)
- donor/member details: `name`, `email`, `adhar`, `address`, `occupation`, `street`, `city`, `state`, `pincode`, `gender`
- `status` (`pending`/`completed`)
- timestamps

### `Contact` collection
- `email` (required)
- timestamps

## Authentication and Security

- Google-only authentication flow
- Backend verifies Google ID token audience with `GOOGLE_CLIENT_ID`
- JWT token is issued and stored in HTTP-only cookie (`token`)
- Auth middleware accepts cookie token or `Authorization: Bearer <token>`
- In production, cookie settings use `secure: true` and `sameSite: None`
- CORS is origin-restricted using defaults + `FRONTEND_URLS`

Important production recommendations:
- Use HTTPS for frontend and backend
- Use strong `JWT_SECRET`
- Never commit `.env` files
- Protect and rotate Razorpay keys as needed

## Deployment Notes

- Frontend is Vercel-ready (`frontend/vercel.json` has SPA rewrite)
- Backend can be deployed on Render, Railway, VPS, or any Node host
- Ensure all required env variables are configured in deployment platform
- Keep frontend `VITE_API_BASE_URL` pointed to deployed backend URL

## Project and Developer Team

### Organization Leadership

- President: Narayan Kumar Shrivastav
- Vice President: Vijay Kumar khare
- Secretary: Brajesh Pratap Singh
- Joint Secretary: Dr. Sukrati shrivastava
- Treasurer: Sapna Shrivastava
- Board Member: Awadh Bihari Gautam
- Board Member: Pankaj Kumar Panthi

### Founders and Tech Leadership

- Anand Singh Chouhan - Founder and Visionary
- Ankesh Barhadiya - Co-Founder and Tech Lead
- Sameer Khan - Co-Founder and Tech Lead
- Deepti Lodhi - Co-Founder and Tech Lead

### Developer Contact References (from project credits)

- Sameer Khan
  - Email: `sameerkhan27560@gmail.com`
  - LinkedIn: `https://www.linkedin.com/in/sameer-khan2210/`

### Public NGO Contact

- Email: `aviyuktngo@gmail.com`
- Phone: `+91 8770321854`
- Location: Bhopal, India

Social links:
- Instagram: `https://www.instagram.com/aviyukt_samaja_sevi_sansthan`
- Facebook: `https://www.facebook.com/share/18ykXqs2ca/`
- YouTube: `http://www.youtube.com/@Aviyuktngo`

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make and test changes locally
4. Open a pull request with clear description

Recommended before PR:
- Run frontend linting
- Validate auth flow
- Validate payment create + verify in Razorpay test mode

## Troubleshooting

- Google login not appearing:
  - Check `GOOGLE_CLIENT_ID` in backend and/or `VITE_GOOGLE_CLIENT_ID` in frontend
- Unauthorized on `/api/auth/me`:
  - Check cookie settings, CORS config, and `withCredentials` behavior
- Payment create failing:
  - Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend
- Payment verify failing:
  - Ensure correct signature and order/payment IDs are sent
- No payment history:
  - Aadhaar must be exactly 12 digits

## Notes

- Backend currently uses `npm start` only (no nodemon script configured).
- No automated tests are configured yet in this repository.

# Admin Panel & Gallery System

A complete **Admin Panel** with **Gallery Management System** that allows:
- ✅ Create, Read, Update, Delete (CRUD) categories with images
- ✅ Upload & manage multiple gallery images per category
- ✅ Cloud storage using Cloudinary
- ✅ User-facing gallery page with category browsing
- ✅ Admin authentication & authorization
- ✅ Beautiful, responsive UI with TailwindCSS

---

## 📦 Files Created

### Backend

#### Models
1. **`src/models/category.model.js`** - Category schema with single image
2. **`src/models/image.model.js`** - Image schema with category reference

#### Controllers
3. **`src/controller/categoryController.js`** - CRUD operations for categories
4. **`src/controller/imageController.js`** - CRUD operations for images

#### Middleware
5. **`src/middleware/uploadMiddleware.js`** - Cloudinary configuration & multer setup
6. **`src/middleware/adminMiddleware.js`** - Authentication & authorization

#### Routes
7. **`src/routes/adminRoutes.js`** - All admin API endpoints

#### Configuration
8. **`BackEnd/.env.example`** - Environment variables template
9. **`.env`** - Your actual environment variables (you'll create this)

### Frontend

#### API Integration
10. **`src/api/adminAPI.js`** - API service for all admin operations

#### Admin Components
11. **`src/Components/Admin/AdminDashboard.jsx`** - Main admin dashboard with tabs
12. **`src/Components/Admin/AdminCategories.jsx`** - Category management component
13. **`src/Components/Admin/AdminImages.jsx`** - Image management component

#### User Pages
14. **`src/pages/Gallery.jsx`** - Public gallery page

#### Routes
15. **`src/routes/ProtectedAdminRoute.jsx`** - Admin-only route protection

#### Documentation
16. **`ADMIN_SETUP.md`** - Complete setup & usage guide
17. **`QUICK_START.md`** - Quick start reference guide
18. **`IMPLEMENTATION_SUMMARY.md`** - This file

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              User-Facing Gallery (/gallery)         │
│  - Browse all categories                            │
│  - Click category → View all images                 │
│  - View image in modal                              │
└─────────────────────────────────────────────────────┘
                        ↑
          ┌─────────────┴─────────────┐
          ↓                           ↓
    ┌──────────────┐         ┌──────────────────┐
    │   Frontend   │         │    Backend API   │
    │   (React)    │         │   (Express.js)   │
    └──────────────┘         └──────────────────┘
          ↓                           ↓
   Components:                Services:
   - AdminDashboard         - categoryRoutes
   - AdminCategories        - imageRoutes
   - AdminImages            - uploadMiddleware
   - Gallery                - Cloudinary
          ↑                           ↓
          └─────────────┬─────────────┘
                        ↓
            ┌───────────────────────┐
            │   Cloudinary Cloud    │
            │  (Image Storage)      │
            └───────────────────────┘
```

---

## 🗄️ Database Schema

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: "String (unique)",
  description: "String (optional)",
  categoryImage: "URL from Cloudinary",
  categoryImagePublicId: "For deletion",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Images Collection
```javascript
{
  _id: ObjectId,
  categoryId: ObjectId (reference to Category),
  title: "String (required)",
  description: "String (optional)",
  imageUrl: "URL from Cloudinary",
  publicId: "For deletion",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Category Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/categories` | No | Get all categories |
| POST | `/api/admin/categories` | Admin | Create category |
| GET | `/api/admin/categories/:id` | No | Get category by ID |
| PUT | `/api/admin/categories/:id` | Admin | Update category |
| DELETE | `/api/admin/categories/:id` | Admin | Delete category |
| PATCH | `/api/admin/categories/:id/deactivate` | Admin | Soft delete |

### Image Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/images` | No | Get all images |
| POST | `/api/admin/images` | Admin | Upload image |
| GET | `/api/admin/images/:id` | No | Get image by ID |
| GET | `/api/admin/images/category/:categoryId` | No | Get images by category |
| PUT | `/api/admin/images/:id` | Admin | Update image |
| DELETE | `/api/admin/images/:id` | Admin | Delete image |
| PATCH | `/api/admin/images/:id/deactivate` | Admin | Soft delete |

---

## 🔐 Authentication & Authorization

### Admin Access Control
- Requires JWT token (from existing login system)
- Checks if user email matches `ADMIN_EMAIL` in `.env`
- All admin routes protected with `isAuthenticated` and `isAdmin` middleware

### Public Access
- Gallery page accessible to all users
- Can view categories and images
- No login required for viewing

---

## 🎨 Frontend Features

### Admin Dashboard (`/admin`)
- **Tabbed Interface**: Categories & Images tabs
- **Create Operations**: Add new categories & images
- **Read Operations**: View all entries in grid layout
- **Update Operations**: Edit existing entries
- **Delete Operations**: Delete with confirmation
- **File Upload**: Image upload with preview
- **Filtering**: Filter images by category
- **Responsive Design**: Works on mobile, tablet, desktop

### Gallery Page (`/gallery`)
- **Category Selection**: Browse all categories
- **Image Grid**: View images in category
- **Modal View**: Click image to view fullscreen
- **Category Images**: Each category has featured image
- **Descriptions**: Show descriptions for both categories and images
- **Responsive**: Mobile-first design with Tailwind CSS

---

## 🔧 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **JWT** - Authentication

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide Icons** - Icon library

### Cloud
- **Cloudinary** - Image storage & optimization
- **MongoDB Atlas** - Database (existing)

---

## 📝 How It Works

### Upload Flow (Admin)
1. Admin logs in → redirected to dashboard
2. Choose Categories or Images tab
3. Click "Add Category/Image" button
4. Fill form & upload file
5. Multer intercepts file → sends to Cloudinary
6. Cloudinary returns URL & public_id
7. Save to MongoDB with Cloudinary URL
8. Admin sees success message

### View Flow (User)
1. User visits `/gallery`
2. Fetches all categories from API
3. Shows category cards with images
4. User clicks category
5. Fetches category images from API
6. Shows image grid
7. Click image → modal view
8. Can navigate back to categories

### Delete Flow (Admin)
1. Admin clicks delete button
2. Confirmation dialog appears
3. Delete request sent to backend
4. Backend deletes from MongoDB
5. Backend deletes from Cloudinary (using public_id)
6. Frontend refreshes list

---

## 🚀 Setup Instructions

### Quick Setup (See QUICK_START.md)
1. **Backend**:
   - `npm install` in BackEnd folder
   - Add Cloudinary credentials to `.env`
   - `npm start`

2. **Frontend**:
   - `npm install` in frontend folder
   - `npm run dev`

3. **Add Data**:
   - Login with admin email
   - Go to `/admin`
   - Create categories & upload images

### Complete Setup (See ADMIN_SETUP.md)
- Detailed step-by-step instructions
- Environment variable explanations
- Troubleshooting guide
- Database schema details
- Security considerations

---

## 🔑 Key Features

✅ **Cloud Storage**: Images stored securely on Cloudinary
✅ **Category Hierarchy**: Categories contain multiple images
✅ **Admin Interface**: Clean, intuitive dashboard
✅ **User Gallery**: Beautiful gallery browsing experience
✅ **Responsive Design**: Works on all devices
✅ **Image Optimization**: Cloudinary auto-optimizes
✅ **Soft Delete**: Deactivate instead of hard delete
✅ **Error Handling**: User-friendly error messages
✅ **Loading States**: Smooth loading indicators
✅ **Image Preview**: Preview before upload
✅ **Category Filtering**: Filter images by category
✅ **Modal View**: Fullscreen image viewing

---

## 📱 Routes Created

### Frontend Routes
- `/gallery` - Public gallery page
- `/admin` - Admin dashboard (protected)
- `/admin/categories` - Category management (via tab)
- `/admin/images` - Image management (via tab)

### Navigation Updated
- Added "Gallery" to navbar
- Gallery accessible from main navigation
- Admin link accessible after login (if admin)

---

## 🔒 Security Features

✅ JWT Authentication on admin routes
✅ Email-based admin verification
✅ File upload validation
✅ File size limits (10MB)
✅ CORS protection with whitelisted origins
✅ Secure Cloudinary integration
✅ Protected routes with middleware