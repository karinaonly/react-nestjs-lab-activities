import React from 'react'
import profileLogo from '../assets/profileicon.png'
import { FiSearch } from 'react-icons/fi' 

function Nav() {
    return (
    <div className="flex items-center justify-between bg-[#FAFBFC] border border-[#D1D9E0] px-4 py-2">
      <h1 className="ml-1 text-base font-semibold">Movies Website</h1>
      <div className="flex items-center justify-between w-[85%] gap-4">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-[25px] text-[#666] text-[16px] pointer-events-none" />
          <input className="ml-5 pr-[10px] pl-[30px] h-[35px] text-sm placeholder:text-[#666] rounded-[5px] border border-[#D1D9E0] outline-none focus:ring-1 focus:ring-[#D1D9E0] w-[300px]" type="text" placeholder='Search Movies...' />
        </div>
        <div className="flex items-center mr-[30px] text-sm">
          <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
          <h3 className='text-base font-semibold'>Login</h3>
        </div>
      </div>
    </div>
    )
}

export default Nav