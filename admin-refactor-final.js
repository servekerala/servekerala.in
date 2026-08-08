const fs = require('fs');
let js = fs.readFileSync('assets/js/admin.js', 'utf8');

// 1. Replace variables
const varRegex = /let activeCategories = \[\];\s*let activeDistricts = \[\];\s*let activeTowns = \[\];\s*let activeLocalities = \[\];/;
js = js.replace(varRegex, `let activeCategories = [];
  let activeDistricts = [];
  let globalAutoConfig = {};`);

// 2. Replace loadDirectoryParameters
const loadStart = js.indexOf('function loadDirectoryParameters() {');
const loadEnd = js.indexOf('function populateDropdowns() {');
const newLoad = `function loadDirectoryParameters() {
    return Promise.all([
      db.collection('cms_settings').doc('global').get(),
      db.collection('page_generator_config').doc('global').get()
    ]).then(([cmsDoc, pgDoc]) => {
      let data = cmsDoc.exists ? cmsDoc.data() : {};
      
      if (!data.categories || !data.categories.length) {
        activeCategories = [
          { id: 'solar', name: 'Solar Installation' },
          { id: 'plumbing', name: 'Plumber' }
        ];
      } else {
        activeCategories = data.categories;
      }

      let pgData = pgDoc.exists ? pgDoc.data() : {};
      if (pgData.auto_mithram) {
        globalAutoConfig = typeof pgData.auto_mithram === 'string' ? JSON.parse(pgData.auto_mithram) : pgData.auto_mithram;
      } else {
        globalAutoConfig = {};
      }
      activeDistricts = Object.keys(globalAutoConfig);

      populateDropdowns();
      renderParameterLists();
      if(window.setupHierarchicalDirectoryUI) window.setupHierarchicalDirectoryUI();
    }).catch(err => {
      console.error("Error loading params:", err);
    });
  }

  `;
js = js.substring(0, loadStart) + newLoad + js.substring(loadEnd);

