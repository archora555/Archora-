const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Remove gradient overlay
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />',
  ''
);

// Remove shadow-2xl from carousel item
code = code.replace(
  'overflow-hidden shadow-2xl cursor-grab',
  'overflow-hidden cursor-grab'
);

// Remove drop-shadow-md from title
code = code.replace(
  'drop-shadow-md',
  ''
);

// Remove shadow from the golden line
code = code.replace(
  'shadow-[0_0_8px_rgba(255,215,0,0.6)]',
  ''
);

// Remove the button
const buttonRegex = /<button[\s\S]*?Shop Special Offer[\s\S]*?<\/button>/;
code = code.replace(buttonRegex, '');

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero fixed');
