const fs = require('fs');
const path = require('path');

const version = '26.0'; // Updated version for cache busting

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.vercel') {
        walk(filepath, callback);
      }
    } else if (stat.isFile() && file.endsWith('.html')) {
      callback(filepath);
    }
  });
}

const rootDir = path.join(__dirname, '..');
let count = 0;
walk(rootDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Replace CSS version
  content = content.replace(/href="\/assets\/css\/main\.css\?v=[\d.]+"/g, `href="/assets/css/main.css?v=${version}"`);
  // Replace home-loader JS version
  content = content.replace(/src="\/assets\/js\/home-loader\.js\?v=[\d.]+"/g, `src="/assets/js/home-loader.js?v=${version}"`);
  // Replace i18n JS version
  content = content.replace(/src="\/assets\/js\/i18n\.js\?v=[\d.]+"/g, `src="/assets/js/i18n.js?v=${version}"`);
  // Replace admin JS version
  content = content.replace(/src="\/assets\/js\/admin\.js\?v=[\d.]+"/g, `src="/assets/js/admin.js?v=${version}"`);
  // Replace listing JS version
  content = content.replace(/src="\/assets\/js\/listing\.js\?v=[\d.]+"/g, `src="/assets/js/listing.js?v=${version}"`);

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    count++;
  }
});

console.log(`Cache busted successfully in ${count} files.`);
