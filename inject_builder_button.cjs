const fs = require('fs');
let code = fs.readFileSync('src/views/AdminView.tsx', 'utf8');

if (!code.includes('Site Builder')) {
  code = code.replace(
    'import { useAppContext } from \'../context/AppContext\';', 
    'import { useAppContext } from \'../context/AppContext\';\nimport { useBuilder } from \'../builder/BuilderContext\';'
  );

  const buttonCode = `
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-blue-900 mb-1">Visual Site Builder</h3>
          <p className="text-sm text-blue-700">Enter full-site drag-and-drop edit mode to design your storefront structure, typography, buttons, and layout.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditMode(true);
            setIsVisualEditMode(true); // legacy compat
            navigate('/');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium whitespace-nowrap transition-colors shadow-sm"
        >
          Launch Visual Builder
        </button>
      </div>
  `;

  code = code.replace('{activeTab === \'layout\' && (', '{activeTab === \'layout\' && (\n' + buttonCode);

  const hookCode = `  const { isVisualEditMode, setIsVisualEditMode } = useAppContext();
  const { setIsEditMode } = useBuilder();`;

  code = code.replace('const { orders, products', hookCode + '\n  const { orders, products');

  fs.writeFileSync('src/views/AdminView.tsx', code);
  console.log('AdminView updated');
} else {
  console.log('AdminView already updated');
}
