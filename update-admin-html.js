const fs = require('fs');
let html = fs.readFileSync('admin/index.html', 'utf8');

// 1. Add Tab Button
if (!html.includes('data-type="page_generator"')) {
  html = html.replace(
    '<button class="content-type-btn" data-type="seo_settings"',
    '<button class="content-type-btn" data-type="page_generator" style="padding: 8px 16px; border: none; background: #e5e7eb; color: var(--text-dark); border-radius: 4px; cursor: pointer; font-weight: 600;">🚀 Page Generator</button>\n        <button class="content-type-btn" data-type="seo_settings"'
  );
}

// 2. Add Container
const pageGeneratorContainer = `
      <!-- Page Generator Section -->
      <div id="admin-page-generator-container" class="admin-cms" style="display: none; background: var(--bg-base); padding: 30px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
          <h3 style="font-size: 20px; color: var(--primary); margin: 0;">Automated Page Generator</h3>
          <button id="btn-save-page-generator" class="btn btn-primary" style="padding: 8px 16px;">Save Configuration & Deploy</button>
        </div>
        
        <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 15px; line-height: 1.6;">
          Define the configurations here. The Vercel build script will read these settings and automatically generate hundreds of static HTML pages for both the Service Directory and Auto Mithram directory!
        </p>

        <form id="page-generator-form">
          <div class="grid grid-2" style="gap: 40px; margin-bottom: 40px;">
            <!-- Service Directory Config -->
            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
              <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                Service Directory
                <span style="font-size: 12px; font-weight: normal; color: var(--text-muted);">JSON Configuration</span>
              </h4>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Defines the district/town mappings for services (e.g. Plumber in Kottayam).</p>
              <textarea id="pg-service-config" rows="12" style="width: 100%; font-family: monospace; font-size: 13px; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-surface); resize: vertical;"></textarea>
            </div>

            <!-- Auto Mithram Config -->
            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
              <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                Auto Mithram Stands
                <span style="font-size: 12px; font-weight: normal; color: var(--text-muted);">JSON Configuration</span>
              </h4>
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Defines the districts, towns, and specific auto stands (e.g. Railway Station in Thiruvalla).</p>
              <textarea id="pg-auto-config" rows="12" style="width: 100%; font-family: monospace; font-size: 13px; padding: 12px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-surface); resize: vertical;"></textarea>
            </div>
          </div>
        </form>
      </div>
`;

if (!html.includes('admin-page-generator-container')) {
  html = html.replace(
    '<!-- SEO Settings Section (Hidden by default) -->',
    pageGeneratorContainer + '\n\n      <!-- SEO Settings Section (Hidden by default) -->'
  );
}

fs.writeFileSync('admin/index.html', html, 'utf8');
console.log('admin/index.html updated with Page Generator UI');
