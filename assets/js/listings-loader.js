// ==========================================================
// SERVEKERALA.IN – DYNAMIC APPROVED LISTINGS LOADER
// ==========================================================

// Firebase configuration (Must be identical to listing.js/admin.js)
const firebaseConfig = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

const pathCategoryToDbCategory = {
  'solar-installation': 'solar',
  'plumber': 'plumbing',
  'electrician': 'electrical',
  'ac-service': 'ac',
  'cctv-installation': 'cctv',
  'home-cleaning': 'cleaning',
  'pest-control': 'pest',
  'water-purifier-service': 'water'
};

if (typeof firebase !== 'undefined') {
  // Initialize Firebase if not already initialized
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', () => {
    // Dynamically load activity-tracker.js if not present
    if (!document.querySelector('script[src*="activity-tracker.js"]')) {
      const script = document.createElement('script');
      script.src = '/assets/js/activity-tracker.js?v=1.6';
      script.defer = true;
      document.head.appendChild(script);
    }

    const container = document.getElementById('dynamic-listings-container');
    if (!container) return;

    // Parse URL Path
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) return;

    let district = null;
    let categoryPath = null;
    let town = null;

    if (pathParts[0] === 'services') {
      categoryPath = pathParts[1];
    } else {
      district = pathParts[0]; // e.g. kottayam
      categoryPath = pathParts[1]; // e.g. solar-installation
      town = pathParts[2] || null; // e.g. changanacherry
    }

    const dbCategory = pathCategoryToDbCategory[categoryPath];
    if (!dbCategory) return;

    // Build Firestore Query
    let query = db.collection('listings')
      .where('category', '==', dbCategory)
      .where('status', '==', 'approved');

    if (district) {
      // Capitalize district name to match database stored values (e.g. 'kottayam' -> 'Kottayam')
      const dbDistrict = district.charAt(0).toUpperCase() + district.slice(1);
      query = query.where('district', '==', dbDistrict);
    }

    // Load listings
    query.get()
      .then((querySnapshot) => {
        let listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({ id: doc.id, ...doc.data() });
        });

        // Filter by town client-side if a town exists in URL path
        if (town) {
          const searchTown = town.toLowerCase();
          listings = listings.filter(l => l.towns.toLowerCase().includes(searchTown));
        }

        renderDynamicListings(listings, container);
      })
      .catch((error) => {
        console.error('Error fetching dynamic listings:', error);
      });
  });

  function renderDynamicListings(listings, container) {
    if (listings.length === 0) return; // Hide section if no dynamically approved listings

    // Create Title header
    const sectionTitle = document.createElement('h2');
    sectionTitle.style.fontSize = '26px';
    sectionTitle.style.fontWeight = '800';
    sectionTitle.style.marginBottom = '24px';
    sectionTitle.style.color = 'var(--primary)';
    sectionTitle.textContent = 'Verified Providers in this Area';

    const grid = document.createElement('div');
    grid.className = 'grid grid-3';

    listings.forEach((listing) => {
      const box = document.createElement('div');
      box.className = 'info-box';
      box.style.marginBottom = '0'; // align within grid

      const ratingStars = '★★★★★'; // Mock rating stars for display
      const websiteHTML = listing.website ? `<a href="${listing.website}" target="_blank" class="btn btn-outline" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;">View Website</a>` : '';

      box.innerHTML = `
        <h3>${listing.name} <span class="verified-badge">✓ Verified</span></h3>
        <div class="rating-stars" style="color: #fbbf24; font-size: 16px; margin-bottom: 12px;">
          ${ratingStars} <span class="rating-count" style="color: var(--text-muted); font-size: 14px; margin-left: 6px;">5.0 (New Listing)</span>
        </div>
        <p class="provider-meta" style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px; min-height: 48px;">
          ${listing.description}
        </p>
        <div class="action-buttons" style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="tel:${listing.phone}" class="btn btn-primary" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;" onclick="if(typeof dataLayer !== 'undefined') dataLayer.push({event: 'business_click', business_name: '${listing.name.replace(/'/g, "\\'")}', action_type: 'call'}); if(typeof trackListingClick === 'function') trackListingClick('${listing.id}', 'call', true)">Call Now</a>
          <a href="https://wa.me/91${listing.whatsapp.replace(/\D/g, '')}" class="btn btn-outline" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;" target="_blank" onclick="if(typeof dataLayer !== 'undefined') dataLayer.push({event: 'business_click', business_name: '${listing.name.replace(/'/g, "\\'")}', action_type: 'whatsapp'}); if(typeof trackListingClick === 'function') trackListingClick('${listing.id}', 'whatsapp', true)">WhatsApp</a>
          ${websiteHTML}
        </div>
      `;

      grid.appendChild(box);
    });

    container.appendChild(sectionTitle);
    container.appendChild(grid);
  }
}
