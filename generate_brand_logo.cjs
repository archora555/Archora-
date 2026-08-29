const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating ultra-luxury ARCHORA logo assets matching user reference...');

// 1. Create the SVG first
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="100%" height="100%">
  <defs>
    <!-- Metallic brushed gold linear gradient -->
    <linearGradient id="archoraGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF5C8" />
      <stop offset="15%" stop-color="#F2D785" />
      <stop offset="35%" stop-color="#DFBA67" />
      <stop offset="65%" stop-color="#C29737" />
      <stop offset="85%" stop-color="#95701E" />
      <stop offset="100%" stop-color="#654807" />
    </linearGradient>

    <!-- Bevel light overlay gradient -->
    <linearGradient id="archoraBevelGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="25%" stop-color="#F5DB94" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#DFBA67" stop-opacity="0.2" />
      <stop offset="80%" stop-color="#7C5B14" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#3D2903" stop-opacity="0.95" />
    </linearGradient>

    <!-- Horizontal sheen -->
    <linearGradient id="archoraSheen" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#DFC077" />
      <stop offset="20%" stop-color="#FFF6D3" />
      <stop offset="35%" stop-color="#D4AF37" />
      <stop offset="55%" stop-color="#FDF3B4" />
      <stop offset="78%" stop-color="#C59B3F" />
      <stop offset="100%" stop-color="#EED58E" />
    </linearGradient>

    <!-- 3D drop shadow filter for luxury depth -->
    <filter id="archoraDropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#140d02" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <style>
    .archora-char {
      font-family: 'Cinzel', 'Playfair Display', 'C059', 'Times New Roman', serif;
      font-size: 154px;
      font-weight: 700;
      fill: url(#archoraGoldGrad);
      filter: url(#archoraDropShadow);
    }
  </style>

  <g filter="url(#archoraDropShadow)" transform="translate(10, 16)">
    <!-- Letters ARC -->
    <text x="30" y="160" class="archora-char" letter-spacing="1">A</text>
    <text x="175" y="160" class="archora-char" letter-spacing="1">R</text>
    <text x="320" y="160" class="archora-char" letter-spacing="1">C</text>

    <!-- CHAIR ACTING AS H -->
    <!-- Positioned precisely between C and O -->
    <g id="chair-h-icon" transform="translate(450, 32)">
      <!-- Outer backrest & rear leg contour (graceful back curve and leg) -->
      <path 
        d="M 12 0 
           C 6 0, 1 8, 1 18 
           L 4 75 
           C 5 92, 6 112, 6 132 
           L 14 132 
           C 14 112, 13 92, 12 75 
           L 8 18 
           C 8 10, 11 5, 14 5 
           Z" 
        fill="url(#archoraGoldGrad)" 
        stroke="url(#archoraBevelGrad)" 
        stroke-width="1.2" 
      />

      <!-- Main Chair body: Inner tubular backrest, ergonomic flowing seat, and front leg -->
      <path 
        d="M 23 2 
           C 18 2, 14 10, 14 20 
           L 18 72 
           C 19 80, 24 85, 32 85 
           L 82 84 
           C 91 84, 97 91, 97 100 
           L 98 132 
           L 106 132 
           L 105 98 
           C 105 86, 96 77, 84 77 
           L 34 77 
           C 28 77, 25 73, 24 68 
           L 21 20 
           C 21 12, 24 7, 27 7 
           Z" 
        fill="url(#archoraGoldGrad)" 
        stroke="url(#archoraBevelGrad)" 
        stroke-width="1.2" 
      />

      <!-- Front second leg (3D depth offset) -->
      <path 
        d="M 85 85 
           L 87 132 
           L 93 132 
           L 91 85 
           Z" 
        fill="url(#archoraGoldGrad)" 
        stroke="url(#archoraBevelGrad)" 
        stroke-width="0.9" 
      />

      <!-- Rear second leg (under seat) -->
      <path 
        d="M 23 85 
           L 23 132 
           L 28 132 
           L 28 85 
           Z" 
        fill="url(#archoraGoldGrad)" 
        stroke="url(#archoraBevelGrad)" 
        stroke-width="0.9" 
      />
    </g>

    <!-- Letters ORA -->
    <text x="580" y="160" class="archora-char" letter-spacing="1">O</text>
    <text x="735" y="160" class="archora-char" letter-spacing="1">R</text>
    <text x="865" y="160" class="archora-char" letter-spacing="1">A</text>
  </g>
</svg>`;

// Save SVG
fs.writeFileSync('public/logo.svg', svgContent);
fs.writeFileSync('public/archora-logo.svg', svgContent);
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/logo.svg', svgContent);
  fs.writeFileSync('dist/archora-logo.svg', svgContent);
}
console.log('Saved public/logo.svg');

// 2. Generate crisp high-resolution PNG using ImageMagick with multi-layer gold effect
try {
  // Chair path string for ImageMagick - scaled to pointsize 170
  const chairOuterPath = 'M 535,46 C 527,46 520,58 520,73 L 524,148 C 526,170 527,196 527,222 L 537,222 C 537,196 535,170 534,148 L 530,73 C 530,61 534,54 538,54 Z';
  const chairBodyPath = 'M 550,48 C 543,48 537,59 537,73 L 542,143 C 543,153 550,160 560,160 L 626,159 C 638,159 646,169 646,181 L 647,222 L 657,222 L 656,179 C 656,163 644,150 629,150 L 563,150 C 556,150 552,144 550,137 L 546,73 C 546,62 550,54 554,54 Z';
  const chairFrontLeg = 'M 630,160 L 632,222 L 640,222 L 638,160 Z';
  const chairRearLeg = 'M 548,160 L 548,222 L 555,222 L 555,160 Z';

  const cmd = `convert -size 1200x270 xc:none -type TrueColorAlpha \\
    \\( -clone 0 \\
       -fill '#1e1302' \\
       -font /tmp/Cinzel-Bold.ttf -pointsize 170 \\
       -draw "text 40,225 'A'" \\
       -draw "text 200,225 'R'" \\
       -draw "text 360,225 'C'" \\
       -draw "text 680,225 'O'" \\
       -draw "text 855,225 'R'" \\
       -draw "text 1005,225 'A'" \\
       -draw "fill '#1e1302' path '${chairOuterPath}'" \\
       -draw "fill '#1e1302' path '${chairBodyPath}'" \\
       -draw "fill '#1e1302' path '${chairFrontLeg}'" \\
       -draw "fill '#1e1302' path '${chairRearLeg}'" \\
       -blur 0x3 \\
    \\) \\
    \\( -clone 0 \\
       -fill '#C29737' \\
       -font /tmp/Cinzel-Bold.ttf -pointsize 170 \\
       -draw "text 40,223 'A'" \\
       -draw "text 200,223 'R'" \\
       -draw "text 360,223 'C'" \\
       -draw "text 680,223 'O'" \\
       -draw "text 855,223 'R'" \\
       -draw "text 1005,223 'A'" \\
       -draw "fill '#C29737' path '${chairOuterPath}'" \\
       -draw "fill '#C29737' path '${chairBodyPath}'" \\
       -draw "fill '#C29737' path '${chairFrontLeg}'" \\
       -draw "fill '#C29737' path '${chairRearLeg}'" \\
    \\) \\
    \\( -clone 0 \\
       -fill '#DFBA67' \\
       -font /tmp/Cinzel-Bold.ttf -pointsize 170 \\
       -draw "text 40,222 'A'" \\
       -draw "text 200,222 'R'" \\
       -draw "text 360,222 'C'" \\
       -draw "text 680,222 'O'" \\
       -draw "text 855,222 'R'" \\
       -draw "text 1005,222 'A'" \\
       -draw "fill '#DFBA67' path '${chairOuterPath}'" \\
       -draw "fill '#DFBA67' path '${chairBodyPath}'" \\
       -draw "fill '#DFBA67' path '${chairFrontLeg}'" \\
       -draw "fill '#DFBA67' path '${chairRearLeg}'" \\
    \\) \\
    \\( -clone 0 \\
       -stroke '#FFF4CA' -strokewidth 1.5 -fill none \\
       -font /tmp/Cinzel-Bold.ttf -pointsize 170 \\
       -draw "text 40,221 'A'" \\
       -draw "text 200,221 'R'" \\
       -draw "text 360,221 'C'" \\
       -draw "text 680,221 'O'" \\
       -draw "text 855,221 'R'" \\
       -draw "text 1005,221 'A'" \\
       -draw "stroke '#FFF4CA' fill none path '${chairOuterPath}'" \\
       -draw "stroke '#FFF4CA' fill none path '${chairBodyPath}'" \\
       -draw "stroke '#FFF4CA' fill none path '${chairFrontLeg}'" \\
       -draw "stroke '#FFF4CA' fill none path '${chairRearLeg}'" \\
    \\) \\
    -layers merge \\
    public/logo.png`;

  execSync(cmd, { stdio: 'inherit' });
  console.log('Generated public/logo.png successfully!');

  // Copy to all needed paths
  fs.copyFileSync('public/logo.png', 'public/archora-logo.png');
  fs.copyFileSync('public/logo.png', 'public/1787550151155-removebg-preview.png');
  if (fs.existsSync('dist')) {
    fs.copyFileSync('public/logo.png', 'dist/logo.png');
    fs.copyFileSync('public/logo.png', 'dist/archora-logo.png');
    fs.copyFileSync('public/logo.png', 'dist/1787550151155-removebg-preview.png');
  }
  console.log('Successfully copied logo to public/1787550151155-removebg-preview.png');
} catch (e) {
  console.error('Error generating PNG:', e);
}

