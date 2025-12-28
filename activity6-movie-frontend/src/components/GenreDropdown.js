import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'


function GenreDropdown() {
    const [genreOpen, setGenreOpen] = useState(false)
    const [selectedGenre, setSelectedGenre] = useState('GENRE')
    const genreOptions = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller']

    const handleGenreSelect = (option) => {
        setSelectedGenre(option)
        setGenreOpen(false)
    }

    return (
        <div className='relative inline-block'>
            <button 
                className='px-5 py-2 border border-[#D1D9E0] bg-white rounded cursor-pointer text-sm font-medium text-[#333] transition-all duration-300 min-w-[120px] text-left flex items-center justify-between gap-2 hover:border-[#999] hover:bg-[#f5f5f5] active:border-[#333]' 
                onClick={() => setGenreOpen(!genreOpen)}
            >
                {selectedGenre}
                <FiChevronDown className={`transition-transform duration-300 text-base flex-shrink-0 ${genreOpen ? 'rotate-180' : ''}`} />
            </button>
            {genreOpen && (
                <div className='absolute top-full left-0 bg-white border border-[#D1D9E0] border-t-0 rounded-b min-w-[120px] shadow-md z-10 overflow-hidden'>
                {genreOptions.map((option) => (
                    <div 
                    key={option}
                    className='px-5 py-2.5 cursor-pointer text-[#333] text-sm transition-colors duration-200 hover:bg-[#f0f0f0] hover:text-black active:bg-[#e0e0e0]'
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