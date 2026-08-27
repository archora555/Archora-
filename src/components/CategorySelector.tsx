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
    <div 
      className="w-full max-w-5xl mx-auto px-4 md:px-6"
      style={{
        marginTop: `${layoutConfig.categorySection.marginTop}px`,
        marginBottom: `${layoutConfig.categorySection.marginBottom}px`,
      }}
    >
      <div className="flex justify-center -mt-6 md:-mt-8 mb-3 md:mb-4 relative z-40 pointer-events-none">
        <div className="px-8 md:px-12 py-3 md:py-4 shadow-[0_4px_20px_rgba(212,175,55,0.3)] border border-[#D4AF37]/50 pointer-events-auto inline-block bg-gradient-to-r from-[#AA8B29] via-[#E5C762] to-[#AA8B29] bg-[length:200%_auto] animate-shimmer">
          <EditableWrapper 
            id="category-title" 
            type="categoryTitle"
            isTextEditable
            onTextChange={(t) => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, title: t}})}
            currentFontSize={layoutConfig.categorySection.fontSize}
            onFontSizeChange={(f) => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, fontSize: f}})}
          >
            <h2 
              className="font-display uppercase tracking-[0.2em] text-white font-medium text-sm md:text-base text-center drop-shadow-sm"
              style={{
                letterSpacing: `${layoutConfig.categorySection.letterSpacing}px`
              }}
            >
              {layoutConfig.categorySection.title}
            </h2>
          </EditableWrapper>
        </div>
      </div>

      <div className={`flex gap-4 md:gap-8 justify-center px-2 md:px-0 max-w-4xl mx-auto ${activeMain ? 'mb-6' : 'mb-0'}`}>
        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={`w-36 md:w-64 py-5 md:py-8 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            ${activeMain === 'budget' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}`}
        >
          <span className={`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 ${activeMain === 'budget' ? 'text-white font-medium drop-shadow-sm' : 'text-gray-500 group-hover:text-[#D4AF37]'}`}>
            Budget
          </span>
        </button>
        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={`w-36 md:w-64 py-5 md:py-8 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            ${activeMain === 'designer' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}`}
        >
          <span className={`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 ${activeMain === 'designer' ? 'text-white font-medium drop-shadow-sm' : 'text-gray-500 group-hover:text-[#D4AF37]'}`}>
            Designer
          </span>
        </button>
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
                    </EditableWrapper>
                  )
                })}
              </div>
            </EditableWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </EditableWrapper>
  );
};
