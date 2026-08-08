const fs = require('fs');
let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const regexHTML = /<button class="btn-admin btn-feature".*?<\/button>/g;

const replacementHtml = `<label style="display:inline-flex; align-items:center; cursor:pointer; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 4px; font-weight: 600; margin-left: 4px;">
                <input type="checkbox" class="feature-checkbox" data-id="\${item.id}" \${isFeat ? 'checked' : ''} style="margin-right: 6px; transform: scale(1.2);"> Feature on Homepage
              </label>`;

if (regexHTML.test(js)) {
  js = js.replace(regexHTML, replacementHtml);
  console.log("Replaced HTML");
} else {
  console.log("Could not find target HTML");
}

const regexEvent = /listingsContainer\.querySelectorAll\('\.btn-feature'\)\.forEach\(btn => \{[\s\S]*?\}\);\s*\}\);/g;

const replacementEvent = `listingsContainer.querySelectorAll('.feature-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const id = e.target.getAttribute('data-id');
          const isCurrentlyFeatured = e.target.checked;
          db.collection(activeCollection).doc(id).update({
            isFeatured: isCurrentlyFeatured
          }).then(() => {
            // initializeDashboard(); // Don't reload entire dashboard on checkbox tick to prevent annoying jump
            console.log('Featured status updated');
          }).catch(error => {
            console.error(error);
            e.target.checked = !isCurrentlyFeatured; // revert on error
          });
        });
      });`;

if (regexEvent.test(js)) {
  js = js.replace(regexEvent, replacementEvent);
  console.log("Replaced Event");
} else {
  console.log("Could not find target Event");
}

fs.writeFileSync('assets/js/admin.js', js, 'utf8');
console.log("Done");
