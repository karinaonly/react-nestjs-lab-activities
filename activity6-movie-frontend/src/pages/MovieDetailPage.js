import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import Nav from '../components/Nav';
import { useMovieDetail, useMovieById, useAllMovies } from '../hooks/useMovieDetail';
import { useAuth } from '../context/AuthContext';

const starValues = [1, 2, 3, 4, 5];
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { data: movie, isLoading, error } = useMovieById(id);
  
  // Prefetch all movies list for instant back navigation
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['allMovies'],
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);
  
  const {
    userRating,
    setUserRating,
    userReview,
    setUserReview,
    activeTab,
    infoRef,
    reviewsRef,
    carouselRef,
    handleTabClick,
    handlePrevReview,
    handleNextReview,
  } = useMovieDetail();

  // Inject scrollbar styles only once
  useEffect(() => {
    const styles = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .carousel-smooth {
        scroll-behavior: smooth;
        scroll-padding: 0;
      }
      .carousel-smooth * {
        scroll-behavior: smooth;
      }
    `;

    if (!document.head.querySelector('style[data-carousel]')) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      styleSheet.setAttribute('data-carousel', 'true');
      document.head.appendChild(styleSheet);
    }
  }, []);

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
          <p className="text-lg font-semibold">{isLoading ? 'Loading...' : 'Movie not found.'}</p>
          <button
            className="mt-4 px-4 py-2 rounded bg-[#2FBB73] text-white text-sm font-semibold hover:bg-[#28a966]"
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
        <div className="mb-4">
          <button
            className="px-4 py-2 rounded border border-[#D1D9E0] bg-white text-sm font-semibold text-[#4B5563] hover:bg-[#E5E7EB]"
            onClick={() => navigate(-1)}
          >
            &lt; Back
          </button>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <img
              src={`${API_URL}${movie.movieImage}`}
              alt={`${movie.title} poster`}
              className="w-full h-[260px] object-cover rounded-lg shadow-sm border border-[#D1D9E0]"
              loading="eager"
            />
          </div>
          <div className="col-span-9 bg-white rounded-lg shadow-sm border border-[#D1D9E0] p-4">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <FaStar className="text-[#f0b90b]" />
              <span>{movie.rating} Rating</span>
            </div>
            <div className="flex gap-4 text-xs text-[#6B7280] mt-2">
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.releaseDate}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Synopsis</h3>
              <p className="text-xs text-[#6B7280] leading-5">
                {movie.description}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-5 text-base font-semibold">Movie Info</h2>

        {/* Movie info card */}
        <div ref={infoRef} className="bg-white border border-[#D1D9E0] rounded-lg mt-4 overflow-hidden">
          <div className="divide-y divide-[#E5E7EB] text-sm text-[#6B7280]">
            <DetailRow label="Producer" value={movie.producer} />
            <DetailRow label="Director" value={movie.director} />
            <DetailRow label="Genre" value={movie.genre} />
            <DetailRow label="Original Language" value={movie.originalLanguage} />
          </div>
        </div>

        {/* Audience reviews */}
        <div ref={reviewsRef} className="mt-8">
          <h2 className="text-sm font-semibold mb-4">Audience Reviews</h2>
          {movie.audienceReviews && movie.audienceReviews.length > 0 ? (
            <div className="relative group">
              {/* Left Arrow */}
              <button
                onClick={handlePrevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-6 p-2 bg-[#2FBB73] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#28a966]"
                aria-label="Previous reviews"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide carousel-smooth"
                style={{ 
                  scrollBehavior: 'smooth'
                }}
              >
                {movie.audienceReviews.map((review) => (
                  <div key={review.id} className="flex-shrink-0 w-72">
                    <ReviewCard rating={review.rating} body={review.body} />
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-6 p-2 bg-[#2FBB73] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#28a966]"
                aria-label="Next reviews"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#D1D9E0] rounded-lg p-8 text-center">
              <p className="text-[#6B7280] text-sm">No reviews yet</p>
              <p className="text-xs text-[#9CA3AF] mt-2">Be the first to share your thoughts about this movie!</p>
            </div>
          )}
        </div>

        {/* Rating form */}
        <div className="bg-white border border-[#D1D9E0] rounded-lg mt-8 p-6 max-w-2xl mx-auto shadow-sm">
          {!isLoggedIn ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-[#4B5563] mb-4">Login to Rate This Movie</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-[#2FBB73] text-white rounded-lg font-semibold hover:bg-[#28a966]"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-semibold">{movie.title}</h3>
              <p className="text-xs text-[#6B7280] mt-1">My Rating</p>

              <div className="mt-4">
                <p className="text-sm font-semibold">What Did You Think Of It?</p>
                <p className="text-xs text-[#6B7280] mt-1">Pick a star rating.</p>
                <div className="mt-3 border border-[#D1D9E0] rounded-lg px-6 py-3 flex flex-col items-center gap-2">
                  <div className="flex gap-2 text-xl text-[#f0b90b]">
                    {starValues.map((value) => (
                      <button
                        key={value}
                        className="focus:outline-none"
                        aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                        onClick={() => setUserRating(value)}
                      >
                        <FaStar className={value <= userRating ? 'text-[#f0b90b]' : 'text-[#D1D5DB]'} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[#6B7280]">What Did You Think Of It?</span>
                </div>
              </div>

              <div className="mt-5">
                <textarea
                  className="w-full border border-[#D1D9E0] rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#2FBB73] focus:outline-none"
                  rows="3"
                  placeholder="Write your review..."
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button className="px-4 py-2 rounded bg-[#2FBB73] text-white text-sm font-semibold hover:bg-[#28a966]">Post Rating</button>
                <button className="px-4 py-2 rounded bg-[#E7F6EE] text-[#2FBB73] text-sm font-semibold border border-[#2FBB73]">
                  Write a Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 px-4 py-3">
      <div className="text-xs text-[#9CA3AF] font-medium">{label}</div>
      <div className="col-span-2 text-xs text-[#4B5563]">{value}</div>
    </div>
  );
}

function ReviewCard({ rating, body }) {
  return (
    <div className="bg-white border border-[#D1D9E0] rounded-lg p-3 text-xs text-[#4B5563] shadow-sm">
      <div className="flex items-center gap-1 text-[#f0b90b] mb-2">
        {starValues.map((value) => (
          <FaStar key={value} className={value <= rating ? 'text-[#f0b90b]' : 'text-[#D1D5DB]'} />
        ))}
      </div>
      <p className="leading-5">{body}</p>
    </div>
  );
}

export default React.memo(MovieDetailPage);
