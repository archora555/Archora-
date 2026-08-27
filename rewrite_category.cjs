const fs = require('fs');
let content = fs.readFileSync('src/components/CategorySelector.tsx', 'utf8');

content = content.replace(
  `{ subCategories, layoutConfig, setLayoutConfig } = useAppContext();`,
  `{ subCategories, setSubCategories, layoutConfig, setLayoutConfig } = useAppContext();`
);

content = content.replace(
  `            <EditableWrapper 
              id="category-cards" 
              type="categoryCards"
              currentWidth={layoutConfig.categoryCards.width}
              currentHeight={layoutConfig.categoryCards.height}
              onResize={(w, h) => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, width: w, height: h}})}
            >`,
  `            <EditableWrapper 
              id="category-cards" 
              type="categoryCards"
              currentWidth={layoutConfig.categoryCards.width}
              currentHeight={layoutConfig.categoryCards.height}
              onResize={(w, h) => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, width: w, height: h}})}
              onAdd={() => {
                const name = prompt('Enter new category name:');
                if (name) {
                  setSubCategories([...subCategories, { id: name.toLowerCase().replace(/\\s+/g, '-'), name, iconName: 'Star' }]);
                }
              }}
            >`
);

content = content.replace(
  `                  const isActive = activeSub === sub.id;
                  
                  return (
                    <motion.button`,
  `                  const isActive = activeSub === sub.id;
                  
                  return (
                    <EditableWrapper
                      key={\`edit-\${sub.id}\`}
                      id={\`cat-\${sub.id}\`}
                      onDelete={() => {
                        if (confirm(\`Delete category "\${sub.name}"?\`)) {
                          setSubCategories(subCategories.filter(s => s.id !== sub.id));
                        }
                      }}
                    >
                    <motion.button`
);

content = content.replace(
  `                      </span>
                    </motion.button>
                  )`,
  `                      </span>
                    </motion.button>
                    </EditableWrapper>
                  )`
);

fs.writeFileSync('src/components/CategorySelector.tsx', content);
