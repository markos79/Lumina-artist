import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';
import { Artwork } from '../types';
import { db, collection, getDocs, query, where } from '../firebase';

const Home = () => {
  const [featuredArt, setFeaturedArt] = useState<Artwork[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Fetch from API
        const apiResponse = await fetch('/api/artworks');
        const apiData = apiResponse.ok ? await apiResponse.json() : [];
        
        // Fetch from Firestore
        const q = query(collection(db, 'artworks'), where('featured', '==', true));
        const querySnapshot = await getDocs(q);
        const firestoreData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
        
        // Merge
        const merged = [...apiData.filter((a: Artwork) => a.featured)];
        firestoreData.forEach(fArt => {
          if (!merged.find(a => a.id === fArt.id)) {
            merged.push(fArt);
          }
        });
        
        setFeaturedArt(merged);
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=2000" 
            alt="Gallery" 
            className="w-full h-full object-cover grayscale-[0.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.4em] font-semibold mb-6 block">Contemporary Collection</span>
            <h1 className="text-6xl md:text-8xl font-serif leading-tight mb-8">
              Discover Original Art That <span className="italic">Transforms</span> Your Space
            </h1>
            <p className="text-lg text-white/80 mb-10 font-light leading-relaxed">
              Browse curated original paintings from a refined digital gallery and collect unique works that bring character, emotion, and beauty into your home.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/shop" className="btn-primary bg-white text-gallery-ink hover:bg-gallery-accent hover:text-white">
                Explore Collection
              </Link>
              <Link to="/artist" className="btn-outline border-white text-white hover:bg-white hover:text-gallery-ink">
                About the Artist
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gallery-accent font-bold mb-2 block">Curated Selection</span>
              <h2 className="text-4xl font-serif">Featured Artworks</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-widest font-bold flex items-center group">
              View All <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredArt.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-gallery-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000" 
                alt="Artist Studio" 
                className="w-full aspect-[4/5] object-cover luxury-shadow"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-gallery-accent/20 hidden lg:block"></div>
            </div>
            <div className="space-y-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gallery-accent font-bold block">Our Philosophy</span>
              <h2 className="text-5xl font-serif leading-tight">Art is the bridge between the <span className="italic text-gallery-accent">unseen</span> and the felt.</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Every stroke on the canvas is a word in a silent language. At Lumina, we believe that art shouldn't just decorate a wall; it should resonate with the soul of the room and the person inhabiting it.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our collection is hand-picked to ensure that every piece tells a story of craftsmanship, emotion, and contemporary vision. From the bold textures of urban expressionism to the serene flows of minimalist nature, we bring you art that matters.
              </p>
              <Link to="/artist" className="inline-block btn-outline">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif mb-4">Why Collect With Us</h2>
            <div className="w-20 h-px bg-gallery-accent mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-bold">Original Works</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Every painting is a unique original, signed by the artist with a certificate of authenticity.</p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-bold">Secure Shipping</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Professional art packaging and fully insured worldwide shipping to ensure your piece arrives safely.</p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-bold">Curated Trust</h3>
              <p className="text-sm text-gray-500 leading-relaxed">We provide high-resolution imagery and detailed condition reports for every piece in our gallery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
