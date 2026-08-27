const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  '{banner.title}',
  'The Burl & Jade Collection'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero text forced');
