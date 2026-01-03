import React, { useMemo } from 'react';
import Nav from '../components/Nav';
import GenreDropdown from '../components/GenreDropdown';
import SortDropdown from '../components/SortDropdown';
import Movie from '../components/Movie';
import NextPage from '../components/NextPage';
import { useAllMovies } from '../hooks/useMovieDetail';

function MoviesPage() {
  const { data: allMovies, isLoading, isError } = useAllMovies();

  // Memoize the movie list to prevent re-renders
  const movieList = useMemo(() => {
    if (!allMovies || allMovies.length === 0) return null;
    return allMovies.map((movie) => (
      <Movie key={movie.movieId} movie={movie} />
    ));
  }, [allMovies]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading movies...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">Error loading movies.</p>
      </div>
    );
  }
  
  if (!allMovies || allMovies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">No movies found.</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className='moviesContainer'>
        <h3 className="text-base font-semibold m-5">TOP MOVIES IN 2025</h3>
        <div className='filterContainer flex gap-4 m-7'>
          <GenreDropdown />
          <SortDropdown />
        </div>
        <div className='grid grid-cols-6 ml-14'>
          {movieList}
        </div>
      </div>
      <NextPage />
    </div>
  );
}

export default React.memo(MoviesPage);