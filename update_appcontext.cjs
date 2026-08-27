const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

code = code.replace(
  '{ id: 1, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000", title: "Living Room" }',
  '{ id: 1, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000", title: "The Burl & Jade Collection" }'
);

fs.writeFileSync('src/context/AppContext.tsx', code);
console.log('AppContext updated');
