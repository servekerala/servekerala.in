const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'scripts', 'auto-seo-template.html');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to replace everything from <section class="section"> to </section>
const sectionRegex = /<section class="section">[\s\S]*?<\/section>/;

const newSection = `<section class="section" style="padding-top: 0;">
  
  <!-- HERO SECTION -->
  <div class="container" style="padding-top: 40px;">
    <div class="hero-seo-banner" style="background-image: url('{{SEO_HERO_IMAGE}}');">
      <div class="hero-seo-content">
        <h1 class="hero-seo-h1">{{H1_HEADING}}</h1>
        <p class="hero-seo-sub">Connect directly with verified local auto drivers. No commission. Call or WhatsApp instantly.</p>
        <div class="hero-cta-grid">
          <a href="#drivers" class="btn-hero btn-hero-primary">📞 Call Driver</a>
          <a href="#drivers" class="btn-hero btn-hero-wa">💬 WhatsApp Driver</a>
          <a href="#map" class="btn-hero btn-hero-outline">📍 View Auto Stand</a>
          <a href="/join-auto-mithram/" class="btn-hero btn-hero-outline">🚖 Register as Driver</a>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    
    <!-- QUICK INFO & MAP GRID -->
    <div class="grid grid-2" style="gap: 40px; margin-bottom: 60px;">
      
      <!-- LEFT: Info & Destinations -->
      <div>
        <div class="quick-info-card">
          <h2 style="font-size: 22px; font-weight: 800; color: var(--primary); margin-bottom: 24px;">Quick Information</h2>
          <div class="quick-info-grid">
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-text">
                <h4>Stand Name</h4>
                <p>{{STAND_NAME_DISPLAY}}</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">🏙️</div>
              <div class="info-text">
                <h4>Town & District</h4>
                <p>{{TOWN_NAME}}, {{DISTRICT_NAME}}</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">🕒</div>
              <div class="info-text">
                <h4>Day Service</h4>
                <p>Available</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">🌙</div>
              <div class="info-text">
                <h4>Night Service</h4>
                <p>Availability Varies</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">💵</div>
              <div class="info-text">
                <h4>Booking Fee</h4>
                <p>₹0 (Direct Booking)</p>
              </div>
            </div>
          </div>
        </div>

        {{SEO_NEARBY_DESTINATIONS}}

      </div>
      
      <!-- RIGHT: Interactive Map -->
      <div id="map">
        <h2 style="font-size: 22px; font-weight: 800; color: var(--primary); margin-bottom: 24px;">Live Stand Map</h2>
        <div class="map-mockup-premium" style="position: relative; height: 100%; min-height: 400px; width: 100%; z-index: 1;">
          <div id="interactive-stand-map" style="width: 100%; height: 100%; min-height: 400px; border-radius: 12px; z-index: 1;"></div>
        </div>
      </div>
    </div>

    <!-- DRIVERS SECTION -->
    <div id="drivers" style="margin-bottom: 60px;">
      <h2 style="font-size: 32px; font-weight: 800; color: var(--primary); margin-bottom: 12px;">Verified Drivers at {{STAND_NAME_DISPLAY}}</h2>
      <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 32px;">Click to call or WhatsApp drivers directly. No middlemen.</p>
      
      <div id="seo-listings-container" class="grid grid-3" style="gap: 20px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
        <p style="color: var(--text-muted);">Loading verified drivers...</p>
      </div>
    </div>

    <!-- WHY CHOOSE US -->
    <div style="margin-bottom: 60px; padding-top: 40px; border-top: 1px solid var(--border-color);">
      <h2 style="font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 32px; text-align: center;">Why Choose Auto Mithram</h2>
      <div class="why-choose-grid">
        <div class="why-item">
          <div class="why-icon">✅</div>
          <h3>Verified Drivers</h3>
          <p>All drivers are locally verified for safety and reliability.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">📱</div>
          <h3>Direct Contact</h3>
          <p>No hiding numbers. Call or WhatsApp the driver directly.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">💸</div>
          <h3>No Commission</h3>
          <p>We charge zero fees. You pay exactly what the meter or standard rate says.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">📍</div>
          <h3>Local Knowledge</h3>
          <p>Our drivers know the fastest routes around {{TOWN_NAME}}.</p>
        </div>
      </div>
    </div>

    <!-- ServeKerala Local Ecosystem Integration -->
    <div style="margin-bottom: 60px; padding-top: 40px; border-top: 1px solid var(--border-color);">
      <h2 style="font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 24px;">Explore Nearby Services in {{TOWN_NAME}}</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
        <a href="/services/" class="card-glass" style="padding: 20px; text-align: center; border-radius: var(--border-radius-md); text-decoration: none; display: block;">
          <div style="font-size: 32px; margin-bottom: 12px;">🏨</div>
          <h3 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0;">Hotels</h3>
        </a>
        <a href="/services/" class="card-glass" style="padding: 20px; text-align: center; border-radius: var(--border-radius-md); text-decoration: none; display: block;">
          <div style="font-size: 32px; margin-bottom: 12px;">🍽️</div>
          <h3 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0;">Restaurants</h3>
        </a>
        <a href="/services/" class="card-glass" style="padding: 20px; text-align: center; border-radius: var(--border-radius-md); text-decoration: none; display: block;">
          <div style="font-size: 32px; margin-bottom: 12px;">🏥</div>
          <h3 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0;">Hospitals</h3>
        </a>
        <a href="/services/" class="card-glass" style="padding: 20px; text-align: center; border-radius: var(--border-radius-md); text-decoration: none; display: block;">
          <div style="font-size: 32px; margin-bottom: 12px;">💊</div>
          <h3 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 0;">Pharmacies</h3>
        </a>
      </div>
    </div>

    <!-- ================= SEO CONTENT SECTIONS ================= -->
    <div class="seo-rich-content" style="border-top: 1px solid var(--border-color); padding-top: 40px;">
      <!-- FAQ Section -->
      <h2 style="font-size: 28px; font-weight: 800; color: var(--accent); margin-bottom: 24px;">Frequently Asked Questions</h2>
      <div class="faq-accordion" style="margin-bottom: 40px;">
        {{SEO_FAQS}}
      </div>

      <!-- Links Section -->
      <div class="grid grid-2" style="gap: 40px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 16px;">Other Stands in {{TOWN_NAME}}</h3>
          <ul style="list-style: none; padding: 0; line-height: 2;">
            {{SEO_NEARBY_STANDS}}
          </ul>
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 16px;">Nearby Towns in {{DISTRICT_NAME}}</h3>
          <ul style="list-style: none; padding: 0; line-height: 2;">
            {{SEO_NEARBY_TOWNS}}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`;

content = content.replace(sectionRegex, newSection);

fs.writeFileSync(filePath, content);
console.log('Successfully patched auto-seo-template.html!');
