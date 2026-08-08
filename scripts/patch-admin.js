const fs = require('fs');
let js = fs.readFileSync('assets/js/admin.js', 'utf8');

const regexHTML = /\} else if \(item\.status === 'approved'\) \{\s*actionsHTML = `[\s\S]*?`;\s*\} else \{/;

const replacementHtml = `} else if (item.status === 'approved') {
          const isFeat = item.isFeatured === true;
          actionsHTML = \`
            <button class="btn-admin btn-reject" data-id="\${item.id}">Archive</button>
            <button class="btn-admin btn-edit-listing" data-id="\${item.id}">Edit Details</button>
            <button class="btn-admin btn-feature" data-id="\${item.id}" style="background: \${isFeat ? '#f59e0b' : '#3b82f6'}; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; padding: 6px 12px; margin-left: 4px;">\${isFeat ? 'Unfeature' : 'Feature'}</button>
          \`;
        } else {`;

if (regexHTML.test(js)) {
  js = js.replace(regexHTML, replacementHtml);
  console.log("Replaced HTML");
} else {
  console.log("Could not find target HTML");
}

fs.writeFileSync('assets/js/admin.js', js, 'utf8');
console.log("Done");
