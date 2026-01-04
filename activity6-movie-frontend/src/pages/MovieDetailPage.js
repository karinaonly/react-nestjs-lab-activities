import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import Nav from '../components/Nav';
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

  const { data: movie, isLoading } = useMovieById(id);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { infoRef, reviewsRef } = useMovieDetail();

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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      await loadReviews();
    } catch (err) {
      alert('Failed to delete review');
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
      <div className="min-h-screen bg-[#F5F7FA]">
        <Nav />
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Nav />
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-lg font-semibold">Movie not found.</p>
          <button
            className="mt-4 px-4 py-2 rounded bg-[#2FBB73] text-white text-sm font-semibold"
            onClick={() => navigate('/movies')}
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-10">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <button
          className="mb-4 px-4 py-2 rounded border bg-white text-sm font-semibold"
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
            />
          </div>

          <div className="col-span-9 bg-white rounded-lg border p-4">
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FaStar className="text-[#f0b90b]" />
              <span>
                {movie.averageRating > 0 
                  ? movie.averageRating.toFixed(1) 
                  : 'No ratings yet'}
              </span>
              {movie.totalReviews > 0 && (
                <span className="text-sm text-gray-500 font-normal">
                  ({movie.totalReviews} {movie.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>

            <div className="flex gap-3 text-xs text-gray-500 mt-2">
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.releaseDate}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-1">Synopsis</h3>
              <p className="text-xs text-gray-600 leading-5">
                {movie.description}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-base font-semibold">Movie Info</h2>

        <div
          ref={infoRef}
          className="bg-white border rounded-lg mt-3 divide-y text-sm text-gray-600"
        >
          <DetailRow label="Producer" value={movie.producer} />
          <DetailRow label="Director" value={movie.director} />
          <DetailRow label="Genre" value={movie.genre} />
          <DetailRow label="Original Language" value={movie.originalLanguage} />
        </div>

        <div ref={reviewsRef} className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Audience Reviews</h2>

          {loadingReviews ? (
            <div className="bg-white border rounded-lg p-6 text-center text-sm text-gray-500">
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
            <div className="bg-white border rounded-lg p-6 text-center text-sm text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg mt-8 p-6 max-w-2xl mx-auto">
          {!isLoggedIn ? (
            <div className="text-center">
              <p className="font-semibold mb-3">Login to rate this movie</p>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 bg-[#2FBB73] text-white rounded hover:bg-[#27a365]"
              >
                Go to Login
              </button>
            </div>
          ) : userReview && !editingReview ? (
            <div className="text-center">
              <p className="font-semibold mb-3">You have already reviewed this movie</p>
              <button
                onClick={() => handleEditReview(userReview)}
                className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Your Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <h3 className="font-semibold mb-3">
                {editingReview ? 'Edit Your Review' : 'Rate this Movie'}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
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
                className="w-full border rounded p-3 text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-[#2FBB73]"
                rows="4"
                placeholder="Write your review... (optional)"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#2FBB73] text-white rounded hover:bg-[#27a365] disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 px-4 py-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="col-span-2 text-xs">{value}</span>
    </div>
  );
}

function ReviewCard({ review, currentUserId, isAdmin, onEdit, onDelete }) {
  const canModify = currentUserId === review.userId || isAdmin;
  const isOwner = currentUserId === review.userId;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-sm">
            {review.user?.username || review.user?.email || 'Anonymous'}
          </p>
          <p className="text-xs text-gray-500">
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
        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

export default React.memo(MovieDetailPage);
