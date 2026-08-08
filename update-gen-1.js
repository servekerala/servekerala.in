const fs = require('fs');

let content = fs.readFileSync('scripts/generate-seo-pages.js', 'utf8');

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
          if (!response.fields || !response.fields.service_directory) return resolve(null);
          
          // Parse the JSON string from the Firestore field if it's stored as a string,
          // but wait, in admin.js I set it as an object!
          // Actually, in admin.js we parsed it into an object and set it in Firestore.
          // Firestore stores maps. To parse it from REST API is annoying.
          // Let me just fetch it, but wait, the REST API returns deeply nested mapValue objects.
          // Let's create a recursive parser, or just use the default hardcoded data if it's too complex.
          // Wait, actually, admin.js saves it as a complex object.
          // Let me use a recursive parser for Firestore REST fields.
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
          resolve(config.service_directory);
        } catch (err) {
          console.error('Error parsing config:', err);
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}
`;

// Replace the hardcoded `districtsWithTowns` declaration with let so we can overwrite it
content = content.replace(
  'const districtsWithTowns = {',
  'let districtsWithTowns = {'
);

// Inject fetch code
content = content.replace('// Configuration', fetchCode + '\n// Configuration');

// Wrap `generatePages` call
content = content.replace(
  'generatePages().catch(console.error);',
  `fetchConfig().then(remoteConfig => {
  if (remoteConfig) {
    console.log('Using Remote Service Configuration from Firebase!');
    districtsWithTowns = remoteConfig;
  }
  generatePages().catch(console.error);
});`
);

fs.writeFileSync('scripts/generate-seo-pages.js', content, 'utf8');
console.log('Updated generate-seo-pages.js to fetch from Firebase!');
