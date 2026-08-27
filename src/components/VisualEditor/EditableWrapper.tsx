import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Check, EyeOff, Palette, ArrowUp, ArrowDown, Sliders, AlignLeft, AlignCenter, AlignRight, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditableWrapperProps {
  children: React.ReactNode;
  id: string;
  type?: 'logo' | 'announcement' | 'categoryTitle' | 'categoryCards' | 'margins' | 'hero' | 'footer' | 'section';
  
  onResize?: (width: number, height: number) => void;
  currentWidth?: number;
  currentHeight?: number;
  
  onTextChange?: (newText: string) => void;
  isTextEditable?: boolean;
  
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  
  onColorChange?: (color: string) => void;
  onHide?: () => void;
  
  onFontSizeChange?: (size: number) => void;
  currentFontSize?: number;
  
  onMarginChange?: (margin: number) => void;
  currentMargin?: number;

  onAlignChange?: (align: 'left' | 'center' | 'right') => void;
  currentAlign?: 'left' | 'center' | 'right';
  
  onOffsetXChange?: (offset: number) => void;
  currentOffsetX?: number;
  
  onOffsetYChange?: (offset: number) => void;
  currentOffsetY?: number;

  onAdd?: () => void;
  onDelete?: () => void;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({ 
  children, id, type, 
  onResize, currentWidth, currentHeight,
  onTextChange, isTextEditable,
  onMoveUp, onMoveDown, onColorChange, onHide,
  onFontSizeChange, currentFontSize,
  onMarginChange, currentMargin,
  onAlignChange, currentAlign,
  onOffsetXChange, currentOffsetX,
  onOffsetYChange, currentOffsetY,
  onAdd, onDelete
}) => {
  const { isVisualEditMode, layoutConfig, setLayoutConfig } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsActive(false);
        setShowSliders(false);
      }
    };
    if (isActive) {
      document.addEventListener('mousedown', handleGlobalClick);
      // for mobile:
      document.addEventListener('touchstart', handleGlobalClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [isActive]);

  if (!isVisualEditMode) return <>{children}</>;

  const handleSave = () => {
    localStorage.setItem('archora_layoutConfig', JSON.stringify(layoutConfig));
    setIsActive(false);
    setShowSliders(false);
  };

  // Pointer Events for Drag-to-Resize (Works on Mobile/Touch + Desktop)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsResizing(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing && wrapperRef.current && onResize) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const newWidth = Math.max(50, e.clientX - rect.left);
      const newHeight = Math.max(20, e.clientY - rect.top);
      onResize(newWidth, newHeight);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsResizing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const hasSliders = !!onResize || !!onFontSizeChange || !!onMarginChange || !!onOffsetXChange || !!onOffsetYChange;

  return (
    <div 
      ref={wrapperRef}
      className={`relative ${isVisualEditMode ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (isVisualEditMode) {
          e.stopPropagation();
          setIsActive(true);
        }
      }}
    >
      <div className={`absolute inset-0 pointer-events-none border-2 border-dashed transition-colors z-40 ${
        isActive ? 'border-archora-gold' : isHovered ? 'border-blue-400/50' : 'border-transparent'
      }`} style={{ margin: '-4px' }} />

      {/* Resize Handle (Bottom Right) */}
      {isActive && onResize && (
        <div 
          className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 rounded-full border-[3px] border-white cursor-se-resize z-50 shadow-md touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}

      {/* Floating Toolbar */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg flex items-center p-1.5 z-[99999] border border-gray-100 whitespace-nowrap" style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1">
              {onMoveUp && (
                <button onClick={onMoveUp} className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors" title="Move Up">
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {onMoveDown && (
                <button onClick={onMoveDown} className="p-2 hover:bg-gray-100 rounded-md text-gray-700 transition-colors" title="Move Down">
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              {onAlignChange && (
                <div className="flex bg-gray-50 rounded-md border border-gray-100 p-0.5 ml-1 mr-1">
                  <button onClick={() => onAlignChange('left')} className={`p-1.5 rounded-sm transition-colors ${currentAlign === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => onAlignChange('center')} className={`p-1.5 rounded-sm transition-colors ${currentAlign === 'center' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button onClick={() => onAlignChange('right')} className={`p-1.5 rounded-sm transition-colors ${currentAlign === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title="Align Right">
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
              )}
              
              {onColorChange && (
                <div className="relative p-2 hover:bg-gray-100 rounded-md text-gray-700 cursor-pointer overflow-hidden transition-colors" title="Change Color">
                  <Palette className="w-4 h-4" />
                  <input type="color" className="absolute -top-4 -left-4 w-16 h-16 opacity-0 cursor-pointer" onChange={(e) => onColorChange(e.target.value)} />
                </div>
              )}
              
              {hasSliders && (
                <button onClick={() => setShowSliders(!showSliders)} className={`p-2 rounded-md transition-colors ${showSliders ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`} title="Adjust Sizes">
                  <Sliders className="w-4 h-4" />
                </button>
              )}

              {onHide && (
                <button onClick={onHide} className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors" title="Toggle Visibility">
                  <EyeOff className="w-4 h-4" />
                </button>
              )}
              
              <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
              
              <button onClick={handleSave} className="p-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700 transition-colors font-medium flex items-center gap-1 px-3" title="Save Changes">
                <Check className="w-4 h-4" />
                <span className="text-xs">Save</span>
              </button>
            </div>

            {/* Sliders Panel */}
            {showSliders && hasSliders && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-100 p-4 min-w-[200px] flex flex-col gap-4"
              >
                {onResize && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Size</span>
                      <span>{Math.round(currentWidth || 0)}px</span>
                    </label>
                    <input 
                      type="range" min="20" max="800" value={currentWidth || 100}
                      onChange={(e) => onResize(Number(e.target.value), currentHeight || Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
                {onFontSizeChange && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                      <span>Font Size</span>
                      <span>{currentFontSize || 16}px</span>
                    </label>
                    <input 
                      type="range" min="10" max="120" value={currentFontSize || 16}
                      onChange={(e) => onFontSizeChange(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
                {onMarginChange && (
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
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={isActive ? 'opacity-90' : ''}
        contentEditable={isTextEditable && isActive}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          if (onTextChange && isTextEditable) {
            onTextChange(e.currentTarget.textContent || '');
          }
        }}
      >
        {children}
      </div>
    </div>
  );
};
