const fs = require('fs');

const file = 'privacy-policy/index.html';
let content = fs.readFileSync(file, 'utf8');

const insert1 = `
<!-- ================= USER RIGHTS ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  2.1 Your Rights
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">
  Users may request:
</p>

<ul style="margin-left: 20px; margin-bottom: 24px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
  <li>Correction of listing information.</li>
  <li>Removal of business or driver listings.</li>
  <li>Deletion of submitted personal information.</li>
  <li>Withdrawal of previously granted consent.</li>
</ul>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px;">
  Such requests may be submitted through our Contact page or by emailing the Grievance Officer.
</p>

<!-- ================= PUBLIC LISTING CONSENT ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  2.2 Public Listing Consent
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
  By submitting a business listing, service provider profile, or Auto Mithram driver registration, you expressly authorize ServeKerala.in to publicly display information provided by you, including but not limited to:
</p>

<ul style="margin-left: 20px; margin-bottom: 24px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
  <li>Name of business or service provider.</li>
  <li>Business description and service details.</li>
  <li>Phone number and WhatsApp number.</li>
  <li>Location, district, town, and service area.</li>
  <li>Photographs, logos, and listing images.</li>
  <li>Auto stand information and vehicle details (Auto Mithram).</li>
</ul>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px;">
  This information may be indexed by search engines such as Google and may remain visible in search results until re-crawled or removed.
</p>

<!-- ================= AUTO MITHRAM SECTION ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  2.3 Auto Mithram Driver Listings
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
  Auto Mithram is a service category operated under ServeKerala.in that helps passengers discover and directly contact independent auto-rickshaw drivers.
</p>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
  Auto Mithram drivers voluntarily submit listing information for publication. ServeKerala.in does not employ, supervise, manage, or control listed drivers.
</p>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
  Listed drivers are solely responsible for their conduct, fares, permits, licences, vehicle condition, legal compliance, and transportation services provided to passengers.
</p>

`;

const insert2 = `

<!-- ================= CLOUD SERVICES ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  4.1 Cloud Services & Analytics
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
  ServeKerala.in may use trusted third-party cloud and analytics providers, including Firebase, Vercel, Google Analytics, Google Tag Manager, and related services, for website hosting, authentication, data storage, security, performance monitoring, and visitor analytics.
</p>
`;

const insert3 = `

<!-- ================= AGE RESTRICTION ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  6.1 Age Restriction
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">
  ServeKerala.in and Auto Mithram are intended for individuals who are at least 18 years of age. By using the platform or submitting listings, you represent that you are 18 years of age or older.
</p>
`;

const insert4 = `

<!-- ================= GRIEVANCE OFFICER ================= -->
<h2 style="font-size: 22px; font-weight: 800; margin-top: 30px; margin-bottom: 12px; color: var(--primary);">
  9. Grievance Officer
</h2>

<p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
  For privacy concerns, listing corrections, content removal requests, complaints, or data-related enquiries, you may contact:
</p>

<div style="background:#f8f9fa; padding:20px; border-radius:12px; margin-bottom:24px;">
  <p style="margin:0 0 8px;"><strong>Grievance Officer</strong></p>
  <p style="margin:0 0 8px;">ServeKerala.in</p>
  <p style="margin:0 0 8px;">Email: support@servekerala.in</p>
  <p style="margin:0;">Response Time: Within 30 days of receiving the request.</p>
</div>
`;

// Replace 1
content = content.replace(
  /<li>To identify and prevent fraudulent activities or fake registrations\.<\/li>\s*<\/ul>/,
  "<li>To identify and prevent fraudulent activities or fake registrations.</li>\n    </ul>\n" + insert1
);

// Replace 2
content = content.replace(
  /legally bound not to distribute or use it for other purposes\.\s*<\/p>/,
  "legally bound not to distribute or use it for other purposes.\n    </p>\n" + insert2
);

// Replace 3
content = content.replace(
  /follow standard security practices to keep your details safe\.\s*<\/p>/,
  "follow standard security practices to keep your details safe.\n    </p>\n" + insert3
);

// Replace 4
content = content.replace(
  /📧 Email: <a href="mailto:bestservicenearme@gmail\.com" style="color: var\(--primary\);">bestservicenearme@gmail\.com<\/a>\s*<\/p>/,
  "📧 Email: <a href=\"mailto:bestservicenearme@gmail.com\" style=\"color: var(--primary);\">bestservicenearme@gmail.com</a>\n    </p>\n" + insert4
);

fs.writeFileSync(file, content, 'utf8');
console.log('Regex replace done! Content length: ' + content.split('\\n').length);
