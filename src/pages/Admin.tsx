import React, { useEffect, useState } from 'react';
import { Artwork } from '../types';
import { Plus, Edit, Trash2, LayoutDashboard, Package, ShoppingCart, Settings, Database } from 'lucide-react';
import { db, collection, getDocs, setDoc, doc, deleteDoc } from '../firebase';

const Admin = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchArtworks = async () => {
    try {
      // Fetch from API
      const apiResponse = await fetch('/api/artworks');
      const apiData = apiResponse.ok ? await apiResponse.json() : [];
      
      // Fetch from Firestore
      const querySnapshot = await getDocs(collection(db, 'artworks'));
      const firestoreData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
      
      // Merge
      const merged = [...apiData];
      firestoreData.forEach(fArt => {
        if (!merged.find(a => a.id === fArt.id)) {
          merged.push(fArt);
        }
      });
      
      setArtworks(merged);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/artworks');
      if (!response.ok) throw new Error('Failed to fetch from server');
      const initialArtworks = await response.json();

      for (const art of initialArtworks) {
        await setDoc(doc(db, 'artworks', art.id), art);
      }
      await fetchArtworks();
      alert("Gallery synced with server data successfully!");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to sync with server. Make sure the server is running.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      await deleteDoc(doc(db, 'artworks', id));
      await fetchArtworks();
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gallery-ink text-white p-8 hidden lg:block">
        <h2 className="text-xl font-serif mb-12 tracking-widest uppercase">Admin Panel</h2>
        <nav className="space-y-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-4 text-xs uppercase tracking-widest w-full text-left transition-colors ${activeTab === 'dashboard' ? 'text-gallery-accent' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-4 text-xs uppercase tracking-widest w-full text-left transition-colors ${activeTab === 'inventory' ? 'text-gallery-accent' : 'text-gray-400 hover:text-white'}`}
          >
            <Package size={18} />
            <span>Inventory</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-4 text-xs uppercase tracking-widest w-full text-left transition-colors ${activeTab === 'orders' ? 'text-gallery-accent' : 'text-gray-400 hover:text-white'}`}
          >
            <ShoppingCart size={18} />
            <span>Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-4 text-xs uppercase tracking-widest w-full text-left transition-colors ${activeTab === 'settings' ? 'text-gallery-accent' : 'text-gray-400 hover:text-white'}`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-serif capitalize">{activeTab}</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Manage your gallery assets and sales</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={seedData} 
                disabled={isSeeding}
                className="btn-outline flex items-center space-x-2 bg-white"
              >
                <Database size={16} />
                <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={16} />
                <span>Add New Artwork</span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 luxury-shadow">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Total Sales</p>
              <h3 className="text-2xl font-serif">$12,450</h3>
            </div>
            <div className="bg-white p-6 luxury-shadow">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Active Artworks</p>
              <h3 className="text-2xl font-serif">{artworks.length}</h3>
            </div>
            <div className="bg-white p-6 luxury-shadow">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Sold Items</p>
              <h3 className="text-2xl font-serif">8</h3>
            </div>
            <div className="bg-white p-6 luxury-shadow">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Pending Orders</p>
              <h3 className="text-2xl font-serif">2</h3>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white luxury-shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Artwork</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Artist</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artworks.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={art.image} alt="" className="w-10 h-10 object-cover" referrerPolicy="no-referrer" />
                        <span className="text-sm font-medium">{art.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{art.artist}</td>
                    <td className="px-6 py-4 text-sm font-medium">${art.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${
                        art.status === 'available' ? 'bg-green-50 text-green-600' : 
                        art.status === 'sold' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4 text-gray-400">
                        <button className="hover:text-gallery-ink transition-colors"><Edit size={16} /></button>
                        <button 
                          onClick={() => handleDelete(art.id)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
