import React, { useRef, useEffect } from 'react';
import { useBuilder } from './BuilderContext';

export const ResizeHandle = ({ id, onResize }: { id: string, onResize: (w: number, h: number) => void }) => {
  return (
    <div 
      className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-tl-md z-50 shadow-sm"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const parent = (e.target as HTMLElement).parentElement;
        if (!parent) return;
        const startW = parent.offsetWidth;
        const startH = parent.offsetHeight;

        const onPointerMove = (moveEvent: PointerEvent) => {
          const newW = startW + (moveEvent.clientX - startX);
          const newH = startH + (moveEvent.clientY - startY);
          onResize(newW, newH);
        };
        const onPointerUp = () => {
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      }}
    />
  );
};

export const MarginHandle = ({ id, onMarginChange }: { id: string, onMarginChange: (margin: number) => void }) => {
  return (
    <div 
      className="absolute top-1/2 -right-4 w-4 h-8 bg-blue-400 cursor-e-resize flex items-center justify-center text-white text-[8px] rounded z-50 shadow-sm -translate-y-1/2"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        let lastMargin = 0;
        
        const onPointerMove = (moveEvent: PointerEvent) => {
          const delta = moveEvent.clientX - startX;
          lastMargin = Math.max(0, delta);
          onMarginChange(lastMargin);
        };
        const onPointerUp = () => {
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      }}
    >
      ||
    </div>
  );
};
