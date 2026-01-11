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
                className='px-5 py-2 border rounded-md cursor-pointer text-sm font-medium transition-all duration-300 min-w-[140px] text-left flex items-center justify-between gap-2 shadow-sm'
                style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)' 
                }}
                onClick={() => setSortOpen(!sortOpen)}
            >
                <span className="truncate">{selectedSort === 'SORT' ? 'Sort By' : selectedSort}</span>
                <FiChevronDown className={`transition-transform duration-300 text-base flex-shrink-0 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)}></div>
                    
                    <div 
                        className='absolute top-full left-0 mt-1 border rounded-lg shadow-xl z-20 w-[180px] p-2' 
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    >
                        <div className="flex flex-col gap-1">
                            {sortOptions.map((option) => (
                                <div 
                                    key={option}
                                    className={`px-3 py-2 cursor-pointer text-xs rounded-md transition-all duration-200 flex items-center ${
                                        selectedSort === option 
                                        ? 'font-bold' 
                                        : 'hover:bg-[var(--bg-secondary)]'
                                    }`}
                                    style={{ 
                                        color: selectedSort === option ? 'var(--accent-color)' : 'var(--text-primary)',
                                        backgroundColor: selectedSort === option ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent' 
                                    }}
                                    onClick={() => handleSortSelect(option)}
                                >
                                    {option}
                                    {selectedSort === option && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SortDropdown