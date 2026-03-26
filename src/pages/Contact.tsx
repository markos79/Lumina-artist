import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h1 className="text-6xl font-serif mb-6">Get in Touch</h1>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Whether you're interested in a specific piece, a commission, or just want to say hello, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gallery-bg flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-gallery-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-1">Email</h4>
                  <p className="text-sm text-gray-500">hello@lumina-gallery.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gallery-bg flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-gallery-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-1">Phone</h4>
                  <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gallery-bg flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-gallery-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-1">Gallery Address</h4>
                  <p className="text-sm text-gray-500">123 Art District, Suite 400<br />New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Follow Us</h4>
              <div className="flex space-x-6">
                <a href="#" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gallery-ink transition-colors">
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gallery-ink transition-colors">
                  <Facebook size={18} />
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gallery-ink transition-colors">
                  <Twitter size={18} />
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gallery-bg p-12 luxury-shadow"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 focus:border-gallery-accent outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-300 py-2 focus:border-gallery-accent outline-none transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-gray-300 py-2 focus:border-gallery-accent outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subject</label>
                <select className="w-full bg-transparent border-b border-gray-300 py-2 focus:border-gallery-accent outline-none transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Artwork Purchase</option>
                  <option>Commission Request</option>
                  <option>Press Inquiry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-gray-300 py-2 focus:border-gallery-accent outline-none transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
