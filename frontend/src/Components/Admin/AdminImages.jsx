import { useState, useEffect } from 'react';
import { imageAPI, categoryAPI } from '../../api/adminAPI';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader } from 'lucide-react';

const getImageCategoryId = (image) => {
  if (!image?.categoryId) {
    return '';
  }

  if (typeof image.categoryId === 'object') {
    return image.categoryId._id || '';
  }

  return image.categoryId;
};

const getImageCategoryLabel = (image) =>
  image?.categoryName || image?.categoryId?.name || 'Deleted category';

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
  const [orphanedCount, setOrphanedCount] = useState(0);

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
      setOrphanedCount(Number(imagesRes.data?.meta?.orphanedCount) || 0);
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

      const files = formData.image;
      if (editingId) {
        if (files && files.length > 1) {
          setError('Please upload only one replacement image when editing');
          return;
        }

        const data = new FormData();
        data.append('categoryId', formData.categoryId);
        data.append('title', formData.title);
        data.append('description', formData.description);

        if (files && files.length === 1) {
          data.append('image', files[0]);
        }

        await imageAPI.update(editingId, data);
        setSuccess('Image updated successfully');
      } else {
        if (!files || files.length === 0) {
          setError('Please select at least one image');
          return;
        }

        const uploadPromises = Array.from(files).map((file, index) => {
          const data = new FormData();
          data.append('categoryId', formData.categoryId);
          data.append('title', `${formData.title} ${index + 1}`);
          data.append('description', formData.description);
          data.append('image', file);

          return imageAPI.create(data);
        });

        const results = await Promise.all(uploadPromises);
        setSuccess(`Successfully uploaded ${results.length} image(s)`);
      }

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
      categoryId: getImageCategoryId(image),
      title: image.title || '',
      description: image.description || '',
      image: null,
    });
    setImagePreviews(image.imageUrl ? [image.imageUrl] : []);
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
      : images.filter((img) => String(getImageCategoryId(img)) === String(filterCategory));

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
      {orphanedCount > 0 && (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded">
          {orphanedCount} image(s) are linked to missing categories. Use the cleanup script to remove the legacy orphaned records or reassign them.
        </div>
      )}

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
          filteredImages.map((image, index) => (
            <div key={image?._id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={image.imageUrl} alt={image.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{image.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{getImageCategoryLabel(image)}</p>
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
