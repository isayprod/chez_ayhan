'use client';

import { useEffect, useState } from "react";


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
  };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full bg-white/80 backdrop-blur-sm z-50 ${scrolled ? 'shadow-sm' : 'border-b'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href='#main' className="text-2xl font-bold text-orange-600">Chez Ayhan</a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <a href="#story" className="text-orange-600 hover:text-orange-700 px-4 py-2 rounded">
            Notre Histoire 
          </a>
          <a href="#menu" className="text-orange-600 hover:text-orange-700 px-4 py-2 rounded">
            Menu
          </a>
          <a href="#order" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">
            Commander
          </a>
        </div>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-orange-600 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-orange-600 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-orange-600 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 border-b' : 'max-h-0'}`}>
        <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
          <a 
            href="#story" 
            className="text-orange-600 hover:text-orange-700 py-2 px-4 block"
            onClick={handleLinkClick}
          >
            Notre Histoire
          </a>
          <a 
            href="#menu" 
            className="text-orange-600 hover:text-orange-700 py-2 px-4 block"
            onClick={handleLinkClick}
          >
            Menu
          </a>
          <a 
            href="#order" 
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 block text-center rounded mb-2"
            onClick={handleLinkClick}
          >
            Commander
          </a>
        </div>
      </div>
    </nav>
  )
}
