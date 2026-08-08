const fs = require('fs');
const path = require('path');

const desiredFooter = `<footer class="site-footer">
  <div class="container">
    <p>&copy; 2026 ServeKerala.in. All rights reserved.</p>
    <nav class="footer-nav">
      <a href="/privacy-policy/">Privacy Policy</a>
      <a href="/terms/">Terms & Conditions</a>
      <a href="/disclaimer/">Disclaimer</a>
      <a href="/contact/">Contact Us</a>
    </nav>
  </div>
</footer>`;

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
      
      // Regex to find the entire <footer ...> ... </footer> block
      const regex = /<footer class="site-footer"[^>]*>[\s\S]*?<\/footer>/;
      
      if (regex.test(content)) {
        content = content.replace(regex, desiredFooter);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Forced standard footer in: ' + fullPath);
      } else {
        // If there's no footer at all, inject it right before </body>
        if (content.includes('</body>')) {
          content = content.replace('</body>', desiredFooter + '\n\n</body>');
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Injected standard footer in: ' + fullPath);
        } else {
          console.log('Skipped (no footer or body tag): ' + fullPath);
        }
      }
    }
  }
}

processDir('.');
console.log('Done forcing footers everywhere!');
