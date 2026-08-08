const fs = require('fs');

const indexFile = 'd:/Antigravity/servekerala.in/business/index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// The file got completely mangled from lines 266 down.
// Let's restore the entire `renderListing` function.
const startIdx = content.indexOf('function renderListing(data, slug) {');
const endIdx = content.indexOf('// ── Hero Section ──');

if (startIdx > -1 && endIdx > -1) {
  const replacement = `function renderListing(data, slug) {
    const icon = CATEGORY_ICONS[data.category] || CATEGORY_ICONS.default;
    const name = data.name || 'Business Listing';
    const desc = data.description || '';
    const phone = data.phone || '';
    const whatsapp = data.whatsapp || phone;
    const email = data.email || '';
    const website = data.website || '';
    const address = data.address || '';
    const mapUrl = data.mapUrl || '';
    const district = data.district || '';
    const towns = data.towns || '';
    const category = data.category || '';
    const gbpRating = data.gbpRating || null;
    const gbpReviews = data.gbpReviews || null;
    const gbpUrl = data.gbpUrl || '';
    const services = data.servicesOffered ? data.servicesOffered.split('\\n').filter(Boolean) : [];
    const whyChoose = data.whyChooseUs ? data.whyChooseUs.split('\\n').filter(Boolean) : [];

    // ── SEO meta tags ──
    const displayCategory = data.primary_service || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Local Business');
    const displayLocation = towns ? towns.split(',')[0].trim() : (district || 'Kerala');
    document.getElementById('page-title').textContent = \`\${name} | \${displayCategory} in \${displayLocation} | ServeKerala\`;
    document.getElementById('page-description').setAttribute('content', desc.slice(0, 160) || \`Find \${name} on ServeKerala.in.\`);
    document.getElementById('page-keywords').setAttribute('content', \`\${name.toLowerCase()}, \${category}, \${displayLocation.toLowerCase()}, kerala\`);
    document.getElementById('og-title').setAttribute('content', name);
    document.getElementById('og-desc').setAttribute('content', desc.slice(0, 200));
    document.getElementById('og-url').setAttribute('content', window.location.href);
    document.getElementById('breadcrumb-current').textContent = name;

    // ── JSON-LD Structured Data ──
    const ld = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": name,
      "description": desc,
      "url": window.location.href,
      "telephone": phone,
      "address": { "@type": "PostalAddress", "addressRegion": "Kerala", "addressCountry": "IN", "addressLocality": district }
    };
    if (email) ld.email = email;
    if (website) ld.sameAs = [website];
    document.getElementById('structured-data').textContent = JSON.stringify(ld, null, 2);

    // ── GTM tracking ──
    const track = (action) => {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ event: 'business_click', business_name: name, action_type: action });
      }
      if (typeof trackListingClick === 'function') {
        trackListingClick(\`/business/\${slug}/\`, action);
      }
    };

    `;
    
  const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(indexFile, newContent, 'utf8');
  console.log("Fixed business/index.html!");
} else {
  console.log("Could not find boundaries");
}
