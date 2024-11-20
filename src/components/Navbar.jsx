import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Blog Generator' },
    { to: '/fluency-analyzer', label: 'Fluency Analyzer' },
    { to: '/analyzer', label: 'Content Analyzer' },
    { to: '/translator', label: 'Translation Tool' },
    { to: '/subtitle', label: 'Subtitle Generator' },

  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-900'>
      <div className='max-w-screen py-4 md:max-w-7xl flex-col md:flex-row mx-auto flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8'>
        <div className='w-full flex justify-between items-center'>
          <p className='text-green-200 font-lg font-bold'>AudioWhisperer</p>

          {/* Hamburger Menu for Mobile */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-green-700 dark:text-green-400 focus:outline-none'
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium
                  ${isActive(link.to) ? 'border-b-2 border-green-700 dark:border-green-400' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className='md:hidden z-[1000] absolute w-full bg-white dark:bg-gray-900 shadow-md'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={toggleMenu}
              className={`block px-4 py-3 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800
                ${isActive(link.to) ? 'border-l-4 border-green-700 dark:border-green-400' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;