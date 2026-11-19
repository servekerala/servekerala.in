const fs = require('fs');
const path = require('path');

const OLD_GTM_ID = 'GTM-NSNDLPTR';
const NEW_GTM_ID = 'GTM-PP7859BT';

const ROOT_DIR = path.join(__dirname, '..');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Ignore system / build / temporary directories
    if (file === '.git' || file === 'node_modules' || file === '.vercel' || file === '.gemini') {
      continue;
    }
    
    if (stat.isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.html' || ext === '.js') {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

function processFiles() {
  console.log('Starting Google Tag Manager replacement and old Google Tag removal...');
  const files = getFiles(ROOT_DIR);
  let updatedCount = 0;

  for (const filePath of files) {
    // Skip this script itself
    if (filePath === __filename) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remove previously added Google Tag (gtag.js)
    if (content.includes('G-5NDFE1FXGX')) {
      const gtagRegex = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?gtag\('config',\s*'G-5NDFE1FXGX'\);\s*<\/script>\s*/gi;
      if (gtagRegex.test(content)) {
        content = content.replace(gtagRegex, '');
        modified = true;
        console.log(`Removing old Google Tag (G-5NDFE1FXGX) from: ${path.relative(ROOT_DIR, filePath)}`);
      }
    }

    // 2. Replace old GTM ID with the new one
    if (content.includes(OLD_GTM_ID)) {
      content = content.split(OLD_GTM_ID).join(NEW_GTM_ID);
      modified = true;
      console.log(`Replacing GTM ID ${OLD_GTM_ID} -> ${NEW_GTM_ID} in: ${path.relative(ROOT_DIR, filePath)}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`Finished. Processed and updated ${updatedCount} files.`);
}

processFiles();
