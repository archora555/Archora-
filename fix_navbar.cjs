const fs = require('fs');
const lines = fs.readFileSync('src/components/Navbar.tsx', 'utf8').split('\\n');

// Find the index of "Center Empty Space"
const startIdx = lines.findIndex(l => l.includes('{/* Center Empty Space to maintain grid balance */}'));

if (startIdx !== -1) {
  const newEnding = `        {/* Center Space */}
        <div className="hidden md:flex order-2 col-span-1 items-center justify-center">
          {layoutConfig.logoSettings.align === 'center' && (
            <div 
              className="cursor-pointer flex items-center justify-center"
              onClick={() => { navigate('/'); setCurrentView('home'); }}
              style={{ transform: \\\`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\\\` }}
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
              style={{ transform: \\\`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\\\` }}
            >
              <LogoWrapper />
            </div>
          )}
        </div>
      </div>
    </header>
    </div>
  );
};
`;
  lines.splice(startIdx, lines.length - startIdx, newEnding);
  fs.writeFileSync('src/components/Navbar.tsx', lines.join('\\n'));
} else {
  console.log('Could not find start idx');
}
