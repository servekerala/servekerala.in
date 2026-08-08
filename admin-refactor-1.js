const fs = require('fs');

let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const regexVars = /let activeCategories = \[\];\s*let activeDistricts = \[\];\s*let activeTowns = \[\];\s*let activeLocalities = \[\];/;

const newVars = `let activeCategories = [];
  let activeDistricts = [];
  let globalAutoConfig = {};`;

js = js.replace(regexVars, newVars);

const regexLoad = /function loadDirectoryParameters\(\) \{[\s\S]*?function populateDropdowns\(\) \{/;

const newLoad = `function loadDirectoryParameters() {
    return Promise.all([
      db.collection('cms_settings').doc('global').get(),
      db.collection('page_generator_config').doc('global').get()
    ]).then(([cmsDoc, pgDoc]) => {
      let needsSave = false;
      let data = {};
      if (cmsDoc.exists) data = cmsDoc.data();

      if (!data.categories || !data.categories.length) {
        activeCategories = [
          { id: 'solar', name: 'Solar Installation' },
          { id: 'plumbing', name: 'Plumber' },
          { id: 'electrical', name: 'Electrician' },
          { id: 'ac', name: 'AC Service' }
        ];
        needsSave = true;
      } else {
        activeCategories = data.categories;
      }

      let pgData = pgDoc.exists ? pgDoc.data() : {};
      if (pgData.auto_mithram) {
        globalAutoConfig = typeof pgData.auto_mithram === 'string' ? JSON.parse(pgData.auto_mithram) : pgData.auto_mithram;
      } else {
        globalAutoConfig = {
          'Pathanamthitta': {
            'Thiruvalla': ['Railway Station', 'KSRTC Bus Stand', 'Pushpagiri Medical College', 'Muthoor', 'Cross Junction'],
            'Kozhencherry': ['Private Bus Stand', 'District Hospital', 'Thelliyoor'],
            'Adoor': ['KSRTC Bus Stand', 'Bypass Junction', 'General Hospital']
          },
          'Kottayam': {
            'Kottayam': ['Railway Station', 'KSRTC Bus Stand', 'Medical College', 'Collectorate', 'Baker Junction'],
            'Changanacherry': ['Railway Station', 'KSRTC Bus Stand', 'Market', 'Perunna']
          },
          'Alappuzha': {
            'Chengannur': ['Railway Station', 'KSRTC Bus Stand', 'Engineering College', 'MC Road']
          }
        };
      }
      activeDistricts = Object.keys(globalAutoConfig);

      if (needsSave) {
        db.collection('cms_settings').doc('global').set({
          categories: activeCategories
        }, { merge: true }).catch(err => console.error("Error setting params:", err));
      }

      populateDropdowns();
      renderParameterLists();
    }).catch(err => {
      console.error("Error loading params:", err);
    });
  }

  function populateDropdowns() {`;

js = js.replace(regexLoad, newLoad);

fs.writeFileSync('assets/js/admin.js', js, 'utf8');
console.log('Replaced loadDirectoryParameters');
