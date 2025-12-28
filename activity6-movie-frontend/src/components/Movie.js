import React from 'react'
import moviePic from '../assets/st.jpg'
import { FaStar } from "react-icons/fa";

function Movie() {
  return (
    <div className='m-5 border border-[#D1D9E0] bg-[#FAFBFC] cursor-pointer rounded rounded-lg p-3 w-fit flex flex-col items-center'>
        <img className="w-32 h-48 rounded-lg shadow-lg" src={moviePic} alt="profile-logo" />
        <div className='flex items-center mt-2 gap-2'>
            <FaStar />
            <h3 className='text-sm font-medium mt-1'>8.3</h3>
        </div>
        <h3 className='text-sm font-semibold mt-1'>Strange Things (2016)</h3>
    </div>
  )
}

export default Movie