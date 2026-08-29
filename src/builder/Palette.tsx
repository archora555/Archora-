import React from 'react';
import { useBuilder } from './BuilderContext';
import { Layout, Type, Image, PlusSquare } from 'lucide-react';

export const BuilderPalette = () => {
  const { setTree, isEditMode } = useBuilder();

  if (!isEditMode) return null;

  const addComponent = (type: string, props: any = {}, styles: any = {}) => {
    const newNode = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      props,
      styles,
      children: []
    };
    
    setTree(prev => {
      const newRoot = { ...prev };
      newRoot.children = [...newRoot.children, newNode];
      return newRoot;
    });
  };

  return (
    <div className="fixed top-20 left-4 w-64 bg-[#0e0e0e]/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl border border-white/20 z-[99999] flex flex-col max-h-[80vh] overflow-hidden text-white">
      <div className="p-3 border-b border-white/10 bg-white/5 font-semibold text-sm text-archora-gold flex items-center gap-2">
        <PlusSquare className="w-4 h-4" /> Add Component
      </div>
      <div className="p-3 overflow-y-auto grid grid-cols-2 gap-2">
        <button onClick={() => addComponent('Header')} className="flex flex-col items-center gap-1.5 p-3 border border-white/15 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <Layout className="w-6 h-6 text-archora-gold" />
          <span className="text-xs font-medium text-gray-200">Header</span>
        </button>
        <button onClick={() => addComponent('Hero', { title: 'New Hero', subtitle: 'Subtitle text' })} className="flex flex-col items-center gap-1.5 p-3 border border-white/15 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <Image className="w-6 h-6 text-archora-gold" />
          <span className="text-xs font-medium text-gray-200">Hero</span>
        </button>
        <button onClick={() => addComponent('Section')} className="flex flex-col items-center gap-1.5 p-3 border border-white/15 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <Layout className="w-6 h-6 text-archora-gold" />
          <span className="text-xs font-medium text-gray-200">Section</span>
        </button>
        <button onClick={() => addComponent('Text', { content: 'Enter your text here' })} className="flex flex-col items-center gap-1.5 p-3 border border-white/15 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <Type className="w-6 h-6 text-archora-gold" />
          <span className="text-xs font-medium text-gray-200">Text</span>
        </button>
        <button onClick={() => addComponent('Button', { text: 'Click Me' }, { backgroundColor: '#C5A880', color: '#000', padding: '10px 20px', borderRadius: '8px' })} className="flex flex-col items-center gap-1.5 p-3 border border-white/15 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-8 h-4 bg-archora-gold rounded"></div>
          <span className="text-xs font-medium text-gray-200">Button</span>
        </button>
      </div>
    </div>
  );
};
