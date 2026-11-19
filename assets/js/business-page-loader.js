// assets/js/business-page-loader.js
(() => {
  // Initialise Firebase (same config as other scripts)
  if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp({
      apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
      authDomain: "servekerala2026.firebaseapp.com",
      projectId: "servekerala2026",
      storageBucket: "servekerala2026.firebasestorage.app",
      messagingSenderId: "122091003614",
      appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
      measurementId: "G-P3J3NLRKDL"
    });
  }
  const db = firebase.firestore();

  // Helper to set meta tags
  const setMeta = (title, desc, image, url) => {
    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute('content', val);
    };
    document.title = title;
    set('meta[name="description"]', desc);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', desc);
    set('meta[property="og:image"]', image);
    set('meta[property="og:url"]', url);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
  };

  const setIndexingAllowed = (allowed) => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!allowed) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex,follow';
    } else if (robots && /\bnoindex\b/i.test(robots.content)) {
      robots.remove();
    }
  };

  const profileUrl = () => {
    const pathname = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    return `${window.location.origin}${pathname}`;
  };

  const markProfileNotFound = () => {
    const url = profileUrl();
    setMeta('Business Profile Not Found | ServeKerala.in', 'This business profile could not be found on ServeKerala.in.', '', url);
    setIndexingAllowed(false);
  };

  const loadBusiness = async () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'business' || !parts[1]) return;
    const id = parts[1]; // assume Firestore doc id matches slug

    try {
      const docSnap = await db.collection('business_pages').doc(id).get();
      if (!docSnap.exists) {
        console.warn('Business page not found for id:', id);
        markProfileNotFound();
        return;
      }
      const data = docSnap.data();

      // Hero
      const hero = document.getElementById('listing-hero-section');
      if (hero) {
        hero.innerHTML = `
          <section class="listing-hero" style="background-image:url('${data.heroImage || '/assets/images/default-hero.jpg'}');">
            <div class="container listing-hero-inner">
              <div class="listing-icon">🔧</div>
              <div>
                <h1>${data.name}</h1>
                <p>${data.tagline || ''}</p>
                <div class="listing-badge"><span>📍 ${data.district || ''}</span></div>
              </div>
            </div>
          </section>`;
      }

      // Track actions helper
      window.trackBusinessAction = (action) => {
        if (typeof trackListingClick === 'function') {
          trackListingClick(id, action, true, 'business_pages', {
            name: data.name,
            category: data.category || '',
            district: data.district || '',
            towns: data.towns || '',
            button_location: 'business_profile'
          });
        }
      };

      // Main content
      const main = document.getElementById('listing-main-content');
      if (main) {
        main.innerHTML = `
          <section class="section">
            <div class="container">
              <h2>About ${data.name}</h2>
              <p>${data.description || ''}</p>

              <h3>Our Services</h3>
              <ul class="services-list">${(data.services || []).map(s => `<li>${s}</li>`).join('')}</ul>

              <h3>Contact</h3>
              <div class="grid contact-grid">
                ${data.phone ? `<div class="contact-card"><div class="contact-card-icon">📞</div><h3>Call</h3><a href="tel:${data.phone}" onclick="window.trackBusinessAction('call')">Call Now</a></div>` : ''}
                ${data.whatsapp ? `<div class="contact-card whatsapp"><div class="contact-card-icon">💬</div><h3>WhatsApp</h3><a href="https://wa.me/${data.whatsapp.replace(/\D/g,'')}" onclick="window.trackBusinessAction('whatsapp')">Chat</a></div>` : ''}
                ${data.website ? `<div class="contact-card"><div class="contact-card-icon">🌐</div><h3>Website</h3><a href="${data.website}" target="_blank" onclick="window.trackBusinessAction('website')">Visit Site</a></div>` : ''}
                ${data.lat && data.lng ? `<div class="contact-card"><div class="contact-card-icon">📍</div><h3>Directions</h3><a href="https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}" target="_blank" onclick="window.trackBusinessAction('directions')">Open Maps</a></div>` : ''}
              </div>
            </div>
          </section>`;
      }

      // Structured data
      const ldScript = document.getElementById('structured-data');
      if (ldScript) {
        const jsonLD = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data.name,
          "description": data.description,
          "url": profileUrl(),
          "telephone": data.phone,
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Kerala",
            "addressCountry": "IN",
            "addressLocality": data.district
          },
          ...(data.lat && data.lng ? { "geo": { "@type": "GeoCoordinates", "latitude": data.lat, "longitude": data.lng } } : {})
        };
        ldScript.textContent = JSON.stringify(jsonLD);
      }

      // Meta tags
      setMeta(
        `${data.name} – ${data.district || ''} | ServeKerala.in`,
        data.description || '',
        data.heroImage || '/assets/images/default-hero.jpg',
        profileUrl()
      );
      setIndexingAllowed(data.allowIndexing !== false
        && String(data.description || '').trim().length >= 60
        && Boolean(data.phone || data.whatsapp || data.website));

      // Track page view
      if (typeof trackListingClick === 'function') {
        trackListingClick(id, 'view', true, 'business_pages', {
          name: data.name,
          category: data.category || '',
          district: data.district || '',
          towns: data.towns || '',
          button_location: 'business_profile'
        });
      } else {
        db.collection('business_pages').doc(id).update({
          profileViews: firebase.firestore.FieldValue.increment(1)
        }).catch(err => console.error("Track view error:", err));
      }
    } catch (e) {
      console.error('Failed to load business page', e);
      markProfileNotFound();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBusiness);
  } else {
    loadBusiness();
  }
})();
