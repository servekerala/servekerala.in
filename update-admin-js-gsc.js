const fs = require('fs');

let content = fs.readFileSync('assets/js/admin.js', 'utf8');

// Load logic
const loadLogic = `
        const inputSeoTitle = document.getElementById('seo-default-title');
        const inputSeoDesc = document.getElementById('seo-default-desc');
        const inputSeoKeywords = document.getElementById('seo-default-keywords');
        const inputSeoGoogleVerification = document.getElementById('seo-google-verification');

        if (inputSeoTitle) inputSeoTitle.value = data.defaultTitle || '';
        if (inputSeoDesc) inputSeoDesc.value = data.defaultDesc || '';
        if (inputSeoKeywords) inputSeoKeywords.value = data.defaultKeywords || '';
        if (inputSeoGoogleVerification) inputSeoGoogleVerification.value = data.googleSiteVerification || '';
`;

// Save logic
const saveLogic = `
          const payload = {
            defaultTitle: document.getElementById('seo-default-title').value.trim(),
            defaultDesc: document.getElementById('seo-default-desc').value.trim(),
            defaultKeywords: document.getElementById('seo-default-keywords').value.trim(),
            googleSiteVerification: document.getElementById('seo-google-verification').value.trim()
          };
`;

content = content.replace(
  /const inputSeoTitle = document\.getElementById\('seo-default-title'\);[\s\S]*?if \(inputSeoKeywords\) inputSeoKeywords\.value = data\.defaultKeywords \|\| '';/,
  loadLogic
);

content = content.replace(
  /const payload = \{[\s\S]*?defaultKeywords: document\.getElementById\('seo-default-keywords'\)\.value\.trim\(\)\n          \};/,
  saveLogic
);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log('admin.js updated with Google Site Verification sync');
