const fs = require('fs');

let content = fs.readFileSync('scripts/inject-seo.js', 'utf8');

const parseLogic = `
      const seo = {
        home: extractFields(response.fields.home),
        auto: extractFields(response.fields.auto),
        services: extractFields(response.fields.services),
        googleSiteVerification: response.fields.googleSiteVerification ? response.fields.googleSiteVerification.stringValue : ''
      };
`;

const injectLogic = `
      // Inject Google Site Verification into index.html
      if (seo.googleSiteVerification) {
        let code = seo.googleSiteVerification.trim();
        let verificationCode = '';
        if (code.startsWith('<meta')) {
          verificationCode = \`  \${code}\\n\`;
        } else {
          verificationCode = \`  <meta name="google-site-verification" content="\${code}" />\\n\`;
        }
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf8');
          // Remove existing if any
          html = html.replace(/<meta name="google-site-verification" content=".*?"\\s*\\/?>\\n?/g, '');
          html = html.replace('</head>', \`\${verificationCode}</head>\`);
          fs.writeFileSync(indexPath, html, 'utf8');
          console.log('Successfully injected Google Site Verification tag');
        }
      }
`;

content = content.replace(
  /const seo = \{[\s\S]*?services: extractFields\(response\.fields\.services\)\n      \};/,
  parseLogic
);

content = content.replace(
  '// Inject Home Page',
  injectLogic + '\n      // Inject Home Page'
);

fs.writeFileSync('scripts/inject-seo.js', content, 'utf8');
console.log('inject-seo.js updated with GSC logic');
