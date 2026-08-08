const fs = require('fs');
const path = require('path');

const desiredFooterNav = `<nav class="footer-nav">
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/terms/">Terms & Conditions</a>
      <a href="/disclaimer/">Disclaimer</a>
      <a href="/contact/">Contact Us</a>
    </nav>`;

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
      
      // Regex to find and replace everything inside <nav class="footer-nav">...</nav>
      const regex = /<nav class="footer-nav">[\s\S]*?<\/nav>/;
      
      if (regex.test(content)) {
        content = content.replace(regex, desiredFooterNav);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated footer in: ' + fullPath);
      }
    }
  }
}

processDir('.');
console.log('Done replacing footers!');
