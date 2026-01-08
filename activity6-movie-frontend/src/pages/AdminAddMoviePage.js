import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import Nav from '../components/Nav';
import AlertDialog from '../components/AlertDialog';
import axiosInstance from '../service/axiosInstance';

function AdminAddMoviePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: editId } = useParams();
  const queryClient = useQueryClient();
  const imageInputRef = useRef(null);
  const [loadedMovie, setLoadedMovie] = useState(null);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const editMovie = location.state?.mode === 'edit' ? location.state.movie : null;
  const isEditMode = location.state?.mode === 'edit' || Boolean(editId);
  const currentMovie = editMovie || loadedMovie;

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
  const [originalFormData, setOriginalFormData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [yearWarning, setYearWarning] = useState('');
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
    // Fetch movie when directly hitting edit route without state
    if (isEditMode && !editMovie && editId) {
      setPrefillLoading(true);
      axiosInstance
        .get(`/movies/${editId}`)
        .then((res) => setLoadedMovie(res.data))
        .catch(() => setError('Failed to load movie details'))
        .finally(() => setPrefillLoading(false));
    }
  }, [isEditMode, editMovie, editId]);

  useEffect(() => {
    if (currentMovie) {
      const newFormData = {
        title: currentMovie.title || '',
        description: currentMovie.description || '',
        genre: currentMovie.genre || '',
        director: currentMovie.director || '',
        producer: currentMovie.producer || '',
        originalLanguage: currentMovie.originalLanguage || '',
        releaseDate: currentMovie.releaseDate || new Date().getFullYear(),
        rating: currentMovie.rating || 8.0,
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData);
      setImagePreview(
        currentMovie.movieImage
          ? `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${currentMovie.movieImage}`
          : null,
      );
    }
  }, [currentMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle year input - only allow numbers and validate range
    if (name === 'releaseDate') {
      // Only allow numeric input
      if (value && !/^\d+$/.test(value)) {
        return;
      }
      // Limit to 4 digits max
      if (value.length > 4) {
        return;
      }
      // Block years greater than current year
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (value.length === 4 && year > currentYear) {
        setYearWarning(`Year cannot be greater than ${currentYear}`);
        setTimeout(() => setYearWarning(''), 2000);
        return;
      }
      setYearWarning('');
      setFormData({
        ...formData,
        releaseDate: value ? parseInt(value) : '',
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value,
    });
  };

  const hasChanges = () => {
    if (!isEditMode) return true; // Add mode always allows submit
    if (imageFile) return true; // New image selected
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
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
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      errors.description = 'Description must be at least 50 characters';
    }
    if (!formData.director.trim()) errors.director = 'Director is required';
    if (!formData.producer.trim()) errors.producer = 'Producer is required';
    if (!formData.originalLanguage.trim()) errors.originalLanguage = 'Language is required';
    if (!formData.releaseDate) {
      errors.releaseDate = 'Release year is required';
    } else if (formData.releaseDate < 1800 || formData.releaseDate > new Date().getFullYear()) {
      errors.releaseDate = `Release year must be between 1800 and ${new Date().getFullYear()}`;
    }
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      errors.rating = 'Rating must be between 0 and 10';
    }
    if (!isEditMode && !imageFile) errors.image = 'Movie poster is required';

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

      if (isEditMode) {
        const targetId = currentMovie?.movieId || editId;
        
        // Delete old image if new image is being uploaded
        if (imageFile && currentMovie?.movieImage) {
          try {
            await axiosInstance.delete(`/movies/delete-image/${targetId}`);
          } catch (err) {
            console.error('Failed to delete old image:', err);
          }
        }
        
        await axiosInstance.put(`/movies/update/${targetId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Movie updated successfully!');
        // Force refetch of all movies immediately
        await queryClient.refetchQueries({ queryKey: ['allMovies'] });
        if (currentMovie?.movieId) {
          await queryClient.refetchQueries({ queryKey: ['movieById', currentMovie.movieId] });
        }
      } else {
        await axiosInstance.post('/movies/create', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('Movie added successfully!');
        await queryClient.refetchQueries({ queryKey: ['allMovies'] });
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
    navigate('/admin/movies');
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
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-10">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-sm font-semibold rounded hover:opacity-90"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            &lt; Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left side */}
          <div className="lg:col-span-2">
            <div className="rounded-xl shadow-sm p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {isEditMode ? 'Edit Movie' : 'Add New Movie'}
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Fields marked with <span style={{ color: '#ef4444' }}>*</span> are required
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--border-color)', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title and Genre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter movie description or synopsis (minimum 50 characters)"
                    className={inputClass(fieldErrors.description)}
                    style={inputStyle(fieldErrors.description)}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {fieldErrors.description && (
                      <p className="text-xs" style={{ color: '#ef4444' }}>{fieldErrors.description}</p>
                    )}
                    <p className={`text-xs ml-auto ${formData.description.length < 50 ? 'text-orange-500' : 'text-green-600'}`}>
                      {formData.description.length}/50 characters
                    </p>
                  </div>
                </div>

                {/* Director and Producer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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

                {/* Release Year and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Release Year <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleChange}
                      placeholder="e.g., 2024"
                      maxLength="4"
                      className={inputClass(fieldErrors.releaseDate)}
                      style={inputStyle(fieldErrors.releaseDate)}
                    />
                    {fieldErrors.releaseDate && (
                      <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.releaseDate}</p>
                    )}
                    {yearWarning && (
                      <p className="text-xs mt-1 text-orange-500 font-semibold animate-pulse">{yearWarning}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    type="submit"
                    disabled={loading || prefillLoading || (isEditMode && !hasChanges())}
                    className="flex-1 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-all"
                    style={{ backgroundColor: 'var(--accent-color)' }}
                    title={isEditMode && !hasChanges() ? 'No changes made' : ''}
                  >
                    {loading || prefillLoading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update Movie' : 'Add Movie'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 rounded-lg font-semibold transition-all"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.75rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Upload and Preview - Right side */}
          <div className="lg:col-span-1">
            <div className="rounded-xl shadow-sm p-6 sticky top-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Movie Poster
              </h2>

              <div className="space-y-4">
                {/* Hidden File Input - Always in DOM */}
                <input
                  id="imageInput"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* File Upload - Only show if no image selected */}
                {!imagePreview && (
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Upload Image <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Max 5MB (JPG, PNG)</p>
                    <div
                      className="relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer hover:border-opacity-100"
                      style={{
                        borderColor: fieldErrors.image ? '#ef4444' : 'var(--border-color)',
                        backgroundColor: 'var(--bg-secondary)',
                        opacity: fieldErrors.image ? 0.9 : 1
                      }}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div>
                        <svg
                          className="mx-auto h-8 w-8 mb-2"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 20M33 13h.01M17 33h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {imageFile ? imageFile.name : 'Click or drag image'}
                        </p>
                        {imageFile && (
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    {fieldErrors.image && (
                      <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{fieldErrors.image}</p>
                    )}
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Preview:</p>
                    <div
                      className="relative rounded-lg overflow-hidden border group cursor-pointer"
                      style={{ borderColor: 'var(--border-color)' }}
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                        style={{ maxHeight: '400px' }}
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-center">
                          <FaEdit className="mx-auto text-white mb-2" size={24} />
                          <p className="text-white text-sm font-semibold">Click to change image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!imagePreview && (
                  <div
                    className="rounded-lg p-6 text-center"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px dashed var(--border-color)'
                    }}
                  >
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Image preview will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
