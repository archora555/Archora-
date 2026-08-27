const fs = require('fs');

let homeCode = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

// The default section container currently has:
// className="max-w-7xl mx-auto px-4 md:px-6 pb-2 md:pb-4 pt-0 flex flex-col gap-12 md:gap-16 overflow-hidden"
homeCode = homeCode.replace(
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-2 md:pb-4 pt-0 flex flex-col gap-12 md:gap-16 overflow-hidden"',
  'className="max-w-7xl mx-auto px-4 md:px-6 pb-0 pt-0 flex flex-col overflow-hidden"'
);

// The scroll container currently has:
// className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
homeCode = homeCode.replace(
  'className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"',
  'className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 pb-1 md:pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"'
);

// Title container
// className="flex items-end justify-between mb-6 md:mb-8"
homeCode = homeCode.replace(
  'className="flex items-end justify-between mb-6 md:mb-8"',
  'className={`flex items-end justify-between mb-4 md:mb-6 ${sectionId !== "newArrivals" ? "mt-2 md:mt-4" : ""}`}'
);

fs.writeFileSync('src/views/HomeView.tsx', homeCode);
console.log('Fixed HomeView row spacing further');
