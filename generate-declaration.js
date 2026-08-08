const fs = require('fs');
const path = require('path');

const privacyFile = 'privacy-policy/index.html';
let privacyContent = fs.readFileSync(privacyFile, 'utf8');

// The top part of the layout, including header, navigation, and breadcrumbs.
const topPart = privacyContent.split('<section class="section">')[0];
// The bottom part of the layout, starting from the end of the section
const bottomPart = '</section>' + privacyContent.split('</section>')[1];

let newTopPart = topPart.replace(/<title>Privacy Policy \| ServeKerala\.in<\/title>/, '<title>Auto Mithram Driver Declaration | ServeKerala.in</title>');
newTopPart = newTopPart.replace(/<meta name="description" content="[^"]+">/, '<meta name="description" content="Driver declaration for Auto Mithram on ServeKerala.in.">');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/, '<span class="current">Auto Mithram Driver Declaration</span>');
newTopPart = newTopPart.replace(/<span class="current">Privacy Policy<\/span>/g, '<span class="current">Auto Mithram Driver Declaration</span>');

const declarationContent = `
<section class="section">
  <div class="container" style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 36px; font-weight: 800; color: var(--primary); margin-bottom: 12px;">Auto Mithram Driver Declaration</h1>
    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 15px;">Version 1.0<br>Last Updated: 20 June 2026</p>

    <p style="font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">
      By registering as an Auto Mithram driver, I confirm that:
    </p>

    <ul style="margin-left: 20px; margin-bottom: 24px; font-size: 15px; color: var(--text-muted); line-height: 1.8;">
      <li style="margin-bottom: 8px;">The information submitted by me is true, accurate and complete.</li>
      <li style="margin-bottom: 8px;">I possess the required driving licence, vehicle registration, permits, insurance and approvals required under applicable laws.</li>
      <li style="margin-bottom: 8px;">I am solely responsible for my conduct, fares, services, vehicle condition, safety practices and legal compliance.</li>
      <li style="margin-bottom: 8px;">Auto Mithram and ServeKerala.in act only as a directory and communication platform.</li>
      <li style="margin-bottom: 8px;">Auto Mithram and ServeKerala.in do not employ, supervise, manage or control me.</li>
      <li style="margin-bottom: 8px;">Any ride, fare, payment, agreement or dispute occurs directly between me and the passenger.</li>
      <li style="margin-bottom: 8px;">I authorize ServeKerala.in and Auto Mithram to publicly display my listing information, including my name, phone number, WhatsApp number, vehicle information, service area and auto stand details.</li>
      <li style="margin-bottom: 8px;">I understand that false information may result in suspension or permanent removal of my listing.</li>
      <li style="margin-bottom: 8px;">I agree to comply with all applicable laws and regulations governing my services.</li>
    </ul>

    <p style="font-size: 15px; font-weight: 600; color: var(--text-main); line-height: 1.7; margin-bottom: 24px;">
      By submitting my registration, I acknowledge and agree to this Driver Declaration.
    </p>

  </div>
`;

const finalHTML = newTopPart + declarationContent + bottomPart;

const targetDir = 'auto-mithram/driver-declaration';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'index.html'), finalHTML, 'utf8');
console.log('Created auto-mithram/driver-declaration/index.html');
