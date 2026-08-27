const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const regex = /<div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center mt-8 md:mt-16">[\s\S]*?<\/motion\.div>\s*<\/div>/g;
code = code.replace(regex, '');

fs.writeFileSync('src/components/Hero.tsx', code);
console.log('Hero block removed');
