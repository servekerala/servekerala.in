const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>https:\/\/servekerala.in([^<]+)<\/loc>/g)].map(m => m[1]);

let missing = 0;
urls.forEach(url => {
  if (url === '/') return;
  const targetPath = path.join(__dirname, url);
  const exists = fs.existsSync(targetPath) || fs.existsSync(path.join(targetPath, 'index.html')) || fs.existsSync(targetPath + '.html');
  if (!exists) {
    console.log(`Missing page for sitemap URL: ${url}`);
    missing++;
  }
});
console.log(`Total missing: ${missing}`);
