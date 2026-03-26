import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <div className="max-w-md mx-auto space-y-8">
          <div className="w-20 h-20 bg-gallery-bg rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
          <h1 className="text-4xl font-serif">Your collection is empty</h1>
          <p className="text-gray-500">Discover original artworks and start your collection today.</p>
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
        <h1 className="text-5xl font-serif mb-16">Your Collection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 luxury-shadow flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="w-full sm:w-32 h-40 bg-gray-100 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif uppercase tracking-wider">{item.title}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 italic mb-2">{item.artist}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.medium} • {item.width}x{item.height} cm</p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={item.stock <= item.quantity}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-lg font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 luxury-shadow sticky top-32">
              <h2 className="text-xl font-serif mb-8 uppercase tracking-widest">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gallery-accent uppercase text-[10px] font-bold">Calculated at checkout</span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between font-bold">
                  <span className="uppercase tracking-widest text-xs">Total</span>
                  <span className="text-xl">${cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link to="/checkout" className="w-full btn-primary flex items-center justify-center space-x-3">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                  Secure Checkout Powered by Stripe
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-black/5">
                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Promo Code</h4>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="bg-gallery-bg border-none px-4 py-2 text-xs w-full focus:ring-1 focus:ring-gallery-accent outline-none"
                  />
                  <button className="bg-gallery-ink text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
