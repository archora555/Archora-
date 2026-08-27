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
    <div className="fixed top-20 left-4 w-64 bg-white shadow-2xl rounded-xl border border-gray-200 z-[99999] flex flex-col max-h-[80vh] overflow-hidden">
      <div className="p-3 border-b bg-gray-50 font-semibold text-sm text-gray-700 flex items-center gap-2">
        <PlusSquare className="w-4 h-4" /> Add Component
      </div>
      <div className="p-3 overflow-y-auto grid grid-cols-2 gap-2">
        <button onClick={() => addComponent('Header')} className="flex flex-col items-center gap-1 p-3 border rounded hover:bg-gray-50">
          <Layout className="w-6 h-6 text-gray-500" />
          <span className="text-xs font-medium">Header</span>
        </button>
        <button onClick={() => addComponent('Hero', { title: 'New Hero', subtitle: 'Subtitle text' })} className="flex flex-col items-center gap-1 p-3 border rounded hover:bg-gray-50">
          <Image className="w-6 h-6 text-gray-500" />
          <span className="text-xs font-medium">Hero</span>
        </button>
        <button onClick={() => addComponent('Section')} className="flex flex-col items-center gap-1 p-3 border rounded hover:bg-gray-50">
          <Layout className="w-6 h-6 text-gray-500" />
          <span className="text-xs font-medium">Section</span>
        </button>
        <button onClick={() => addComponent('Text', { content: 'Enter your text here' })} className="flex flex-col items-center gap-1 p-3 border rounded hover:bg-gray-50">
          <Type className="w-6 h-6 text-gray-500" />
          <span className="text-xs font-medium">Text</span>
        </button>
        <button onClick={() => addComponent('Button', { text: 'Click Me' }, { backgroundColor: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '4px' })} className="flex flex-col items-center gap-1 p-3 border rounded hover:bg-gray-50">
          <div className="w-8 h-4 bg-blue-600 rounded"></div>
          <span className="text-xs font-medium">Button</span>
        </button>
      </div>
    </div>
  );
};
