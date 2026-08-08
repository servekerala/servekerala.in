const fs = require('fs');

let html = fs.readFileSync('admin/index.html', 'utf8');

const searchConsoleHtml = `
          <h4 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; border-top: 1px solid var(--border-color); padding-top: 24px;">Search Console Integration</h4>
          <div class="form-group" style="margin-bottom: 30px;">
            <label for="seo-google-verification">Google Site Verification Code (Optional)</label>
            <input type="text" id="seo-google-verification" placeholder="e.g. gC_d... or full <meta> tag">
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Paste the exact content value or the full HTML tag provided by Google Search Console. It will be injected into all pages.</p>
          </div>
`;

if (!html.includes('id="seo-google-verification"')) {
  html = html.replace(
    '</form>\n      </div>\n\n    </div>\n  </div>\n</main>',
    searchConsoleHtml + '\n        </form>\n      </div>\n\n    </div>\n  </div>\n</main>'
  );
}

fs.writeFileSync('admin/index.html', html, 'utf8');
console.log('admin/index.html updated with Google Site Verification UI');
