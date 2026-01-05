import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

function SortDropdown({ selectedSort = 'SORT', onSelect }) {
    const [sortOpen, setSortOpen] = useState(false)
    const sortOptions = ['Rating', 'Release Date', 'Popularity', 'Title']

    const handleSortSelect = (option) => {
        if (onSelect) onSelect(option)
        setSortOpen(false)
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
                onClick={() => setSortOpen(!sortOpen)}
            >
                {selectedSort}
                <FiChevronDown className={`transition-transform duration-300 text-base flex-shrink-0 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
                <div className='absolute top-full left-0 border border-t-0 rounded-b min-w-[120px] shadow-md z-10 overflow-hidden' style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {sortOptions.map((option) => (
                    <div 
                    key={option}
                    className='px-5 py-2.5 cursor-pointer text-sm transition-colors duration-200'
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => handleSortSelect(option)}
                    >
                    {option}
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}

export default SortDropdown