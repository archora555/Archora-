import React, { useEffect } from 'react';
import { motion } from 'motion/react';

export const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Prevent scrolling behind intro
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 6000);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  const handleEnter = () => {
    document.body.style.overflow = '';
    onComplete();
  };

  return (
    <motion.div
      key="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020203]"
    >
      {/* Deep Space Background Layer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #0a0a0d 0%, #000000 100%)'
        }}
      />

      {/* Fade-in Container for all Stars and Nebulas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Twinkling Star Layers */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 mix-blend-screen"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 160px 120px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 250px 50px, #ffffff, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 320px 180px, #d4af37, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 100px 250px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 350px 80px, #ffffff, rgba(0,0,0,0))
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 400px'
          }}
        />
        
        <motion.div
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-0 mix-blend-screen w-[150%] h-[150%] left-[-25%] top-[-25%]"
          style={{
            backgroundImage: `
              radial-gradient(1.5px 1.5px at 40px 70px, rgba(255,255,255,0.9), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 200px 180px, rgba(229,199,98,0.8), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 280px 250px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 400px 300px, rgba(255,255,255,0.5), rgba(0,0,0,0))
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '500px 500px',
            transform: 'rotate(15deg)'
          }}
        />
        
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-0 mix-blend-screen w-[120%] h-[120%] left-[-10%] top-[-10%]"
          style={{
            backgroundImage: `
              radial-gradient(1.5px 1.5px at 10px 150px, rgba(255,255,255,1), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 150px 30px, rgba(212,175,55,1), rgba(0,0,0,0)),
              radial-gradient(2px 2px at 300px 220px, rgba(255,255,255,0.9), rgba(0,0,0,0)),
              radial-gradient(1px 1px at 380px 100px, rgba(255,255,255,0.7), rgba(0,0,0,0))
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '600px 600px',
            transform: 'rotate(-25deg)'
          }}
        />

        {/* Subtle Cinematic Galaxy Glow */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] rounded-full mix-blend-screen"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, rgba(0, 0, 0, 0) 60%)',
            filter: 'blur(80px)'
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div 
            className="font-serif text-4xl md:text-6xl text-[#FFFDF5] mb-2 tracking-wide"
            style={{ 
              textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.4)' 
            }}
          >
            Welcome to
          </div>
          
          {/* Subtle glowing separator */}
          <div className="w-[120%] h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent my-1 shadow-[0_0_12px_#FFD700] opacity-80" />

          <div 
            className="font-display text-[2.5rem] md:text-7xl text-[#FFFDF5] tracking-[0.1em] uppercase font-normal drop-shadow-2xl mt-1"
            style={{ 
              textShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.6)' 
            }}
          >
            ARCHORA
          </div>
        </motion.div>

        {/* Explore World Button */}
        <motion.button
          layoutId="explore-world-btn"
          onClick={handleEnter}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="group relative mt-20 md:mt-24 inline-flex items-center justify-center px-10 py-4 font-sans tracking-widest text-xs md:text-sm uppercase font-bold btn-gold rounded-sm overflow-hidden"
        >
          <span className="relative z-10 flex items-center text-archora-black">
            <span>EXPLORE WORLD</span>
            <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
