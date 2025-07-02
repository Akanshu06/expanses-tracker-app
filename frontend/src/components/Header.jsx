import React, { useState } from 'react'
import { LogOut, User, Settings, Crown, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">ET</span>
                </div>
                <h1 className="text-xl font-bold gradient-text">ExpenseTracker</h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <span className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Dashboard
              </span>
              <span className="text-neutral-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Analytics
              </span>
              {user?.isPremium && (
                <span className="text-warning-600 hover:text-warning-700 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 hover:shadow-md p-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="ml-3 text-neutral-700 font-medium">{user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-large bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-down">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-sm text-neutral-500">Signed in as</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                        {user?.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-800 mt-1">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {showMobileMenu ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg shadow-lg mt-2 border border-neutral-200">
              <span className="text-neutral-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer">
                Dashboard
              </span>
              <span className="text-neutral-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer">
                Analytics
              </span>
              {user?.isPremium && (
                <span className="text-warning-600 hover:text-warning-700 block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Features
                </span>
              )}
              <div className="border-t border-neutral-200 pt-4 pb-3">
                <div className="flex items-center px-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800">{user?.name}</div>
                    {user?.isPremium && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-100 text-warning-800">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button className="flex items-center w-full px-3 py-2 text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-danger-700 hover:text-danger-900 hover:bg-danger-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header