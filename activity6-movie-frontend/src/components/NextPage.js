import React from 'react'
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";

function NextPage({ currentPage }) {
  return (
    <div className='flex justify-center items-center gap-2 md:gap-4 my-10'>
        {/* First Page - Locked */}
        <button 
          disabled
          className='w-10 h-10 md:w-12 md:h-12 rounded-full border flex justify-center items-center opacity-30 cursor-not-allowed'
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        >
          <MdKeyboardDoubleArrowLeft />
        </button>

        {/* Prev Page - Locked */}
        <button 
          disabled
          className='w-10 h-10 md:w-12 md:h-12 rounded-full border flex justify-center items-center opacity-30 cursor-not-allowed'
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        >
          <IoIosArrowBack />
        </button>

        {/* Current Page Only */}
        <button
          className='w-10 h-10 md:w-12 md:h-12 rounded-full border flex justify-center items-center text-sm md:text-base'
          style={{ 
            borderColor: 'var(--accent-color)', 
            backgroundColor: 'var(--accent-color)', 
            color: '#fff' 
          }}
        >
          {currentPage || 1}
        </button>

        {/* Next Page - Locked */}
        <button 
          disabled
          className='w-10 h-10 md:w-12 md:h-12 rounded-full border flex justify-center items-center opacity-30 cursor-not-allowed'
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        >
          <IoIosArrowForward />
        </button>

        {/* Last Page - Locked */}
        <button 
          disabled
          className='w-10 h-10 md:w-12 md:h-12 rounded-full border flex justify-center items-center opacity-30 cursor-not-allowed'
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        >
          <MdKeyboardDoubleArrowRight />
        </button>
    </div>
  )
}

export default NextPage