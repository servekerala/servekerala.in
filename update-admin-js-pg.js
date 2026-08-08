const fs = require('fs');

let content = fs.readFileSync('assets/js/admin.js', 'utf8');

// 1. Tab Switching Logic
const pgDashboardInit = `      } else if (activeCollection === 'page_generator') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (typeof seoContainer !== 'undefined' && seoContainer) seoContainer.style.display = 'none';
        const pgContainer = document.getElementById('admin-page-generator-container');
        if (pgContainer) pgContainer.style.display = 'block';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadPageGeneratorSettings();
        return;`;

if (!content.includes("activeCollection === 'page_generator'")) {
  content = content.replace(
    "} else if (activeCollection === 'seo_settings') {",
    pgDashboardInit + "\n" + "      } else if (activeCollection === 'seo_settings') {"
  );
}

// Ensure pgContainer is hidden when other tabs are active
content = content.replace(/if \(typeof seoContainer !== 'undefined' && seoContainer\) seoContainer\.style\.display = 'none';/g, "if (typeof seoContainer !== 'undefined' && seoContainer) seoContainer.style.display = 'none';\n        const pgContainer = document.getElementById('admin-page-generator-container');\n        if (pgContainer) pgContainer.style.display = 'none';");

// 2. Load and Save Logic
const pgLogic = `
    // ==================== PAGE GENERATOR LOGIC ====================
    const defaultServiceConfig = {
      'Kottayam': ['Kottayam', 'Changanacherry', 'Ettumanoor', 'Pala'],
      'Pathanamthitta': ['Thiruvalla', 'Adoor', 'Ranni', 'Kozhencherry', 'Pandalam'],
      'Alappuzha': ['Alappuzha', 'Chengannur', 'Cherthala', 'Kayamkulam'],
      'Kollam': ['Kollam', 'Karunagappally', 'Kottarakkara', 'Punalur']
    };

    const defaultAutoConfig = {
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

    function loadPageGeneratorSettings() {
      db.collection('page_generator_config').doc('global').get().then((doc) => {
        const data = doc.exists ? doc.data() : {};
        
        const serviceData = data.service_directory || defaultServiceConfig;
        const autoData = data.auto_mithram || defaultAutoConfig;

        const serviceTextarea = document.getElementById('pg-service-config');
        const autoTextarea = document.getElementById('pg-auto-config');

        if (serviceTextarea) serviceTextarea.value = JSON.stringify(serviceData, null, 2);
        if (autoTextarea) autoTextarea.value = JSON.stringify(autoData, null, 2);
      }).catch((error) => {
        console.error('Error fetching Page Generator settings:', error);
        showDashboardStatus('Error loading Page Generator settings.', 'alert-error');
      });
    }

    const btnSavePageGen = document.getElementById('btn-save-page-generator');
    if (btnSavePageGen) {
      btnSavePageGen.addEventListener('click', (e) => {
        e.preventDefault();
        
        btnSavePageGen.disabled = true;
        btnSavePageGen.textContent = 'Saving...';

        try {
          const serviceVal = document.getElementById('pg-service-config').value;
          const autoVal = document.getElementById('pg-auto-config').value;
          
          const serviceConfig = JSON.parse(serviceVal);
          const autoConfig = JSON.parse(autoVal);

          db.collection('page_generator_config').doc('global').set({
            service_directory: serviceConfig,
            auto_mithram: autoConfig
          }, { merge: true }).then(() => {
            showDashboardStatus('Page Generator configurations saved! Run "vercel --prod" to deploy.', 'alert-success');
          }).catch((error) => {
            console.error('Error saving configs:', error);
            showDashboardStatus('Failed to save configurations.', 'alert-error');
          }).finally(() => {
            btnSavePageGen.disabled = false;
            btnSavePageGen.textContent = 'Save Configuration & Deploy';
          });
        } catch (err) {
          showDashboardStatus('Invalid JSON format. Please check your syntax and try again.', 'alert-error');
          btnSavePageGen.disabled = false;
          btnSavePageGen.textContent = 'Save Configuration & Deploy';
        }
      });
    }
`;

if (!content.includes('loadPageGeneratorSettings() {')) {
  const lastIdx = content.lastIndexOf('});');
  content = content.substring(0, lastIdx) + pgLogic + content.substring(lastIdx);
}

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log('admin.js updated with Page Generator UI logic');
