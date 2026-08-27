const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(
  `        {/* Center Empty Space to maintain grid balance */}
        <div className="hidden md:block order-2 col-span-1"></div>
        
        {/* Logo (Right Corner) */}
        <div 
          className="cursor-pointer flex items-center justify-end order-1 md:order-3 col-span-1"
          onClick={() => { navigate('/'); setCurrentView('home'); }}
        >`,
  `        {/* Center Space */}
        <div className="hidden md:flex order-2 col-span-1 items-center justify-center">
          {layoutConfig.logoSettings.align === 'center' && (
            <div 
              className="cursor-pointer flex items-center justify-center"
              onClick={() => { navigate('/'); setCurrentView('home'); }}
              style={{ transform: \`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\` }}
            >
              <LogoWrapper />
            </div>
          )}
        </div>
        
        {/* Right Space */}
        <div className="flex items-center justify-end order-1 md:order-3 col-span-1">
          {(!layoutConfig.logoSettings.align || layoutConfig.logoSettings.align === 'right') && (
            <div 
              className="cursor-pointer flex items-center justify-end"
              onClick={() => { navigate('/'); setCurrentView('home'); }}
              style={{ transform: \`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\` }}
            >
              <LogoWrapper />
            </div>
          )}
        </div>`
);

content = content.replace(
  `          <EditableWrapper 
            id="logo" 
            type="logo"
            currentWidth={layoutConfig.logoSettings.width}
            onResize={(w) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, width: w}})}
            isTextEditable={logoConfig.type === 'text' || !logoConfig.imageUrl}
            onTextChange={(t) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, text: t}})}
          >
            {logoConfig.type === 'text' || !logoConfig.imageUrl ? (
              <span className="font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
            ) : (
              <img 
                src={logoConfig.imageUrl} 
                alt={logoConfig.text || 'ARCHORA'} 
                className="object-contain" style={{ 
                  width: \`\${layoutConfig.logoSettings.width}px\`, 
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? \`\${layoutConfig.logoSettings.mobileHeight}px\` : \`\${layoutConfig.logoSettings.desktopHeight}px\` 
                }}
              />
            )}
            {logoConfig.type === 'image' && logoConfig.imageUrl && (
              <span className="hidden font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
            )}
          </EditableWrapper>
        </div>`,
  ``
);

const logoWrapperDefinition = `
  const LogoWrapper = () => (
    <EditableWrapper 
      id="logo" 
      type="logo"
      currentWidth={layoutConfig.logoSettings.width}
      onResize={(w) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, width: w}})}
      isTextEditable={logoConfig.type === 'text' || !logoConfig.imageUrl}
      onTextChange={(t) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, text: t}})}
      currentAlign={layoutConfig.logoSettings.align || 'right'}
      onAlignChange={(a) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, align: a}})}
      currentOffsetX={layoutConfig.logoSettings.offsetX}
      onOffsetXChange={(x) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, offsetX: x}})}
      currentOffsetY={layoutConfig.logoSettings.offsetY}
      onOffsetYChange={(y) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, offsetY: y}})}
    >
      {logoConfig.type === 'text' || !logoConfig.imageUrl ? (
        <span className="font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
      ) : (
        <img 
          src={logoConfig.imageUrl} 
          alt={logoConfig.text || 'ARCHORA'} 
          className="object-contain" style={{ 
            width: \`\${layoutConfig.logoSettings.width}px\`, 
            height: typeof window !== 'undefined' && window.innerWidth < 768 ? \`\${layoutConfig.logoSettings.mobileHeight}px\` : \`\${layoutConfig.logoSettings.desktopHeight}px\` 
          }}
        />
      )}
      {logoConfig.type === 'image' && logoConfig.imageUrl && (
        <span className="hidden font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
      )}
    </EditableWrapper>
  );

`;

// Add LogoWrapper inside Navbar before return
content = content.replace(
  `  return (`,
  logoWrapperDefinition + `  return (`
);

// We also need to add logic for `align === 'left'` to the left icons corner.
content = content.replace(
  `        {/* Icons Navigation (Left Corner) */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-start order-1 relative z-10 w-full col-span-2 md:col-span-1 border-gray-400">`,
  `        {/* Left Side */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-start order-1 relative z-10 w-full col-span-2 md:col-span-1 border-gray-400">
          {layoutConfig.logoSettings.align === 'left' && (
            <div 
              className="cursor-pointer flex items-center justify-start mr-4"
              onClick={() => { navigate('/'); setCurrentView('home'); }}
              style={{ transform: \`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\` }}
            >
              <LogoWrapper />
            </div>
          )}`
);

fs.writeFileSync('src/components/Navbar.tsx', content);
