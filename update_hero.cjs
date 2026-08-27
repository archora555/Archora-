const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Change text alignment from bottom-left to top-center
code = code.replace(
  'className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col items-start z-30 pointer-events-none"',
  'className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30 pointer-events-none w-full px-4"'
);

// We need to add the subtitle (which could be static or based on banner.subtitle if it existed, but we'll just hardcode it or add it if banner.id === 1)
// Let's modify the text block entirely.
const oldText = `<h2 className="text-white font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2 drop-shadow-md">
                     {banner.title}
                   </h2>
                   <div className="h-0.5 w-12 bg-[#FFD700] mt-2 mb-4 md:mb-6 shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setCurrentView(\'catalog\');
                     }}
                     className="bg-[#FFD700] border-2 border-[#FFD700] text-black px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white hover:border-white transition-colors pointer-events-auto shadow-lg"
                   >
                     Shop Special Offer
                   </button>`;

const newText = `<h2 className="text-[#F1C40F] font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2 drop-shadow-md">
                     {banner.title}
                   </h2>
                   <p className="text-[#F1C40F] italic font-display text-sm md:text-lg mb-8 drop-shadow-md opacity-90">
                     Exquisite deep tones and curated natural burls
                   </p>
                   
                   <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col items-start pointer-events-auto">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="h-0.5 w-12 bg-[#F1C40F] shadow-[0_0_8px_rgba(241,196,15,0.6)]"></div>
                     </div>
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         setCurrentView('catalog');
                       }}
                       className="bg-[#F1C40F] text-black px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                     >
                       Shop Special Offer
                     </button>
                     <button 
                       className="mt-2 text-[#e0e0e0] hover:text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 text-xs md:text-sm transition-colors flex items-center gap-2"
                     >
                       Request a Design Consultation <span className="text-[10px]">&gt;</span>
                     </button>
                   </div>`;

code = code.replace(oldText, newText);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero updated');
