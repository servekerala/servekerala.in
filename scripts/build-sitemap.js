const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const sitemapPath = path.join(rootDir, 'sitemap.xml');

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(rootDir, fullPath);
    
    // Ignore specific directories and files
    if (file.startsWith('.') || file === 'node_modules' || file === 'assets' || file === 'scripts' || relativePath.startsWith('admin') || relativePath.startsWith('scratch-')) {
      continue;
    }
    
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, fileList);
    } else if (file === 'index.html') {
      fileList.push(relativePath);
    }
  }
  return fileList;
}

console.log('Generating sitemap.xml based on actual filesystem...');
const htmlFiles = getHtmlFiles(rootDir);

// Seed event slugs to index in Google
const seedEventSlugs = [
  'central-travancore-flower-show-2026',
  'kottayam-mega-shopping-and-trade-expo',
  'maramon-convention-2027',
  'alappuzha-beach-carnival-food-fest',
  'kollam-fest-cultural-extravaganza',
  'adoor-all-kerala-sevens-football-tournament'
];

const dateStr = new Date().toISOString().split('T')[0];
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Sort files to keep core pages at the top
htmlFiles.sort((a, b) => {
  if (a === 'index.html') return -1;
  if (b === 'index.html') return 1;
  return a.localeCompare(b);
});

for (const relPath of htmlFiles) {
  let urlPath = relPath.replace(/\\/g, '/').replace(/\/index\.html$/, '/').replace(/^index\.html$/, '');
  const fullUrl = `https://servekerala.in/${urlPath}`;
  
  // Determine priority based on depth
  let priority = '0.7';
  if (urlPath === '') priority = '1.0';
  else if (urlPath.startsWith('events/')) priority = '0.9';
  else if (urlPath.split('/').length <= 2) priority = '0.9';
  else if (urlPath.split('/').length <= 3) priority = '0.8';

  xmlContent += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Add Seed Event Detail URLs
for (const slug of seedEventSlugs) {
  const eventUrl = `https://servekerala.in/events/${slug}/`;
  xmlContent += `
  <url>
    <loc>${eventUrl}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
}

xmlContent += '\n</urlset>\n';

fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
const totalUrls = htmlFiles.length + seedEventSlugs.length;
console.log(`Generated sitemap.xml with ${totalUrls} URLs successfully!`);
