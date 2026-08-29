const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

// Replace the container styling
const oldContainer = 'className="px-8 md:px-12 py-3 md:py-4 shadow-[0_4px_20px_rgba(212,175,55,0.3)] border border-[#D4AF37]/50 pointer-events-auto inline-block bg-gradient-to-r from-[#AA8B29] via-[#E5C762] to-[#AA8B29] bg-[length:200%_auto] animate-shimmer"';
const newContainer = 'className="px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-700 pointer-events-auto inline-block bg-[#1a1a1a]"';
code = code.replace(oldContainer, newContainer);

// Replace the text styling
const oldText = 'className="font-display uppercase tracking-[0.2em] text-white font-medium text-sm md:text-base text-center drop-shadow-sm"';
const newText = 'className="font-display uppercase tracking-[0.2em] font-bold text-sm md:text-base text-center drop-shadow-lg bg-clip-text text-transparent bg-[linear-gradient(90deg,#9ca3af_0%,#f3f4f6_25%,#f59e0b_50%,#f3f4f6_75%,#9ca3af_100%)] bg-[length:200%_auto] animate-shimmer"';
code = code.replace(oldText, newText);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('CategorySelector updated');
