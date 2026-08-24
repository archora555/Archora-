import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const CategorySelector = () => {
  const { subCategories, layoutConfig } = useAppContext();
  const [activeMain, setActiveMain] = useState<'budget' | 'designer' | 'future' | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMainClick = (category: 'budget' | 'designer' | 'future') => {
    if (activeMain === category) {
      setActiveMain(null);
      setActiveSub(null);
    } else {
      setActiveMain(category);
    }
  };

  const handleSubClick = (subId: string) => {
    setActiveSub(subId);
    navigate(`/category/${subId}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-4">
      <div className="flex gap-2 md:gap-4 justify-center mb-6">
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

        {/* Future Interior Card */}
        <button 
          onClick={() => handleMainClick('future')}
          className={`flex-1 relative overflow-hidden group transition-all duration-500 ease-out py-10 md:py-14 rounded-md border
            ${activeMain === 'future' 
              ? 'border-transparent shadow-[0_4px_20px_-5px_rgba(212,175,55,0.4)]' 
              : 'border-gray-200 bg-archora-gray hover:border-gray-300'}`}
        >
          {activeMain === 'future' && (
            <motion.div 
              layoutId="main-category-bg"
              className="absolute inset-0 bg-gradient-to-br from-[#E5C762] via-[#D4AF37] to-[#AA8B29]"
            />
          )}
          <span className={`relative z-10 font-display text-2xl md:text-3xl tracking-wide transition-colors duration-500 ${activeMain === 'future' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-archora-black'}`}>
            Future Interior
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
            <div className="pt-4 pb-6 flex flex-wrap justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2" style={{ gap: layoutConfig.categoryCards.gap }}>
              {subCategories.map((sub, idx) => {
                const Icon = (Icons as any)[sub.iconName] || Icons.HelpCircle;
                const isActive = activeSub === sub.id;
                
                return (
                  <motion.button
                    key={sub.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                    onClick={() => handleSubClick(sub.id)}
                    className="flex flex-col items-center group shrink-0"
                    style={{ gap: layoutConfig.categoryCards.gap, width: layoutConfig.categoryCards.width }}
                  >
                    <div 
                      className={`flex items-center justify-center transition-all duration-500 ease-out overflow-hidden ${
                        isActive 
                          ? 'bg-archora-black text-archora-gold shadow-lg shadow-archora-black/20 scale-110 border-2 border-archora-black' 
                          : 'bg-archora-gray text-archora-black group-hover:bg-gray-200 group-hover:scale-105 border-2 border-transparent hover:border-gray-300'
                      }`}
                      style={{ 
                        width: '100%', 
                        height: layoutConfig.categoryCards.height, 
                        aspectRatio: layoutConfig.categoryCards.aspectRatio,
                        borderRadius: layoutConfig.categoryCards.cornerRadius
                      }}
                    >
                      {sub.image ? (
                        <img src={sub.image || undefined} alt={sub.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Icon strokeWidth={isActive ? 2 : 1.5} className="w-6 h-6 md:w-7 md:h-7" />
                      )}
                    </div>
                    <span className={`text-[10px] md:text-xs uppercase tracking-widest font-medium transition-colors text-center ${
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