// 3. Replace populateDropdowns, renderParameterLists, saveDirectoryParameters
const popStart = js.indexOf('function populateDropdowns() {');
const domLoadStart = js.indexOf("document.addEventListener('DOMContentLoaded', () => {");
const newPopAndSave = `function populateDropdowns() {
    const bcatSelect = document.getElementById('edit-bcat');
    const bdistSelect = document.getElementById('edit-bdist');
    const bpCatSelect = document.getElementById('bp-category');
    const bpDistSelect = document.getElementById('bp-district');
    const editAutoDist = document.getElementById('edit-auto-dist');
    const editAutoTown = document.getElementById('edit-auto-town');
    const editAutoLocality = document.getElementById('edit-auto-locality');

    const manageTownDist = document.getElementById('manage-town-district-select');
    const manageLocDist = document.getElementById('manage-locality-district-select');
    const manageLocTown = document.getElementById('manage-locality-town-select');

    if (bcatSelect) bcatSelect.innerHTML = activeCategories.map(c => \`<option value="\${c.id}">\${c.name}</option>\`).join('');
    if (bpCatSelect) bpCatSelect.innerHTML = activeCategories.map(c => \`<option value="\${c.id}">\${c.name}</option>\`).join('');
    
    const distOptions = '<option value="">Select District</option>' + activeDistricts.map(d => \`<option value="\${d.toLowerCase()}">\${d}</option>\`).join('');
    
    if (bdistSelect) bdistSelect.innerHTML = distOptions;
    if (bpDistSelect) bpDistSelect.innerHTML = distOptions;
    if (editAutoDist) editAutoDist.innerHTML = distOptions + '<option value="other">Other District</option>';
    
    if (manageTownDist) {
      const prevTownDist = manageTownDist.value;
      manageTownDist.innerHTML = distOptions;
      if (prevTownDist) manageTownDist.value = prevTownDist;
    }
    if (manageLocDist) {
      const prevLocDist = manageLocDist.value;
      manageLocDist.innerHTML = distOptions;
      if (prevLocDist) manageLocDist.value = prevLocDist;
    }
    
    if (editAutoTown) editAutoTown.innerHTML = '';
    if (editAutoLocality) editAutoLocality.innerHTML = '';
  }

  function renderParameterLists() {
    const districtContainer = document.getElementById('district-list-container');
    const categoryContainer = document.getElementById('category-list-container');
    const townContainer = document.getElementById('town-list-container');
    const localityContainer = document.getElementById('locality-list-container');

    // 1. Districts
    if (districtContainer) {
      if (!activeDistricts.length) {
        districtContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No districts configured.</p>';
      } else {
        districtContainer.innerHTML = activeDistricts.map(d => \`
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
            <span style="font-weight: 500;">\${d}</span>
            <button type="button" class="btn-delete-district" data-name="\${d}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
          </div>
        \`).join('');

        districtContainer.querySelectorAll('.btn-delete-district').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const name = e.currentTarget.getAttribute('data-name');
            if (confirm(\`Delete district \${name} and all its towns and localities?\`)) {
              delete globalAutoConfig[name];
              saveDirectoryParameters();
            }
          });
        });
      }
    }

    // 2. Categories
    if (categoryContainer) {
      if (!activeCategories.length) {
        categoryContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No categories configured.</p>';
      } else {
        categoryContainer.innerHTML = activeCategories.map((c, index) => \`
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
            <span><strong style="color: var(--text-main);">\${c.name}</strong> <span style="font-size: 12px; color: var(--text-muted);">(\${c.id})</span></span>
            <button type="button" class="btn-delete-category" data-index="\${index}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
          </div>
        \`).join('');

        categoryContainer.querySelectorAll('.btn-delete-category').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            activeCategories.splice(idx, 1);
            saveDirectoryParameters();
          });
        });
      }
    }

    // 3. Towns
    const selTownDistVal = document.getElementById('manage-town-district-select')?.value;
    const selTownDistKey = activeDistricts.find(d => d.toLowerCase() === selTownDistVal);
    if (townContainer) {
      if (!selTownDistKey) {
        townContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">Please select a District first.</p>';
      } else {
        const townsObj = globalAutoConfig[selTownDistKey] || {};
        const towns = Object.keys(townsObj);
        if (!towns.length) {
          townContainer.innerHTML = \`<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No towns in \${selTownDistKey}.</p>\`;
        } else {
          townContainer.innerHTML = towns.map(t => \`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
              <span style="font-weight: 500;">\${t}</span>
              <button type="button" class="btn-delete-town" data-dist="\${selTownDistKey}" data-town="\${t}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
            </div>
          \`).join('');

          townContainer.querySelectorAll('.btn-delete-town').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const d = e.currentTarget.getAttribute('data-dist');
              const t = e.currentTarget.getAttribute('data-town');
              if (confirm(\`Delete town \${t} and all its localities?\`)) {
                delete globalAutoConfig[d][t];
                saveDirectoryParameters();
              }
            });
          });
        }
      }
    }

    // 4. Localities
    const selLocDistVal = document.getElementById('manage-locality-district-select')?.value;
    const selLocDistKey = activeDistricts.find(d => d.toLowerCase() === selLocDistVal);
    const selLocTownKey = document.getElementById('manage-locality-town-select')?.value;
    
    if (localityContainer) {
      if (!selLocTownKey) {
        localityContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">Please select Town first.</p>';
      } else {
        const locs = (globalAutoConfig[selLocDistKey] && globalAutoConfig[selLocDistKey][selLocTownKey]) || [];
        if (!locs.length) {
          localityContainer.innerHTML = \`<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No localities in \${selLocTownKey}.</p>\`;
        } else {
          localityContainer.innerHTML = locs.map((l, index) => \`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
              <span style="font-weight: 500;">\${l}</span>
              <button type="button" class="btn-delete-locality" data-dist="\${selLocDistKey}" data-town="\${selLocTownKey}" data-index="\${index}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
            </div>
          \`).join('');

          localityContainer.querySelectorAll('.btn-delete-locality').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const d = e.currentTarget.getAttribute('data-dist');
              const t = e.currentTarget.getAttribute('data-town');
              const idx = parseInt(e.currentTarget.getAttribute('data-index'));
              globalAutoConfig[d][t].splice(idx, 1);
              saveDirectoryParameters();
            });
          });
        }
      }
    }
  }

  function saveDirectoryParameters() {
    activeDistricts = Object.keys(globalAutoConfig);
    
    const p1 = db.collection('cms_settings').doc('global').update({
      categories: activeCategories
    });
    
    const p2 = db.collection('page_generator_config').doc('global').set({
      auto_mithram: globalAutoConfig
    }, { merge: true });

    Promise.all([p1, p2]).then(() => {
      localStorage.removeItem('cms_settings'); // Clear cache
      populateDropdowns();
      renderParameterLists();
      
      const autoTextarea = document.getElementById('pg-auto-config');
      if (autoTextarea) autoTextarea.value = JSON.stringify(globalAutoConfig, null, 2);

      showDashboardStatus('Directory parameters updated.', 'alert-success');
    }).catch(err => {
      console.error("Error saving params:", err);
      showDashboardStatus('Failed to save parameters.', 'alert-error');
    });
  }

  `;
js = js.substring(0, popStart) + newPopAndSave + js.substring(domLoadStart);

