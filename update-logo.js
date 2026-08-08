const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.vercel' && f !== 'assets') {
         walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.html')) {
         callback(dirPath);
      }
    }
  });
}

const logoStr1 = '<a href="/" class="logo" aria-label="ServeKerala.in Home">ServeKerala<span>.in</span></a>';
const logoStr2 = '<a href="/" class="mobile-nav-logo">ServeKerala<span>.in</span></a>';
const logoRep1 = '<a href="/" class="logo" aria-label="ServeKerala.in Home"><img src="/assets/images/logo.png" alt="ServeKerala.in Logo" style="height: 45px; width: auto;"></a>';
const logoRep2 = '<a href="/" class="mobile-nav-logo"><img src="/assets/images/logo.png" alt="ServeKerala.in Logo" style="height: 35px; width: auto;"></a>';

function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (!content.includes('<link rel="icon"')) {
    content = content.replace('</head>', '  <link rel="icon" type="image/png" href="/favicon.png">\\n</head>');
  }

  content = content.split(logoStr1).join(logoRep1);
  content = content.split(logoStr2).join(logoRep2);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

walkDir('.', processHtmlFile);

function processJsGenerators() {
  const scripts = [
    'scripts/generate-seo-pages.js',
    'scripts/generate-auto-seo.js',
    'scripts/inject-seo.js'
  ];
  
  scripts.forEach(script => {
    if (fs.existsSync(script)) {
      let content = fs.readFileSync(script, 'utf8');
      let orig = content;
      
      if (!content.includes('<link rel="icon"')) {
        content = content.replace('</head>', '  <link rel="icon" type="image/png" href="/favicon.png">\\n</head>');
      }
      
      content = content.split(logoStr1).join(logoRep1);
      content = content.split(logoStr2).join(logoRep2);
      
      if (orig !== content) {
        fs.writeFileSync(script, content, 'utf8');
        console.log('Updated generator script: ' + script);
      }
    }
  });
}

processJsGenerators();
console.log('Finished updating logo references.');
