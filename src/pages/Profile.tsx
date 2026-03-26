import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Heart, ShoppingBag, Sparkles, RefreshCcw, LogOut } from 'lucide-react';
import Questionnaire from '../components/Questionnaire';
import ArtworkCard from '../components/ArtworkCard';
import { Artwork, UserPreferences } from '../types';
import { db, collection, getDocs, query, where, limit } from '../firebase';

const Profile = () => {
  const { user, userData, logout, updatePreferences, loading } = useCart();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [recommendations, setRecommendations] = useState<Artwork[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getBudgetRange = (budgetStr: string) => {
    switch (budgetStr) {
      case 'Under $1,000': return { min: 0, max: 1000 };
      case '$1,000 - $3,000': return { min: 1000, max: 3000 };
      case '$3,000 - $7,000': return { min: 3000, max: 7000 };
      case '$7,000 - $15,000': return { min: 7000, max: 15000 };
      case '$15,000+': return { min: 15000, max: Infinity };
      default: return { min: 0, max: Infinity };
    }
  };

  useEffect(() => {
    if (userData?.preferences) {
      fetchRecommendations(userData.preferences);
    }
  }, [userData?.preferences]);

  const fetchRecommendations = async (prefs: UserPreferences) => {
    setIsRecLoading(true);
    try {
      const response = await fetch('/api/artworks');
      if (!response.ok) throw new Error('Failed to fetch artworks');
      const allArtworks: Artwork[] = await response.json();

      // 1. Filter by style/category
      let filtered = allArtworks.filter(art => 
        prefs.styles.includes(art.category) || prefs.styles.includes(art.style)
      );

      // 2. Filter by budget
      const budgetRange = getBudgetRange(prefs.budget);
      const budgetFiltered = filtered.filter(art => art.price >= budgetRange.min && art.price <= budgetRange.max);

      // 3. If not enough results, relax budget constraint but keep style
      let finalRecs = [...budgetFiltered];
      if (finalRecs.length < 3) {
        const styleOnly = filtered.filter(art => !finalRecs.find(f => f.id === art.id));
        finalRecs = [...finalRecs, ...styleOnly];
      }

      // 4. If still not enough, add featured or others to fill the grid (at least 3)
      if (finalRecs.length < 3) {
        const others = allArtworks.filter(art => !finalRecs.find(f => f.id === art.id));
        finalRecs = [...finalRecs, ...others];
      }

      setRecommendations(finalRecs.slice(0, 6));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsRecLoading(false);
    }
  };

  const handleQuestionnaireComplete = async (prefs: UserPreferences) => {
    setIsSaving(true);
    try {
      await updatePreferences(prefs);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
      setShowQuestionnaire(false);
    }
  };

  if (loading || isSaving) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gallery-ink mb-4"></div>
        {isSaving && <p className="text-sm uppercase tracking-widest text-gray-500 animate-pulse">Curating your collection...</p>}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <User size={64} className="text-gray-200 mb-6" />
        <h1 className="text-3xl font-serif mb-4">Your Art Journey Starts Here</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Sign in to create your personalized art profile, save your favorites, and discover paintings tailored to your taste.
        </p>
        <button onClick={() => window.location.href = '/'} className="btn-primary px-8 py-3">
          Return to Home
        </button>
      </div>
    );
  }

  const hasPreferences = userData?.preferences && 
                         userData.preferences.styles && 
                         userData.preferences.styles.length > 0;

  console.log('Profile: Render state', { showQuestionnaire, hasPreferences, userData });

  return (
    <div className="min-h-screen bg-gallery-bg pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={userData?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={userData?.displayName || 'User'} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-gallery-ink text-white p-2 rounded-full shadow-lg">
                <Settings size={16} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-serif">{userData?.displayName || 'Collector'}</h1>
              <p className="text-gray-500 mt-1">{userData?.email}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-[10px] uppercase tracking-widest bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold">
                  {userData?.role || 'Collector'}
                </span>
                <button 
                  onClick={logout}
                  className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1 font-bold"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setShowQuestionnaire(true)}
              className="btn-outline flex items-center space-x-2 bg-white"
            >
              <RefreshCcw size={16} />
              <span>Retake Quiz</span>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {showQuestionnaire || !hasPreferences ? (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gallery-ink text-white p-8 text-center">
                <Sparkles className="mx-auto mb-4" size={32} />
                <h2 className="text-2xl font-serif">Personalize Your Experience</h2>
                <p className="text-gray-400 mt-2">Tell us about your taste and we'll find the perfect art for you.</p>
              </div>
              <Questionnaire 
                onComplete={handleQuestionnaireComplete} 
                initialPreferences={userData?.preferences}
              />
            </motion.div>
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-20"
            >
              {/* Recommendations Section */}
              <section>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-serif flex items-center space-x-3">
                      <Sparkles className="text-gallery-ink" size={28} />
                      <span>Curated for You</span>
                    </h2>
                    <p className="text-gray-500 mt-2 italic">Based on your preference for {userData.preferences!.styles.join(', ')}</p>
                  </div>
                </div>

                {isRecLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-[4/5] mb-4"></div>
                        <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {recommendations.map(artwork => (
                      <ArtworkCard key={artwork.id} artwork={artwork} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No specific recommendations found yet. Try exploring the shop!</p>
                  </div>
                )}
              </section>

              {/* Preferences Summary */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Preferred Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferences.styles.map(style => (
                      <span key={style} className="px-3 py-1 bg-gallery-bg text-xs font-medium rounded-full">{style}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Color Palette</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferences.colors.map(color => (
                      <span key={color} className="px-3 py-1 bg-gallery-bg text-xs font-medium rounded-full">{color}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Investment Range</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gallery-ink text-white text-xs font-medium rounded-full">{userData.preferences.budget}</span>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
