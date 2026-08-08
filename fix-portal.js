const fs = require('fs');
const path = require('path');

const statsHTML = `
        <!-- Dashboard Stats -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 20px;">
          <div style="background: var(--bg-base); padding: 12px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color);">
            <div style="font-size: 20px; font-weight: 800; color: var(--primary);" id="dashboard-stat-views">0</div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Profile Views</div>
          </div>
          <div style="background: var(--bg-base); padding: 12px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color);">
            <div style="font-size: 20px; font-weight: 800; color: var(--primary);" id="dashboard-stat-calls">0</div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Call Clicks</div>
          </div>
          <div style="background: var(--bg-base); padding: 12px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color);">
            <div style="font-size: 20px; font-weight: 800; color: var(--primary);" id="dashboard-stat-wa">0</div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">WhatsApp</div>
          </div>
        </div>

        <!-- Edit Profile Form -->`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, fix the broken login form if it exists
    if (content.includes('Enter your registered phone number and secret 6-digit PIN to update your status.\n        <!-- Edit Profile Form -->')) {
        // It's broken. Let's fix it manually. This is complex.
        // Actually, let's just copy the correct modal from a known good file like auto/thiruvalla/index.html to auto-mithram/index.html
    }
}

// Just copy the whole modal from auto/thiruvalla/index.html to auto-mithram/index.html
let goodContent = fs.readFileSync('auto/thiruvalla/index.html', 'utf8');
let badContent = fs.readFileSync('auto-mithram/index.html', 'utf8');

const modalRegex = /<!-- ================= DRIVER PORTAL MODAL ================= -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const goodModal = goodContent.match(modalRegex)[0];

let fixedBadContent = badContent.replace(/<!-- ================= DRIVER PORTAL MODAL ================= -->[\s\S]*?(?=<!-- CSS spinner animation)/, goodModal + '\n\n');
fs.writeFileSync('auto-mithram/index.html', fixedBadContent, 'utf8');

// Now let's inject the stats into auto-mithram/index.html and scripts/auto-seo-template.html
function injectStats(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('<!-- Dashboard Stats -->')) {
        content = content.replace('<!-- Edit Profile Form -->', statsHTML);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Injected stats into', filePath);
    }
}

injectStats('auto-mithram/index.html');
injectStats('scripts/auto-seo-template.html');

console.log('Done!');
