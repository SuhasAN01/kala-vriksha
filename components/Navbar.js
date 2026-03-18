import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ user, logout }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setNavOpen(false);
    
    // Only scroll if we're on the homepage where elements exist
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the homepage, redirect to the homepage with the hash
      window.location.href = `/#${id}`;
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'pillars', label: 'Pillars' },
    { id: 'events', label: 'Events' },
    { id: 'founders', label: 'Founders' },
    { id: 'team', label: 'Team' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-emerald-950/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2 text-gold hover:text-yellow-400 transition-colors" onClick={() => scrollTo('home')}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span className="text-xl md:text-2xl font-bold font-serif tracking-wider" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #FFF8DC 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              KALA VRIKSHA
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks?.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3 py-2 text-white hover:text-yellow-400 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            <button
              onClick={() => scrollTo('contact')}
              className="ml-4 px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-emerald-900 rounded-md font-medium transition-colors"
            >
              Contact
            </button>

            {user ? (
              <div className="flex items-center ml-2 space-x-2">
                {user?.role === 'admin' && (
                  <Link href="/admin" className="px-4 py-2 bg-blue-600/20 text-blue-300 border border-blue-500/50 hover:bg-blue-600 hover:text-white rounded-md transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-2 px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-emerald-950 font-bold rounded-md hover:from-yellow-500 hover:to-yellow-300 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-yellow-400 focus:outline-none p-2"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {navOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`lg:hidden transition-all duration-300 overflow-hidden bg-emerald-950/95 backdrop-blur-md shadow-xl ${
          navOpen ? 'max-h-screen border-b border-emerald-800' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          {navLinks?.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-4 py-3 text-white hover:bg-emerald-800/50 hover:text-yellow-400 rounded-md transition-colors border-b border-emerald-800/50"
            >
              {link.label}
            </button>
          ))}
          
          <button
            onClick={() => scrollTo('contact')}
            className="block w-full text-left px-4 py-3 text-yellow-500 hover:bg-emerald-800/50 rounded-md transition-colors border-b border-emerald-800/50"
          >
            Contact
          </button>

          <div className="pt-4 flex flex-col space-y-3 px-2">
            {user ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="w-full text-center px-4 py-2 border border-blue-500/50 text-blue-300 rounded-md hover:bg-blue-600/20">
                    Admin Panel
                  </Link>
                )}
                <Link href="/dashboard" className="w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-center px-4 py-2 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-emerald-950 font-bold rounded-md shadow-lg">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
