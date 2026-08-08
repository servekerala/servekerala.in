const fs = require('fs');
const path = require('path');

const stage1Config = {
  "Pathanamthitta": {
    "Thiruvalla": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Pushpagiri Medical College",
      "Believers Medical College",
      "Government Hospital"
    ],
    "Adoor": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Pathanamthitta": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Kozhencherry": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Pandalam": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Ranni": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ]
  },
  "Kottayam": {
    "Kottayam": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Medical College",
      "District Hospital"
    ],
    "Changanassery": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Ettumanoor": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Pala": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Vaikom": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ]
  },
  "Alappuzha": {
    "Alappuzha": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "District Hospital",
      "Medical College"
    ],
    "Cherthala": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Kayamkulam": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Haripad": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Mavelikkara": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ]
  },
  "Kollam": {
    "Kollam": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "District Hospital"
    ],
    "Karunagappally": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Kottarakkara": [
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Punalur": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ],
    "Paravur": [
      "Railway Station",
      "KSRTC Bus Stand",
      "Private Bus Stand",
      "Government Hospital"
    ]
  }
};

const jsonString = JSON.stringify(stage1Config, null, 2);
fs.writeFileSync(path.join(__dirname, '..', 'stage1-auto-config.json'), jsonString);
console.log('Created stage1-auto-config.json');

// Helper to patch generate-auto-seo.js
function patchFile(filePath, varName, replacement) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp('(const|let)\\s+' + varName + '\\s*=\\s*\\{[\\s\\S]*?\\};');
    if (regex.test(content)) {
      content = content.replace(regex, 'let ' + varName + ' = ' + replacement + ';');
      fs.writeFileSync(filePath, content);
      console.log('Patched ' + filePath);
    } else {
      console.log('Could not find ' + varName + ' in ' + filePath);
    }
  } catch(e) {
    console.error(e.message);
  }
}

patchFile(path.join(__dirname, '..', 'scripts', 'generate-auto-seo.js'), 'config', jsonString);

// Push to Firebase directly!
const https = require('https');
const PROJECT_ID = 'servekerala2026';
const API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';
const URL = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/page_generator_config/global?key=' + API_KEY;

// To update, we must do a PATCH with updateMask
function toFirestoreValue(val) {
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return { integerValue: val.toString() };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const k in val) fields[k] = toFirestoreValue(val[k]);
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

const firestoreBody = {
  fields: {
    auto_mithram: toFirestoreValue(stage1Config)
  }
};

// We will just patch the document using REST API.
const req = https.request(URL + '&updateMask.fieldPaths=auto_mithram', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log('Firebase Update Status:', res.statusCode);
    if(res.statusCode === 200) console.log('Successfully updated Firebase!');
    else console.log(data);
  });
});
req.on('error', console.error);
req.write(JSON.stringify(firestoreBody));
req.end();
