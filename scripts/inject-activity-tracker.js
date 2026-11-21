const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SCRIPT_TAG = '  <script src="/assets/js/activity-tracker.js?v=1.8" defer></script>';

function getHtmlFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Ignore build/system directories
    if (file === '.git' || file === 'node_modules' || file === '.vercel' || file === '.gemini') {
      continue;
    }
    
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, filesList);
    } else if (path.extname(file).toLowerCase() === '.html') {
      filesList.push(filePath);
    }
  }
  return filesList;
}

function injectTracker() {
  console.log('Starting activity-tracker.js script injection...');
  const htmlFiles = getHtmlFiles(ROOT_DIR);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has activity-tracker.js
    if (content.includes('activity-tracker.js')) {
      console.log(`Skipping (already loaded): ${path.relative(ROOT_DIR, filePath)}`);
      continue;
    }

    // Find </head> and insert right before it
    const headCloseIndex = content.search(/<\/head>/i);
    if (headCloseIndex === -1) {
      console.warn(`No </head> tag found in: ${path.relative(ROOT_DIR, filePath)}`);
      continue;
    }

    // Format CRLF or LF nicely
    const hasCrlf = content.includes('\r\n');
    const newline = hasCrlf ? '\r\n' : '\n';
    
    const before = content.substring(0, headCloseIndex);
    const after = content.substring(headCloseIndex);

    // Write back
    content = before + SCRIPT_TAG + newline + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected tracker into: ${path.relative(ROOT_DIR, filePath)}`);
    updatedCount++;
  }

  console.log(`Finished. Injected tracker script into ${updatedCount} HTML files.`);
}

injectTracker();
