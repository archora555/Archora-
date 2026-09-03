import React from 'react';

interface ArchoraLogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  alt?: string;
  mode?: 'img' | 'svg';
  style?: React.CSSProperties;
}

export const ArchoraLogo: React.FC<ArchoraLogoProps> = ({
  className = '',
  height = 'auto',
  width = 'auto',
  alt = 'ARCHORA Luxury Furniture',
  style = {},
}) => {
  return (
    <img
      src="/1787550151155-removebg-preview.png"
      alt={alt}
      className={`object-contain select-none transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${className}`}
      style={{ height, width, ...style }}
    />
  );
};
