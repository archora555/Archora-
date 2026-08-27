const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldBoxStart = `<div className="bg-white px-8 md:px-12 py-3 md:py-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 pointer-events-auto inline-block">`;
const newBoxStart = `<div className="px-8 md:px-12 py-3 md:py-4 shadow-[0_4px_20px_rgba(212,175,55,0.3)] border border-[#D4AF37]/50 pointer-events-auto inline-block bg-gradient-to-r from-[#AA8B29] via-[#E5C762] to-[#AA8B29] bg-[length:200%_auto] animate-shimmer">`;

const oldTitle = `<h2 
              className="font-display uppercase tracking-[0.2em] font-medium text-sm md:text-base text-center bg-gradient-to-r from-[#AA8B29] via-[#E5C762] to-[#AA8B29] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer"`;
const newTitle = `<h2 
              className="font-display uppercase tracking-[0.2em] text-white font-medium text-sm md:text-base text-center drop-shadow-sm"`;

code = code.replace(oldBoxStart, newBoxStart);
code = code.replace(oldTitle, newTitle);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('Fixed box animation');
