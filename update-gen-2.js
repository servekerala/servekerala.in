const fs = require('fs');

let content = fs.readFileSync('scripts/generate-auto-seo.js', 'utf8');

const fetchCode = `
const https = require('https');
const PROJECT_ID = 'servekerala2026';
const API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';
const URL = \`https://firestore.googleapis.com/v1/projects/\${PROJECT_ID}/databases/(default)/documents/page_generator_config/global?key=\${API_KEY}\`;

function fetchConfig() {
  return new Promise((resolve, reject) => {
    https.get(URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.warn('Could not fetch Page Generator settings from Firebase. Using defaults. Status:', res.statusCode);
          return resolve(null);
        }
        try {
          const response = JSON.parse(data);
          if (!response.fields || !response.fields.auto_mithram) return resolve(null);
          
          function parseFirestoreValue(val) {
            if (val.stringValue !== undefined) return val.stringValue;
            if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
            if (val.booleanValue !== undefined) return val.booleanValue;
            if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseFirestoreValue);
            if (val.mapValue !== undefined) {
              const res = {};
              for (const k in val.mapValue.fields) {
                res[k] = parseFirestoreValue(val.mapValue.fields[k]);
              }
              return res;
            }
            return null;
          }
          
          const config = parseFirestoreValue({ mapValue: { fields: response.fields } });
          resolve(config.auto_mithram);
        } catch (err) {
          console.error('Error parsing config:', err);
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}
`;

content = content.replace(
  'const config = {',
  'let config = {'
);

content = content.replace('const sitemapPath =', fetchCode + '\nconst sitemapPath =');

content = content.replace(
  'generatePages().catch(console.error);',
  `fetchConfig().then(remoteConfig => {
  if (remoteConfig) {
    console.log('Using Remote Auto Configuration from Firebase!');
    config = remoteConfig;
  }
  generatePages().catch(console.error);
});`
);

fs.writeFileSync('scripts/generate-auto-seo.js', content, 'utf8');
console.log('Updated generate-auto-seo.js to fetch from Firebase!');
