const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldBudget = `        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'budget' 
              ? 'border-gray-400 bg-white shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'}\`}
        >
          <span className={\`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 \${activeMain === 'budget' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-gray-800'}\`}>
            Budget
          </span>
        </button>`;

const newBudget = `        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'budget' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >
          <span className={\`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 \${activeMain === 'budget' ? 'text-white font-medium drop-shadow-sm' : 'text-gray-500 group-hover:text-[#D4AF37]'}\`}>
            Budget
          </span>
        </button>`;

const oldDesigner = `        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'designer' 
              ? 'border-gray-400 bg-white shadow-md' 
              : 'border-gray-200 bg-white hover:border-gray-300'}\`}
        >
          <span className={\`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 \${activeMain === 'designer' ? 'text-archora-black font-medium' : 'text-gray-500 group-hover:text-gray-800'}\`}>
            Designer
          </span>
        </button>`;

const newDesigner = `        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'designer' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >
          <span className={\`relative z-10 font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 \${activeMain === 'designer' ? 'text-white font-medium drop-shadow-sm' : 'text-gray-500 group-hover:text-[#D4AF37]'}\`}>
            Designer
          </span>
        </button>`;

code = code.replace(oldBudget, newBudget);
code = code.replace(oldDesigner, newDesigner);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('CategorySelector buttons updated');
