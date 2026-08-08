const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'admin', 'assets'].includes(file)) {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for the footer-nav and see if it has Disclaimer
      if (content.includes('<nav class="footer-nav">')) {
        if (!content.includes('href="/disclaimer/"')) {
          content = content.replace(
            /<a href="\/contact\/\?v=1\.4">Contact Us<\/a>/g,
            '<a href="/disclaimer/">Disclaimer</a>\n        <a href="/contact/?v=1.4">Contact Us</a>'
          );
          content = content.replace(
            /<a href="\/contact\/\?v=2\.6">Contact Us<\/a>/g,
            '<a href="/disclaimer/">Disclaimer</a>\n        <a href="/contact/?v=2.6">Contact Us</a>'
          );
          // General fallback
          if (!content.includes('/disclaimer/')) {
            content = content.replace(
              /<\/nav>/g,
              '  <a href="/disclaimer/">Disclaimer</a>\n    </nav>'
            );
          }
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Updated: ' + fullPath);
        }
      }
    }
  }
}

processDir('.');
console.log('Done!');
