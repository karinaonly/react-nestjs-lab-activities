import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Nav from '../components/Nav';
import { movies } from '../data/movies';

const starValues = [1, 2, 3, 4, 5];

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = useMemo(() => movies.find((item) => item.id === id), [id]);
  const [userRating, setUserRating] = useState(4);
  const [userReview, setUserReview] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const infoRef = useRef(null);
  const reviewsRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const target = tab === 'info' ? infoRef.current : reviewsRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const infoEl = infoRef.current;
    const reviewsEl = reviewsRef.current;
    if (!infoEl || !reviewsEl) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.dataset.section;
          if (id && id !== activeTab) {
            setActiveTab(id);
          }
        }
      },
      {
        root: null,
        threshold: [0.25, 0.35, 0.5],
      }
    );

    infoEl.dataset.section = 'info';
    reviewsEl.dataset.section = 'reviews';
    observer.observe(infoEl);
    observer.observe(reviewsEl);

    return () => observer.disconnect();
  }, [activeTab]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Nav />
        <div className="max-w-5xl mx-auto p-6">
          <p className="text-lg font-semibold">Movie not found.</p>
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
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full h-[260px] object-cover rounded-lg shadow-sm border border-[#D1D9E0]"
            />
          </div>
          <div className="col-span-9 bg-white rounded-lg shadow-sm border border-[#D1D9E0] p-4">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <FaStar className="text-[#f0b90b]" />
              <span>{movie.rating} Rating</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-5 mt-3">
              {movie.story}
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-base font-semibold">Movie Info</h2>

        {/* Movie info card */}
        <div ref={infoRef} className="bg-white border border-[#D1D9E0] rounded-lg mt-4 overflow-hidden">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="text-base font-semibold">Synopsis</h2>
            <p className="text-xs text-[#6B7280] leading-5 mt-2">{movie.synopsis}</p>
          </div>
          <div className="divide-y divide-[#E5E7EB] text-sm text-[#6B7280]">
            <DetailRow label="Producer" value={movie.producer} />
            <DetailRow label="Screenwriter" value={movie.screenplay} />
            <DetailRow label="Genre" value={movie.genre} />
            <DetailRow label="Original Language" value={movie.originalLanguage} />
            <DetailRow label="Runtime" value={movie.runtime} />
          </div>
        </div>

        {/* Audience reviews */}
        <div ref={reviewsRef} className="mt-8">
          <h2 className="text-sm font-semibold mb-4">Audience Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {movie.audienceReviews.map((review) => (
              <ReviewCard key={review.id} rating={review.rating} body={review.body} />
            ))}
          </div>
        </div>

        {/* Rating form */}
        <div className="bg-white border border-[#D1D9E0] rounded-lg mt-8 p-6 max-w-2xl mx-auto shadow-sm">
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

export default MovieDetailPage;
