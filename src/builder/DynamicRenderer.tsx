import React from 'react';
import { useBuilder, ComponentNode } from './BuilderContext';
import { ResizeHandle, MarginHandle } from './Handles';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CategorySelector } from '../components/CategorySelector';

// Placeholder mapping of types to actual React components
const ComponentsMap: Record<string, React.FC<any>> = {
  Header: () => <div className="p-4 bg-gray-100 text-center font-bold">Header Placeholder (Uses Navbar internally if desired)</div>,
  Hero: ({ title, subtitle }) => <div className="p-20 bg-gray-900 text-white text-center"><h1>{title}</h1><p>{subtitle}</p></div>,
  Footer: () => <div className="p-10 bg-black text-white text-center">Footer</div>,
  Section: ({ children }) => <div className="w-full flex flex-col">{children}</div>,
  Text: ({ content }) => <p>{content}</p>,
  Button: ({ text }) => <button className="px-6 py-3 bg-blue-600 text-white rounded">{text}</button>
};

export const DynamicElement = ({ node }: { node: ComponentNode }) => {
  const { selectedId, setSelectedId, isEditMode, updateNode } = useBuilder();
  const isSelected = selectedId === node.id;

  const Comp = ComponentsMap[node.type] || 'div';
  
  const handleSelect = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    setSelectedId(node.id);
  };

  return (
    <div 
      className={`relative transition-all ${isEditMode ? 'hover:ring-1 hover:ring-blue-300' : ''} ${isSelected ? 'ring-2 ring-blue-500 z-40' : ''}`}
      onClick={handleSelect}
      style={{ ...node.styles }}
    >
      <Comp {...node.props}>
        {node.children && node.children.map(child => (
          <DynamicElement key={child.id} node={child} />
        ))}
      </Comp>

      {isSelected && isEditMode && (
        <>
          <ResizeHandle 
            id={node.id} 
            onResize={(w, h) => updateNode(node.id, { styles: { ...node.styles, width: w, height: h }})} 
          />
          <MarginHandle 
            id={node.id} 
            onMarginChange={(m) => updateNode(node.id, { styles: { ...node.styles, margin: m }})} 
          />
        </>
      )}
    </div>
  );
};

export const DynamicRenderer = () => {
  const { tree } = useBuilder();
  return (
    <div className="w-full min-h-screen">
      {tree.children.map(child => (
        <DynamicElement key={child.id} node={child} />
      ))}
    </div>
  );
};
