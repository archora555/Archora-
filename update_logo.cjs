const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  '<span className="font-display text-3xl font-bold tracking-tight">{logoConfig.text || \'ARCHORA\'}</span>',
  '<span className="font-display text-3xl md:text-4xl tracking-[0.1em] text-[#D4AF37]" style={{ textShadow: "0px 1px 1px rgba(0,0,0,0.1)" }}>{logoConfig.text || \'ARCHORA\'}</span>'
);

// We should also replace the hidden fallback just in case
code = code.replace(
  '<span className="hidden font-display text-3xl font-bold tracking-tight">{logoConfig.text || \'ARCHORA\'}</span>',
  '<span className="hidden font-display text-3xl md:text-4xl tracking-[0.1em] text-[#D4AF37]">{logoConfig.text || \'ARCHORA\'}</span>'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log('Logo updated');
