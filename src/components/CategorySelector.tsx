import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sofa, BedDouble, Utensils, Briefcase, Lamp } from 'lucide-react';

const SUB_CATEGORIES = [
  { id: 'sofa', name: 'Sofa', icon: Sofa },
  { id: 'bed', name: 'Bed', icon: BedDouble },
  { id: 'dining', name: 'Dining', icon: Utensils },
  { id: 'office', name: 'Office', icon: Briefcase },
  { id: 'decor', name: 'Decor', icon: Lamp }
];

export const CategorySelector = () => {
  const [activeMain, setActiveMain] = useState<'budget' | 'designer' | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const handleMainClick = (category: 'budget' | 'designer') => {
    if (activeMain === category) {
      setActiveMain(null);
      setActiveSub(null);
    } else {
      setActiveMain(category);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-4">
      <div className="flex gap-4 md:gap-8 justify-center mb-6">
        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={`flex-1 relative overflow-hidden group transition-all duration-500 ease-out py-10 md:py-14 rounded-md border
            ${activeMain === 'budget' 
              ? 'border-transparent shadow-[0_4px_20px_-5px_rgba(212,175,55,0.4)]' 
              : 'border-gray-200 bg-archora-gray hover:border-gray-300'}`}
        >
          {activeMain === 'budget' && (
            <motion.div 
              layoutId="main-category-bg" // Smoothly animates if switching
              className="absolute inset-0 bg-gradient-to-br from-[#E5C762] via-[#D4AF37] to-[#AA8B29]"
            />
          )}
          <span className={`relative z-10 font-display text-2xl md:text-3xl tracking-wide transition-colors duration-500 ${activeMain === 'budget' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-archora-black'}`}>
            Budget
          </span>
        </button>

        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={`flex-1 relative overflow-hidden group transition-all duration-500 ease-out py-10 md:py-14 rounded-md border
            ${activeMain === 'designer' 
              ? 'border-transparent shadow-[0_4px_20px_-5px_rgba(212,175,55,0.4)]' 
              : 'border-gray-200 bg-archora-gray hover:border-gray-300'}`}
        >
          {activeMain === 'designer' && (
            <motion.div 
              layoutId="main-category-bg"
              className="absolute inset-0 bg-gradient-to-br from-[#E5C762] via-[#D4AF37] to-[#AA8B29]"
            />
          )}
          <span className={`relative z-10 font-display text-2xl md:text-3xl tracking-wide transition-colors duration-500 ${activeMain === 'designer' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-archora-black'}`}>
            Designer
          </span>
        </button>
      </div>

      <AnimatePresence>
        {activeMain && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-6 flex justify-between md:justify-center md:gap-16 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2">
              {SUB_CATEGORIES.map((sub, idx) => {
                const Icon = sub.icon;
                const isActive = activeSub === sub.id;
                
                return (
                  <motion.button
                    key={sub.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                    onClick={() => setActiveSub(sub.id)}
                    className="flex flex-col items-center gap-3 group px-3 shrink-0"
                  >
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                      isActive 
                        ? 'bg-archora-black text-archora-gold shadow-lg shadow-archora-black/20 scale-110' 
                        : 'bg-archora-gray text-archora-black group-hover:bg-gray-200 group-hover:scale-105'
                    }`}>
                      <Icon strokeWidth={isActive ? 2 : 1.5} className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <span className={`text-[10px] md:text-xs uppercase tracking-widest font-medium transition-colors ${
                      isActive ? 'text-archora-black' : 'text-gray-500 group-hover:text-archora-black'
                    }`}>
                      {sub.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
