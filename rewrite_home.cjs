const fs = require('fs');

let content = `import React from 'react';
import { Hero } from '../components/Hero';
import { CategorySelector } from '../components/CategorySelector';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EditableWrapper } from '../components/VisualEditor/EditableWrapper';

export const HomeView = () => {
  const { products, homeSections, logoConfig, layoutConfig, setLayoutConfig } = useAppContext();
  const navigate = useNavigate();

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...layoutConfig.sectionOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setLayoutConfig({ ...layoutConfig, sectionOrder: newOrder });
  };

  const renderSection = (sectionId: string, index: number) => {
    switch(sectionId) {
      case 'hero':
        return (
          <EditableWrapper 
            key={sectionId} id="hero-section" type="section"
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
          >
            <Hero />
          </EditableWrapper>
        );
      case 'categories':
        return (
          <EditableWrapper 
            key={sectionId} id="categories-section" type="section"
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
          >
            <CategorySelector />
          </EditableWrapper>
        );
      case 'footer':
        return (
          <EditableWrapper 
            key={sectionId} id="footer-section" type="section"
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
            onColorChange={(c) => setLayoutConfig({...layoutConfig, footerSettings: {...layoutConfig.footerSettings, bgColor: c}})}
          >
            <footer className="text-white py-20 px-6" style={{ backgroundColor: layoutConfig.footerSettings.bgColor || '#111111' }}>
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <EditableWrapper 
                    id="footer-title" 
                    isTextEditable 
                    onTextChange={(t) => setLayoutConfig({...layoutConfig, footerSettings: {...layoutConfig.footerSettings, title: t}})}
                  >
                    <h3 className="font-display text-4xl mb-6" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff' }}>
                      {layoutConfig.footerSettings.title}
                    </h3>
                  </EditableWrapper>
                  
                  <EditableWrapper 
                    id="footer-desc" 
                    isTextEditable 
                    onTextChange={(t) => setLayoutConfig({...layoutConfig, footerSettings: {...layoutConfig.footerSettings, description: t}})}
                  >
                    <p className="max-w-md" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff', opacity: 0.7 }}>
                      {layoutConfig.footerSettings.description}
                    </p>
                  </EditableWrapper>
                </div>
                <div>
                  <h4 className="font-semibold uppercase tracking-widest text-sm mb-6" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff' }}>Shop</h4>
                  <ul className="space-y-4" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff', opacity: 0.7 }}>
                    <li><a href="#" className="hover:text-archora-gold transition-colors">Living Room</a></li>
                    <li><a href="#" className="hover:text-archora-gold transition-colors">Bedroom</a></li>
                    <li><a href="#" className="hover:text-archora-gold transition-colors">Dining Room</a></li>
                    <li><a href="#" className="hover:text-archora-gold transition-colors">Office Use Pro</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold uppercase tracking-widest text-sm mb-6" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff' }}>Contact</h4>
                  <ul className="space-y-4" style={{ color: layoutConfig.footerSettings.textColor || '#ffffff', opacity: 0.7 }}>
                    <li>concierge@archora.com</li>
                    <li>+1 (800) 123-4567</li>
                    <li>123 Luxury Ave, NY 10001</li>
                  </ul>
                </div>
              </div>
            </footer>
          </EditableWrapper>
        );
      default:
        // Render dynamic sections from homeSections
        const hSection = homeSections.find(s => s.filter === sectionId || s.title === sectionId);
        if (!hSection) return null;
        
        const exactProducts = products.filter(p => p.category === hSection.filter);
        const otherProducts = products.filter(p => p.category !== hSection.filter);
        const sectionProducts = [...exactProducts, ...otherProducts, ...exactProducts, ...otherProducts].slice(0, 8);
        
        if (sectionProducts.length === 0) return null;
        
        return (
          <EditableWrapper 
            key={sectionId} id={\`section-\${sectionId}\`} type="section"
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-12 md:gap-16 overflow-hidden">
              <div>
                <div className="flex items-end justify-between mb-6 md:mb-8">
                  <h2 className="font-display text-2xl md:text-3xl text-archora-black">{hSection.title}</h2>
                  <button className="text-archora-black border-b border-archora-black pb-0.5 hover:text-archora-gold hover:border-archora-gold transition-colors uppercase tracking-wider text-[10px] md:text-xs font-medium">
                    View All
                  </button>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {sectionProducts.map((product, idx) => (
                    <div 
                      key={\`\${product.id}-\${idx}\`} 
                      className="shrink-0 snap-start w-[calc(100%/2.2)] sm:w-[calc(100%/3.2)] lg:w-[calc(100%/4.2)]"
                    >
                      <ProductCard 
                        product={product} 
                        onClick={() => navigate(\`/product/\${product.id}\`)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </EditableWrapper>
        );
    }
  };

  // If sectionOrder is missing some sections, we ensure they are added to the layout.
  // Map homeSections to 'filter' as the ID if not present.
  const activeSectionOrder = [...(layoutConfig.sectionOrder || ['hero', 'categories', 'featured', 'newArrivals', 'footer'])];
  
  // Make sure new sections are included if we just added them via admin panel
  homeSections.forEach(s => {
    if (!activeSectionOrder.includes(s.title) && !activeSectionOrder.includes(s.filter)) {
      activeSectionOrder.splice(activeSectionOrder.length - 1, 0, s.filter || s.title);
    }
  });

  return (
    <div className="w-full">
      {activeSectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
    </div>
  );
};
`
fs.writeFileSync('src/views/HomeView.tsx', content);
