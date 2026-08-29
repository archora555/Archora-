import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EditableWrapper } from './VisualEditor/EditableWrapper';

export const CategorySelector = () => {
  const { subCategories, setSubCategories, layoutConfig, setLayoutConfig } = useAppContext();
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
    <EditableWrapper 
      id="category-margins" 
      type="margins"
      currentMargin={layoutConfig.categorySection.marginTop}
      onMarginChange={(m) => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, marginTop: m, marginBottom: m}})}
    >
      <section 
        aria-label="Category Selection"
        className="relative w-full py-4 md:py-6"
        style={{
          marginTop: `${layoutConfig.categorySection.marginTop}px`,
          marginBottom: `${layoutConfig.categorySection.marginBottom}px`,
        }}
      >
        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6">
          <div className={`flex gap-4 md:gap-8 justify-center px-2 md:px-0 max-w-4xl mx-auto ${activeMain ? 'mb-6' : 'mb-0'}`}>
            {/* Budget Button */}
            <div className="relative group">
              <button 
                onClick={() => handleMainClick('budget')}
                className={`w-36 sm:w-56 md:w-64 py-4 sm:py-5 md:py-6 relative overflow-hidden rounded-md transition-all duration-300 ease-out flex items-center justify-center cursor-pointer select-none active:scale-[0.97]
                  ${activeMain === 'budget' 
                    ? 'shadow-[0_4px_24px_rgba(223,186,103,0.7),0_8px_28px_rgba(0,0,0,0.6)] ring-2 ring-[#FFF5D6] scale-[1.03]' 
                    : 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(223,186,103,0.6)]'}`}
                style={{
                  background: 'linear-gradient(135deg, #DFBA67 0%, #F5E2B3 50%, #CFA344 100%)',
                  border: '2px solid #DFBA67'
                }}
              >
                {/* Subtle light edge highlight / inner golden rim */}
                <div className="absolute inset-0 border border-white/50 rounded-[inherit] pointer-events-none" />

                {/* Dynamic Light-Sweep / Shimmer Animation on Hover */}
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[-25deg] group-hover:animate-metallic-sweep pointer-events-none bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Clean Flat-Luxurious Typography */}
                <span className="relative z-10 font-serif text-[#1A1A1A] text-xl md:text-2xl tracking-wide font-medium transition-transform duration-300 group-hover:scale-105">
                  Budget
                </span>
              </button>
            </div>

            {/* Designer Button */}
            <div className="relative group">
              <button 
                onClick={() => handleMainClick('designer')}
                className={`w-36 sm:w-56 md:w-64 py-4 sm:py-5 md:py-6 relative overflow-hidden rounded-md transition-all duration-300 ease-out flex items-center justify-center cursor-pointer select-none active:scale-[0.97]
                  ${activeMain === 'designer' 
                    ? 'shadow-[0_4px_24px_rgba(223,186,103,0.7),0_8px_28px_rgba(0,0,0,0.6)] ring-2 ring-[#FFF5D6] scale-[1.03]' 
                    : 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(223,186,103,0.6)]'}`}
                style={{
                  background: 'linear-gradient(135deg, #DFBA67 0%, #F5E2B3 50%, #CFA344 100%)',
                  border: '2px solid #DFBA67'
                }}
              >
                {/* Subtle light edge highlight / inner golden rim */}
                <div className="absolute inset-0 border border-white/50 rounded-[inherit] pointer-events-none" />

                {/* Dynamic Light-Sweep / Shimmer Animation on Hover */}
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[-25deg] group-hover:animate-metallic-sweep pointer-events-none bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Clean Flat-Luxurious Typography */}
                <span className="relative z-10 font-serif text-[#1A1A1A] text-xl md:text-2xl tracking-wide font-medium transition-transform duration-300 group-hover:scale-105">
                  Designer
                </span>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {activeMain && (
              <motion.div
                initial={{ height: 0, opacity: 0, scale: 0.85 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden origin-top"
              >
                <EditableWrapper 
                  id="category-cards" 
                  type="categoryCards"
                  currentWidth={layoutConfig.categoryCards.width}
                  currentHeight={layoutConfig.categoryCards.height}
                  onResize={(w, h) => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, width: w, height: h}})}
                  onAdd={() => {
                    const name = prompt('Enter new category name:');
                    if (name) {
                      setSubCategories([...subCategories, { id: name.toLowerCase().replace(/\s+/g, '-'), name, iconName: 'Star' }]);
                    }
                  }}
                >
                  <div className="pt-4 pb-6 flex flex-wrap justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2" style={{ gap: layoutConfig.categoryCards.gap }}>
                    {subCategories.map((sub, idx) => {
                      const Icon = (Icons as any)[sub.iconName] || Icons.HelpCircle;
                      const isActive = activeSub === sub.id;
                      
                      return (
                        <EditableWrapper
                          key={`edit-${sub.id}`}
                          id={`cat-${sub.id}`}
                          onDelete={() => {
                            if (confirm(`Delete category "${sub.name}"?`)) {
                              setSubCategories(subCategories.filter(s => s.id !== sub.id));
                            }
                          }}
                        >
                        <motion.button
                          key={sub.id}
                          initial={{ opacity: 0, scale: 0.5, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => handleSubClick(sub.id)}
                          className="flex flex-col items-center group shrink-0"
                          style={{ gap: layoutConfig.categoryCards.gap, width: layoutConfig.categoryCards.width }}
                        >
                          <div 
                            className={`flex items-center justify-center transition-all duration-500 ease-out overflow-hidden ${
                              isActive 
                                ? 'frosted-glass-white text-[#DFBA67] scale-110 border-2 !border-[#DFBA67]' 
                                : 'frosted-glass-white-subtle text-gray-200 group-hover:frosted-glass-white group-hover:text-white group-hover:scale-105 border border-white/25 hover:border-[#DFBA67]/50'
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
                            isActive ? 'text-[#DFBA67] font-semibold' : 'text-gray-300 group-hover:text-[#F5E2B3]'
                          }`}>
                            {sub.name}
                          </span>
                        </motion.button>
                        </EditableWrapper>
                      )
                    })}
                  </div>
                </EditableWrapper>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </EditableWrapper>
  );
};
