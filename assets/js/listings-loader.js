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
      script.src = '/assets/js/activity-tracker.js?v=1.7';
      script.defer = true;
      document.head.appendChild(script);
    }
    if (!document.querySelector('script[src*="lead-engine.js"]')) {
      const leadScript = document.createElement('script');
      leadScript.src = '/assets/js/lead-engine.js?v=1.0';
      leadScript.defer = true;
      document.head.appendChild(leadScript);
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

        renderDynamicListings(dedupeBusinessListings(listings), container);
      })
      .catch((error) => {
        console.error('Error fetching dynamic listings:', error);
        container.setAttribute('aria-busy', 'false');
        container.innerHTML = '<div class="directory-empty-state" role="status"><h2>Listings could not be loaded</h2><p>Please refresh the page or try again shortly.</p></div>';
      });
  });

  function renderDynamicListings(listings, container) {
    container.innerHTML = '';
    container.setAttribute('aria-busy', 'false');
    if (listings.length === 0) {
      container.innerHTML = `
        <section class="directory-empty-state" role="status" aria-live="polite">
          <h2>No providers listed here yet</h2>
          <p>We do not have an approved listing for this service area yet. You can browse nearby locations or add your business to the directory.</p>
          <a class="btn btn-outline" href="/list-your-business/">List your business</a>
        </section>`;
      return;
    }

    // Create Title header
    const sectionTitle = document.createElement('h2');
    sectionTitle.style.fontSize = '26px';
    sectionTitle.style.fontWeight = '800';
    sectionTitle.style.marginBottom = '24px';
    sectionTitle.style.color = 'var(--primary)';
    sectionTitle.textContent = 'Local Providers';

    const grid = document.createElement('div');
    grid.className = 'grid grid-3';

    listings.forEach((listing) => {
      const box = document.createElement('div');
      box.className = 'info-box';
      box.style.marginBottom = '0'; // align within grid

      const officialWebsite = getBusinessWebsite(listing);
      const websiteHTML = officialWebsite ? `<a href="${officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" data-business-website style="padding: 10px 20px; font-size: 14px; border-radius: 999px;">Official website</a>` : '';
      const profileHTML = `<a href="${getBusinessProfileUrl(listing)}" class="btn btn-outline" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;">View profile</a>`;
      const smartWa = typeof buildWhatsAppUrl === 'function'
        ? buildWhatsAppUrl(listing.whatsapp || listing.phone, listing.name, listing.category, listing.towns || listing.district)
        : `https://wa.me/91${(listing.whatsapp || listing.phone || '').replace(/\D/g, '')}`;
      const actualRating = Number(listing.gbpRating);
      const actualReviewCount = Number(listing.gbpReviews);
      const ratingHTML = Number.isFinite(actualRating) && actualRating > 0 && actualReviewCount > 0
        ? `<p class="listing-rating" aria-label="${actualRating.toFixed(1)} out of 5 from ${actualReviewCount} Google reviews">★ ${actualRating.toFixed(1)} · ${actualReviewCount} Google reviews</p>`
        : '';
      const phoneHTML = listing.phone
        ? `<a href="tel:${String(listing.phone).replace(/[^0-9+]/g, '')}" class="btn btn-primary" style="padding: 9px 18px; font-size: 13.5px; border-radius: 999px;">📞 Call</a>`
        : '';
      const whatsappHTML = (listing.whatsapp || listing.phone)
        ? `<a href="${smartWa}" class="btn btn-outline" style="padding: 9px 18px; font-size: 13.5px; border-radius: 999px; border-color: #16A34A; color: #15803d;" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>`
        : '';
      const quoteData = JSON.stringify({
        businessId: listing.id,
        businessName: listing.name || '',
        phone: listing.phone || '',
        whatsapp: listing.whatsapp || '',
        category: listing.category || '',
        district: listing.district || '',
        town: listing.towns || ''
      }).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

      box.innerHTML = `
        <h3>${listing.name || 'Local provider'} <span class="verified-badge">Listed</span></h3>
        ${ratingHTML}
        <p class="provider-meta" style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px; min-height: 48px;">${listing.description || 'Contact this provider to ask about services and availability.'}</p>
        <div class="action-buttons" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${phoneHTML}
          ${whatsappHTML}
          <button type="button" class="btn btn-primary" style="padding: 9px 18px; font-size: 13.5px; border-radius: 999px; background: #0B3B2C; border: none; cursor: pointer;" data-quote="${quoteData}" onclick="if(typeof openQuoteModal==='function')openQuoteModal(JSON.parse(this.dataset.quote))">⚡ Get Quote</button>
          ${profileHTML}
          ${websiteHTML}
        </div>
      `;

      const clickData = {name: listing.name || '', category: listing.category || '', district: listing.district || '', towns: listing.towns || '', button_location: 'service_directory'};
      box.querySelector('a[href^="tel:"]')?.addEventListener('click', () => window.trackListingClick?.(listing.id, 'call', true, 'listings', clickData));
      box.querySelector('a[href*="wa.me/"]')?.addEventListener('click', () => window.trackListingClick?.(listing.id, 'whatsapp', true, 'listings', clickData));
      box.querySelector('[data-business-website]')?.addEventListener('click', () => window.trackListingClick?.(listing.id, 'website', true, 'listings', clickData));

      grid.appendChild(box);
    });

    container.appendChild(sectionTitle);
    container.appendChild(grid);
  }

  function normalizeListingValue(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function listingQuality(listing) {
    return (listing.phone ? 8 : 0) + (listing.whatsapp ? 6 : 0) + (listing.website ? 4 : 0)
      + (listing.description ? Math.min(String(listing.description).length, 500) / 100 : 0)
      + (listing.towns ? 2 : 0) + (listing.servicesOffered ? 2 : 0);
  }

  function dedupeBusinessListings(listings) {
    const unique = new Map();
    listings.forEach(listing => {
      const name = normalizeListingValue(listing.name);
      const contact = String(listing.phone || listing.whatsapp || listing.email || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
      const identity = `${name}|${contact || normalizeListingValue(listing.website)}`;
      const current = unique.get(identity);
      if (!current || listingQuality(listing) > listingQuality(current)) unique.set(identity, listing);
    });
    return Array.from(unique.values());
  }

  function getBusinessProfileUrl(listing) {
    const explicit = listing.profileUrl || listing.publicProfileUrl;
    if (explicit) return explicit;
    const name = normalizeListingValue(listing.name);
    try {
      const legacy = new URL(listing.website);
      if ((legacy.hostname === 'servekerala.in' || legacy.hostname.endsWith('.servekerala.in')) && legacy.pathname !== '/') return `${legacy.pathname.replace(/\/$/, '')}/`;
    } catch (_) {}
    return `/listing/${encodeURIComponent(listing.id)}/`;
  }

  function getBusinessWebsite(listing) {
    try {
      const website = new URL(listing.website);
      if (!['https:', 'http:'].includes(website.protocol)) return '';
      if (website.hostname !== 'servekerala.in' && !website.hostname.endsWith('.servekerala.in')) return website.href;
    } catch (_) {}
    return '';
  }
}
