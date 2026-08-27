const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

// replace md:aspect-square with md:aspect-[3/4] to keep them portrait on desktop too.
code = code.replace(/md:aspect-square/g, 'md:aspect-[3/4]');

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('CategorySelector aspect ratio updated');
