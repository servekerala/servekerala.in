const fs = require('fs');

let content = fs.readFileSync('assets/js/admin.js', 'utf8');

// 1. Add DOM elements
if (!content.includes('const seoContainer =')) {
  content = content.replace(
    "const cmsContainer = document.getElementById('admin-cms-container');",
    "const cmsContainer = document.getElementById('admin-cms-container');\n    const seoContainer = document.getElementById('admin-seo-container');\n    const seoForm = document.getElementById('seo-settings-form');"
  );
}

// 2. Add to tab click handler (where it sets activeCollection)
// Since I couldn't easily find the click handler via grep, I'll inject the logic directly into `initializeDashboard`.
// It checks if activeCollection === 'seo_settings'
const seoDashboardInit = `      } else if (activeCollection === 'seo_settings') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'block';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadSeoSettings();
        return;`;

if (!content.includes("activeCollection === 'seo_settings'")) {
  content = content.replace(
    "} else if (activeCollection === 'kpi_dashboard') {",
    seoDashboardInit + "\n" + "      } else if (activeCollection === 'kpi_dashboard') {"
  );
}

// 3. Make sure to hide seoContainer when other tabs are active
content = content.replace(/if \(kpiContainer\) kpiContainer\.style\.display = 'none';/g, "if (kpiContainer) kpiContainer.style.display = 'none';\n        if (seoContainer) seoContainer.style.display = 'none';");

// 4. Add the click listener for contentTypeBtns manually if needed, 
// actually I found the button has class `content-type-btn`. Let's just find `contentTypeBtns.forEach`
// Actually, I didn't find `contentTypeBtns.forEach` with grep_search because maybe it's `Array.from(contentTypeBtns)` or something.
// Let's add loadSeoSettings and form submit logic at the bottom of the DOMContentLoaded block.
const seoLogic = `
    // ==================== SEO SETTINGS LOGIC ====================
    function loadSeoSettings() {
      db.collection('site_seo').doc('global').get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.home) {
            document.getElementById('seo-home-title').value = data.home.title || '';
            document.getElementById('seo-home-desc').value = data.home.description || '';
            document.getElementById('seo-home-keywords').value = data.home.keywords || '';
          }
          if (data.auto) {
            document.getElementById('seo-auto-title').value = data.auto.title || '';
            document.getElementById('seo-auto-desc').value = data.auto.description || '';
            document.getElementById('seo-auto-keywords').value = data.auto.keywords || '';
          }
          if (data.services) {
            document.getElementById('seo-services-title').value = data.services.title || '';
            document.getElementById('seo-services-desc').value = data.services.description || '';
            document.getElementById('seo-services-keywords').value = data.services.keywords || '';
          }
        }
      }).catch((error) => {
        console.error('Error fetching SEO settings:', error);
        showDashboardStatus('Error loading SEO settings.', 'alert-error');
      });
    }

    if (seoForm) {
      seoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSaveSeo = document.getElementById('btn-save-seo');
        if (btnSaveSeo) {
          btnSaveSeo.disabled = true;
          btnSaveSeo.textContent = 'Saving...';
        }

        const newSeoSettings = {
          home: {
            title: document.getElementById('seo-home-title').value.trim(),
            description: document.getElementById('seo-home-desc').value.trim(),
            keywords: document.getElementById('seo-home-keywords').value.trim()
          },
          auto: {
            title: document.getElementById('seo-auto-title').value.trim(),
            description: document.getElementById('seo-auto-desc').value.trim(),
            keywords: document.getElementById('seo-auto-keywords').value.trim()
          },
          services: {
            title: document.getElementById('seo-services-title').value.trim(),
            description: document.getElementById('seo-services-desc').value.trim(),
            keywords: document.getElementById('seo-services-keywords').value.trim()
          }
        };

        db.collection('site_seo').doc('global').set(newSeoSettings, { merge: true }).then(() => {
          showDashboardStatus('SEO Settings saved successfully. They will be applied on the next build.', 'alert-success');
          if (btnSaveSeo) {
            btnSaveSeo.disabled = false;
            btnSaveSeo.textContent = 'Save SEO Settings';
          }
        }).catch((error) => {
          console.error('Error saving SEO:', error);
          showDashboardStatus('Failed to save SEO settings.', 'alert-error');
          if (btnSaveSeo) {
            btnSaveSeo.disabled = false;
            btnSaveSeo.textContent = 'Save SEO Settings';
          }
        });
      });
    }
`;

if (!content.includes('loadSeoSettings() {')) {
  // Insert before the last `});` which closes DOMContentLoaded
  const lastIdx = content.lastIndexOf('});');
  content = content.substring(0, lastIdx) + seoLogic + content.substring(lastIdx);
}

// 5. Let's fix the tab switching listener. I will use regex to find where contentTypeBtns are used.
// Let's just find where `activeCollection = ` happens.
// `data-type` is used.
if (content.includes('btn.addEventListener(\'click\'')) {
   // it's fine
}

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log('admin.js updated for SEO');
