import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, user, isAdmin, login, logout } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/shop' },
    { name: 'Artist', path: '/artist' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif tracking-tighter uppercase font-bold">Lumina</h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 hover:text-gallery-accent ${
                    isActive ? 'text-gallery-accent' : 'text-gallery-ink'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gallery-ink hover:text-gallery-accent transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className="text-gallery-ink hover:text-gallery-accent transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="text-gallery-ink hover:text-gallery-accent transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gallery-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="text-[10px] uppercase tracking-widest font-bold hover:text-gallery-accent transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gallery-ink hover:text-gallery-accent transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </Link>
                <button onClick={logout} className="text-[10px] uppercase tracking-widest font-bold hover:text-gallery-accent transition-colors">
                  Logout
                </button>
                {user.photoURL && (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-black/5" />
                )}
              </div>
            ) : (
              <button onClick={login} className="text-[10px] uppercase tracking-widest font-bold hover:text-gallery-accent transition-colors">
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gallery-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gallery-ink">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-widest font-medium text-gallery-ink hover:text-gallery-accent"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-6 pt-4 border-t border-black/5">
                <Link to="/wishlist" onClick={() => setIsOpen(false)} className="text-gallery-ink">
                  <Heart size={20} />
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-gallery-ink">
                  <User size={20} />
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-widest font-bold text-gallery-ink flex items-center">
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
