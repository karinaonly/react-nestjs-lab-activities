import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import AlertDialog from '../components/AlertDialog';
import axiosInstance from '../service/axiosInstance';

function AdminAddMoviePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editMovie = location.state?.mode === 'edit' ? location.state.movie : null;

  // Genre options
  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History',
    'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
    'Thriller', 'War', 'Western'
  ];

  // Language options
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Japanese', 'Korean', 'Chinese', 'Hindi', 'Arabic',
    'Turkish', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
    'Polish', 'Czech', 'Greek', 'Hebrew', 'Thai', 'Vietnamese',
    'Indonesian', 'Tagalog', 'Swahili', 'Other'
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  useEffect(() => {
    if (editMovie) {
      setFormData({
        title: editMovie.title || '',
        description: editMovie.description || '',
        genre: editMovie.genre || '',
        director: editMovie.director || '',
        producer: editMovie.producer || '',
        originalLanguage: editMovie.originalLanguage || '',
        releaseDate: editMovie.releaseDate || new Date().getFullYear(),
        rating: editMovie.rating || 8.0,
      });
      setImagePreview(editMovie.movieImage ? `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${editMovie.movieImage}` : null);
    }
  }, [editMovie]);

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

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

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
    if (!editMovie && !imageFile) errors.image = 'Movie poster is required';

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
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editMovie) {
        await axiosInstance.put(`/movies/update/${editMovie.movieId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Movie updated successfully!');
      } else {
        await axiosInstance.post('/movies/create', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Movie added successfully!');
      }

      setShowSuccessAlert(true);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editMovie ? 'update' : 'add'} movie`);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
    if (editMovie) {
      navigate(`/movies/${editMovie.movieId}`);
    } else {
      navigate('/movies');
    }
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${hasError ? 'border-red-500' : ''}`;

  const inputStyle = (hasError) => ({
    backgroundColor: 'var(--bg-secondary)',
    borderColor: hasError ? '#ef4444' : 'var(--border-color)',
    color: 'var(--text-primary)',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Nav />
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-10">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-sm font-semibold rounded hover:opacity-90"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            &lt; Back
          </button>
        </div>

        <div className="rounded-xl shadow-sm p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{editMovie ? 'Edit Movie' : 'Add New Movie'}</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Fields marked with <span style={{ color: '#ef4444' }}>*</span> are required</p>

          {error && (
            <div className="mb-4 p-4 rounded" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ef4444' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  className={inputClass(fieldErrors.title)}
                  style={inputStyle(fieldErrors.title)}
                />
                {fieldErrors.title && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Genre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={inputClass(fieldErrors.genre)}
                  style={inputStyle(fieldErrors.genre)}
                >
                  <option value="">Select genre...</option>
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {fieldErrors.genre && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.genre}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter movie description or synopsis"
                className={inputClass(fieldErrors.description)}
                style={inputStyle(fieldErrors.description)}
              />
              {fieldErrors.description && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Director <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Director name"
                  className={inputClass(fieldErrors.director)}
                  style={inputStyle(fieldErrors.director)}
                />
                {fieldErrors.director && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.director}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Producer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  placeholder="Producer name"
                  className={inputClass(fieldErrors.producer)}
                  style={inputStyle(fieldErrors.producer)}
                />
                {fieldErrors.producer && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.producer}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Release Year <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  placeholder="2024"
                  min="1800"
                  max="2100"
                  className={inputClass(fieldErrors.releaseDate)}
                  style={inputStyle(fieldErrors.releaseDate)}
                />
                {fieldErrors.releaseDate && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.releaseDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Language <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="originalLanguage"
                  value={formData.originalLanguage}
                  onChange={handleChange}
                  className={inputClass(fieldErrors.originalLanguage)}
                  style={inputStyle(fieldErrors.originalLanguage)}
                >
                  <option value="">Select language...</option>
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
                {fieldErrors.originalLanguage && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.originalLanguage}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Movie Poster <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Upload an image (max 5MB, JPG/PNG)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={inputClass(fieldErrors.image)}
                style={inputStyle(fieldErrors.image)}
              />
              {fieldErrors.image && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-auto rounded-lg border"
                    style={{ borderColor: 'var(--border-color)' }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                {loading ? (editMovie ? 'Updating...' : 'Adding...') : editMovie ? 'Update Movie' : 'Add Movie'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-lg font-semibold"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.75rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertDialog
        isOpen={showSuccessAlert}
        onClose={handleAlertClose}
        title="Success"
        message={successMessage}
        variant="success"
      />
    </div>
  );
}

export default AdminAddMoviePage;
