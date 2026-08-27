const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  '<h2 className="text-white font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2 ">',
  '<h2 className="text-[#D4AF37] font-display text-3xl md:text-5xl tracking-wide mb-1 md:mb-2">'
);

code = code.replace(
  '{banner.title}',
  'The Burl & Jade Collection\\n                     <span className="block text-sm md:text-base tracking-[0.1em] text-[#D4AF37] mt-2 font-light">Exquisite deep tones and curated natural burls</span>'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero text color and content fixed');
