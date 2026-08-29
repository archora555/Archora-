const fs = require('fs');
const { execSync } = require('child_process');

// Let's create an SVG with exact dimensions and 3D gold gradients
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="1000" height="240">
  <defs>
    <!-- Rich 3D Gold Gradient for base metallic sheen -->
    <linearGradient id="goldSheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDF1B8" />
      <stop offset="15%" stop-color="#EED180" />
      <stop offset="35%" stop-color="#DFBA67" />
      <stop offset="65%" stop-color="#C59B3F" />
      <stop offset="85%" stop-color="#9C7723" />
      <stop offset="100%" stop-color="#725310" />
    </linearGradient>

    <!-- Horizontal specular shimmer -->
    <linearGradient id="goldSpec" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF5D2" />
      <stop offset="25%" stop-color="#DFC077" />
      <stop offset="50%" stop-color="#FDF3B4" />
      <stop offset="75%" stop-color="#B88E32" />
      <stop offset="100%" stop-color="#DFBB66" />
    </linearGradient>

    <!-- Bevel light highlight -->
    <linearGradient id="bevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="30%" stop-color="#FDF2BA" stop-opacity="0.4" />
      <stop offset="70%" stop-color="#9E7623" stop-opacity="0" />
      <stop offset="100%" stop-color="#543B06" stop-opacity="0.6" />
    </linearGradient>

    <!-- Subtle bevel filter -->
    <filter id="goldBevel" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#3a2806" flood-opacity="0.8" />
    </filter>
  </defs>

  <style>
    @font-face {
      font-family: 'CinzelCustom';
      src: url('/tmp/Cinzel-Bold.ttf') format('truetype');
    }
    .gold-letter {
      font-family: 'CinzelCustom', 'Cinzel', 'Playfair Display', serif;
      font-size: 154px;
      font-weight: 700;
      fill: url(#goldSheen);
      filter: url(#goldBevel);
    }
    .gold-stroke {
      stroke: url(#bevelLight);
      stroke-width: 1.2;
    }
  </style>

  <g transform="translate(10, 18)">
    <!-- Letter A -->
    <text x="35" y="165" class="gold-letter gold-stroke">A</text>
    
    <!-- Letter R -->
    <text x="180" y="165" class="gold-letter gold-stroke">R</text>
    
    <!-- Letter C -->
    <text x="325" y="165" class="gold-letter gold-stroke">C</text>
    
    <!-- CHAIR (acting as H) -->
    <!-- Chair coordinates: x: 445 to 555, y: 38 to 166 (matches the 128px cap-height of the letters) -->
    <g transform="translate(452, 28)" filter="url(#goldBevel)">
      <!-- Outer backrest & rear leg line -->
      <!-- Backrest curves gently at top, drops down to baseline y=138 -->
      <path 
        d="M 12 0 
           C 6 0, 0 10, 0 20 
           L 4 80 
           C 5 95, 6 115, 6 138 
           L 14 138 
           C 14 115, 13 95, 12 80 
           L 8 20 
           C 8 12, 11 7, 14 7 
           Z" 
        fill="url(#goldSheen)" 
        stroke="url(#bevelLight)" 
        stroke-width="1" 
      />

      <!-- Main Chair body: inner backrest, flowing seat, and front leg -->
      <path 
        d="M 23 2 
           C 18 2, 14 10, 14 20 
           L 18 75 
           C 19 82, 24 87, 32 87 
           L 82 86 
           C 91 86, 97 93, 97 101 
           L 98 138 
           L 106 138 
           L 105 99 
           C 105 87, 96 79, 84 79 
           L 35 79 
           C 30 79, 27 75, 26 70 
           L 22 20 
           C 22 13, 24 9, 27 9 
           Z" 
        fill="url(#goldSheen)" 
        stroke="url(#bevelLight)" 
        stroke-width="1" 
      />

      <!-- Front second leg (giving 3D depth to the chair) -->
      <path 
        d="M 85 86 
           L 87 138 
           L 93 138 
           L 91 86 
           Z" 
        fill="url(#goldSheen)" 
        stroke="url(#bevelLight)" 
        stroke-width="0.8" 
      />

      <!-- Rear second leg (under seat) -->
      <path 
        d="M 24 87 
           L 24 138 
           L 30 138 
           L 30 87 
           Z" 
        fill="url(#goldSheen)" 
        stroke="url(#bevelLight)" 
        stroke-width="0.8" 
      />
    </g>

    <!-- Letter O -->
    <text x="575" y="165" class="gold-letter gold-stroke">O</text>

    <!-- Letter R -->
    <text x="730" y="165" class="gold-letter gold-stroke">R</text>

    <!-- Letter A -->
    <text x="860" y="165" class="gold-letter gold-stroke">A</text>
  </g>
</svg>`;

fs.writeFileSync('/tmp/logo.svg', svg);
console.log('SVG written to /tmp/logo.svg');
