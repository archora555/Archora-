const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  'alt=The Burl & Jade Collection',
  'alt="The Burl & Jade Collection"'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero alt fixed');
