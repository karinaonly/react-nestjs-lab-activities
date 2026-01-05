import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import AdminMovieCard from '../components/AdminMovieCard';
import { useAllMovies } from '../hooks/useMovieDetail';
import { useQueryClient } from '@tanstack/react-query';
import { FaFilm } from 'react-icons/fa';

function AdminMoviesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allMovies, isLoading, isError } = useAllMovies();
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleMovieDeleted = (movieId) => {
    setDeletedIds(new Set([...deletedIds, movieId]));
    queryClient.invalidateQueries({ queryKey: ['allMovies'] });
  };

  const visibleMovies = useMemo(() => {
    const filtered = allMovies?.filter(m => !deletedIds.has(m.movieId)) || [];
    
    if (!searchTerm.trim()) return filtered;
    
    const q = searchTerm.toLowerCase();
    return filtered.filter((m) =>
      m.title?.toLowerCase().includes(q) || 
      m.genre?.toLowerCase().includes(q) ||
      m.director?.toLowerCase().includes(q)
    );
  }, [allMovies, deletedIds, searchTerm]);

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

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Nav 
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search movies..."
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with Add Movie CTA */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFilm size={32} style={{ color: 'var(--accent-color)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Movie Management</h1>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{visibleMovies.length} {visibleMovies.length === 1 ? 'movie' : 'movies'} in catalog</p>
          <button
            onClick={() => navigate('/admin/movies/add')}
            className="px-6 py-3 text-white rounded-lg font-semibold active:scale-95 transition-all"
            style={{ backgroundColor: 'var(--accent-color)' }}
          >
            + Add Movie
          </button>
        </div>

        {/* Movies Grid */}
        {visibleMovies.length === 0 ? (
          <div className="text-center py-16 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <p className="text-lg mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>No movies yet</p>
            <button
              onClick={() => navigate('/admin/movies/add')}
              className="px-6 py-3 text-white rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Create your first movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleMovies.map((movie) => (
              <AdminMovieCard
                key={movie.movieId}
                movie={movie}
                onDelete={handleMovieDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(AdminMoviesPage);
