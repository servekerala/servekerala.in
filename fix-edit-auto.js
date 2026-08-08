const fs = require('fs');

let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const targetStr = `    function openEditAutoModal(id) {
      const doc = allDocuments.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('edit-auto-id').value = id;
      document.getElementById('edit-auto-name').value = doc.driverName || '';
      document.getElementById('edit-auto-vehicle').value = doc.vehicleNumber || '';
      document.getElementById('edit-auto-dist').value = doc.district || 'other';
      
      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      document.getElementById('edit-auto-town').value = doc.town || parts[2] || parts[1] || '';
      document.getElementById('edit-auto-locality').value = doc.locality || parts[1] || '';
      document.getElementById('edit-auto-stand').value = doc.autoStand || parts[0] || '';
      
      document.getElementById('edit-auto-phone').value = doc.phone || '';
      document.getElementById('edit-auto-wa').value = doc.whatsapp || '';
      document.getElementById('edit-auto-time').value = doc.availableHours || '';

      if (editModalAuto) editModalAuto.style.display = 'flex';
    }`;

const replaceStr = `    function setupDynamicEditAutoDropdowns(district, selectedTown, selectedLocality) {
      const editDist = document.getElementById('edit-auto-dist');
      const editTown = document.getElementById('edit-auto-town');
      const editLoc = document.getElementById('edit-auto-locality');
      
      if (!editDist || !editTown || !editLoc) return;
      
      function updateTowns() {
        const distVal = editDist.value;
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        editTown.innerHTML = '<option value="">Select Town</option>';
        if (distKey && globalAutoConfig[distKey]) {
          const towns = Object.keys(globalAutoConfig[distKey]);
          editTown.innerHTML += towns.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
        }
        updateLocalities();
      }
      
      function updateLocalities() {
        const distVal = editDist.value;
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        const townVal = editTown.value;
        editLoc.innerHTML = '<option value="">Select Locality</option>';
        if (distKey && townVal && globalAutoConfig[distKey] && globalAutoConfig[distKey][townVal]) {
          const locs = globalAutoConfig[distKey][townVal];
          editLoc.innerHTML += locs.map(l => \`<option value="\${l}">\${l}</option>\`).join('');
        }
      }
      
      if (!editDist.hasAttribute('data-bound')) {
        editDist.setAttribute('data-bound', 'true');
        editDist.addEventListener('change', updateTowns);
        editTown.addEventListener('change', updateLocalities);
      }
      
      editDist.value = district || 'other';
      updateTowns();
      
      if (selectedTown) {
        if (!Array.from(editTown.options).some(opt => opt.value === selectedTown)) {
          editTown.innerHTML += \`<option value="\${selectedTown}">\${selectedTown}</option>\`;
        }
        editTown.value = selectedTown;
      }
      
      updateLocalities();
      
      if (selectedLocality) {
        if (!Array.from(editLoc.options).some(opt => opt.value === selectedLocality)) {
          editLoc.innerHTML += \`<option value="\${selectedLocality}">\${selectedLocality}</option>\`;
        }
        editLoc.value = selectedLocality;
      }
    }

    function openEditAutoModal(id) {
      const doc = allDocuments.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('edit-auto-id').value = id;
      document.getElementById('edit-auto-name').value = doc.driverName || '';
      document.getElementById('edit-auto-vehicle').value = doc.vehicleNumber || '';
      
      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      const townVal = doc.town || parts[2] || parts[1] || '';
      const localityVal = doc.locality || parts[1] || '';
      
      setupDynamicEditAutoDropdowns(doc.district, townVal, localityVal);
      
      document.getElementById('edit-auto-stand').value = doc.autoStand || parts[0] || '';
      document.getElementById('edit-auto-phone').value = doc.phone || '';
      document.getElementById('edit-auto-wa').value = doc.whatsapp || '';
      document.getElementById('edit-auto-time').value = doc.availableHours || '';

      if (editModalAuto) editModalAuto.style.display = 'flex';
    }`;

js = js.replace(targetStr, replaceStr);

fs.writeFileSync('assets/js/admin.js', js);
console.log('Fixed edit auto modal dropdowns.');
