import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

function GenreDropdown({ selectedGenre = 'GENRE', onSelect }) {
    const [genreOpen, setGenreOpen] = useState(false)
      const genreOptions = [
        'All', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
        'Documentary', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History',
        'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
        'Thriller', 'War', 'Western'
    ]

    const handleGenreSelect = (option) => {
        if (onSelect) onSelect(option)
        setGenreOpen(false)
    }

    return (
        <div className='relative inline-block'>
            <button 
                className='px-5 py-2 border rounded-md cursor-pointer text-sm font-medium transition-all duration-300 min-w-[140px] text-left flex items-center justify-between gap-2 shadow-sm'
                style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)' 
                }}
                onClick={() => setGenreOpen(!genreOpen)}
            >
                <span className="truncate">{selectedGenre === 'All' ? 'All Genres' : selectedGenre}</span>
                <FiChevronDown className={`transition-transform duration-300 text-base flex-shrink-0 ${genreOpen ? 'rotate-180' : ''}`} />
            </button>

            {genreOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setGenreOpen(false)}></div>
                    
                    <div 
                        className='absolute top-full left-0 mt-1 border rounded-lg shadow-xl z-20 w-[320px] p-2' 
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    >
                        <div className="grid grid-cols-2 gap-1 overflow-y-auto max-h-[350px] scrollbar-hide">
                            {genreOptions.map((option) => (
                                <div 
                                    key={option}
                                    className={`px-3 py-2 cursor-pointer text-xs rounded-md transition-all duration-200 flex items-center ${
                                        selectedGenre === option 
                                        ? 'font-bold' 
                                        : 'hover:bg-[var(--bg-secondary)]'
                                    }`}
                                    style={{ 
                                        color: selectedGenre === option ? 'var(--accent-color)' : 'var(--text-primary)',
                                        backgroundColor: selectedGenre === option ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent' 
                                    }}
                                    onClick={() => handleGenreSelect(option)}
                                >
                                    {option}
                                    {selectedGenre === option && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default GenreDropdown