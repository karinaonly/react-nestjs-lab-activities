import React, { memo, useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import profileLogo from '../assets/profileicon.png'
import { FiSearch } from 'react-icons/fi'

function Nav() {
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }, [logout, navigate])

  const handleLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  return (
    <div className="flex items-center justify-between bg-[#FAFBFC] border border-[#D1D9E0] px-4 py-2">
      
      {/* LOGO (Link is faster than navigate) */}
      <Link
        to="/movies"
        className="ml-1 text-base font-semibold hover:text-[#2FBB73]"
      >
        Movies Website
      </Link>

      <div className="flex items-center justify-between w-[85%] gap-4">
        
        {/* SEARCH (no logic = cheap render) */}
        <div className="relative flex items-center">
          <FiSearch className="absolute left-[25px] text-[#666] text-[16px]" />
          <input
            className="ml-5 pr-[10px] pl-[30px] h-[35px] text-sm rounded-[5px] border border-[#D1D9E0] outline-none w-[300px]"
            placeholder="Search Movies..."
          />
        </div>

        <div className="flex items-center mr-[30px] gap-4">
          
          {/* ADMIN BUTTONS */}
          {isAdmin && (
            <>
              <Link
                to="/admin/movies/add"
                className="px-3 py-1 text-sm font-semibold text-white bg-[#2FBB73] rounded hover:bg-[#28a966]"
              >
                + Add Movie
              </Link>
              <Link
                to="/admin/users"
                className="px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Manage Users
              </Link>
            </>
          )}

          {/* USER */}
          {user ? (
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
                <h3 className="text-base font-semibold">
                  {user.username || user.email}
                </h3>
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-center cursor-pointer"
              onClick={handleLogin}
            >
              <img className="w-[20px] mr-[10px]" src={profileLogo} alt="profile-logo" />
              <h3 className="text-base font-semibold">Login</h3>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default memo(Nav)
