const fs = require('fs');

let js = fs.readFileSync('assets/js/admin.js', 'utf8');

// The file was messed up, so we need to find the remaining parts and rebuild.
// Right now, at line 1054 it has:
//       const blob = new Blob([html], { type: 'text/html' });
//       if (editFormAuto) editFormAuto.reset();
//     }
// 
//     if (closeModalBtnAuto) closeModalBtnAuto.addEventListener('click', closeEditAutoModal);

// Let's grab everything up to "const blob = new Blob([html], { type: 'text/html' });"
let splitIndex1 = js.indexOf("const blob = new Blob([html], { type: 'text/html' });");
if (splitIndex1 === -1) {
    console.error("Could not find anchor 1");
    process.exit(1);
}

// The part to insert right after the blob line:
const insertCode = `
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = \`\${slug}.html\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      showDashboardStatus(\`Static HTML for "\${name}" downloaded! Place it in a folder named "\${slug}/" and deploy.\`, 'alert-success');
    }

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
      const doc = allDocuments.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('edit-auto-id').value = id;
      document.getElementById('edit-auto-name').value = doc.driverName || '';
      document.getElementById('edit-auto-vehicle').value = doc.vehicleNumber || '';
      
      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      const selectedDist = doc.district || 'other';
      const selectedTown = doc.town || parts[2] || parts[1] || '';
      const selectedLocality = doc.locality || parts[1] || '';
      
      setupDynamicEditAutoDropdowns(selectedDist, selectedTown, selectedLocality);
      
      document.getElementById('edit-auto-stand').value = doc.autoStand || parts[0] || '';
      document.getElementById('edit-auto-phone').value = doc.phone || '';
      document.getElementById('edit-auto-wa').value = doc.whatsapp || '';
      document.getElementById('edit-auto-time').value = doc.availableHours || '';

      if (editModalAuto) editModalAuto.style.display = 'flex';
    }

    function closeEditAutoModal() {
      if (editModalAuto) editModalAuto.style.display = 'none';
`;

let splitIndex2 = js.indexOf("      if (editFormAuto) editFormAuto.reset();");
if (splitIndex2 === -1) {
    console.error("Could not find anchor 2");
    process.exit(1);
}

let part1 = js.substring(0, splitIndex1 + "const blob = new Blob([html], { type: 'text/html' });".length);
let part3 = js.substring(splitIndex2);

let newJs = part1 + "\n" + insertCode + part3;

fs.writeFileSync('assets/js/admin.js', newJs, 'utf8');
console.log("Successfully rebuilt admin.js openEditAutoModal");
