import React, { useState } from 'react';
import { useBuilder, ComponentNode } from './BuilderContext';
import { Settings, Type, Move, X, Plus, Copy, Trash } from 'lucide-react';

export const BuilderToolbar = () => {
  const { tree, selectedId, setSelectedId, updateNode, removeNode, moveNode } = useBuilder();
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');

  if (!selectedId) return null;

  const findNode = (node: ComponentNode, id: string): ComponentNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const node = findNode(tree, selectedId);
  if (!node) return null;

  return (
    <div className="fixed top-20 right-4 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 z-[99999] overflow-hidden flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <span className="font-semibold text-sm text-gray-700">Editing: {node.type}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => moveNode(node.id, 'up')} className="p-1 hover:bg-gray-200 rounded" title="Move Up">↑</button>
          <button onClick={() => moveNode(node.id, 'down')} className="p-1 hover:bg-gray-200 rounded" title="Move Down">↓</button>
          <button onClick={() => removeNode(node.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash className="w-4 h-4" /></button>
          <button onClick={() => setSelectedId(null)} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="flex border-b text-sm">
        <button 
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-2 ${activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('style')}
        ><Settings className="w-4 h-4"/> Style</button>
        <button 
          className={`flex-1 py-2 font-medium flex items-center justify-center gap-2 ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        ><Type className="w-4 h-4"/> Content</button>
      </div>

      <div className="p-4 overflow-y-auto flex flex-col gap-4">
        {activeTab === 'style' && (
          <>
            <div>
              <label className="text-xs font-semibold text-gray-500">Margin</label>
              <input type="range" min="0" max="100" value={parseInt(node.styles.margin || '0')} onChange={e => updateNode(node.id, { styles: { ...node.styles, margin: `${e.target.value}px` }})} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Padding</label>
              <input type="range" min="0" max="100" value={parseInt(node.styles.padding || '0')} onChange={e => updateNode(node.id, { styles: { ...node.styles, padding: `${e.target.value}px` }})} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Corner Radius</label>
              <input type="range" min="0" max="50" value={parseInt(node.styles.borderRadius || '0')} onChange={e => updateNode(node.id, { styles: { ...node.styles, borderRadius: `${e.target.value}px` }})} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Background Color</label>
              <input type="color" value={node.styles.backgroundColor || '#ffffff'} onChange={e => updateNode(node.id, { styles: { ...node.styles, backgroundColor: e.target.value }})} className="w-full h-8 cursor-pointer" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">Text Color</label>
              <input type="color" value={node.styles.color || '#000000'} onChange={e => updateNode(node.id, { styles: { ...node.styles, color: e.target.value }})} className="w-full h-8 cursor-pointer" />
            </div>
          </>
        )}

        {activeTab === 'content' && (
          <div className="flex flex-col gap-3">
            {Object.keys(node.props).map(key => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase">{key}</label>
                <input 
                  type="text" 
                  value={node.props[key]} 
                  onChange={e => updateNode(node.id, { props: { ...node.props, [key]: e.target.value }})}
                  className="w-full border rounded px-2 py-1 mt-1 text-sm"
                />
              </div>
            ))}
            {Object.keys(node.props).length === 0 && <p className="text-sm text-gray-400">No content props available for this component.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
