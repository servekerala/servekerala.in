const fs = require('fs');

let js = fs.readFileSync('assets/js/home-loader.js', 'utf8');

// We need to inject the fetch for auto_mithram into the DOMContentLoaded block
const oldInitBlockRegex = /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{([\s\S]*?)function renderFeaturedListings/;

const newInitBlock = `document.addEventListener('DOMContentLoaded', () => {
    // === FEATURED BUSINESSES ===
    const bTrack = document.getElementById('featured-slider-track');
    const bContainer = document.getElementById('featured-slider-container');
    if (bTrack && bContainer) {
      db.collection('listings')
        .where('status', '==', 'approved')
        .where('isFeatured', '==', true)
        .get()
        .then((querySnapshot) => {
          let listings = [];
          querySnapshot.forEach((doc) => { listings.push({ id: doc.id, ...doc.data() }); });
          listings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          listings = listings.slice(0, 10);
          
          if (listings.length === 0) {
            bTrack.innerHTML = '<p style="padding: 20px;">No featured listings available at the moment.</p>';
          } else {
            renderFeaturedListings(listings, bTrack);
            initAutoScroll(bContainer, bTrack, 'featured-slider-prev', 'featured-slider-next');
          }
        })
        .catch((error) => { console.error('Error fetching featured listings:', error); });
    }

    // === PREMIUM AUTO DRIVERS ===
    const aTrack = document.getElementById('auto-slider-track');
    const aContainer = document.getElementById('auto-slider-container');
    if (aTrack && aContainer) {
      db.collection('auto_mithram')
        .where('status', '==', 'approved')
        .where('isFeatured', '==', true)
        .get()
        .then((querySnapshot) => {
          let autos = [];
          querySnapshot.forEach((doc) => { autos.push({ id: doc.id, ...doc.data() }); });
          autos.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          autos = autos.slice(0, 10);
          
          if (autos.length === 0) {
            aTrack.innerHTML = '<p style="padding: 20px;">No premium auto drivers available at the moment.</p>';
          } else {
            renderFeaturedAutos(autos, aTrack);
            initAutoScroll(aContainer, aTrack, 'auto-slider-prev', 'auto-slider-next');
          }
        })
        .catch((error) => { console.error('Error fetching premium autos:', error); });
    }
  });

  function renderFeaturedAutos(autos, container) {
    container.innerHTML = ''; 
    autos.forEach((auto) => {
      const box = document.createElement('div');
      box.className = 'info-box';
      
      const phoneLink = auto.phone ? \`tel:\${auto.phone}\` : '#';
      const waLink = auto.whatsapp ? \`https://wa.me/91\${auto.whatsapp.replace(/\\D/g,'')}\` : '#';

      box.innerHTML = \`
        <div style="display:flex; align-items:center; margin-bottom:12px;">
          <div style="width:40px; height:40px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px; font-size:18px;">
            🛺
          </div>
          <div>
            <h3 style="margin:0; font-size:16px;">\${auto.driverName}</h3>
            <span style="font-size:12px; background:#fbbf24; color:#78350f; padding:2px 6px; border-radius:10px; font-weight:600;">\${auto.vehicleNumber}</span>
          </div>
        </div>
        <div style="font-size:14px; margin-bottom:16px; color:var(--text-color);">
          <div style="margin-bottom:4px;"><strong>Stand:</strong> \${auto.standLocation || auto.autoStand}</div>
          <div><strong>Hours:</strong> \${auto.availableHours || 'N/A'}</div>
        </div>
        <div style="display:flex; gap:10px; margin-top:auto;">
          <a href="\${phoneLink}" class="btn-primary" style="flex:1; text-align:center; padding:8px 0; font-size:13px; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px;">
            📞 Call Now
          </a>
          <a href="\${waLink}" class="btn-primary" target="_blank" style="flex:1; text-align:center; padding:8px 0; font-size:13px; background-color:#25D366; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px;">
            💬 WhatsApp
          </a>
        </div>
      \`;
      container.appendChild(box);
    });
  }

  function renderFeaturedListings`;

if (oldInitBlockRegex.test(js)) {
  js = js.replace(oldInitBlockRegex, newInitBlock);
} else {
  console.log("Could not patch home-loader init block");
}

// Update initAutoScroll signature and usage
const oldScrollRegex = /function initAutoScroll\(container, track\)/;
if (oldScrollRegex.test(js)) {
  js = js.replace(oldScrollRegex, "function initAutoScroll(container, track, prevId, nextId)");
}

const oldPrevBtnRegex = /const prevBtn = document\.getElementById\('featured-slider-prev'\);/;
if (oldPrevBtnRegex.test(js)) {
  js = js.replace(oldPrevBtnRegex, "const prevBtn = document.getElementById(prevId);");
}

const oldNextBtnRegex = /const nextBtn = document\.getElementById\('featured-slider-next'\);/;
if (oldNextBtnRegex.test(js)) {
  js = js.replace(oldNextBtnRegex, "const nextBtn = document.getElementById(nextId);");
}

fs.writeFileSync('assets/js/home-loader.js', js, 'utf8');
console.log("Patched home-loader.js");
