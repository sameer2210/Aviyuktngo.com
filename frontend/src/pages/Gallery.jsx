import { useState, useEffect } from 'react';
import { categoryAPI, imageAPI } from '../api/adminAPI';
import { Loader, X, ChevronRight, Image, Folder, Palette } from 'lucide-react';

export default function Gallery() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories || response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      const response = await imageAPI.getByCategory(category._id);
      setImages(response.data.images || response.data);
    } catch (err) {
      console.error('Failed to fetch category images:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-25">
        {/* Header Section */}
        {!selectedCategory && (
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-900 mb-2"> EXPLORE OUR WORK</h1>
           
          </div>
        )}

        {/* Category Selection */}
        {!selectedCategory ? (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={36} className="animate-spin text-blue-600" />
              </div>
            ) : categories.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-56"
                  >
                    <div className="relative w-full h-full overflow-hidden bg-gray-300">
                      {category.categoryImage ? (
                        <img
                          src={category.categoryImage}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Image size={48} className="text-white" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-white text-lg font-bold mb-1">{category.name}</h3>
                        {category.description && (
                          <p className="text-gray-200 text-xs line-clamp-2">{category.description}</p>
                        )}
                        <div className="mt-2 text-white text-xs font-semibold flex items-center gap-1">
                          Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Folder size={48} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No categories available yet.</p>
              </div>
            )}
          </div>
        ) : (
          // Category Images View
          <div className="space-y-6">
            {/* Back Button and Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setImages([]);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  ← Back to Categories
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mt-3">{selectedCategory.name}</h2>
                {selectedCategory.description && (
                  <p className="text-gray-600 text-sm mt-1">{selectedCategory.description}</p>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={36} className="animate-spin text-blue-600" />
              </div>
            ) : images.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {images.map((image) => (
                  <button
                    key={image._id}
                    onClick={() => setSelectedImage(image)}
                    className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-48"
                  >
                    <div className="relative w-full h-full overflow-hidden bg-gray-200">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white font-semibold text-sm">View</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{image.title}</h3>
                      {image.description && (
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{image.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette size={48} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No images in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-600 text-xs mt-0.5">{selectedImage.description}</p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Image */}
            <div className="relative bg-gray-100 flex items-center justify-center" style={{ maxHeight: 'calc(80vh - 80px)' }}>
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.title} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
