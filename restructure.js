const fs = require('fs');

let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add "Locations" tab button
html = html.replace(
  '<button class="content-type-btn" data-type="seo_settings"',
  '<button class="content-type-btn" data-type="location_settings" style="padding: 8px 16px; border: none; background: #e5e7eb; color: var(--text-dark); border-radius: 4px; cursor: pointer; font-weight: 600; margin-left: 10px;">📍 Locations</button>\n        <button class="content-type-btn" data-type="seo_settings"'
);

// 2. Separate out the "Manage Directory Parameters" section into its own div
const split1 = html.indexOf('<!-- Dynamic Settings Management -->');
const split2 = html.indexOf('<!-- Page Generator Section -->');

if (split1 !== -1 && split2 !== -1) {
  const p1 = html.substring(0, split1);
  const p2 = html.substring(split1, split2);
  const p3 = html.substring(split2);

  // Close the cms div before opening locations div
  const newP2 = p2.replace(
    '<!-- Dynamic Settings Management -->',
    '</div>\n\n      <!-- Locations Section -->\n      <div id="admin-locations-container" class="admin-cms" style="display: none; background: var(--bg-base); padding: 30px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">\n        <!-- Dynamic Settings Management -->'
  );

  html = p1 + newP2 + p3;
}

// 3. Cache bust
html = html.replace('src="/assets/js/admin.js?v=2.5"', 'src="/assets/js/admin.js?v=3.0"');

fs.writeFileSync('admin/index.html', html);
console.log('Done');
