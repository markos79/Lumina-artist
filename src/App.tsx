import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ArtworkDetail from './pages/ArtworkDetail';
import Artist from './pages/Artist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import { CartProvider } from './CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/artwork/:slug" element={<ArtworkDetail />} />
              <Route path="/artist" element={<Artist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
