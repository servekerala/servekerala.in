const fs = require('fs');
const path = require('path');

const privacyFile = 'privacy-policy/index.html';
let privacyContent = fs.readFileSync(privacyFile, 'utf8');

// The top part of the layout, including header, navigation, and breadcrumbs.
const topPart = privacyContent.split('<section class="section">')[0];
// The bottom part of the layout, starting from the end of the section
const bottomPart = '</section>' + privacyContent.split('</section>')[1];

// Make adjustments for Terms page
let newTopPart = topPart.replace(/<title>Privacy Policy \| ServeKerala\.in<\/title>/, '<title>Terms & Conditions | ServeKerala.in</title>');
newTopPart = newTopPart.replace(/<meta name="description" content="[^"]+">/, '<meta name="description" content="Terms and Conditions for ServeKerala.in. Read about our user responsibilities, platform rules, and policies.">');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/, '<span class="current">Terms & Conditions</span>');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/g, '<span class="current">Terms & Conditions</span>');

const termsContent = `
<section class="section">
  <div class="container" style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 36px; font-weight: 800; color: var(--primary); margin-bottom: 12px;">Terms & Conditions</h1>
    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 15px;">Version 1.0<br>Last Updated: 20 June 2026</p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">1. Acceptance of Terms</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      By accessing or using ServeKerala.in, Auto Mithram, and related services, you agree to be bound by these Terms & Conditions.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      If you do not agree with these terms, you should not use the platform.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">2. About ServeKerala</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in is an online directory and listing platform that enables users to discover and contact independent businesses, service providers, and auto-rickshaw drivers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      ServeKerala.in is not a service provider, employer, transport operator, contractor, travel agency, taxi aggregator, or ride-hailing platform.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">3. Eligibility</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      You must be at least 18 years of age to use the platform, submit listings, register as a service provider, or register as an Auto Mithram driver.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      By using the platform, you represent that you meet this requirement.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">4. User Responsibilities</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">Users agree to:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Provide accurate information.</li>
      <li>Use the platform lawfully.</li>
      <li>Respect other users and service providers.</li>
      <li>Verify service providers before engaging their services.</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">Users shall not:</p>
    <ul style="margin-left: 20px; margin-bottom: 24px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Submit false information.</li>
      <li>Impersonate another person or business.</li>
      <li>Use the platform for illegal activities.</li>
      <li>Attempt to disrupt or damage the platform.</li>
    </ul>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">5. Business Listings</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Business owners and service providers are responsible for ensuring that all submitted information is accurate and up to date.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      ServeKerala.in reserves the right to edit, reject, suspend, or remove listings at its sole discretion.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">6. Auto Mithram Driver Listings</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">Auto Mithram drivers confirm that:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Information submitted is accurate.</li>
      <li>Required licences and permits are maintained.</li>
      <li>Vehicle operation complies with applicable laws.</li>
      <li>Services are provided independently.</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in and Auto Mithram do not employ, supervise, or manage listed drivers.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Drivers are solely responsible for their conduct, fares, services, vehicle condition, legal compliance, and interactions with passengers.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">7. Public Listing Consent</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">
      By submitting a listing, you authorize ServeKerala.in to publicly display information provided by you, including:
    </p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Name</li>
      <li>Phone number</li>
      <li>WhatsApp number</li>
      <li>Business details</li>
      <li>Service area</li>
      <li>Photos and logos</li>
      <li>Auto stand details</li>
      <li>Vehicle information</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      This information may be indexed by search engines.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">8. Reviews and User Content</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      Users are responsible for any reviews, comments, images, or content submitted to the platform.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">ServeKerala.in reserves the right to remove content that is:</p>
    <ul style="margin-left: 20px; margin-bottom: 24px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>False</li>
      <li>Offensive</li>
      <li>Misleading</li>
      <li>Defamatory</li>
      <li>Illegal</li>
      <li>Spam</li>
    </ul>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">9. No Guarantee of Services</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">ServeKerala.in does not guarantee:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Service quality</li>
      <li>Availability</li>
      <li>Pricing accuracy</li>
      <li>Driver conduct</li>
      <li>Business performance</li>
      <li>Customer satisfaction</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Users must independently evaluate service providers before engaging their services.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">10. Limitation of Liability</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">
      To the maximum extent permitted by law, ServeKerala.in, Auto Mithram, their owners, operators, contributors, and affiliates shall not be liable for:
    </p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Losses</li>
      <li>Damages</li>
      <li>Personal injury</li>
      <li>Property damage</li>
      <li>Service disputes</li>
      <li>Payment disputes</li>
      <li>Delays</li>
      <li>Cancellations</li>
      <li>Accidents</li>
      <li>Misrepresentation by service providers</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Any agreement or transaction occurs directly between users and service providers.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">11. Intellectual Property</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      All website content, branding, logos, design elements, and platform features are the property of ServeKerala.in unless otherwise stated.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Users may not copy, reproduce, or distribute platform content without permission.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">12. Third-Party Services</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">The platform may contain links to:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>WhatsApp</li>
      <li>Google Maps</li>
      <li>Social Media Platforms</li>
      <li>External Websites</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      ServeKerala.in is not responsible for third-party content, policies, or services.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">13. Suspension and Termination</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px;">ServeKerala.in may suspend or remove any listing, account, or content that:</p>
    <ul style="margin-left: 20px; margin-bottom: 16px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li>Violates these Terms</li>
      <li>Contains false information</li>
      <li>Causes harm to users or the platform</li>
    </ul>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      without prior notice.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">14. Changes to Terms</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      ServeKerala.in may update these Terms & Conditions at any time.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Continued use of the platform constitutes acceptance of updated terms.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">15. Governing Law</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      These Terms & Conditions shall be governed by the laws of India.
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      Any disputes shall be subject to the jurisdiction of the courts having authority over the location of ServeKerala.in's operations.
    </p>

    <h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">16. Contact</h2>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      For questions regarding these Terms & Conditions, please contact:
    </p>
    <p style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">
      ServeKerala.in
    </p>
    <p style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 16px;">
      📧 Email: <a href="mailto:servekerala.in@gmail.com" style="color: var(--primary);">servekerala.in@gmail.com</a>
    </p>
    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
      We aim to respond to legitimate enquiries within 30 days.
    </p>
`;

const finalHTML = newTopPart + termsContent + bottomPart;

if (!fs.existsSync('terms')) {
  fs.mkdirSync('terms');
}

fs.writeFileSync('terms/index.html', finalHTML, 'utf8');
console.log('Created/Updated terms/index.html');
