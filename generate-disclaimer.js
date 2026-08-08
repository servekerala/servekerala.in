const fs = require('fs');
const path = require('path');

const privacyFile = 'privacy-policy/index.html';
let privacyContent = fs.readFileSync(privacyFile, 'utf8');

// The top part of the layout, including header, navigation, and breadcrumbs.
const topPart = privacyContent.split('<section class="section">')[0];
// The bottom part of the layout, starting from the end of the section
const bottomPart = '</section>' + privacyContent.split('</section>')[1];

// Make adjustments for Disclaimer page
let newTopPart = topPart.replace(/<title>Privacy Policy \| ServeKerala\.in<\/title>/, '<title>Disclaimer | ServeKerala.in</title>');
newTopPart = newTopPart.replace(/<meta name="description" content="[^"]+">/, '<meta name="description" content="Disclaimer for ServeKerala.in. Read about our platform limitations, liability exclusions, and service guarantees.">');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/, '<span class="current">Disclaimer</span>');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/g, '<span class="current">Disclaimer</span>');

const disclaimerContent = `
<section class="section">
  <div class="container" style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 36px; font-weight: 800; color: var(--primary); margin-bottom: 12px;">Disclaimer</h1>
    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 15px;">Last Updated: 20 June 2026</p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">1. General Disclaimer</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in and Auto Mithram provide an online platform that enables users to discover, view, and contact independent businesses, service providers, and auto-rickshaw drivers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in acts solely as a directory, listing, and communication platform.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      We do not own, operate, manage, supervise, employ, endorse, or control any business, service provider, driver, vehicle, or service listed on the platform.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">2. No Service Guarantee</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">ServeKerala.in does not guarantee:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Service quality</li>
      <li>Service availability</li>
      <li>Pricing accuracy</li>
      <li>Response times</li>
      <li>Professional qualifications</li>
      <li>Driver conduct</li>
      <li>Vehicle condition</li>
      <li>Business performance</li>
      <li>Customer satisfaction</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Users are advised to independently verify service providers before engaging their services.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">3. Auto Mithram Disclaimer</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Auto Mithram is a service category operated under ServeKerala.in that allows passengers to discover and directly contact independent auto-rickshaw drivers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Auto Mithram is not a taxi operator, transport company, ride-hailing platform, travel agency, or transportation provider.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">ServeKerala.in does not:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Assign rides</li>
      <li>Control fares</li>
      <li>Manage drivers</li>
      <li>Collect transportation payments</li>
      <li>Supervise trips</li>
      <li>Monitor driver behaviour</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      All transportation services are provided independently by the listed drivers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Any agreement, fare, ride, payment, dispute, or arrangement occurs directly between the passenger and the driver.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">4. Driver Verification Disclaimer</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      While we may review information submitted by drivers and businesses, ServeKerala.in does not guarantee the accuracy, validity, authenticity, or completeness of any submitted information.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">Users should independently verify:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Identity</li>
      <li>Licences</li>
      <li>Permits</li>
      <li>Insurance</li>
      <li>Vehicle condition</li>
      <li>Qualifications</li>
      <li>Certifications</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      before engaging any service provider.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">5. Limitation of Liability</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">
      To the fullest extent permitted by applicable law, ServeKerala.in, Auto Mithram, their owners, operators, contributors, and affiliates shall not be liable for:
    </p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Direct or indirect losses</li>
      <li>Damages</li>
      <li>Personal injury</li>
      <li>Property damage</li>
      <li>Service disputes</li>
      <li>Delays</li>
      <li>Cancellations</li>
      <li>Accidents</li>
      <li>Fraudulent activities</li>
      <li>Misrepresentation by service providers</li>
      <li>Payment disputes</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      arising from the use of the platform.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">6. Third-Party Content</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Listings, reviews, images, contact information, and descriptions are submitted by independent users and service providers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      ServeKerala.in does not guarantee the accuracy of such content.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">7. External Links</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      The platform may contain links to external websites, WhatsApp chats, Google Maps listings, social media profiles, and third-party services.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      ServeKerala.in is not responsible for the content, policies, or practices of third-party websites and services.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">8. User Responsibility</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Users are solely responsible for evaluating service providers and making informed decisions before entering into any transaction, ride, agreement, or service arrangement.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Users should exercise reasonable caution and verify relevant details before proceeding.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">9. Changes to this Disclaimer</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in reserves the right to modify this Disclaimer at any time without prior notice.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Continued use of the platform constitutes acceptance of any updated Disclaimer.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">10. Contact</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      For questions regarding this Disclaimer, Privacy Policy, Terms & Conditions, listing removal requests, or grievances, please contact:
    </p>
    <p style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">
      ServeKerala.in
    </p>
    <p style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 16px;">
      📧 Email: <a href="mailto:servekerala.in@gmail.com" style="color: var(--primary);">servekerala.in@gmail.com</a>
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      We aim to respond to legitimate requests within 30 days.
    </p>
`;

const finalHTML = newTopPart + disclaimerContent + bottomPart;

if (!fs.existsSync('disclaimer')) {
  fs.mkdirSync('disclaimer');
}

fs.writeFileSync('disclaimer/index.html', finalHTML, 'utf8');
console.log('Created disclaimer/index.html');

// Add disclaimer link to sitemap if not exists
const sitemapPath = 'sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
if (!sitemap.includes('https://servekerala.in/disclaimer/')) {
    const d = new Date();
    const today = d.toISOString().split('T')[0];
    const newUrl = "  <url>\n    <loc>https://servekerala.in/disclaimer/</loc>\n    <lastmod>" + today + "</lastmod>\n    <priority>0.5</priority>\n  </url>\n";
    sitemap = sitemap.replace('</urlset>', newUrl + '</urlset>');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Added disclaimer to sitemap.xml');
}
