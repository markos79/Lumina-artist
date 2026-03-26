import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Maximize2, Check, ShieldCheck, Truck } from 'lucide-react';
import { Artwork } from '../types';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';
import ArtworkCard from '../components/ArtworkCard';
import { db, collection, getDocs, query, where } from '../firebase';

const ArtworkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [related, setRelated] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/artworks/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch from server');
        const data = await response.json();
        setArtwork(data);
        
        // Fetch related from API
        const allResponse = await fetch('/api/artworks');
        const allData = await allResponse.json();
        const relatedData = allData
          .filter((a: Artwork) => a.category === data.category && a.slug !== slug)
          .slice(0, 3);
        setRelated(relatedData);
      } catch (error) {
        console.error("Error fetching artwork:", error);
        // Fallback to Firestore
        const q = query(collection(db, 'artworks'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Artwork;
          setArtwork(data);
          
          const relatedQ = query(collection(db, 'artworks'), where('category', '==', data.category));
          const relatedSnapshot = await getDocs(relatedQ);
          const relatedData = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Artwork))
            .filter(a => a.slug !== slug)
            .slice(0, 3);
          setRelated(relatedData);
        }
      }
      setLoading(false);
    };
    fetchArtwork();
  }, [slug]);

  if (loading) return <div className="pt-40 text-center font-serif italic">Loading masterpiece...</div>;
  if (!artwork) return <div className="pt-40 text-center font-serif italic">Artwork not found.</div>;

  const isWishlisted = isInWishlist(artwork.id);

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold mb-12 hover:text-gallery-accent transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 group">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square bg-gray-100 border border-gallery-ink/10">
                <img src={artwork.image} alt="Thumbnail" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
              </div>
              {/* Additional images would go here */}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="border-b border-black/5 pb-8 mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gallery-accent font-bold mb-4 block">
                {artwork.year} • {artwork.style}
              </span>
              <h1 className="text-5xl font-serif mb-4">{artwork.title}</h1>
              <p className="text-xl text-gray-500 italic mb-6">by {artwork.artist}</p>
              <p className="text-3xl font-light">${artwork.price.toLocaleString()}</p>
            </div>

            <div className="space-y-8 mb-12">
              <div className="grid grid-cols-2 gap-y-4 text-xs uppercase tracking-widest">
                <div className="text-gray-400">Medium</div>
                <div className="font-bold">{artwork.medium}</div>
                <div className="text-gray-400">Dimensions</div>
                <div className="font-bold">{artwork.width} x {artwork.height} cm</div>
                <div className="text-gray-400">Category</div>
                <div className="font-bold">{artwork.category}</div>
                <div className="text-gray-400">Status</div>
                <div className="font-bold capitalize">{artwork.status}</div>
              </div>

              <div className="prose prose-sm text-gray-600 leading-relaxed">
                <p>{artwork.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button 
                onClick={() => addToCart(artwork)}
                disabled={artwork.status !== 'available'}
                className={`flex-1 btn-primary flex items-center justify-center space-x-3 ${
                  artwork.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingBag size={18} />
                <span>{artwork.status === 'available' ? 'Add to Collection' : artwork.status.toUpperCase()}</span>
              </button>
              <button 
                onClick={() => toggleWishlist(artwork)}
                className={`btn-outline flex items-center justify-center space-x-3 ${
                  isWishlisted ? 'bg-gallery-accent text-white border-gallery-accent' : ''
                }`}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                <span>{isWishlisted ? 'In Wishlist' : 'Wishlist'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-black/5">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={20} className="text-gallery-accent" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Authentic</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck size={20} className="text-gallery-accent" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Insured</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check size={20} className="text-gallery-accent" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="pt-20 border-t border-black/5">
            <h2 className="text-3xl font-serif mb-12">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {related.map(art => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetail;
