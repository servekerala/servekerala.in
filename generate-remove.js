const fs = require('fs');
const path = require('path');

const privacyFile = 'privacy-policy/index.html';
let privacyContent = fs.readFileSync(privacyFile, 'utf8');

// The top part of the layout, including header, navigation, and breadcrumbs.
const topPart = privacyContent.split('<section class="section">')[0];
// The bottom part of the layout, starting from the end of the section
const bottomPart = '</section>' + privacyContent.split('</section>')[1];

let newTopPart = topPart.replace(/<title>Privacy Policy \| ServeKerala\.in<\/title>/, '<title>Listing Removal Request | ServeKerala.in</title>');
newTopPart = newTopPart.replace(/<meta name="description" content="[^"]+">/, '<meta name="description" content="Submit a request to remove, correct, or update a listing on ServeKerala.in.">');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/, '<span class="current">Listing Removal</span>');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/g, '<span class="current">Listing Removal</span>');

const pageContent = `
<section class="section">
  <div class="container" style="max-width: 800px; margin: 0 auto;">
    
    <div class="profile-main-layout" style="margin: 0; display: block;">
      <div class="lead-form-box">
        <h1 style="font-size: 32px; font-weight: 800; color: var(--primary); margin-bottom: 16px;">Listing Removal Request</h1>
        
        <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
          ServeKerala.in respects the privacy and preferences of businesses, service providers and Auto Mithram drivers.
        </p>
        
        <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
          If you would like to remove, correct or update a listing, please submit a request using the form below.
        </p>

        <div style="background: #f9fdfa; border: 1px solid #e2e8f0; padding: 20px; border-radius: var(--border-radius-sm); margin-bottom: 24px;">
          <h4 style="font-size: 16px; margin-bottom: 12px; color: var(--text-main);">Requests may be made for:</h4>
          <ul style="margin-left: 20px; font-size: 15px; color: var(--text-muted); line-height: 1.8; margin-bottom: 0;">
            <li>Incorrect information</li>
            <li>Duplicate listings</li>
            <li>Closed businesses</li>
            <li>Inactive driver profiles</li>
            <li>Privacy concerns</li>
            <li>Other legitimate reasons</li>
          </ul>
        </div>

        <form onsubmit="alert('Thank you. Your request has been submitted successfully. We will review it within 30 days.'); return false;">
          
          <div class="grid grid-2" style="gap: 16px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="rname">Full Name *</label>
              <input type="text" id="rname" required placeholder="Your full name">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="rphone">Phone Number *</label>
              <input type="tel" id="rphone" required placeholder="10-digit mobile number">
            </div>
          </div>

          <div class="form-group">
            <label for="rurl">Listing URL (if known)</label>
            <input type="url" id="rurl" placeholder="https://servekerala.in/...">
          </div>

          <div class="grid grid-2" style="gap: 16px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="rcategory">Category</label>
              <select id="rcategory">
                <option value="">Select Category</option>
                <option value="business">Business / Service Provider</option>
                <option value="auto">Auto Mithram Driver</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="rbusiness">Business / Driver Name</label>
              <input type="text" id="rbusiness" placeholder="Name as shown on listing">
            </div>
          </div>

          <div class="form-group">
            <label for="rreason">Reason for Request *</label>
            <select id="rreason" required>
              <option value="">Select a Reason</option>
              <option value="incorrect">Incorrect Information</option>
              <option value="duplicate">Duplicate Listing</option>
              <option value="closed">Business Closed</option>
              <option value="privacy">Privacy Concern</option>
              <option value="inactive_driver">Driver No Longer Active</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" class="btn-form-submit" style="width: auto; padding: 14px 40px; display: inline-flex; margin-top: 12px;">Submit Request</button>
        </form>

        <div style="margin-top: 30px; padding-top: 24px; border-top: 1px solid var(--border-color);">
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">
            We aim to review and respond to removal requests within 30 days.
          </p>
          <p style="font-size: 14px; font-weight: 600; color: var(--text-main);">
            For urgent requests, please contact: <br>
            <span style="font-weight: normal; color: var(--text-muted);">Email: <a href="mailto:servekerala.in@gmail.com" style="color: var(--primary);">servekerala.in@gmail.com</a></span>
          </p>
        </div>

      </div>
    </div>

  </div>
`;

const finalHTML = newTopPart + pageContent + bottomPart;

const targetDir = 'remove-listing';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'index.html'), finalHTML, 'utf8');
console.log('Created remove-listing/index.html');

// Add to sitemap
const sitemapPath = 'sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes('https://servekerala.in/remove-listing/')) {
    const d = new Date();
    const today = d.toISOString().split('T')[0];
    const newUrl = "  <url>\n    <loc>https://servekerala.in/remove-listing/</loc>\n    <lastmod>" + today + "</lastmod>\n    <priority>0.5</priority>\n  </url>\n";
    sitemap = sitemap.replace('</urlset>', newUrl + '</urlset>');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Added remove-listing to sitemap.xml');
}
