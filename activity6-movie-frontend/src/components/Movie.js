import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import moviePic from '../assets/st.jpg';

function Movie({ movie }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const poster = movie.movieImage ? `${API_URL}${movie.movieImage}` : moviePic;

  return (
    <Link
      to={`/movies/${movie.movieId}`}
      className='m-5 border border-[#D1D9E0] bg-[#FAFBFC] cursor-pointer rounded-lg p-3 w-fit flex flex-col items-center hover:shadow-sm'
    >
      <img 
        className="w-40 h-48 rounded-lg shadow-lg object-cover" 
        src={poster} 
        alt={`${movie.title} poster`}
        loading="lazy"
      />
      <div className='flex items-center mt-2 gap-2'>
        <FaStar className='text-[#f0b90b]' />
        <h3 className='text-sm font-medium mt-1'>
          {movie.averageRating > 0 
            ? movie.averageRating.toFixed(1) 
            : 'No ratings'}
        </h3>
        {movie.totalReviews > 0 && (
          <span className='text-xs text-gray-500'>
            ({movie.totalReviews})
          </span>
        )}
      </div>
      <h3 className='text-sm font-semibold mt-1 text-center'>{movie.title}</h3>
    </Link>
  );
}

export default React.memo(Movie);