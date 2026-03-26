import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-2xl font-serif tracking-tighter uppercase font-bold">Lumina</h1>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              A curated selection of contemporary original paintings for the modern collector. Transforming spaces through emotion and color.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gallery-ink hover:text-gallery-accent transition-colors"><Instagram size={18} /></a>
              <a href="#" className="text-gallery-ink hover:text-gallery-accent transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-gallery-ink hover:text-gallery-accent transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Gallery</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">All Artworks</Link></li>
              <li><Link to="/shop?category=Abstract" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Abstract</Link></li>
              <li><Link to="/shop?category=Landscape" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Landscape</Link></li>
              <li><Link to="/shop?category=Nature" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Nature</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Information</h4>
            <ul className="space-y-4">
              <li><Link to="/artist" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">About the Artist</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-gallery-ink transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-6">Join our list for exhibition previews and new collection drops.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gallery-bg border-none px-4 py-3 text-sm w-full focus:ring-1 focus:ring-gallery-accent outline-none"
              />
              <button type="submit" className="bg-gallery-ink text-white px-4 py-3 hover:bg-gallery-accent transition-colors">
                <Mail size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4 md:mb-0">
            © 2026 Lumina Art Gallery. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visa</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Mastercard</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Amex</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
