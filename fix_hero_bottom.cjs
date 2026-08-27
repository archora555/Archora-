const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Move dots up
code = code.replace(
  'className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto"',
  'className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto"'
);

// Reduce bottom padding of section
code = code.replace(
  'className="relative w-full flex flex-col justify-center overflow-hidden bg-white pt-24 pb-8 md:pb-12"',
  'className="relative w-full flex flex-col justify-center overflow-hidden bg-white pt-24 pb-4 md:pb-6"'
);

// Remove the whole "Select a category" block in Hero
const blockToRemove = `<div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center mt-8 md:mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          {introFinished && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-gray-500 text-sm md:text-base uppercase tracking-[0.2em] font-medium mt-2"
            >
              Select a category
            </motion.p>
          )}
        </motion.div>
      </div>`;

if (code.includes(blockToRemove)) {
  code = code.replace(blockToRemove, '');
} else {
  // Try regex if spacing differs
  code = code.replace(/<div className="relative z-10 text-center[\s\S]*?<\/div>\s*<\/div>/, '');
}

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero updated');
