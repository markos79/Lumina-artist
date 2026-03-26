import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';
import ArtworkCard from '../components/ArtworkCard';

const Wishlist = () => {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <div className="max-w-md mx-auto space-y-8">
          <div className="w-20 h-20 bg-gallery-bg rounded-full flex items-center justify-center mx-auto">
            <Heart size={32} className="text-gray-300" />
          </div>
          <h1 className="text-4xl font-serif">Your wishlist is empty</h1>
          <p className="text-gray-500">Save your favorite artworks here to keep track of them.</p>
          <Link to="/shop" className="inline-block btn-primary">
            Explore Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gallery-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-serif mb-16">Your Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {wishlist.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
