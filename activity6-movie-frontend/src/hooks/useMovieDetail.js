import { useEffect, useRef, useState } from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { moviesService } from '../service/moviesService';

/* ============================
   MOVIE DETAIL UI LOGIC HOOK
============================ */
export const useMovieDetail = () => {
  const [userRating, setUserRating] = useState(4);
  const [userReview, setUserReview] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const infoRef = useRef(null);
  const reviewsRef = useRef(null);
  const carouselRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const target = tab === 'info' ? infoRef.current : reviewsRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrevReview = () => {
    carouselRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const handleNextReview = () => {
    carouselRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  // ⚡ Optimized IntersectionObserver (run ONCE)
  useEffect(() => {
    const infoEl = infoRef.current;
    const reviewsEl = reviewsRef.current;
    if (!infoEl || !reviewsEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.dataset.section;
          setActiveTab(prev => (prev !== id ? id : prev));
        }
      },
      { threshold: [0.25, 0.35, 0.5] }
    );

    infoEl.dataset.section = 'info';
    reviewsEl.dataset.section = 'reviews';

    observer.observe(infoEl);
    observer.observe(reviewsEl);

    return () => observer.disconnect();
  }, []);

  return {
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
  };
};

/* ============================
   ALL MOVIES (LANDING PAGE)
============================ */
export const useAllMovies = () => {
  return useQuery({
    queryKey: ['allMovies'],
    queryFn: moviesService.getAllMovies,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/* ============================
   SINGLE MOVIE (DETAIL PAGE)
============================ */
export const useMovieById = (id) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.getMovieById(id),
    enabled: !!id,

    // 🚀 INSTANT PAGE LOAD (cache reuse)
    initialData: () => {
      const movies = queryClient.getQueryData(['allMovies']);
      return movies?.find(movie => movie.id === id);
    },
  });
};

export const useCreateMovie = () => {
  return useQuery({
    queryKey: ['createMovie'],
    queryFn: moviesService.createMovie,
  });
}

export const useEditMovie = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.updateMovie(id),
    enabled: !!id,
  });
}

/* ============================
   PREFETCH HELPER (OPTIONAL)
============================ */
export const usePrefetchMovie = () => {
  const queryClient = useQueryClient();

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: ['movie', id],
      queryFn: () => moviesService.getMovieById(id)
    });
  };
};
