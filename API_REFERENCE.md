# API Reference - Complete Endpoints Guide

## Base URL
```
http://localhost:5000/api/admin
https://your-deployed-backend.com/api/admin
```

---

## 📦 Category Endpoints

### 1. Get All Categories
```http
GET /categories
```

**Authentication**: ❌ Not required
**Response**:
```json
{
  "message": "Categories fetched successfully",
  "categories": [
    {
      "_id": "category_id_123",
      "name": "Nature",
      "description": "Nature photography",
      "categoryImage": "https://cloudinary.com/...",
      "categoryImagePublicId": "aviyukt_categories/nature_1234",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 2. Create Category
```http
POST /categories
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Body** (form-data):
- `name` (text, required) - Category name
- `description` (text, optional) - Category description
- `categoryImage` (file, optional) - Category image

**Example cURL**:
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Mountains" \
  -F "description=Beautiful mountain landscapes" \
  -F "categoryImage=@/path/to/image.jpg"
```

**Response** (201):
```json
{
  "message": "Category created successfully",
  "category": {
    "_id": "category_id_123",
    "name": "Mountains",
    "description": "Beautiful mountain landscapes",
    "categoryImage": "https://cloudinary.com/...",
    "categoryImagePublicId": "aviyukt_categories/mountains_1234",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

### 3. Get Category by ID
```http
GET /categories/:id
```

**Authentication**: ❌ Not required
**Parameters**:
- `id` (path, required) - Category ID

**Example**:
```
GET /categories/category_id_123
```

**Response**:
```json
{
  "message": "Category fetched successfully",
  "category": { /* category object */ }
}
```

---

### 4. Update Category
```http
PUT /categories/:id
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Category ID

**Body** (form-data):
- `name` (text, optional) - Update category name
- `description` (text, optional) - Update description
- `categoryImage` (file, optional) - Replace image

**Example cURL**:
```bash
curl -X PUT http://localhost:5000/api/admin/categories/category_id_123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Alpine Mountains" \
  -F "categoryImage=@/path/to/new_image.jpg"
```

**Response** (200):
```json
{
  "message": "Category updated successfully",
  "category": { /* updated category object */ }
}
```

---

### 5. Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Category ID

**Example**:
```
DELETE /categories/category_id_123
```

**Response** (200):
```json
{
  "message": "Category deleted successfully"
}
```

---

### 6. Deactivate Category (Soft Delete)
```http
PATCH /categories/:id/deactivate
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Category ID

**Example**:
```
PATCH /categories/category_id_123/deactivate
```

**Response** (200):
```json
{
  "message": "Category deactivated successfully",
  "category": { /* category with isActive: false */ }
}
```

---

## 🖼️ Image Endpoints

### 7. Get All Images
```http
GET /images
```

**Authentication**: ❌ Not required
**Response**:
```json
{
  "message": "Images fetched successfully",
  "images": [
    {
      "_id": "image_id_123",
      "categoryId": {
        "_id": "category_id_456",
        "name": "Mountains"
      },
      "title": "Sunset on Peak",
      "description": "Beautiful sunset view",
      "imageUrl": "https://cloudinary.com/...",
      "publicId": "aviyukt_gallery/sunset_1234",
      "isActive": true,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 8. Create Image (Upload)
```http
POST /images
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Body** (form-data):
- `categoryId` (text, required) - Category ID
- `title` (text, required) - Image title
- `description` (text, optional) - Image description
- `image` (file, required) - Image file

**Example cURL**:
```bash
curl -X POST http://localhost:5000/api/admin/images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "categoryId=category_id_123" \
  -F "title=Mountain Peak" \
  -F "description=A beautiful mountain peak" \
  -F "image=@/path/to/image.jpg"
```

**Response** (201):
```json
{
  "message": "Image uploaded successfully",
  "image": {
    "_id": "image_id_123",
    "categoryId": "category_id_456",
    "title": "Mountain Peak",
    "description": "A beautiful mountain peak",
    "imageUrl": "https://cloudinary.com/...",
    "publicId": "aviyukt_gallery/mountain_peak_1234",
    "isActive": true
  }
}
```

---

### 9. Get Image by ID
```http
GET /images/:id
```

**Authentication**: ❌ Not required
**Parameters**:
- `id` (path, required) - Image ID

**Response**:
```json
{
  "message": "Image fetched successfully",
  "image": { /* image object with populated category */ }
}
```

---

### 10. Get Images by Category
```http
GET /images/category/:categoryId
```

**Authentication**: ❌ Not required
**Parameters**:
- `categoryId` (path, required) - Category ID

**Example**:
```
GET /images/category/category_id_123
```

**Response**:
```json
{
  "message": "Category images fetched successfully",
  "categoryName": "Mountains",
  "images": [ /* array of images in category */ ]
}
```

---

### 11. Update Image
```http
PUT /images/:id
Content-Type: multipart/form-data
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Image ID

**Body** (form-data):
- `title` (text, optional) - Update title
- `description` (text, optional) - Update description
- `image` (file, optional) - Replace image file

**Example cURL**:
```bash
curl -X PUT http://localhost:5000/api/admin/images/image_id_123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Updated Mountain Peak" \
  -F "image=@/path/to/new_image.jpg"
```

**Response** (200):
```json
{
  "message": "Image updated successfully",
  "image": { /* updated image object */ }
}
```

---

### 12. Delete Image
```http
DELETE /images/:id
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Image ID

**Response** (200):
```json
{
  "message": "Image deleted successfully"
}
```

---

### 13. Deactivate Image (Soft Delete)
```http
PATCH /images/:id/deactivate
Authorization: Bearer <JWT_TOKEN>
```

**Authentication**: ✅ Admin only
**Parameters**:
- `id` (path, required) - Image ID

**Response** (200):
```json
{
  "message": "Image deactivated successfully",
  "image": { /* image with isActive: false */ }
}
```

---

## 📋 Quick Reference Table

| HTTP | Endpoint | Auth | Purpose |
|------|----------|------|---------|
| **GET** | `/categories` | ❌ No | List all categories |
| **POST** | `/categories` | ✅ Admin | Create category |
| **GET** | `/categories/:id` | ❌ No | Get category |
| **PUT** | `/categories/:id` | ✅ Admin | Update category |
| **DELETE** | `/categories/:id` | ✅ Admin | Delete category |
| **PATCH** | `/categories/:id/deactivate` | ✅ Admin | Deactivate category |
| **GET** | `/images` | ❌ No | List all images |
| **POST** | `/images` | ✅ Admin | Upload image |
| **GET** | `/images/:id` | ❌ No | Get image |
| **GET** | `/images/category/:id` | ❌ No | Get category images |
| **PUT** | `/images/:id` | ✅ Admin | Update image |
| **DELETE** | `/images/:id` | ✅ Admin | Delete image |
| **PATCH** | `/images/:id/deactivate` | ✅ Admin | Deactivate image |

---

## 🔐 Authentication

### Get JWT Token
Use your existing login endpoint:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Token is returned in response and stored in cookies/localStorage.

### Use JWT Token
Add to all admin requests:
```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Or via cookies (automatically sent by browser).

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Category name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Please login first"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin only."
}
```

### 404 Not Found
```json
{
  "error": "Category not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## 🧪 Testing with Postman

1. Create collection: "Admin Panel API"
2. Set base URL: `{{BASE_URL}}/api/admin`
3. Create variables:
   - `BASE_URL` = `http://localhost:5000`
   - `TOKEN` = Your JWT token
   - `CATEGORY_ID` = Created category ID
   - `IMAGE_ID` = Created image ID

4. In request headers add:
   ```
   Authorization: Bearer {{TOKEN}}
   ```

5. Test each endpoint!

---

## 🔗 Related Frontend API Calls

Frontend uses `src/api/adminAPI.js`:

```javascript
// Categories
categoryAPI.create(formData)
categoryAPI.getAll()
categoryAPI.getById(id)
categoryAPI.update(id, formData)
categoryAPI.delete(id)
categoryAPI.deactivate(id)

// Images
imageAPI.create(formData)
imageAPI.getAll()
imageAPI.getByCategory(categoryId)
imageAPI.getById(id)
imageAPI.update(id, formData)
imageAPI.delete(id)
imageAPI.deactivate(id)
```

---

**Happy API testing! 🚀**
