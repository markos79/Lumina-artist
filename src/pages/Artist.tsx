import React from 'react';
import { motion } from 'motion/react';

const Artist = () => {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <img 
              src="https://www.1st-art-gallery.com/media/magefan_blog/artist-draws-a-work-of-art.jpg" 
              alt="Artist at work" 
              className="w-full aspect-[4/5] object-cover luxury-shadow"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gallery-accent/10 -z-10"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gallery-accent font-bold block">The Visionary</span>
            <h1 className="text-6xl font-serif leading-tight">Elena Vance</h1>
            <p className="text-lg text-gray-600 leading-relaxed italic">
              "Art is not what you see, but what you make others see."
            </p>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Born in the coastal landscapes of the Pacific Northwest, Elena Vance's work is a profound dialogue between the raw power of nature and the delicate nuances of human emotion. With over 15 years of experience in contemporary oil painting, her pieces are held in private collections across Europe and North America.
              </p>
              <p>
                Elena's process is intuitive and physical. She often works with large-scale canvases, using a combination of traditional brushes, palette knives, and unconventional tools to create rich, tactile surfaces that invite the viewer to explore the depth of the paint itself.
              </p>
              <p>
                Her latest collection, "Ethereal Whispers," explores the concept of 'liminal spaces'—the moments of transition between day and night, silence and sound, presence and absence.
              </p>
            </div>
            <div className="pt-8 flex space-x-12">
              <div>
                <h4 className="text-2xl font-serif mb-1">20+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Exhibitions</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif mb-1">15</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Years Active</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif mb-1">150+</h4>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Works Sold</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Studio Gallery */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Inside the Studio</h2>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">A glimpse into the creative process</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <img src="https://images.unsplash.com/photo-1460661419201-fd4ce18a802f?auto=format&fit=crop&q=80&w=800" alt="Studio 1" className="w-full aspect-square object-cover luxury-shadow" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800" alt="Studio 2" className="w-full aspect-square object-cover luxury-shadow" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" alt="Studio 3" className="w-full aspect-square object-cover luxury-shadow" referrerPolicy="no-referrer" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Artist;
