const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldBlockRegex = /<!-- ================= FEATURED BUSINESSES ================= -->[\s\S]*?<\/section>/;

const newBlock = `<!-- ================= FEATURED BUSINESSES ================= -->
    <section class="section" style="padding-bottom: 20px;">
      <div class="container">
        <h2>Featured Verified Listings</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px;">
          Top recommended professionals currently serving Kerala.
        </p>
  
        <!-- Featured Listings Slider Wrapper -->
        <div class="featured-slider-wrapper">
          <!-- Prev Button -->
          <button class="slider-arrow slider-arrow-prev" id="featured-slider-prev" aria-label="Previous Slide">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
  
          <div class="featured-slider-container" id="featured-slider-container">
            <div class="featured-slider-track" id="featured-slider-track">
              <!-- Dynamic featured listings will be injected here by home-loader.js -->
            </div>
          </div>
  
          <!-- Next Button -->
          <button class="slider-arrow slider-arrow-next" id="featured-slider-next" aria-label="Next Slide">
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ================= PREMIUM AUTO DRIVERS ================= -->
    <section class="section" style="padding-top: 20px; background-color: var(--bg-surface);">
      <div class="container">
        <h2>Premium Auto Drivers</h2>
        <p style="color: var(--text-muted); margin-bottom: 30px;">
          Verified and highly recommended Auto Mithram drivers in your area.
        </p>
  
        <!-- Featured Auto Slider Wrapper -->
        <div class="featured-slider-wrapper">
          <!-- Prev Button -->
          <button class="slider-arrow slider-arrow-prev" id="auto-slider-prev" aria-label="Previous Slide">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
  
          <div class="featured-slider-container" id="auto-slider-container">
            <div class="featured-slider-track" id="auto-slider-track">
              <!-- Dynamic auto listings will be injected here by home-loader.js -->
            </div>
          </div>
  
          <!-- Next Button -->
          <button class="slider-arrow slider-arrow-next" id="auto-slider-next" aria-label="Next Slide">
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </section>`;

if (oldBlockRegex.test(html)) {
  html = html.replace(oldBlockRegex, newBlock);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Patched index.html");
} else {
  console.log("Could not find regex in index.html");
}
