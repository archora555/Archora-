const fs = require('fs');

let homeView = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
homeView = homeView.replace(
  'className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-12 md:gap-16 overflow-hidden"',
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12 pt-4 md:pt-6 flex flex-col gap-12 md:gap-16 overflow-hidden"'
);
fs.writeFileSync('src/views/HomeView.tsx', homeView);

let catSel = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');
catSel = catSel.replace(
  'className="flex gap-4 md:gap-8 justify-center mb-6 px-2 md:px-0 max-w-4xl mx-auto"',
  'className={`flex gap-4 md:gap-8 justify-center px-2 md:px-0 max-w-4xl mx-auto ${activeMain ? \'mb-6\' : \'mb-0\'}`}'
);
fs.writeFileSync('src/components/CategorySelector.tsx', catSel);

console.log('Gap reduced');
