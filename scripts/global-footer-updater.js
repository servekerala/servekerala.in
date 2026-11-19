const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', '.vercel', 'kottayam', 'pathanamthitta', 'kollam', 'alappuzha', 'categories', 'business'];

const newFooter = `  <!-- ================= FOOTER ================= -->
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col brand-col">
        <div class="footer-logo">ServeKerala<span>.in</span></div>
        <p class="footer-tagline">
          Kerala's premier local marketplace. Connecting you directly to verified local professionals without any middleman commission.
        </p>
        <div class="footer-badges">
          <span class="trust-badge">✓ 100% Commission-Free</span>
        </div>
      </div>
      
      <div class="footer-col">
        <h4>Explore Directory</h4>
        <nav class="footer-links">
          <a href="/">Home</a>
          <a href="/services/">Browse Services</a>
          <a href="/contact/">Get in Touch</a>
        </nav>
      </div>

      <div class="footer-col">
        <h4>Top Coverage</h4>
        <nav class="footer-links">
          <a href="/kottayam/">Kottayam</a>
          <a href="/pathanamthitta/">Pathanamthitta</a>
          <a href="/alappuzha/">Alappuzha</a>
          <a href="/kollam/">Kollam</a>
        </nav>
      </div>

      <div class="footer-col">
        <h4>For Professionals</h4>
        <p class="footer-cta-subtext">Are you a service provider? Register your business today to get high-quality WhatsApp leads.</p>
        <a href="/list-your-business/?v=1.4" class="btn-footer-cta">List Your Business</a>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; 2026 ServeKerala.in. All rights reserved.</p>
      <nav class="footer-bottom-nav">
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms/">Terms & Conditions</a>
        <a href="/disclaimer/">Disclaimer</a>
        <a href="/contact/">Contact Us</a>
      </nav>
    </div>
  </footer>`;

const newServicesCta = `  <!-- ================= FOR BUSINESS OWNERS ================= -->
  <section class="business-cta">
    <div class="container">
      <h2>Grow Your Business with ServeKerala.in</h2>
      <p>
        Get High-Quality Local Leads Directly to Your WhatsApp. No commission fees, no hidden charges. Just direct customer inquiries.
      </p>
      <a href="/list-your-business/?v=1.4" class="btn-accent">
        Start Getting Leads Today
      </a>
    </div>
  </section>`;

const newAutoCta = `  <!-- ================= FOR AUTO DRIVERS ================= -->
  <section class="business-cta">
    <div class="container">
      <h2>Are You an Auto Driver?</h2>
      <p>
        Join the Auto Mithram directory for free and get direct calls from customers in your area. No commission fees, no hidden charges.
      </p>
      <a href="/join-auto-mithram/" class="btn-accent">
        Join Auto Mithram
      </a>
    </div>
  </section>`;

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (excludeDirs.indexOf(file) === -1) {
        walk(filepath, callback);
      }
    } else if (stat.isFile() && file.endsWith('.html')) {
      callback(filepath);
    }
  });
}

let updatedCount = 0;

walk('.', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // 1. Replace Footer
  content = content.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/g, newFooter);

  // 2. Replace Business CTA
  if (content.includes('class="business-cta"')) {
    content = content.replace(/<section class="business-cta"[\s\S]*?>[\s\S]*?<\/section>/g, newServicesCta);
  }

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    updatedCount++;
    console.log(`Updated footer/CTA in: ${filepath}`);
  }
});

console.log(`Completed updating footer and CTA in ${updatedCount} files.`);
