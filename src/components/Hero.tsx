import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { EditableWrapper } from './VisualEditor/EditableWrapper';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const Hero = () => {
  const { setCurrentView, introFinished, heroBanners: banners, layoutConfig, setLayoutConfig } = useAppContext();
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 5 images, but we'll wrap around.
  const imageIndex = Math.abs(page % banners.length);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 4500); // Auto-play every 4.5 seconds
    return () => clearInterval(timer);
  }, [paginate]);

  const getOffset = (idx: number, currentPage: number) => {
    const numItems = banners.length;
    const normalizedPage = currentPage % numItems;
    const currentIdx = normalizedPage < 0 ? normalizedPage + numItems : normalizedPage;
    let offset = idx - currentIdx;
    
    if (offset > Math.floor(numItems / 2)) {
      offset -= numItems;
    } else if (offset < -Math.floor(numItems / 2)) {
      offset += numItems;
    }
    return offset;
  };

  const carouselVariants = {
    center: {
      x: '0%',
      scale: 1,
      zIndex: 5,
      rotateY: 0,
      opacity: 1,
      filter: 'brightness(1)',
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
    },
    left: {
      x: '-65%',
      scale: 0.85,
      zIndex: 3,
      rotateY: -20, // Negative rotateY for left slide to curve away
      opacity: 0.6,
      filter: 'brightness(0.5)',
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
    },
    right: {
      x: '65%',
      scale: 0.85,
      zIndex: 3,
      rotateY: 20, // Positive rotateY for right slide to curve away
      opacity: 0.6,
      filter: 'brightness(0.5)',
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
    },
    hiddenLeft: {
      x: '-100%',
      scale: 0.7,
      zIndex: 1,
      rotateY: -45,
      opacity: 0,
      filter: 'brightness(0.2)',
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
    },
    hiddenRight: {
      x: '100%',
      scale: 0.7,
      zIndex: 1,
      rotateY: 45,
      opacity: 0,
      filter: 'brightness(0.2)',
      transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
    }
  };

  return (
    <section className="relative w-full flex flex-col justify-center overflow-hidden bg-white pt-24 pb-4 md:pb-6">
      {/* Horizontal Banner */}
      <div className="absolute top-[72px] md:top-24 left-0 w-full bg-archora-black text-white py-2.5 flex items-center justify-center overflow-hidden z-20">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1 }}
           className="text-[10px] md:text-xs tracking-widest uppercase font-medium whitespace-nowrap px-4 flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="text-archora-gold px-2 md:px-4">✦</span>
          Complimentary White Glove Delivery on Orders Over $5,000
          <span className="text-archora-gold px-2 md:px-4">✦</span>
          Use Code <span className="font-bold text-archora-gold mx-1">LUXE20</span> for 20% Off Select Office Pro Items
          <span className="text-archora-gold px-2 md:px-4">✦</span>
        </motion.div>
      </div>

      {/* 3D Rotating Cylinder Carousel */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 mb-4 mt-4 md:mt-12 overflow-visible">
        <div 
          style={{ perspective: '1800px' }} 
          className="relative w-full flex items-center justify-center"
        >
          {/* Ghost element for sizing */}
          <div className="w-[100%] md:w-[75%] lg:w-[65%] aspect-video invisible pointer-events-none"></div>

          {banners.map((banner, idx) => {
            const offset = getOffset(idx, page);
            let animateState = 'center';
            if (offset === -1) animateState = 'left';
            else if (offset === 1) animateState = 'right';
            else if (offset < -1) animateState = 'hiddenLeft';
            else if (offset > 1) animateState = 'hiddenRight';

            return (
              <motion.div
                key={banner.id}
                variants={carouselVariants}
                initial={false}
                animate={animateState}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) paginate(1);
                  else if (swipe > swipeConfidenceThreshold) paginate(-1);
                }}
                className="absolute w-[100%] md:w-[75%] lg:w-[65%] aspect-video rounded-2xl md:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/20"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="w-full h-full bg-archora-gray/20">
                  {banner.image && (
                    <img 
                      src={banner.image} 
                      alt="The Burl & Jade Collection" 
                      className="w-full h-full object-cover pointer-events-none"
                      draggable="false"
                    />
                  )}
                </div>
                {/* Cinematic overlay for depth */}
                
                
                {/* Text for center slide */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 10 }}
                  transition={{ duration: 0.6, delay: offset === 0 ? 0.3 : 0 }}
                  className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30 pointer-events-none w-full px-4"
                >
                   <h2 className="text-[#D4AF37] font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2">
                     The Burl & Jade Collection                     <span className="block text-sm md:text-base tracking-[0.1em] text-[#D4AF37] mt-2 font-light">Exquisite deep tones and curated natural burls</span>
                   </h2>
                   <div className="h-0.5 w-12 bg-[#FFD700] mt-2 mb-4 md:mb-6 "></div>
                   
                   
                </motion.div>
              </motion.div>
            );
          })}
          
          {/* Slider Pagination Controls */}
          <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  const numItems = banners.length;
                  const normalizedPage = page % numItems;
                  const currentIdx = normalizedPage < 0 ? normalizedPage + numItems : normalizedPage;
                  const newDirection = idx > currentIdx ? 1 : -1;
                  if(idx !== currentIdx) {
                      setPage([page + (idx - currentIdx), newDirection]);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  idx === imageIndex ? 'bg-archora-gold w-10 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      
    </section>
  );
};
