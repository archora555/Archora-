import React, { createContext, useContext, useState, useEffect } from 'react';

export type ComponentNode = {
  id: string;
  type: string;
  props: any;
  styles: any;
  children: ComponentNode[];
};

interface BuilderContextType {
  tree: ComponentNode;
  setTree: (tree: ComponentNode | ((prev: ComponentNode) => ComponentNode)) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  updateNode: (id: string, updates: Partial<ComponentNode>) => void;
  removeNode: (id: string) => void;
  moveNode: (id: string, direction: 'up' | 'down') => void;
}

const defaultTree: ComponentNode = {
  id: 'root',
  type: 'Page',
  props: {},
  styles: {},
  children: [
    { id: 'header', type: 'Header', props: {}, styles: {}, children: [] },
    { id: 'hero', type: 'Hero', props: { title: 'Elevate Your Space', subtitle: 'Discover the new collection' }, styles: {}, children: [] },
    { id: 'footer', type: 'Footer', props: {}, styles: {}, children: [] }
  ]
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tree, setTree] = useState<ComponentNode>(() => {
    try {
      const saved = localStorage.getItem('archora_builder_tree');
      return saved ? JSON.parse(saved) : defaultTree;
    } catch {
      return defaultTree;
    }
  });
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('archora_builder_tree', JSON.stringify(tree));
  }, [tree]);

  const updateNodeRecursive = (node: ComponentNode, id: string, updates: Partial<ComponentNode>): ComponentNode => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    return {
      ...node,
      children: node.children.map(child => updateNodeRecursive(child, id, updates))
    };
  };

  const removeNodeRecursive = (node: ComponentNode, id: string): ComponentNode => {
    return {
      ...node,
      children: node.children.filter(c => c.id !== id).map(child => removeNodeRecursive(child, id))
    };
  };

  const updateNode = (id: string, updates: Partial<ComponentNode>) => {
    setTree(prev => updateNodeRecursive(prev, id, updates));
  };

  const removeNode = (id: string) => {
    setTree(prev => removeNodeRecursive(prev, id));
  };

  const moveNodeRecursive = (node: ComponentNode, id: string, direction: 'up' | 'down'): ComponentNode => {
    const idx = node.children.findIndex(c => c.id === id);
    if (idx !== -1) {
      const newChildren = [...node.children];
      if (direction === 'up' && idx > 0) {
        [newChildren[idx - 1], newChildren[idx]] = [newChildren[idx], newChildren[idx - 1]];
      } else if (direction === 'down' && idx < newChildren.length - 1) {
        [newChildren[idx], newChildren[idx + 1]] = [newChildren[idx + 1], newChildren[idx]];
      }
      return { ...node, children: newChildren };
    }
    return {
      ...node,
      children: node.children.map(child => moveNodeRecursive(child, id, direction))
    };
  };

  const moveNode = (id: string, direction: 'up' | 'down') => {
    setTree(prev => moveNodeRecursive(prev, id, direction));
  };

  return (
    <BuilderContext.Provider value={{ tree, setTree, selectedId, setSelectedId, isEditMode, setIsEditMode, updateNode, removeNode, moveNode }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};
