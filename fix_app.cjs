const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('BuilderProvider')) {
  code = `import { BuilderProvider } from './builder/BuilderContext';\nimport { BuilderToolbar } from './builder/Toolbar';\nimport { BuilderPalette } from './builder/Palette';\n` + code;
  code = code.replace('<AppProvider>', '<AppProvider><BuilderProvider>');
  code = code.replace('</AppProvider>', '</BuilderProvider></AppProvider>');
  code = code.replace('{isMainSite && <WhatsAppButton />}', '{isMainSite && <WhatsAppButton />}\n      <BuilderToolbar />\n      <BuilderPalette />');
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx updated');
} else {
  console.log('Already updated');
}
