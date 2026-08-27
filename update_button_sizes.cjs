const fs = require('fs');
let code = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

const oldBudget = `        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'budget' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >`;

const newBudget = `        {/* Budget Card */}
        <button 
          onClick={() => handleMainClick('budget')}
          className={\`w-36 md:w-64 py-5 md:py-8 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'budget' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >`;

const oldDesigner = `        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={\`px-8 py-4 md:px-16 md:py-6 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'designer' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >`;

const newDesigner = `        {/* Designer Card */}
        <button 
          onClick={() => handleMainClick('designer')}
          className={\`w-36 md:w-64 py-5 md:py-8 relative overflow-hidden group transition-all duration-500 ease-out flex items-center justify-center rounded-sm border
            \${activeMain === 'designer' 
              ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105' 
              : 'border-gray-200 bg-white hover:border-[#D4AF37] hover:shadow-md'}\`}
        >`;

code = code.replace(oldBudget, newBudget);
code = code.replace(oldDesigner, newDesigner);

fs.writeFileSync('src/components/CategorySelector.tsx', code);
console.log('CategorySelector button sizes updated');
