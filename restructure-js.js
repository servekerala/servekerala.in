const fs = require('fs');

let js = fs.readFileSync('assets/js/admin.js', 'utf8');

if (!js.includes('const locContainer = document.getElementById(\'admin-locations-container\');')) {
  js = js.replace(
    'const cmsContainer = document.getElementById(\'admin-cms-container\');',
    'const cmsContainer = document.getElementById(\'admin-cms-container\');\n    const locContainer = document.getElementById(\'admin-locations-container\');'
  );
}

// Add to cms_settings
js = js.replace(
  'cmsContainer.style.display = \'block\';',
  'cmsContainer.style.display = \'block\';\n        if (locContainer) locContainer.style.display = \'none\';'
);

// Add to page_generator
js = js.replace(
  'cmsContainer.style.display = \'none\';\n        if (kpiContainer) kpiContainer.style.display = \'none\';\n        if (typeof seoContainer !== \'undefined\' && seoContainer) seoContainer.style.display = \'none\';',
  'cmsContainer.style.display = \'none\';\n        if (locContainer) locContainer.style.display = \'none\';\n        if (kpiContainer) kpiContainer.style.display = \'none\';\n        if (typeof seoContainer !== \'undefined\' && seoContainer) seoContainer.style.display = \'none\';'
);

// Add to seo_settings
js = js.replace(
  'if (seoContainer) seoContainer.style.display = \'none\';\n        if (seoContainer) seoContainer.style.display = \'block\';',
  'if (seoContainer) seoContainer.style.display = \'none\';\n        if (locContainer) locContainer.style.display = \'none\';\n        if (seoContainer) seoContainer.style.display = \'block\';'
);

// Add to kpi_dashboard
js = js.replace(
  'if (kpiContainer) kpiContainer.style.display = \'block\';',
  'if (locContainer) locContainer.style.display = \'none\';\n        if (kpiContainer) kpiContainer.style.display = \'block\';'
);

// Add to business_pages
js = js.replace(
  'const bpBar = document.getElementById(\'business-pages-action-bar\');\n        if (bpBar) bpBar.style.display = \'block\';',
  'if (locContainer) locContainer.style.display = \'none\';\n        const bpBar = document.getElementById(\'business-pages-action-bar\');\n        if (bpBar) bpBar.style.display = \'block\';'
);

// Add to else block
js = js.replace(
  'const bpBar = document.getElementById(\'business-pages-action-bar\');\n        if (bpBar) bpBar.style.display = \'none\';',
  'if (locContainer) locContainer.style.display = \'none\';\n        const bpBar = document.getElementById(\'business-pages-action-bar\');\n        if (bpBar) bpBar.style.display = \'none\';'
);

// Add location_settings if block
js = js.replace(
  'if (activeCollection === \'cms_settings\') {',
  `if (activeCollection === 'location_settings') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (locContainer) locContainer.style.display = 'block';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        const pgContainer = document.getElementById('admin-page-generator-container');
        if (pgContainer) pgContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        return;
      } else if (activeCollection === 'cms_settings') {`
);

fs.writeFileSync('assets/js/admin.js', js);
console.log('Done');
