const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldTitle = `            <h2 
              className="font-display uppercase tracking-[0.2em] text-gray-500 font-medium text-sm md:text-base text-center"
              style={{
                letterSpacing: \`\${layoutConfig.categorySection.letterSpacing}px\`
              }}
            >
              {layoutConfig.categorySection.title}
            </h2>`;

const newTitle = `            <h2 
              className="font-display uppercase tracking-[0.2em] font-medium text-sm md:text-base text-center bg-gradient-to-r from-[#AA8B29] via-[#E5C762] to-[#AA8B29] bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer"
              style={{
                letterSpacing: \`\${layoutConfig.categorySection.letterSpacing}px\`
              }}
            >
              {layoutConfig.categorySection.title}
            </h2>`;

code = code.replace(oldTitle, newTitle);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('Category title updated');
