import { useState, useEffect } from 'react';
import { imageAPI, categoryAPI } from '../../api/adminAPI';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader } from 'lucide-react';

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]); // Array for multiple previews
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [imagesRes, categoriesRes] = await Promise.all([
        imageAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      
      console.log('Images Response:', imagesRes.data);
      console.log('Categories Response:', categoriesRes.data);
      
      const imagesData = imagesRes.data.images || imagesRes.data;
      const categoriesData = categoriesRes.data.categories || categoriesRes.data;
      
      setImages(Array.isArray(imagesData) ? imagesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Store all selected files
      setFormData({ ...formData, image: files });
      
      // Create previews for all selected images
      const previews = [];
      let loadedCount = 0;
      
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews[index] = reader.result;
          loadedCount++;
          if (loadedCount === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter an image title');
      return;
    }

    try {
      setLoading(true);

      // Handle multiple files
      const files = formData.image;
      if (!files || files.length === 0) {
        setError('Please select at least one image');
        return;
      }

      // Upload each file separately
      const uploadPromises = Array.from(files).map((file) => {
        const data = new FormData();
        data.append('categoryId', formData.categoryId);
        data.append('title', `${formData.title} ${Array.from(files).indexOf(file) + 1}`);
        data.append('description', formData.description);
        data.append('image', file);

        if (editingId) {
          return imageAPI.update(editingId, data);
        } else {
          return imageAPI.create(data);
        }
      });

      const results = await Promise.all(uploadPromises);
      setSuccess(`Successfully uploaded ${results.length} image(s)`);

      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save images');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image) => {
    setFormData({
      categoryId: image.categoryId._id,
      title: image.title,
      description: image.description,
      image: null,
    });
    setImagePreview(image.imageUrl);
    setEditingId(image._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      await imageAPI.delete(id);
      setSuccess('Image deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ categoryId: '', title: '', description: '', image: null });
    setImagePreviews([]);
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  const filteredImages =
    filterCategory === 'all'
      ? images
      : images.filter((img) => img.categoryId._id === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Manage Gallery Images</h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter image title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter image description (optional)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image File(s) {!editingId && '*'}</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                required={!editingId}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="flex justify-center">
                    <img src={preview} alt={`Preview ${index + 1}`} className="h-40 w-40 object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Images Gallery */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && !showForm ? (
          <div className="col-span-full flex justify-center">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={image.imageUrl} alt={image.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{image.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{image.categoryId.name}</p>
                {image.description && <p className="text-sm text-gray-600 mb-3">{image.description}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-1 text-sm transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
            <p>No images yet. Upload one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
