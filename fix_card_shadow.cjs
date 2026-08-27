const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  'className="relative aspect-square overflow-hidden bg-[#F8F8F8] mb-4 transition-all duration-500 group-hover:shadow-inner"',
  'className="relative aspect-square overflow-hidden bg-[#F8F8F8] mb-4 transition-all duration-500 shadow-[0_8px_24px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"'
);

fs.writeFileSync('src/components/ProductCard.tsx', code);
console.log('Card shadow updated');
