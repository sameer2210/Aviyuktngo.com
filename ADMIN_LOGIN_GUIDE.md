# Admin Panel Login - Complete Guide

## 🔐 Admin Login System (Username & Password Based)

Your admin panel now uses **Username & Password authentication** - NOT email-based!

---

## 📝 Default Credentials

```
Username: admin
Password: admin@123
```

---

## 🚀 Setup Steps

### Step 1: Update Backend `.env` File
Edit `BackEnd/.env` and ensure you have:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: Start Backend Server
```bash
cd BackEnd
npm start
```

### Step 3: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

### Step 4: Access Admin Panel
1. Go to `http://localhost:5173/admin-login`
2. Enter credentials:
   - **Username:** `admin`
   - **Password:** `admin@123`
3. Click "Login to Admin Panel"
4. You'll be redirected to `/admin` dashboard

---

## 🔄 Workflow

```
http://localhost:5173/admin-login
         ↓
[Enter Username & Password]
         ↓
POST /api/admin/auth/login
         ↓
Backend validates credentials
         ↓
✅ Valid → Generate JWT Token
❌ Invalid → Show error "Invalid credentials"
         ↓
Token stored in localStorage
         ↓
Redirected to /admin dashboard
         ↓
ProtectedAdminRoute checks token
         ↓
✅ Token exists → Show Dashboard
❌ No token → Redirect to /admin-login
```

---

## 🛠️ Change Admin Credentials

### Option 1: Update `.env` File (Recommended)

Edit `BackEnd/.env`:
```env
ADMIN_USERNAME=my_custom_username
ADMIN_PASSWORD=my_custom_password
```

Then restart backend: `npm start`

### Option 2: Change Default in Code

Edit `BackEnd/src/routes/adminAuthRoutes.js`:
```javascript
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
```

---

## 📱 Admin Panel Features

After logging in, you can:

### Categories Tab
- ✅ View all categories
- ✅ Create new category
- ✅ Edit category name & image
- ✅ Delete category
- ✅ Upload category image

### Gallery Images Tab
- ✅ View all images
- ✅ Upload new images
- ✅ Assign images to categories
- ✅ Edit image titles & descriptions
- ✅ Delete images
- ✅ Filter by category

---

## 🔓 Logout

Click "Logout" button in admin dashboard to:
- Clear authentication token
- Redirect to login page
- Session ends

---

## 🔒 Security Features

✅ **Token-based Authentication** - JWT tokens for secure session
✅ **HttpOnly Cookies** - Tokens stored securely (not accessible via JavaScript)
✅ **24-hour Expiry** - Tokens expire after 24 hours
✅ **Protected Routes** - Admin routes require valid token
✅ **Password Storage** - Uses environment variables (not hardcoded)

---

## 📋 Endpoints

### Admin Authentication Endpoints

#### Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin@123"
}
```

**Response (200):**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### Logout
```http
POST /api/admin/auth/logout
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🐛 Troubleshooting

### ❌ "Invalid credentials" error
- Check username spelling
- Check password spelling
- Make sure `.env` file has correct values
- Restart backend server

### ❌ Token expired
- Automatic 24-hour expiry
- Login again with credentials

### ❌ Cannot access /admin after login
- Check if token exists in localStorage
- Clear browser cache/cookies
- Login again

### ❌ Backend API not responding
- Ensure backend is running: `npm start`
- Check if port 5000 is available
- Check MongoDB connection

---

## 📚 File Locations

### Backend Files
- Routes: `BackEnd/src/routes/adminAuthRoutes.js`
- App Config: `BackEnd/src/app.js`
- Env Template: `BackEnd/.env.example`

### Frontend Files
- Login Page: `frontend/src/pages/AdminLogin.jsx`
- Auth Context: `frontend/src/context/AdminAuthContext.jsx`
- Auth Hook: `frontend/src/context/useAdminAuth.js`
- API Service: `frontend/src/api/adminAuthAPI.js`
- Protected Route: `frontend/src/routes/ProtectedAdminRoute.jsx`
- Dashboard: `frontend/src/Components/Admin/AdminDashboard.jsx`

---

## 🎯 Production Deployment

### Before Deploying:
1. **Change default credentials** in `.env`:
   ```env
   ADMIN_USERNAME=your_secure_username
   ADMIN_PASSWORD=your_secure_password
   ```

2. **Use strong password** (min 12 characters with special chars)

3. **Update JWT_SECRET** to a random value:
   ```env
   JWT_SECRET=your_very_long_random_secret_key_here
   ```

4. **Set secure cookies** in production:
   - HttpOnly: ✅ (default)
   - Secure: ✅ (HTTPS only)
   - SameSite: ✅ (Strict)

---

## 🔑 Keep Your Credentials Safe

⚠️ **Important Security Tips:**
- Never commit `.env` file to git
- Change default credentials
- Use strong passwords
- Enable HTTPS in production
- Monitor login attempts
- Rotate credentials periodically

---

**Your admin panel is ready!** 🎉

Login at: `http://localhost:5173/admin-login`
