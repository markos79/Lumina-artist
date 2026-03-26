import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { ShieldCheck, CreditCard, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { db, collection, addDoc, Timestamp } from '../firebase';

const Checkout = () => {
  const { cart, cartTotal, clearCart, user } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to complete your purchase.");
      return;
    }

    setIsProcessing(true);
    try {
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartTotal + 150, // Including shipping
        status: 'pending',
        shippingAddress: {
          // Mocking address from form for now
          address: '123 Art St',
          city: 'New York',
          country: 'USA'
        },
        createdAt: Timestamp.now()
      });

      setIsOrdered(true);
      clearCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif">Order Confirmed</h1>
          <p className="text-gray-500 leading-relaxed">
            Thank you for your purchase. We are preparing your artwork for its journey to your home. You will receive a confirmation email shortly.
          </p>
          <Link to="/shop" className="inline-block btn-primary">
            Back to Gallery
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gallery-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold mb-12 hover:text-gallery-accent transition-colors">
          <ArrowLeft size={14} className="mr-2" /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest">Shipping Information</h2>
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                    <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                    <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                  <input required type="email" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Address</label>
                  <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                    <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Postal Code</label>
                    <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Country</label>
                    <input required type="text" className="w-full bg-white border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none luxury-shadow" />
                  </div>
                </div>

                <div className="pt-8">
                  <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest">Payment Method</h2>
                  <div className="bg-white p-6 luxury-shadow space-y-6">
                    <div className="flex items-center justify-between border-b border-black/5 pb-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard size={20} className="text-gallery-accent" />
                        <span className="text-sm font-medium">Credit / Debit Card</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-gray-100 rounded"></div>
                        <div className="w-8 h-5 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gallery-bg border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Expiry Date</label>
                          <input type="text" placeholder="MM / YY" className="w-full bg-gallery-bg border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">CVV</label>
                          <input type="text" placeholder="000" className="w-full bg-gallery-bg border-none px-4 py-3 text-sm focus:ring-1 focus:ring-gallery-accent outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`w-full btn-primary py-4 text-sm ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : `Complete Purchase • $${(cartTotal + 150).toLocaleString()}`}
                </button>
              </form>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-20">
            <div className="bg-white p-8 luxury-shadow sticky top-32">
              <h2 className="text-xl font-serif mb-8 uppercase tracking-widest">Your Order</h2>
              <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 italic mb-1">{item.artist}</p>
                      <p className="text-xs font-medium">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-black/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping (Insured)</span>
                  <span>$150.00</span>
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-between font-bold">
                  <span className="uppercase tracking-widest text-xs">Total</span>
                  <span className="text-xl">${(cartTotal + 150).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-center space-x-4">
                  <ShieldCheck size={20} className="text-gallery-accent" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                    Your transaction is secure and encrypted.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Truck size={20} className="text-gallery-accent" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                    Artworks are professionally crated and fully insured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
