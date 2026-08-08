const fs = require('fs');

let js = fs.readFileSync('assets/js/auto-loader.js', 'utf8');

// Add globalAutoConfig to auto-loader.js
js = js.replace('let activeTowns = [];\n  let activeLocalities = [];', 'let activeTowns = [];\n  let activeLocalities = [];\n  let globalAutoConfig = {};');

// Populate globalAutoConfig inside loadParamsPromise
js = js.replace(
  'const autoConfig = typeof data.auto_mithram === \'string\' ? JSON.parse(data.auto_mithram) : data.auto_mithram;',
  'const autoConfig = typeof data.auto_mithram === \'string\' ? JSON.parse(data.auto_mithram) : data.auto_mithram;\n            globalAutoConfig = autoConfig;'
);

// We need to rewrite populatePortalDropdowns
// and also add the event listener for portal-edit-town
const rewriteTarget = `  function populatePortalDropdowns() {
    const portalEditTown = document.getElementById('portal-edit-town');
    const portalEditLocality = document.getElementById('portal-edit-locality');
    if (portalEditTown) {
      portalEditTown.innerHTML = activeTowns.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
    }
    if (portalEditLocality) {
      portalEditLocality.innerHTML = activeLocalities.map(l => \`<option value="\${l}">\${l}</option>\`).join('');
    }
  }`;

const rewriteReplacement = `  function populatePortalDropdowns() {
    // This is no longer run on load. We run it dynamically when dashboard opens.
  }

  function setupDynamicPortalDropdowns(district, selectedTown, selectedLocality) {
    const portalEditTown = document.getElementById('portal-edit-town');
    const portalEditLocality = document.getElementById('portal-edit-locality');
    
    if (!portalEditTown || !portalEditLocality) return;
    
    const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (district || '').toLowerCase());
    
    function updateTowns() {
      portalEditTown.innerHTML = '<option value="">Select Town</option>';
      if (distKey && globalAutoConfig[distKey]) {
        const towns = Object.keys(globalAutoConfig[distKey]);
        portalEditTown.innerHTML += towns.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
      }
    }
    
    function updateLocalities() {
      const townVal = portalEditTown.value;
      portalEditLocality.innerHTML = '<option value="">Select Locality</option>';
      if (distKey && townVal && globalAutoConfig[distKey] && globalAutoConfig[distKey][townVal]) {
        const locs = globalAutoConfig[distKey][townVal];
        portalEditLocality.innerHTML += locs.map(l => \`<option value="\${l}">\${l}</option>\`).join('');
      }
    }
    
    // Bind event
    if (!portalEditTown.hasAttribute('data-bound')) {
      portalEditTown.setAttribute('data-bound', 'true');
      portalEditTown.addEventListener('change', updateLocalities);
    }
    
    updateTowns();
    if (selectedTown) {
      if (!Array.from(portalEditTown.options).some(opt => opt.value === selectedTown)) {
         portalEditTown.innerHTML += \`<option value="\${selectedTown}">\${selectedTown}</option>\`;
      }
      portalEditTown.value = selectedTown;
    }
    
    updateLocalities();
    if (selectedLocality) {
      if (!Array.from(portalEditLocality.options).some(opt => opt.value === selectedLocality)) {
         portalEditLocality.innerHTML += \`<option value="\${selectedLocality}">\${selectedLocality}</option>\`;
      }
      portalEditLocality.value = selectedLocality;
    }
  }`;

js = js.replace(rewriteTarget, rewriteReplacement);

// Update where it fills values
const fillTarget = `      const portalEditTown = document.getElementById('portal-edit-town');
      const portalEditLocality = document.getElementById('portal-edit-locality');
      
      if (portalEditTown) {
        if (townVal && !Array.from(portalEditTown.options).some(opt => opt.value === townVal)) {
          const opt = document.createElement('option');
          opt.value = townVal;
          opt.textContent = townVal;
          portalEditTown.appendChild(opt);
        }
        portalEditTown.value = townVal;
      }
      
      if (portalEditLocality) {
        if (localityVal && !Array.from(portalEditLocality.options).some(opt => opt.value === localityVal)) {
          const opt = document.createElement('option');
          opt.value = localityVal;
          opt.textContent = localityVal;
          portalEditLocality.appendChild(opt);
        }
        portalEditLocality.value = localityVal;
      }`;

const fillReplacement = `      setupDynamicPortalDropdowns(activeSessionDriver.district, townVal, localityVal);`;

js = js.replace(fillTarget, fillReplacement);

fs.writeFileSync('assets/js/auto-loader.js', js);
console.log('Done');
