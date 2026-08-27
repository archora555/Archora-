const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(
  'The Burl & Jade Collection\\n',
  'The Burl & Jade Collection'
);

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero newline fixed');
