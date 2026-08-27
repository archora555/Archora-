const fs = require('fs');
let code = fs.readFileSync('src/views/AdminView.tsx', 'utf8');

const target = `      </div>

          <div className="space-y-8 animate-fade-in pb-12">`;

code = code.replace(target, `      </div>
      <>
          <div className="space-y-8 animate-fade-in pb-12">`);

fs.writeFileSync('src/views/AdminView.tsx', code);
