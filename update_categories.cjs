const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldRegex = /<div className="flex gap-2 md:gap-4 justify-center mb-6">[\s\S]*?Future Interior[\s\S]*?<\/button>\s*<\/div>/;

const newButtons = `<div className="flex gap-4 md:gap-8 justify-center mb-6 px-2 md:px-0 max-w-4xl mx-auto">
        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={\`flex-1 aspect-[3/4] md:aspect-[3/4] max-h-[300px] max-w-[200px] relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'budget' 
              ? 'border-gray-400 bg-white shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'}\`}
        >
          <span className={\`relative z-10 font-display text-2xl md:text-4xl tracking-wide transition-colors duration-500 \${activeMain === 'budget' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-gray-800'}\`}>
            Budget
          </span>
        </button>
        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={\`flex-1 aspect-[3/4] md:aspect-[3/4] max-h-[300px] max-w-[200px] relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'designer' 
              ? 'border-gray-400 bg-white shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'}\`}
        >
          <span className={\`relative z-10 font-display text-2xl md:text-4xl tracking-wide transition-colors duration-500 \${activeMain === 'designer' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-gray-800'}\`}>
            Designer
          </span>
        </button>
      </div>`;

code = code.replace(oldRegex, newButtons);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('CategorySelector updated');
