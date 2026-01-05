import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

function GenreDropdown({ selectedGenre = 'GENRE', onSelect }) {
    const [genreOpen, setGenreOpen] = useState(false)
    const genreOptions = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller']

    const handleGenreSelect = (option) => {
        if (onSelect) onSelect(option)
        setGenreOpen(false)
    }

    return (
        <div className='relative inline-block'>
            <button 
                className='px-5 py-2 border rounded cursor-pointer text-sm font-medium transition-all duration-300 min-w-[120px] text-left flex items-center justify-between gap-2'
                style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)' 
                }}
                onClick={() => setGenreOpen(!genreOpen)}
            >
                {selectedGenre}
                <FiChevronDown className={`transition-transform duration-300 text-base flex-shrink-0 ${genreOpen ? 'rotate-180' : ''}`} />
            </button>
            {genreOpen && (
                <div className='absolute top-full left-0 border border-t-0 rounded-b min-w-[120px] shadow-md z-10 overflow-hidden' style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {genreOptions.map((option) => (
                    <div 
                    key={option}
                    className='px-5 py-2.5 cursor-pointer text-sm transition-colors duration-200'
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => handleGenreSelect(option)}
                    >
                    {option}
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}

export default GenreDropdown