const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// 1. Remove the cinematic overlay
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />',
  ''
);

// 2. Remove the shadow from the banner image container if any (shadow-2xl) -> let's keep it clean
code = code.replace(
  'aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-white/20',
  'aspect-video rounded-2xl md:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/20'
);

// 3. Update the text block to remove drop-shadow, and remove the button
const oldTextBlock = `<motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 10 }}
                  transition={{ duration: 0.6, delay: offset === 0 ? 0.3 : 0 }}
                  className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30 pointer-events-none w-full px-4"
                >
                   <h2 className="text-white font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2 drop-shadow-md">
                     {banner.title}
                   </h2>
                   <div className="h-0.5 w-12 bg-[#FFD700] mt-2 mb-4 md:mb-6 shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setCurrentView('catalog');
                     }}
                     className="bg-[#FFD700] border-2 border-[#FFD700] text-black px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white hover:border-white transition-colors pointer-events-auto shadow-lg"
                   >
                     Shop Special Offer
                   </button>
                </motion.div>`;

// Since the title was previously overwritten to "The Burl & Jade Collection", I need to match what's currently in the file. Let me check the exact string.
