import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';
import { Artwork } from '../types';
import { motion } from 'motion/react';
import { db, collection, getDocs } from '../firebase';

const Shop = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArt, setFilteredArt] = useState<Artwork[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Abstract', 'Landscape', 'Nature', 'Urban'];
  const styles = ['All', 'Contemporary', 'Expressionism', 'Minimalism', 'Impressionism'];

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        // Fetch from API
        const apiResponse = await fetch('/api/artworks');
        const apiData = apiResponse.ok ? await apiResponse.json() : [];
        
        // Fetch from Firestore
        const querySnapshot = await getDocs(collection(db, 'artworks'));
        const firestoreData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
        
        // Merge (using ID as key to avoid duplicates)
        const merged = [...apiData];
        firestoreData.forEach(fArt => {
          if (!merged.find(a => a.id === fArt.id)) {
            merged.push(fArt);
          }
        });
        
        setArtworks(merged);
        setFilteredArt(merged);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    const style = searchParams.get('style') || 'All';

    let result = artworks;

    if (category !== 'All') {
      result = result.filter(a => a.category === category);
    }
    if (style !== 'All') {
      result = result.filter(a => a.style === style);
    }
    if (searchQuery) {
      result = result.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArt(result);
  }, [searchParams, artworks, searchQuery]);

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'All') {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-32 pb-20 bg-gallery-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-5xl font-serif mb-4">The Gallery</h1>
          <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            Explore our complete collection of original paintings
          </p>
        </header>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none pl-12 pr-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow"
            />
          </div>

          <div className="flex items-center space-x-6 w-full md:w-auto justify-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold hover:text-gallery-accent transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold cursor-pointer group">
              <span>Sort By</span>
              <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 mb-12 luxury-shadow grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-gallery-accent">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange('category', cat)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                      (searchParams.get('category') || 'All') === cat 
                      ? 'bg-gallery-ink text-white border-gallery-ink' 
                      : 'border-gray-200 hover:border-gallery-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-gallery-accent">Style</h4>
              <div className="flex flex-wrap gap-2">
                {styles.map(style => (
                  <button
                    key={style}
                    onClick={() => handleFilterChange('style', style)}
                    className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                      (searchParams.get('style') || 'All') === style 
                      ? 'bg-gallery-ink text-white border-gallery-ink' 
                      : 'border-gray-200 hover:border-gallery-ink'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-gallery-accent">Price Range</h4>
              <div className="space-y-4">
                <input type="range" className="w-full accent-gallery-accent" min="0" max="5000" />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                  <span>$0</span>
                  <span>$5,000+</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {filteredArt.length > 0 ? (
            filteredArt.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 font-serif italic text-xl">No artworks found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
                className="mt-6 text-xs uppercase tracking-widest font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
