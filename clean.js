const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

const splitCMS = html.indexOf('<!-- CMS / Settings Section (Hidden by default) -->');
const splitPageGen = html.indexOf('<!-- Page Generator Section -->');

if (splitCMS !== -1 && splitPageGen !== -1) {
  let part1 = html.substring(0, splitCMS);
  let part3 = html.substring(splitPageGen);
  let middle = html.substring(splitCMS, splitPageGen);

  // The middle contains the duplicate. Let's find the FIRST "<!-- Locations Section -->" 
  // and the SECOND "<!-- Dynamic Settings Management -->"
  
  const splitCMS2 = middle.indexOf('<!-- CMS / Settings Section (Hidden by default) -->', middle.indexOf('<!-- CMS / Settings Section (Hidden by default) -->') + 1);
  
  if (splitCMS2 !== -1) {
    // There is a duplicate CMS settings section.
    // We want to keep from the start of middle until the start of the FIRST "<!-- Locations Section -->"
    const startOfDuplicateLocations = middle.indexOf('<!-- Locations Section -->');
    
    // We want to keep the true "Dynamic Settings Management" which is in the second CMS block.
    const trueDynamicSettings = middle.indexOf('<!-- Dynamic Settings Management -->', splitCMS2);
    
    const validCMS = middle.substring(0, startOfDuplicateLocations);
    const validLocations = '\n      <!-- Locations Section -->\n      <div id="admin-locations-container" class="admin-cms" style="display: none; background: var(--bg-base); padding: 30px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">\n        ' + middle.substring(trueDynamicSettings);
    
    html = part1 + validCMS + validLocations + part3;
    fs.writeFileSync('admin/index.html', html);
    console.log('Cleaned HTML successfully.');
  } else {
    console.log('No duplicate found, check structure manually.');
  }
} else {
  console.log('Could not find boundaries.');
}
