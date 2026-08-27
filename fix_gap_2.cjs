const fs = require('fs');
let homeView = fs.readFileSync('src/views/HomeView.tsx', 'utf8');
homeView = homeView.replace(
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12 pt-4 md:pt-6 flex flex-col gap-12 md:gap-16 overflow-hidden"',
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-8 md:pb-12 pt-0 flex flex-col gap-12 md:gap-16 overflow-hidden"'
);
fs.writeFileSync('src/views/HomeView.tsx', homeView);
