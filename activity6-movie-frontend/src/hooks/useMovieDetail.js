import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { moviesService } from '../service/moviesService';

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
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevReview = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleNextReview = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
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

export const useAllMovies = () => {
  return useQuery({
    queryKey: ['allMovies'],
    queryFn: moviesService.getAllMovies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes (formerly cacheTime)
  });
};

export const useMovieById = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.getMovieById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10 // 10 minutes (formerly cacheTime)
  });
};


