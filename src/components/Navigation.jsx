import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  MessageCircle, 
  Heart, 
  Award, 
  User, 
  Smile,
  Menu,
  X,
  LogOut
} from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Donate', href: '/donate', icon: Heart },
    { name: 'Certificate', href: '/certificate', icon: Award },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Bonus', href: '/bonus', icon: Smile },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  const isActive = (href) => {
    return location.pathname === href
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Sticky Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">UsheGuard</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 relative ${
                        active
                          ? 'bg-primary-100 text-primary-700 shadow-sm'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Desktop Sign Out */}
            <div className="hidden md:block">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-blue-100/50 shadow-lg">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMenu}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                    active
                      ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
            
            {/* Mobile Sign Out */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button
                onClick={() => {
                  handleSignOut()
                  closeMenu()
                }}
                className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  )
}