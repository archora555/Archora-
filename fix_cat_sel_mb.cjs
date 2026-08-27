const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

code = code.replace(
  'className="flex justify-center -mt-6 md:-mt-8 mb-6 relative z-40 pointer-events-none"',
  'className="flex justify-center -mt-6 md:-mt-8 mb-3 md:mb-4 relative z-40 pointer-events-none"'
);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('Category selector mb updated');
