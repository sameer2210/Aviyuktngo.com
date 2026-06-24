# Quick Start Guide - Admin Panel

## 1️⃣ Backend Configuration (First)

### A. Install Packages
```bash
cd BackEnd
npm install
```

### B. Get Cloudinary Credentials
- Visit: https://cloudinary.com/users/register/free
- Sign up for free account
- Go to Dashboard → Settings → API Credentials
- Copy: Cloud Name, API Key, API Secret

### C. Update .env
```bash
# Edit BackEnd/.env file and add:
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your-email@gmail.com
```

### D. Start Server
```bash
npm start
# Server should run at http://localhost:5000
```

---

## 2️⃣ Frontend Configuration (Second)

### A. Install Packages
```bash
cd frontend
npm install
```

### B. Start Dev Server
```bash
npm run dev
# Frontend at http://localhost:5173
```

---

## 3️⃣ Test It Out

### A. User-Facing Gallery
1. Open http://localhost:5173
2. Click "Gallery" in navigation
3. You should see empty categories (since you haven't added any yet)

### B. Admin Panel
1. Login with your account (the one matching ADMIN_EMAIL)
2. Go to http://localhost:5173/admin
3. You should see Admin Dashboard

### C. Add First Category
1. In Admin Dashboard → Categories tab
2. Click "Add Category"
3. Enter name: "Nature Photography"
4. (Optional) Upload a category image
5. Click "Save"

### D. Add Gallery Images
1. Admin Dashboard → Gallery Images tab
2. Click "Add Image"
3. Select category: "Nature Photography"
4. Title: "Mountain Peak"
5. Upload an image file
6. Click "Save"

### E. View in Gallery
1. Go to /gallery page
2. Click on "Nature Photography" category
3. See your uploaded images!

---

## 4️⃣ Important Notes

⚠️ **Admin Access**
- Only email matching `ADMIN_EMAIL` can access `/admin`
- Update `ADMIN_EMAIL` in backend `.env` to your email
- Must be logged in to access admin panel

📁 **File Structure**
```
Categories
├── Category Name
│   ├── Category Image (1 per category)
│   └── Images
│       ├── Image 1
│       ├── Image 2
│       └── ...

Gallery
├── All Images
└── Organized by Category
```

☁️ **Cloudinary Free Plan**
- 25GB monthly storage
- 25GB monthly bandwidth
- Free image optimization
- Perfect for getting started!

---

## 5️⃣ API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/categories` | View all categories |
| POST | `/api/admin/categories` | Create category (admin) |
| PUT | `/api/admin/categories/:id` | Update category (admin) |
| DELETE | `/api/admin/categories/:id` | Delete category (admin) |
| GET | `/api/admin/images` | View all images |
| POST | `/api/admin/images` | Upload image (admin) |
| GET | `/api/admin/images/category/:categoryId` | Get images by category |

---

## 6️⃣ Troubleshooting

### ❌ Images not uploading?
- Check Cloudinary API credentials in .env
- Ensure file is under 10MB
- Check browser console for errors

### ❌ Admin panel not showing?
- Verify you're logged in
- Check your email matches ADMIN_EMAIL in .env
- Try clearing browser cache

### ❌ No categories showing in gallery?
- Check backend server is running
- Go to /admin and add a category first
- Refresh /gallery page

---

## 7️⃣ Next Steps

✅ Categories & Images CRUD working
✅ Cloud storage setup complete
✅ User gallery view working

**Future Enhancements:**
- Add image descriptions
- Category sorting/filtering
- Bulk upload
- Image search
- Analytics dashboard
- Advanced filtering options

---

**Ready to go! 🚀 Start adding categories and images!**
