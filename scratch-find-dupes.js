const fs = require('fs');
const path = require('path');

const rootDir = 'd:/Antigravity/servekerala.in';

function scanDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.vercel', '.git', 'scripts'].includes(file)) {
        results = results.concat(scanDir(filePath));
      }
    } else {
      if (file.endsWith('.html') && !['seo-template.html', 'auto-seo-template.html'].includes(file)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const allHtmlFiles = scanDir(rootDir);
const titles = {};

for (const file of allHtmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1].trim() : 'NO_TITLE';
  
  if (!titles[title]) titles[title] = [];
  titles[title].push(file.replace(rootDir, ''));
}

for (const title in titles) {
  if (titles[title].length > 1) {
    console.log(`\nTitle: "${title}"`);
    titles[title].forEach(f => console.log(`  - ${f}`));
  }
}
