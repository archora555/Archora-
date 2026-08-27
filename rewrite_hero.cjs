const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(
  `import { useAppContext } from '../context/AppContext';`,
  `import { useAppContext } from '../context/AppContext';
import { EditableWrapper } from './VisualEditor/EditableWrapper';`
);

content = content.replace(
  `export const Hero = () => {
  const { setCurrentView, introFinished, heroBanners: banners, layoutConfig } = useAppContext();`,
  `export const Hero = () => {
  const { setCurrentView, introFinished, heroBanners: banners, layoutConfig, setLayoutConfig } = useAppContext();`
);

content = content.replace(
  `                   <div className="h-0.5 w-12 bg-[#FFD700] mt-2 mb-4 md:mb-6 shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
                   
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setCurrentView('catalog');
                     }}
                     className="bg-[#FFD700] border-2 border-[#FFD700] text-black px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-white hover:border-white transition-colors pointer-events-auto shadow-lg"
                   >
                     Shop Special Offer
                   </button>`,
  `                   <div className="h-0.5 w-12 bg-[#FFD700] mt-2 mb-4 md:mb-6 shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div>
                   
                   <EditableWrapper
                     id="hero-button"
                     currentWidth={layoutConfig.heroSettings?.buttonWidth}
                     currentHeight={layoutConfig.heroSettings?.buttonHeight}
                     onResize={(w, h) => setLayoutConfig({...layoutConfig, heroSettings: {...layoutConfig.heroSettings, buttonWidth: w, buttonHeight: h}})}
                     currentFontSize={layoutConfig.heroSettings?.buttonFontSize}
                     onFontSizeChange={(f) => setLayoutConfig({...layoutConfig, heroSettings: {...layoutConfig.heroSettings, buttonFontSize: f}})}
                   >
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         setCurrentView('catalog');
                       }}
                       className="bg-[#FFD700] border-2 border-[#FFD700] text-black px-6 py-2.5 md:px-8 md:py-3 font-bold uppercase tracking-widest hover:bg-white hover:border-white transition-colors pointer-events-auto shadow-lg"
                       style={{
                         width: layoutConfig.heroSettings?.buttonWidth ? \`\${layoutConfig.heroSettings.buttonWidth}px\` : undefined,
                         height: layoutConfig.heroSettings?.buttonHeight ? \`\${layoutConfig.heroSettings.buttonHeight}px\` : undefined,
                         fontSize: layoutConfig.heroSettings?.buttonFontSize ? \`\${layoutConfig.heroSettings.buttonFontSize}px\` : undefined
                       }}
                     >
                       Shop Special Offer
                     </button>
                   </EditableWrapper>`
);

fs.writeFileSync('src/components/Hero.tsx', content);