// 4. Inject setupHierarchicalDirectoryUI definition and call into DOMContentLoaded
const btnAddDistIdx = js.indexOf("const btnAddDistrict = document.getElementById('btn-add-district');");
const kpiIdx = js.indexOf("// ==================== KPI DASHBOARD ====================");

const setupFunction = `
    window.setupHierarchicalDirectoryUI = function() {
      const manageTownDist = document.getElementById('manage-town-district-select');
      const newTownInput = document.getElementById('new-town-input');
      const btnAddTown = document.getElementById('btn-add-town');
      
      const manageLocDist = document.getElementById('manage-locality-district-select');
      const manageLocTown = document.getElementById('manage-locality-town-select');
      const newLocalityInput = document.getElementById('new-locality-input');
      const btnAddLocality = document.getElementById('btn-add-locality');

      const btnAddDistrict = document.getElementById('btn-add-district');
      const newDistrictInput = document.getElementById('new-district-input');

      const btnAddCategory = document.getElementById('btn-add-category');
      const newCategoryName = document.getElementById('new-category-name');
      const newCategoryId = document.getElementById('new-category-id');

      // Add District
      if (btnAddDistrict && newDistrictInput) {
        btnAddDistrict.addEventListener('click', () => {
          const name = newDistrictInput.value.trim();
          if (name) {
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            if (!globalAutoConfig[capitalized]) {
              globalAutoConfig[capitalized] = {};
              newDistrictInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('District already exists!');
            }
          }
        });
      }

      // Add Category
      if (btnAddCategory && newCategoryName && newCategoryId) {
        btnAddCategory.addEventListener('click', () => {
          const name = newCategoryName.value.trim();
          const id = newCategoryId.value.trim().toLowerCase().replace(/\\s+/g, '-');
          if (name && id) {
            if (!activeCategories.some(c => c.id === id)) {
              activeCategories.push({ id, name });
              newCategoryName.value = '';
              newCategoryId.value = '';
              saveDirectoryParameters();
            } else {
              alert('Category ID already exists!');
            }
          }
        });
      }

      // Manage Towns
      if (manageTownDist) {
        manageTownDist.addEventListener('change', () => {
          if (manageTownDist.value) {
            newTownInput.disabled = false;
            btnAddTown.disabled = false;
          } else {
            newTownInput.disabled = true;
            btnAddTown.disabled = true;
          }
          renderParameterLists();
        });
      }
      if (btnAddTown && newTownInput) {
        btnAddTown.addEventListener('click', () => {
          const distVal = manageTownDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          const town = newTownInput.value.trim();
          if (distKey && town) {
            const capitalized = town.charAt(0).toUpperCase() + town.slice(1);
            if (!globalAutoConfig[distKey]) globalAutoConfig[distKey] = {};
            if (!globalAutoConfig[distKey][capitalized]) {
              globalAutoConfig[distKey][capitalized] = [];
              newTownInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('Town already exists in this district!');
            }
          }
        });
      }

      // Manage Localities
      if (manageLocDist) {
        manageLocDist.addEventListener('change', () => {
          const distVal = manageLocDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          manageLocTown.innerHTML = '<option value="">Select Town</option>';
          if (distKey && globalAutoConfig[distKey]) {
            const towns = Object.keys(globalAutoConfig[distKey]);
            manageLocTown.innerHTML += towns.map(t => \`<option value="\${t}">\${t}</option>\`).join('');
            manageLocTown.disabled = false;
          } else {
            manageLocTown.disabled = true;
          }
          manageLocTown.value = '';
          manageLocTown.dispatchEvent(new Event('change'));
        });
      }
      
      if (manageLocTown) {
        manageLocTown.addEventListener('change', () => {
          if (manageLocTown.value) {
            newLocalityInput.disabled = false;
            btnAddLocality.disabled = false;
          } else {
            newLocalityInput.disabled = true;
            btnAddLocality.disabled = true;
          }
          renderParameterLists();
        });
      }

      if (btnAddLocality && newLocalityInput) {
        btnAddLocality.addEventListener('click', () => {
          const distVal = manageLocDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          const townKey = manageLocTown.value;
          const loc = newLocalityInput.value.trim();
          if (distKey && townKey && loc) {
            if (!globalAutoConfig[distKey][townKey]) globalAutoConfig[distKey][townKey] = [];
            if (!globalAutoConfig[distKey][townKey].includes(loc)) {
              globalAutoConfig[distKey][townKey].push(loc);
              newLocalityInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('Locality already exists in this town!');
            }
          }
        });
      }
    };
    
    // Bind the old parameter add buttons is now handled by setupHierarchicalDirectoryUI
    `;

js = js.substring(0, btnAddDistIdx) + setupFunction + js.substring(kpiIdx);

fs.writeFileSync('assets/js/admin.js', js, 'utf8');
console.log('Successfully refactored admin.js');
