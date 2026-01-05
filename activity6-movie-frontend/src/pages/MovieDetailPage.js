import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import Nav from '../components/Nav';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';
import { useMovieDetail, useMovieById } from '../hooks/useMovieDetail';
import { useAuth } from '../context/AuthContext';
import { 
  getMovieReviews, 
  createReview, 
  deleteReview, 
  updateReview 
} from '../service/reviewsService';

const starValues = [1, 2, 3, 4, 5];
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: movie, isLoading, refetch: refetchMovie } = useMovieById(id);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { infoRef, reviewsRef } = useMovieDetail();

  const syncAllMoviesCache = (updatedMovie) => {
    if (!updatedMovie?.movieId) return;
    queryClient.setQueryData(['allMovies'], (old) => {
      if (!old) return old;
      return old.map((m) => (m.movieId === updatedMovie.movieId ? { ...m, ...updatedMovie } : m));
    });
  };

  // Fetch reviews when component mounts or movie changes
  useEffect(() => {
    if (id) {
      const fetchReviews = async () => {
        try {
          setLoadingReviews(true);
          const data = await getMovieReviews(id);
          setReviews(data);
        } catch (err) {
          console.error('Error loading reviews:', err);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await getMovieReviews(id);
      setReviews(data);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');

    if (userRating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingReview) {
        await updateReview(editingReview.id, {
          rating: userRating,
          comment: userComment,
        });
        setEditingReview(null);
      } else {
        await createReview({
          movieId: parseInt(id),
          rating: userRating,
          comment: userComment,
        });
      }

      setUserRating(0);
      setUserComment('');
      await loadReviews();
      const { data: updatedMovie } = await refetchMovie(); // refresh movie aggregate rating
      syncAllMoviesCache(updatedMovie); // keep list page in sync without waiting for refetch
      await queryClient.invalidateQueries({ queryKey: ['allMovies'] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteReview = async () => {
    try {
      await deleteReview(reviewToDelete);
      await loadReviews();
      const { data: updatedMovie } = await refetchMovie(); // refresh movie aggregate rating
      syncAllMoviesCache(updatedMovie); // keep list page in sync without waiting for refetch
      await queryClient.invalidateQueries({ queryKey: ['allMovies'] });
      setShowDeleteConfirm(false);
      setReviewToDelete(null);
    } catch (err) {
      setShowDeleteConfirm(false);
      setReviewToDelete(null);
      setShowDeleteAlert(true);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setUserRating(review.rating);
    setUserComment(review.comment || '');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setUserRating(0);
    setUserComment('');
    setError('');
  };

  const userReview = reviews.find(r => r.userId === user?.id);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <Nav />
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <Nav />
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Movie not found.</p>
          <button
            className="mt-4 px-4 py-2 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent-color)' }}
            onClick={() => navigate('/movies')}
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '2.5rem' }}>
      <Nav />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          className="mb-4 px-4 py-2 rounded border text-sm font-semibold"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          onClick={() => navigate('/movies')}
        >
          &lt; Back
        </button>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <img
              src={`${API_URL}${movie.movieImage}`}
              alt={movie.title}
              loading="lazy"
              className="w-full h-[260px] object-cover rounded-lg border"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          <div className="col-span-9 rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{movie.title}</h1>
            
            <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              <FaStar className="text-[#f0b90b]" />
              <span>
                {movie.averageRating > 0 
                  ? movie.averageRating.toFixed(1) 
                  : 'No ratings yet'}
              </span>
              {movie.totalReviews > 0 && (
                <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                  ({movie.totalReviews} {movie.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>

            <div className="flex gap-3 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.releaseDate}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Synopsis</h3>
              <p className="text-xs leading-5" style={{ color: 'var(--text-muted)' }}>
                {movie.description}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Movie Info</h2>

        <div
          ref={infoRef}
          className="bg-white border rounded-lg mt-3 divide-y text-sm"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          <DetailRow label="Producer" value={movie.producer} />
          <DetailRow label="Director" value={movie.director} />
          <DetailRow label="Genre" value={movie.genre} />
          <DetailRow label="Original Language" value={movie.originalLanguage} />
        </div>

        <div ref={reviewsRef} className="mt-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Audience Reviews</h2>

          {loadingReviews ? (
            <div className="border rounded-lg p-6 text-center text-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={user?.id}
                  isAdmin={user?.role === 'admin'}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 text-center text-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>

        <div className="border rounded-lg mt-8 p-6 max-w-2xl mx-auto" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          {!isLoggedIn ? (
            <div className="text-center">
              <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Login to rate this movie</p>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-white rounded"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Go to Login
              </button>
            </div>
          ) : user?.role === 'admin' ? (
            <div className="text-center space-y-3">
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Admins manage movies instead of rating them.</p>
              <button
                onClick={() => navigate('/admin/movies/add', { state: { mode: 'edit', movie } })}
                className="px-5 py-2 text-white rounded"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Edit Movie Details
              </button>
            </div>
          ) : userReview && !editingReview ? (
            <div className="text-center">
              <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>You have already reviewed this movie</p>
              <button
                onClick={() => handleEditReview(userReview)}
                className="px-5 py-2 text-white rounded"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                Edit Your Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {editingReview ? 'Edit Your Review' : 'Rate this Movie'}
              </h3>

              {error && (
                <div className="mb-4 p-3 rounded text-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-color)' }}>
                  {error}
                </div>
              )}

              <div className="flex gap-2 mt-3 text-2xl">
                {starValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUserRating(value)}
                    className="hover:scale-110 transition-transform"
                  >
                    <FaStar
                      className={
                        value <= userRating
                          ? 'text-[#f0b90b]'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border rounded p-3 text-sm mt-4 focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                rows="4"
                placeholder="Write your review... (optional)"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  {submitting 
                    ? 'Submitting...' 
                    : editingReview 
                      ? 'Update Review' 
                      : 'Post Review'
                  }
                </button>
                
                {editingReview && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 rounded"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setReviewToDelete(null);
        }}
        onConfirm={confirmDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
        variant="danger"
      />

      <AlertDialog
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        title="Delete Failed"
        message="Failed to delete review. Please try again."
        variant="error"
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 px-4 py-3" style={{ color: 'var(--text-muted)' }}>
      <span className="text-xs">{label}</span>
      <span className="col-span-2 text-xs" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function ReviewCard({ review, currentUserId, isAdmin, onEdit, onDelete }) {
  const canModify = currentUserId === review.userId || isAdmin;
  const isOwner = currentUserId === review.userId;

  return (
    <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {review.user?.username || review.user?.email || 'Anonymous'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1 text-[#f0b90b]">
            {starValues.map((v) => (
              <FaStar
                key={v}
                className={v <= review.rating ? 'text-[#f0b90b]' : 'text-gray-300'}
              />
            ))}
          </div>
          
          {canModify && (
            <div className="flex gap-2 ml-2">
              {isOwner && (
                <button
                  onClick={() => onEdit(review)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit review"
                >
                  <FaEdit />
                </button>
              )}
              <button
                onClick={() => onDelete(review.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete review"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {review.comment && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{review.comment}</p>
      )}
    </div>
  );
}

export default React.memo(MovieDetailPage);
