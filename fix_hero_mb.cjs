const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  'className="w-full max-w-[1440px] mx-auto px-4 md:px-6 mb-8 mt-4 md:mt-12 overflow-visible"',
  'className="w-full max-w-[1440px] mx-auto px-4 md:px-6 mb-4 mt-4 md:mt-12 overflow-visible"'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero mb updated');
