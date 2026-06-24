# Admin Panel - Setup & Usage Guide

## Overview
This admin panel allows administrators to manage categories and gallery images with cloud storage integration using Cloudinary.

### Features
✅ Category Management (Create, Read, Update, Delete)
✅ Gallery Image Management (CRUD operations)
✅ Cloud Storage with Cloudinary
✅ Category-wise Image Filtering
✅ User Gallery View
✅ Admin Authentication & Authorization

---

## Backend Setup

### 1. Install Dependencies
```bash
cd BackEnd
npm install
```

This adds:
- `cloudinary` - Cloud storage service
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage adapter

### 2. Configure Cloudinary

Get your credentials from [Cloudinary](https://cloudinary.com):

1. Sign up for a free Cloudinary account
2. Go to Dashboard → Settings
3. Find your API Credentials:
   - Cloud Name
   - API Key
   - API Secret

### 3. Update .env File
Create/Update `.env` in BackEnd folder with:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your-admin@email.com
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri
```

### 4. Start Backend Server
```bash
npm start
```

Server runs on: `http://localhost:5000` (or your configured port)

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Environment File
Create `.env.local` in frontend folder:

```env
VITE_API_URL=http://localhost:5000
VITE_ADMIN_EMAIL=your-admin@email.com
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## API Endpoints

### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category (admin only)
- `GET /api/admin/categories/:id` - Get category by ID
- `PUT /api/admin/categories/:id` - Update category (admin only)
- `DELETE /api/admin/categories/:id` - Delete category (admin only)
- `PATCH /api/admin/categories/:id/deactivate` - Soft delete (admin only)

### Images
- `GET /api/admin/images` - Get all images
- `POST /api/admin/images` - Create image (admin only)
- `GET /api/admin/images/:id` - Get image by ID
- `GET /api/admin/images/category/:categoryId` - Get images by category
- `PUT /api/admin/images/:id` - Update image (admin only)
- `DELETE /api/admin/images/:id` - Delete image (admin only)
- `PATCH /api/admin/images/:id/deactivate` - Soft delete (admin only)

---

## How to Use

### Admin Dashboard Access
1. Login with your account
2. Navigate to `/admin` or click "Admin" link (if you're admin)
3. Choose between Categories or Gallery Images tab

### Managing Categories
1. Click "Add Category" button
2. Fill in:
   - **Category Name** (required)
   - **Description** (optional)
   - **Category Image** (optional - single image representing category)
3. Click "Save"
4. View, Edit, or Delete existing categories

### Managing Gallery Images
1. Click "Add Image" button
2. Select a Category (required)
3. Fill in:
   - **Image Title** (required)
   - **Description** (optional)
   - **Image File** (required - JPG, PNG, GIF, WebP)
4. Click "Save"
5. Filter by category to view/edit/delete images

### User-Facing Gallery
1. Users visit `/gallery` page
2. See all categories with their category images
3. Click on a category to view all images in that category
4. Click on an image to view in fullscreen modal

---

## Database Schema

### Category Model
```javascript
{
  name: String (required, unique),
  description: String,
  categoryImage: String (URL),
  categoryImagePublicId: String (for Cloudinary deletion),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Image Model
```javascript
{
  categoryId: ObjectId (ref: Category),
  title: String (required),
  description: String,
  imageUrl: String (URL),
  publicId: String (for Cloudinary deletion),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

### Admin Authorization
- Only logged-in users with `email === ADMIN_EMAIL` can:
  - Create categories
  - Create images
  - Update categories/images
  - Delete categories/images

- Public users can:
  - View all categories
  - View gallery images
  - Filter by category

### Protected Routes
- Admin routes require valid JWT token
- Token comes from login/authentication system

---

## Cloudinary Folder Structure
Images are organized in Cloudinary:
- **Categories**: `aviyukt_categories/`
- **Gallery**: `aviyukt_gallery/`

This helps organize and manage images in your Cloudinary dashboard.

---

## Troubleshooting

### Images Not Uploading
- Check Cloudinary credentials in `.env`
- Ensure file size < 10MB
- Check supported formats (JPG, PNG, GIF, WebP)
- Check browser console for errors

### Admin Panel Not Accessible
- Ensure you're logged in
- Check that your email matches `ADMIN_EMAIL` in backend `.env`
- Clear browser cookies and login again
- Check JWT token in cookies/localStorage

### Categories/Images Not Showing
- Backend server must be running
- Check network requests in browser DevTools
- Verify MongoDB connection
- Check database for data

### CORS Issues
- Add frontend URL to `FRONTEND_URLS` in backend `.env`
- Example: `FRONTEND_URLS=http://localhost:5173,https://yourdomain.com`

---

## File Upload Limits
- Maximum file size: 10 MB
- Supported formats: JPG, JPEG, PNG, GIF, WebP
- Images are optimized by Cloudinary automatically

---

## Security Considerations
✅ JWT Token required for admin operations
✅ Admin email verification
✅ Protected routes
✅ CORS enabled for specific origins
✅ File validation on server
✅ Secure Cloudinary integration

---

## Support
For issues or questions:
1. Check error logs in browser console
2. Check backend server logs
3. Verify environment variables
4. Ensure all dependencies are installed

---

Happy uploading! 🎉
