const fs = require('fs');
let js = fs.readFileSync('assets/js/admin.js', 'utf8');

if (!js.includes('function setupDynamicEditAutoDropdowns')) {
  const replacement = `
    // AUTO MITHRAM MODAL
    
    function setupDynamicEditAutoDropdowns(selectedDist, selectedTown, selectedLocality) {
      const distSelect = document.getElementById('edit-auto-dist');
      const townSelect = document.getElementById('edit-auto-town');
      const localitySelect = document.getElementById('edit-auto-locality');
      
      if (!distSelect || !townSelect || !localitySelect) return;
      
      // Populate Districts
      const districts = Object.keys(globalAutoConfig);
      distSelect.innerHTML = '<option value="">Select District</option>' + districts.map(d => \`<option value="\${d.toLowerCase()}">\${d}</option>\`).join('');
      distSelect.innerHTML += '<option value="other">Other District</option>';
      
      function updateTowns() {
        const distVal = distSelect.value;
        if (distVal === 'other' || distVal === '') {
          townSelect.innerHTML = '<option value="">Select Town</option>';
          localitySelect.innerHTML = '<option value="">Select Locality</option>';
          return;
        }
        
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        if (distKey && globalAutoConfig[distKey]) {
          const towns = Object.keys(globalAutoConfig[distKey]);
          townSelect.innerHTML = '<option value="">Select Town</option>' + towns.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
        } else {
          townSelect.innerHTML = '<option value="">Select Town</option>';
        }
        updateLocalities();
      }
      
      function updateLocalities() {
        const distVal = distSelect.value;
        const townVal = townSelect.value;
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        
        if (distKey && townVal && globalAutoConfig[distKey] && globalAutoConfig[distKey][townVal]) {
          const locs = globalAutoConfig[distKey][townVal];
          localitySelect.innerHTML = '<option value="">Select Locality</option>' + locs.map(l => \`<option value="\${l}">\${l}</option>\`).join('');
        } else {
          localitySelect.innerHTML = '<option value="">Select Locality</option>';
        }
      }
      
      if (!distSelect.hasAttribute('data-bound')) {
        distSelect.setAttribute('data-bound', 'true');
        distSelect.addEventListener('change', updateTowns);
        townSelect.addEventListener('change', updateLocalities);
      }
      
      // Set initial values
      distSelect.value = selectedDist || '';
      updateTowns();
      if (selectedTown) {
        if (!Array.from(townSelect.options).some(o => o.value === selectedTown)) {
          townSelect.innerHTML += \`<option value="\${selectedTown}">\${selectedTown}</option>\`;
        }
        townSelect.value = selectedTown;
      }
      updateLocalities();
      if (selectedLocality) {
        if (!Array.from(localitySelect.options).some(o => o.value === selectedLocality)) {
          localitySelect.innerHTML += \`<option value="\${selectedLocality}">\${selectedLocality}</option>\`;
        }
        localitySelect.value = selectedLocality;
      }
    }

    function openEditAutoModal(id) {
`;

  js = js.replace('    // AUTO MITHRAM MODAL\\n    function openEditAutoModal(id) {', replacement);
  
  // Now replace the hardcoded assignments inside openEditAutoModal
  const oldAssignments = `      document.getElementById('edit-auto-dist').value = doc.district || 'other';
      
      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      document.getElementById('edit-auto-town').value = doc.town || parts[2] || parts[1] || '';
      document.getElementById('edit-auto-locality').value = doc.locality || parts[1] || '';`;
      
  const newAssignments = `      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      const selectedDist = doc.district || 'other';
      const selectedTown = doc.town || parts[2] || parts[1] || '';
      const selectedLocality = doc.locality || parts[1] || '';
      
      setupDynamicEditAutoDropdowns(selectedDist, selectedTown, selectedLocality);`;
      
  js = js.replace(oldAssignments, newAssignments);
  
  fs.writeFileSync('assets/js/admin.js', js, 'utf8');
  console.log('Successfully injected setupDynamicEditAutoDropdowns into admin.js');
} else {
  console.log('setupDynamicEditAutoDropdowns is already present.');
}
