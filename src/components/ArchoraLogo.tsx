import React from 'react';

interface ArchoraLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  alt?: string;
  mode?: 'img' | 'svg';
  style?: React.CSSProperties;
}

export const ArchoraLogo: React.FC<ArchoraLogoProps> = ({
  className = '',
  height = 'auto',
  width = 'auto',
  alt = 'ARCHORA Luxury Furniture',
  mode = 'img',
  style = {},
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (mode === 'img' && !imgError) {
    return (
      <img
        src="/1787550151155-removebg-preview.png"
        alt={alt}
        className={`object-contain select-none transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${className}`}
        style={{ height, width, ...style }}
        onError={(e) => {
          // Fallback to /logo.png or SVG if needed
          const target = e.currentTarget;
          if (target.src.endsWith('1787550151155-removebg-preview.png')) {
            target.src = '/logo.png';
          } else if (target.src.endsWith('logo.png')) {
            target.src = '/logo.svg';
          } else {
            setImgError(true);
          }
        }}
      />
    );
  }

  // Crisp Vector SVG fallback / SVG mode
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 240"
      className={`select-none ${className}`}
      style={{ height, width, ...style }}
      aria-label={alt}
    >
      <defs>
        <linearGradient id="archoraGoldGradComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF5C8" />
          <stop offset="15%" stopColor="#F2D785" />
          <stop offset="35%" stopColor="#DFBA67" />
          <stop offset="65%" stopColor="#C29737" />
          <stop offset="85%" stopColor="#95701E" />
          <stop offset="100%" stopColor="#654807" />
        </linearGradient>

        <linearGradient id="archoraBevelGradComp" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#F5DB94" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#DFBA67" stopOpacity="0.2" />
          <stop offset="80%" stopColor="#7C5B14" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3D2903" stopOpacity="0.95" />
        </linearGradient>

        <filter id="archoraDropShadowComp" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#140d02" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#archoraDropShadowComp)" transform="translate(10, 16)">
        <text x="30" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">A</text>
        <text x="175" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">R</text>
        <text x="320" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">C</text>

        {/* CHAIR ACTING AS H */}
        <g id="chair-h-icon" transform="translate(450, 32)">
          {/* Outer backrest & rear leg contour */}
          <path
            d="M 12 0 C 6 0, 1 8, 1 18 L 4 75 C 5 92, 6 112, 6 132 L 14 132 C 14 112, 13 92, 12 75 L 8 18 C 8 10, 11 5, 14 5 Z"
            fill="url(#archoraGoldGradComp)"
            stroke="url(#archoraBevelGradComp)"
            strokeWidth="1.2"
          />

          {/* Main Chair body: Inner tubular backrest, ergonomic flowing seat, and front leg */}
          <path
            d="M 23 2 C 18 2, 14 10, 14 20 L 18 72 C 19 80, 24 85, 32 85 L 82 84 C 91 84, 97 91, 97 100 L 98 132 L 106 132 L 105 98 C 105 86, 96 77, 84 77 L 34 77 C 28 77, 25 73, 24 68 L 21 20 C 21 12, 24 7, 27 7 Z"
            fill="url(#archoraGoldGradComp)"
            stroke="url(#archoraBevelGradComp)"
            strokeWidth="1.2"
          />

          {/* Front second leg (3D depth offset) */}
          <path
            d="M 85 85 L 87 132 L 93 132 L 91 85 Z"
            fill="url(#archoraGoldGradComp)"
            stroke="url(#archoraBevelGradComp)"
            strokeWidth="0.9"
          />

          {/* Rear second leg (under seat) */}
          <path
            d="M 23 85 L 23 132 L 28 132 L 28 85 Z"
            fill="url(#archoraGoldGradComp)"
            stroke="url(#archoraBevelGradComp)"
            strokeWidth="0.9"
          />
        </g>

        <text x="580" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">O</text>
        <text x="735" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">R</text>
        <text x="865" y="160" fontFamily="'Cinzel', 'Playfair Display', serif" fontSize="154" fontWeight="700" fill="url(#archoraGoldGradComp)">A</text>
      </g>
    </svg>
  );
};
