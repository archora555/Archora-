const fs = require('fs');
let code = fs.readFileSync('src/views/AdminView.tsx', 'utf8');

code = code.replace(
  '{activeTab === \'layout\' && (\n      <div className="mt-8 bg-blue-50',
  '{activeTab === \'layout\' && (\n    <>\n      <div className="mt-8 bg-blue-50'
);

// Find the end of activeTab === 'layout' block.
// It ends around line 1246: "Note: You can add/remove category items..."
code = code.replace(
  'Note: You can add/remove category items in the "Categories" tab.</p>\n                </div>\n              </div>\n            </div>\n          </div>\n      )}',
  'Note: You can add/remove category items in the "Categories" tab.</p>\n                </div>\n              </div>\n            </div>\n          </div>\n    </>\n      )}'
);

fs.writeFileSync('src/views/AdminView.tsx', code);
