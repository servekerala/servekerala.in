const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // ignore node_modules or .git
      if (!file.startsWith('.')) {
         getFiles(fullPath, filesList);
      }
    } else if (fullPath.endsWith('.html')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allHtml = getFiles(__dirname);
let brokenLinks = [];
let checked = 0;

allHtml.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  
  hrefs.forEach(href => {
    if (href.startsWith('/') && !href.startsWith('//') && !href.includes('assets') && !href.includes('favicon.png')) {
      // Strip query params
      const cleanHref = href.split('?')[0].split('#')[0];
      if (cleanHref === '/') return; // root is ok
      
      const targetPath = path.join(__dirname, cleanHref);
      const isHtml = cleanHref.endsWith('.html');
      
      let exists = false;
      if (isHtml) {
         exists = fs.existsSync(targetPath);
      } else {
         exists = fs.existsSync(path.join(targetPath, 'index.html')) || fs.existsSync(targetPath + '.html');
      }
      
      if (!exists) {
         brokenLinks.push({ file: f.replace(__dirname, ''), brokenHref: href });
      }
    }
  });
});

console.log(`Checked ${allHtml.length} HTML files.`);
const uniqueBroken = [...new Set(brokenLinks.map(b => b.brokenHref))];
console.log(`Found ${uniqueBroken.length} unique broken internal links.`);

const pagesWithBrokenLinks = [...new Set(brokenLinks.map(b => b.file))];
console.log(`Found ${pagesWithBrokenLinks.length} pages with broken links.`);

console.log('\nSample broken links:');
uniqueBroken.slice(0, 10).forEach(b => console.log(b));

console.log('\nSample pages with broken links:');
pagesWithBrokenLinks.slice(0, 10).forEach(b => console.log(b));

