const fs = require('fs');

// Fix ProductCard aspect ratio
let cardCode = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');
cardCode = cardCode.replace(
  'className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] mb-4 transition-all duration-500 group-hover:shadow-inner"',
  'className="relative aspect-square overflow-hidden bg-[#F8F8F8] mb-4 transition-all duration-500 group-hover:shadow-inner"'
);
fs.writeFileSync('src/components/ProductCard.tsx', cardCode);

// Fix HomeView gap between product sections
let homeCode = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
homeCode = homeCode.replace(
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12 pt-0 flex flex-col gap-12 md:gap-16 overflow-hidden"',
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-2 md:pb-4 pt-0 flex flex-col gap-12 md:gap-16 overflow-hidden"'
);
fs.writeFileSync('src/views/HomeView.tsx', homeCode);

console.log('Fixed ProductCard and HomeView spacing');
