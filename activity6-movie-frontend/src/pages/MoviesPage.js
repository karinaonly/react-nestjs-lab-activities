import React, { useState } from 'react'
import Nav from '../components/Nav'
import GenreDropdown from '../components/GenreDropdown'
import SortDropdown from '../components/SortDropdown'
import Movie from '../components/Movie'
import NextPage from '../components/NextPage'

function MoviesPage() {
  const movies = [
    { id: 1, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 2, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 3, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 4, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 5, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 6, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 7, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 8, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 9, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 10, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 11, title: 'Strange Things (2016)', rating: '8.3' },
    { id: 12, title: 'Strange Things (2016)', rating: '8.3' },
  ]

  return (
    <div>
      <Nav/>
      <div className='moviesContainer'>
        <h3 className="text-base font-semibold m-5">TOP MOVIES IN 2025</h3>
        <div className='filterContainer flex gap-4 m-7'>
          <GenreDropdown />
          <SortDropdown />
        </div>
        <div className='grid grid-cols-6 px-5'>
          {movies.map((movie) => (
            <Movie key={movie.id} />
          ))}
        </div>
      </div>
      <NextPage />
    </div>
  )
}

export default MoviesPage