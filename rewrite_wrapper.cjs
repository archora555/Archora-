const fs = require('fs');
let content = fs.readFileSync('src/components/VisualEditor/EditableWrapper.tsx', 'utf8');

content = content.replace(
  `import { Check, EyeOff, Palette, ArrowUp, ArrowDown, Sliders } from 'lucide-react';`,
  `import { Check, EyeOff, Palette, ArrowUp, ArrowDown, Sliders, AlignLeft, AlignCenter, AlignRight, Plus, Trash2 } from 'lucide-react';`
);

content = content.replace(
  `  onMarginChange?: (margin: number) => void;
  currentMargin?: number;
}`,
  `  onMarginChange?: (margin: number) => void;
  currentMargin?: number;

  onAlignChange?: (align: 'left' | 'center' | 'right') => void;
  currentAlign?: 'left' | 'center' | 'right';
  
  onOffsetXChange?: (offset: number) => void;
  currentOffsetX?: number;
  
  onOffsetYChange?: (offset: number) => void;
  currentOffsetY?: number;

  onAdd?: () => void;
  onDelete?: () => void;
}`
);

content = content.replace(
  `  onMarginChange, currentMargin
}) => {`,
  `  onMarginChange, currentMargin,
  onAlignChange, currentAlign,
  onOffsetXChange, currentOffsetX,
  onOffsetYChange, currentOffsetY,
  onAdd, onDelete
}) => {`
);

content = content.replace(
  `hasSliders = !!onResize || !!onFontSizeChange || !!onMarginChange;`,
  `hasSliders = !!onResize || !!onFontSizeChange || !!onMarginChange || !!onOffsetXChange || !!onOffsetYChange;`
);

content = content.replace(
  `className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg flex items-center p-1.5 z-[100] border border-gray-100 whitespace-nowrap"`,
  `className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg flex items-center p-1.5 z-[99999] border border-gray-100 whitespace-nowrap" style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' }}`
);

content = content.replace(
  `              {onMoveDown && (
                <button onClick={onMoveDown} className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors" title="Move Down">
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}`,
  `              {onMoveDown && (
                <button onClick={onMoveDown} className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors" title="Move Down">
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              {onAlignChange && (
                <div className="flex bg-gray-50 rounded-md border border-gray-100 p-0.5 ml-1 mr-1">
                  <button onClick={() => onAlignChange('left')} className={\`p-1.5 rounded-sm transition-colors \${currentAlign === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}\`} title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => onAlignChange('center')} className={\`p-1.5 rounded-sm transition-colors \${currentAlign === 'center' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}\`} title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button onClick={() => onAlignChange('right')} className={\`p-1.5 rounded-sm transition-colors \${currentAlign === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}\`} title="Align Right">
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              {onAdd && (
                <button onClick={onAdd} className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors flex items-center gap-1" title="Add Item">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs pr-1 font-medium">Add</span>
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}`
);

content = content.replace(
  `                {onMarginChange && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Spacing</span>
                      <span>{currentMargin || 0}px</span>
                    </label>
                    <input 
                      type="range" min="0" max="200" value={currentMargin || 0}
                      onChange={(e) => onMarginChange(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}`,
  `                {onMarginChange && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Spacing</span>
                      <span>{currentMargin || 0}px</span>
                    </label>
                    <input 
                      type="range" min="0" max="200" value={currentMargin || 0}
                      onChange={(e) => onMarginChange(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
                {onOffsetXChange && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>X Offset</span>
                      <span>{currentOffsetX || 0}px</span>
                    </label>
                    <input 
                      type="range" min="-300" max="300" value={currentOffsetX || 0}
                      onChange={(e) => onOffsetXChange(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
                {onOffsetYChange && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Y Offset</span>
                      <span>{currentOffsetY || 0}px</span>
                    </label>
                    <input 
                      type="range" min="-300" max="300" value={currentOffsetY || 0}
                      onChange={(e) => onOffsetYChange(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}`
);

fs.writeFileSync('src/components/VisualEditor/EditableWrapper.tsx', content);
