import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import AdminMovieCard from '../components/AdminMovieCard';
import { useAllMovies } from '../hooks/useMovieDetail';
import { useQueryClient } from '@tanstack/react-query';
import { FaFilm } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

function AdminMoviesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allMovies, isLoading, isError } = useAllMovies();
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const handleMovieDeleted = (movieId) => {
    setDeletedIds(new Set([...deletedIds, movieId]));
    queryClient.invalidateQueries({ queryKey: ['allMovies'] });
  };

  const visibleMovies = useMemo(() => {
    const filtered = allMovies?.filter((m) => !deletedIds.has(m.movieId)) || [];

    const q = searchTerm.trim().toLowerCase();

    return filtered.filter((m) => {
      const matchesSearch = !q ||
        m.title?.toLowerCase().includes(q) ||
        m.genre?.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q);

      const matchesGenre = genreFilter === 'all' || m.genre?.toLowerCase() === genreFilter;
      const matchesLanguage = languageFilter === 'all' || m.originalLanguage?.toLowerCase() === languageFilter;
      const matchesYear = yearFilter === 'all' || String(m.releaseDate) === yearFilter;

      return matchesSearch && matchesGenre && matchesLanguage && matchesYear;
    });
  }, [allMovies, deletedIds, searchTerm, genreFilter, languageFilter, yearFilter]);

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
      <Nav />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with Add Movie CTA */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <FaFilm size={32} style={{ color: 'var(--accent-color)' }} />
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Movie Management</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{visibleMovies.length} {visibleMovies.length === 1 ? 'movie' : 'movies'} in catalog</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/movies/add')}
              className="px-6 py-3 text-white rounded-lg font-semibold active:scale-95 transition-all"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              + Add Movie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full border rounded-lg p-3 pl-10 text-sm bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
              </div>
            </div>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value.toLowerCase())}
              className="border rounded-lg p-3 text-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Genres</option>
              {Array.from(new Set((allMovies || []).map((m) => m.genre?.toLowerCase()).filter(Boolean))).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value.toLowerCase())}
              className="border rounded-lg p-3 text-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Languages</option>
              {Array.from(new Set((allMovies || []).map((m) => m.originalLanguage?.toLowerCase()).filter(Boolean))).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded-lg p-3 text-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Years</option>
              {Array.from(new Set((allMovies || []).map((m) => m.releaseDate).filter(Boolean))).sort((a, b) => b - a).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
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
