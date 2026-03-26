import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Artwork } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(artwork.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        <Link to={`/artwork/${artwork.slug}`}>
          <img 
            src={artwork.image} 
            alt={artwork.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Status Badge */}
        {artwork.status !== 'available' && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
            {artwork.status}
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={() => toggleWishlist(artwork)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isWishlisted ? 'bg-gallery-accent text-white' : 'bg-white/90 text-gallery-ink hover:bg-gallery-accent hover:text-white'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <Link 
            to={`/artwork/${artwork.slug}`}
            className="bg-white text-gallery-ink px-6 py-2 text-[10px] uppercase tracking-widest font-bold pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            View Details
          </Link>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/artwork/${artwork.slug}`} className="hover:text-gallery-accent transition-colors">
            <h3 className="text-sm font-serif font-medium uppercase tracking-wider">{artwork.title}</h3>
          </Link>
          <span className="text-sm font-medium">${artwork.price.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500 italic">{artwork.artist}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          {artwork.medium} • {artwork.width}x{artwork.height} cm
        </p>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
