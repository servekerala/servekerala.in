const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const excludeDirs = ['node_modules', '.vercel', '.git', 'scripts', 'kottayam', 'pathanamthitta', 'alappuzha', 'kollam', 'auto'];

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(scanDir(filePath));
      }
    } else {
      if (file.endsWith('.html') && !excludeDirs.includes(path.basename(dir))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Determine canonical URL
  let relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  let canonicalUrl = 'https://servekerala.in/';
  if (relativePath !== 'index.html') {
      canonicalUrl = `https://servekerala.in/${relativePath.replace('index.html', '')}`;
  }

  // Extract title and description for OG tags
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'ServeKerala.in';
  
  const descMatch = content.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/i) || 
                    content.match(/<meta\s+content="([\s\S]*?)"\s+name="description"/i);
  const desc = descMatch ? descMatch[1].trim() : 'ServeKerala connects you directly with verified local professionals.';

  // Check and insert Canonical
  if (!content.includes('<link rel="canonical"')) {
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    // Insert after description meta tag, or if not found, after viewport
    if (content.match(/(<meta name="description".*?>)/i)) {
      content = content.replace(/(<meta name="description".*?>)/i, `$1\n  ${canonicalTag}`);
    } else {
      content = content.replace(/(<meta name="viewport".*?>)/i, `$1\n  ${canonicalTag}`);
    }
    changed = true;
  }

  // Check and insert OG Tags
  if (!content.includes('property="og:title"')) {
    const ogTags = `
  <!-- Open Graph / Social Tags -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://servekerala.in/assets/images/logo.png" />`;
    
    if (content.match(/(<link rel="canonical".*?>)/i)) {
        content = content.replace(/(<link rel="canonical".*?>)/i, `$1\n${ogTags}`);
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated tags for: ${relativePath}`);
  }
}

const allHtmlFiles = scanDir(rootDir);
for (const file of allHtmlFiles) {
  processFile(file);
}
console.log('Done injecting tags into static files.');
