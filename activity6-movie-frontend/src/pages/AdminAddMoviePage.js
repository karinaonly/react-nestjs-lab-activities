import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import axiosInstance from '../service/axiosInstance';

function AdminAddMoviePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    director: '',
    producer: '',
    originalLanguage: '',
    releaseDate: new Date().getFullYear(),
    rating: 8.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : name === 'releaseDate' ? parseInt(value) : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate all required fields
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.director.trim()) errors.director = 'Director is required';
    if (!formData.producer.trim()) errors.producer = 'Producer is required';
    if (!formData.originalLanguage.trim()) errors.originalLanguage = 'Language is required';
    if (!formData.releaseDate) errors.releaseDate = 'Release year is required';
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      errors.rating = 'Rating must be between 0 and 10';
    }
    if (!imageFile) errors.image = 'Movie poster is required';

    // If there are errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('genre', formData.genre);
      submitData.append('director', formData.director);
      submitData.append('producer', formData.producer);
      submitData.append('originalLanguage', formData.originalLanguage);
      submitData.append('releaseDate', formData.releaseDate);
      submitData.append('rating', formData.rating);
      submitData.append('image', imageFile);

      await axiosInstance.post('/movies/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Movie added successfully!');
      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded border border-[#D1D9E0] bg-white text-sm font-semibold text-[#4B5563] hover:bg-[#E5E7EB]"
          >
            &lt; Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#D1D9E0] p-8">
          <h2 className="text-2xl font-semibold mb-2">Add New Movie</h2>
          <p className="text-sm text-gray-500 mb-6">Fields marked with <span className="text-red-500">*</span> are required</p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  className={`w-full border ${fieldErrors.title ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Genre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g., Action, Drama, Comedy"
                  className={`w-full border ${fieldErrors.genre ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.genre && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.genre}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter movie description or synopsis"
                className={`w-full border ${fieldErrors.description ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Director <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Director name"
                  className={`w-full border ${fieldErrors.director ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.director && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.director}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Producer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  placeholder="Producer name"
                  className={`w-full border ${fieldErrors.producer ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.producer && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.producer}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Release Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  placeholder="2024"
                  min="1800"
                  max="2100"
                  className={`w-full border ${fieldErrors.releaseDate ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.releaseDate && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.releaseDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Rating (0-10) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="8.5"
                  className={`w-full border ${fieldErrors.rating ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.rating && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.rating}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="originalLanguage"
                  value={formData.originalLanguage}
                  onChange={handleChange}
                  placeholder="English"
                  className={`w-full border ${fieldErrors.originalLanguage ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
                />
                {fieldErrors.originalLanguage && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.originalLanguage}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-2">
                Movie Poster <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Upload an image (max 5MB, JPG/PNG)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`w-full border ${fieldErrors.image ? 'border-red-500' : 'border-[#D1D9E0]'} rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]`}
              />
              {fieldErrors.image && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-auto rounded-lg border border-[#D1D9E0]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#2FBB73] text-white py-3 rounded-lg font-semibold hover:bg-[#28a966] disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Movie'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-[#D1D9E0] text-[#4B5563] py-3 rounded-lg font-semibold hover:bg-[#F5F7FA]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddMoviePage;
