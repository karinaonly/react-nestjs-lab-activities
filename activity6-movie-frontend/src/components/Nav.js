import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import profileLogo from '../assets/profileicon.png'
import { FiSearch } from 'react-icons/fi' 

function Nav() {
    const navigate = useNavigate()
    const { user, logout, isAdmin } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
    <div className="flex items-center justify-between bg-[#FAFBFC] border border-[#D1D9E0] px-4 py-2">
      <h1 className="ml-1 text-base font-semibold cursor-pointer hover:text-[#2FBB73]" onClick={() => navigate('/movies')}>
        Movies Website
      </h1>
      <div className="flex items-center justify-between w-[85%] gap-4">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-[25px] text-[#666] text-[16px] pointer-events-none" />
          <input className="ml-5 pr-[10px] pl-[30px] h-[35px] text-sm placeholder:text-[#666] rounded-[5px] border border-[#D1D9E0] outline-none focus:ring-1 focus:ring-[#D1D9E0] w-[300px]" type="text" placeholder='Search Movies...' />
        </div>
        <div className="flex items-center mr-[30px] gap-4">
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin/movies/add')}
              className="px-3 py-1 text-sm font-semibold text-white bg-[#2FBB73] rounded hover:bg-[#28a966]"
            >
              + Add Movie
            </button>
          )}
          <div className="flex items-center cursor-pointer" onClick={user ? handleLogout : () => navigate('/login')}>
            <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
            <h3 className='text-base font-semibold'>
              {user ? `${user.username || user.email}` : 'Login'}
            </h3>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Nav