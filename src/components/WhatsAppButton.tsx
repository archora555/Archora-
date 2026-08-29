import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const whatsappNumber = "1234567890"; // Admin should configure this, but hardcode for now or use context
  const [isHovered, setIsHovered] = useState(false);
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      {/* Optional luxury tooltip pill */}
      <span 
        className={`mr-3 px-3 py-1.5 bg-[#0D2317] text-[#F5E2B3] text-xs font-serif tracking-wider border border-[#DFBA67]/40 rounded-sm shadow-lg pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        Concierge WhatsApp
      </span>

      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group p-3.5 bg-[#0D2317] hover:bg-[#091B11] text-[#DFBA67] border-2 border-[#1E4D30] hover:border-[#DFBA67] rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_28px_rgba(223,186,103,0.3)] ring-1 ring-[#DFBA67]/30 hover:ring-[#DFBA67]/70 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Chat with Concierge on WhatsApp"
      >
        {/* Subtle gold active status badge */}
        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#DFBA67] border-2 border-[#0D2317] shadow-sm animate-pulse" />

        <MessageCircle 
          className="w-6 h-6 text-[#DFBA67] group-hover:text-[#FFF4D4] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" 
          strokeWidth={1.75}
        />
      </button>
    </div>
  );
};

