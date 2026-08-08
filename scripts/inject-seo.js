const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'servekerala2026';
const API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/site_seo/global?key=${API_KEY}`;

console.log('Starting SEO injection process...');

https.get(URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.warn('Could not fetch SEO settings from Firebase. Using defaults. Status:', res.statusCode);
      return;
    }

    try {
      const response = JSON.parse(data);
      if (!response.fields) {
        console.log('No SEO settings found in Firestore. Skipping injection.');
        return;
      }

      
      const seo = {
        home: extractFields(response.fields.home),
        auto: extractFields(response.fields.auto),
        services: extractFields(response.fields.services),
        googleSiteVerification: response.fields.googleSiteVerification ? response.fields.googleSiteVerification.stringValue : ''
      };


      console.log('Fetched SEO settings:', JSON.stringify(seo, null, 2));

      
      // Inject Google Site Verification into index.html
      if (seo.googleSiteVerification) {
        let code = seo.googleSiteVerification.trim();
        let verificationCode = '';
        if (code.startsWith('<meta')) {
          verificationCode = `  ${code}\n`;
        } else {
          verificationCode = `  <meta name="google-site-verification" content="${code}" />\n`;
        }
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf8');
          // Remove existing if any
          html = html.replace(/<meta name="google-site-verification" content=".*?"\s*\/?>\n?/g, '');
          html = html.replace('  <link rel="icon" type="image/png" href="/favicon.png">\n</head>', `${verificationCode}\n</head>`);
          fs.writeFileSync(indexPath, html, 'utf8');
          console.log('Successfully injected Google Site Verification tag');
        }
      }

      // Inject Home Page
      if (seo.home) {
        injectTags('index.html', seo.home);
      }
      
      // Inject Auto Mithram Page
      if (seo.auto) {
        injectTags('auto-mithram/index.html', seo.auto);
      }
      
      // Inject Services Page
      if (seo.services) {
        injectTags('services/index.html', seo.services);
      }

    } catch (err) {
      console.error('Error parsing Firestore response:', err);
    }
  });
}).on('error', (err) => {
  console.error('Network error fetching SEO settings:', err.message);
});

function extractFields(mapValue) {
  if (!mapValue || !mapValue.mapValue || !mapValue.mapValue.fields) return null;
  const f = mapValue.mapValue.fields;
  return {
    title: f.title ? f.title.stringValue : '',
    description: f.description ? f.description.stringValue : '',
    keywords: f.keywords ? f.keywords.stringValue : ''
  };
}

function injectTags(filePath, seoData) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return;
  }

  let html = fs.readFileSync(fullPath, 'utf8');

  // Replace Title
  if (seoData.title) {
    html = html.replace(/<title>.*?<\/title>/is, `<title>${seoData.title}</title>`);
  }

  // Replace Description
  if (seoData.description) {
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description" content=".*?"\s*\/?>/is, `<meta name="description" content="${seoData.description}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${seoData.description}" />
</head>`);
    }
  }

  // Replace Keywords
  if (seoData.keywords) {
    if (html.includes('<meta name="keywords"')) {
      html = html.replace(/<meta name="keywords" content=".*?"\s*\/?>/is, `<meta name="keywords" content="${seoData.keywords}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="keywords" content="${seoData.keywords}" />
</head>`);
    }
  }

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Successfully injected SEO tags into ${filePath}`);
}
