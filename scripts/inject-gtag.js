const fs = require('fs');
const path = require('path');

const GTAG_SNIPPET = ``;

const ROOT_DIR = path.join(__dirname, '..');

function getHtmlFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Ignore system / build directories
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

function injectGtag() {
  console.log('Starting Google Tag injection...');
  const htmlFiles = getHtmlFiles(ROOT_DIR);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the gtag is already present
    if (content.includes('G-5NDFE1FXGX')) {
      console.log(`Skipping (already has Google Tag): ${path.relative(ROOT_DIR, filePath)}`);
      continue;
    }

    // Find the <head> tag
    const headIndex = content.search(/<head\b[^>]*>/i);
    if (headIndex === -1) {
      console.warn(`No <head> tag found in: ${path.relative(ROOT_DIR, filePath)}`);
      continue;
    }

    // Find the end of the <head> tag to insert after it
    const match = content.match(/<head\b[^>]*>/i);
    const insertIndex = headIndex + match[0].length;

    // We insert it with proper newlines and spacing
    const before = content.substring(0, insertIndex);
    const after = content.substring(insertIndex);
    
    // Detect line ending (CRLF vs LF) to format nicely
    const hasCrlf = before.includes('\r\n');
    const newline = hasCrlf ? '\r\n' : '\n';
    
    // Format the snippet with indentation (2 spaces)
    const formattedSnippet = newline + GTAG_SNIPPET.split('\n').map(line => '  ' + line).join(newline) + newline;

    content = before + formattedSnippet + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected Google Tag into: ${path.relative(ROOT_DIR, filePath)}`);
    updatedCount++;
  }

  console.log(`Finished. Injected Google Tag into ${updatedCount} HTML files.`);
}

injectGtag();
