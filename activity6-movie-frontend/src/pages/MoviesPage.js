import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import GenreDropdown from '../components/GenreDropdown';
import SortDropdown from '../components/SortDropdown';
import Movie from '../components/Movie';
import NextPage from '../components/NextPage';
import { useAllMovies, usePrefetchMovie } from '../hooks/useMovieDetail';
import { useAuth } from '../context/AuthContext';

function MoviesPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: allMovies, isLoading, isError } = useAllMovies();
  const prefetchMovie = usePrefetchMovie();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedSort, setSelectedSort] = useState('SORT');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/movies', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, selectedSort]);

  const filteredMovies = useMemo(() => {
    if (!allMovies) return [];

    let list = [...allMovies];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((m) =>
        m.title?.toLowerCase().includes(q) || m.genre?.toLowerCase().includes(q)
      );
    }

    if (selectedGenre && selectedGenre !== 'All' && selectedGenre !== 'GENRE') {
      const g = selectedGenre.toLowerCase();
      list = list.filter((m) => m.genre?.toLowerCase().includes(g));
    }

    switch (selectedSort) {
      case 'Rating':
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'Release Date':
        list.sort((a, b) => (b.releaseDate || 0) - (a.releaseDate || 0));
        break;
      case 'Popularity':
        list.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
        break;
      case 'Title':
        list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      default:
        break;
    }

    return list;
  }, [allMovies, searchTerm, selectedGenre, selectedSort]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(start, start + itemsPerPage);
  }, [filteredMovies, currentPage]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Nav
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search movies..."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Loading movies...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-semibold text-red-600">Error loading movies.</p>
        </div>
      ) : (
        <div className="moviesContainer">

          <div className="filterContainer flex gap-4 m-7">
            <GenreDropdown selectedGenre={selectedGenre} onSelect={setSelectedGenre} />
            <SortDropdown selectedSort={selectedSort} onSelect={setSelectedSort} />
          </div>

          {filteredMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No movies found.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-sm underline"
                style={{ color: 'var(--accent-color)' }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              {/* 🔥 Optimized Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-10">
                {paginatedMovies.map((movie) => (
                  <Movie
                    key={movie.movieId}
                    movie={movie}
                    onHover={() => prefetchMovie(movie.movieId)}
                  />
                ))}
              </div>

              <NextPage 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(MoviesPage);
