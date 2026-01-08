import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../service/axiosInstance';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';

function AdminMovieCard({ movie, onDelete }) {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/movies/edit/${movie.movieId}`, { state: { mode: 'edit', movie } });
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/movies/delete/${movie.movieId}`);
      onDelete(movie.movieId);
      setShowConfirm(false);
    } catch (err) {
      setShowConfirm(false);
      setShowAlert(true);
    }
  };

  return (
    <div className="group rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-200" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      {/* Poster with Overlay */}
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={`${API_URL}${movie.movieImage}`}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
          loading="lazy"
        />
        {/* Quick Action Buttons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <button
            onClick={handleEdit}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-primary)' }}>{movie.title}</h3>

        {/* Meta Info */}
        <div className="space-y-2 text-xs mb-3">
          <div className="flex items-center gap-1">
            <FaStar className="text-[#f0b90b]" />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {movie.averageRating > 0 ? movie.averageRating.toFixed(1) : 'No'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>({movie.totalReviews})</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>{movie.genre} • {movie.releaseDate}</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Movie"
        message={`Delete "${movie.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <AlertDialog
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Delete Failed"
        message="Failed to delete movie. Please try again."
        variant="error"
      />
    </div>
  );
}

export default React.memo(AdminMovieCard);
