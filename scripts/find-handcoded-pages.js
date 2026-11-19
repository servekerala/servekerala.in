const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.vercel', 'kottayam', 'pathanamthitta', 'kollam', 'alappuzha', 'auto', 'categories', 'business'];

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (excludeDirs.indexOf(file) === -1) {
        walk(filepath, callback);
      }
    } else if (stat.isFile() && file.endsWith('.html')) {
      callback(filepath);
    }
  });
}

walk('.', (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('class="site-footer"')) {
    console.log(filepath);
  }
});
