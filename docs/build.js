const fs = require('fs');
const path = require('path');

const docsDir = __dirname;
const contentJsonPath = path.join(docsDir, 'content', 'content.json');
const bundlePath = path.join(docsDir, 'content-bundle.js');

try {
    const registry = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));
    const bundle = {
        registry: registry,
        markdown: {}
    };

    registry.sections.forEach(section => {
        section.items.forEach(item => {
            const mdPath = path.join(docsDir, item.file);
            let mdContent = '';
            try {
                mdContent = fs.readFileSync(mdPath, 'utf8');
            } catch (err) {
                console.warn(`Warning: Could not read ${item.file}`);
            }
            bundle.markdown[item.file] = mdContent;
        });
    });

    const jsContent = `// Auto-generated file. Do not edit directly.\nwindow.DOCS_BUNDLE = ${JSON.stringify(bundle, null, 2)};\n`;
    fs.writeFileSync(bundlePath, jsContent, 'utf8');
    
    console.log(`Successfully bundled docs into content-bundle.js`);
} catch (err) {
    console.error('Error building docs bundle:', err);
}
