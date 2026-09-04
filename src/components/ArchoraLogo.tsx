import React from 'react';

interface ArchoraLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  alt?: string;
  style?: React.CSSProperties;
}

export const ArchoraLogo: React.FC<ArchoraLogoProps> = ({
  className = '',
  height = 'auto',
  width = 'auto',
  alt = 'ARCHORA Luxury Furniture',
  style = {},
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 220" className={`select-none ${className}`} style={{ height, width, ...style }} aria-label={alt}>
      <defs>
        <linearGradient id="archoraGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DB94" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#AA7C11" />
          <stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F5DB94" />
        </linearGradient>
        <linearGradient id="archoraGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#8C660D" />
          <stop offset="100%" stopColor="#594005" />
        </linearGradient>
        <filter id="luxuryGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#luxuryGlow)">
        {/* ARC */}
        <text x="30" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">A</text>
        <text x="145" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">R</text>
        <text x="255" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">C</text>
        
        {/* Stylized 'h' Chair */}
        <g transform="translate(375, 50)" strokeLinecap="round" strokeLinejoin="round">
          {/* Back Legs (Background Perspective) */}
          <line x1="25" y1="65" x2="25" y2="110" stroke="url(#archoraGoldDark)" strokeWidth="8" opacity="0.8" />
          {/* Front Legs (Background Perspective) */}
          <line x1="85" y1="65" x2="85" y2="110" stroke="url(#archoraGoldDark)" strokeWidth="8" opacity="0.8" />
          
          {/* Continuous Seat and Backrest */}
          {/* Starts at top (backrest), curves down, goes right (seat) */}
          <path d="M 18 -10 C 5 -10, 10 20, 10 50 C 10 65, 18 65, 30 65 L 80 65" fill="none" stroke="url(#archoraGold)" strokeWidth="12" />
          
          {/* Back Leg (Foreground) */}
          <line x1="10" y1="65" x2="10" y2="110" stroke="url(#archoraGold)" strokeWidth="12" />
          {/* Front Leg (Foreground) */}
          <line x1="70" y1="65" x2="70" y2="110" stroke="url(#archoraGold)" strokeWidth="12" />
        </g>
        
        {/* ORA */}
        <text x="495" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">O</text>
        <text x="635" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">R</text>
        <text x="745" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="140" fontWeight="400" fill="url(#archoraGold)" letterSpacing="2">A</text>
      </g>
    </svg>
  );
};
