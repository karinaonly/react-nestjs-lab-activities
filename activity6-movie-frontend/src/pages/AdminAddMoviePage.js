import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import axiosInstance from '../service/axiosInstance';

function AdminAddMoviePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    director: '',
    producer: '',
    originalLanguage: '',
    releaseDate: new Date().getFullYear(),
    rating: 8.0,
    movieImage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : name === 'releaseDate' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/movies/create', formData);
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
          <h2 className="text-2xl font-semibold mb-6">Add New Movie</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Genre *
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Director *
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Producer *
                </label>
                <input
                  type="text"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Release Date *
                </label>
                <input
                  type="number"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Rating *
                </label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-2">
                  Language *
                </label>
                <input
                  type="text"
                  name="originalLanguage"
                  value={formData.originalLanguage}
                  onChange={handleChange}
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4B5563] mb-2">
                Image Path (e.g., /movie-images/poster.jpg) *
              </label>
              <input
                type="text"
                name="movieImage"
                value={formData.movieImage}
                onChange={handleChange}
                className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                placeholder="/movie-images/poster.jpg"
                required
              />
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
