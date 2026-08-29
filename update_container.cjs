const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldContainer = 'className="px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-700 pointer-events-auto inline-block bg-[#1a1a1a]"';
const newContainer = 'className="px-8 md:px-12 py-3 md:py-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-600/50 pointer-events-auto inline-block bg-gradient-to-b from-[#27272a] to-[#18181b] rounded-sm"';
code = code.replace(oldContainer, newContainer);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('Container updated');
