const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

if (!code.includes('DynamicRenderer')) {
  code = code.replace(
    'import { EditableWrapper } from \'../components/VisualEditor/EditableWrapper\';',
    'import { EditableWrapper } from \'../components/VisualEditor/EditableWrapper\';\nimport { DynamicRenderer } from \'../builder/DynamicRenderer\';\nimport { useBuilder } from \'../builder/BuilderContext\';'
  );

  code = code.replace('  const navigate = useNavigate();', '  const navigate = useNavigate();\n  const { isEditMode } = useBuilder();');

  const replaceTarget = 'return (\n    <div className="w-full">';
  const newReturn = `return (
    <div className="w-full">
      {isEditMode ? <DynamicRenderer /> : activeSectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
    </div>
  );`;

  code = code.replace(/return \([\s\S]*?<div className="w-full">[\s\S]*?<\/div>\n  \);/, newReturn);

  fs.writeFileSync('src/views/HomeView.tsx', code);
  console.log('HomeView updated');
} else {
  console.log('HomeView already updated');
}
