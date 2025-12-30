import React from 'react';
import Nav from '../components/Nav';
import GenreDropdown from '../components/GenreDropdown';
import SortDropdown from '../components/SortDropdown';
import Movie from '../components/Movie';
import NextPage from '../components/NextPage';
import { movies } from '../data/movies';

function MoviesPage() {
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
          {movies.map((movie) => (
            <Movie key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <NextPage />
    </div>
  );
}

export default MoviesPage;