// ==========================================================
// SERVEKERALA.IN - DYNAMIC HOMEPAGE FEATURED LISTINGS LOADER
// ==========================================================

// Check if firebaseConfig is already defined by another script
if (typeof firebaseConfig === 'undefined') {
  var firebaseConfig = {
    apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
    authDomain: "servekerala2026.firebaseapp.com",
    projectId: "servekerala2026",
    storageBucket: "servekerala2026.firebasestorage.app",
    messagingSenderId: "122091003614",
    appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
    measurementId: "G-P3J3NLRKDL"
  };
}

if (typeof firebase !== 'undefined') {
  // Initialize Firebase if not already initialized
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', () => {
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
      
      const phoneLink = auto.phone ? `tel:${auto.phone}` : '#';
      const waLink = auto.whatsapp ? `https://wa.me/91${auto.whatsapp.replace(/\D/g,'')}` : '#';

      box.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:12px;">
          <div style="width:40px; height:40px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px; font-size:18px;">
            🛺
          </div>
          <div>
            <h3 style="margin:0; font-size:16px;">${auto.driverName}</h3>
            <span style="font-size:12px; background:#fbbf24; color:#78350f; padding:2px 6px; border-radius:10px; font-weight:600;">${auto.vehicleNumber}</span>
          </div>
        </div>
        <div style="font-size:14px; margin-bottom:16px; color:var(--text-color);">
          <div style="margin-bottom:4px;"><strong>Stand:</strong> ${auto.standLocation || auto.autoStand}</div>
          <div><strong>Hours:</strong> ${auto.availableHours || 'N/A'}</div>
        </div>
        <div style="display:flex; gap:10px; margin-top:auto;">
          <a href="${phoneLink}" class="btn-primary" style="flex:1; text-align:center; padding:8px 0; font-size:13px; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px;">
            📞 Call Now
          </a>
          <a href="${waLink}" class="btn-primary" target="_blank" style="flex:1; text-align:center; padding:8px 0; font-size:13px; background-color:#25D366; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px;">
            💬 WhatsApp
          </a>
        </div>
      `;
      container.appendChild(box);
    });
  }

  function renderFeaturedListings(listings, container) {
    container.innerHTML = ''; // Clear previous/loading content

    listings.forEach((listing) => {
      const box = document.createElement('div');
      box.className = 'info-box';

      // Safe description
      let desc = listing.description || '';
      if (desc.length > 120) desc = desc.substring(0, 117) + '...';

      // Setup phone link
      const phoneLink = listing.phone ? `tel:${listing.phone}` : '#';
      
      // Determine profile link 
      let profileLink = listing.website || `/business/${listing.id}/`;
      
      const ratingStars = '★★★★★';

      box.innerHTML = `
        <h3>${listing.name} <span class="verified-badge">✓ Verified</span></h3>
        <div class="rating-stars" style="color: #fbbf24; font-size: 16px; margin-bottom: 12px;">
          ${ratingStars} <span class="rating-count" style="color: var(--text-muted); font-size: 14px; margin-left: 6px;">5.0 (Featured)</span>
        </div>
        <p class="provider-meta" style="min-height: 60px;">
          ${desc}
        </p>
        <div class="action-buttons">
          <a href="${phoneLink}" class="btn btn-primary" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;">Call Now</a>
          <a href="${profileLink}" class="btn btn-outline" style="padding: 10px 20px; font-size: 14px; border-radius: 999px;">View Profile</a>
        </div>
      `;
      container.appendChild(box);
    });
  }

  function initAutoScroll(container, track, prevId, nextId) {
    let isHovering = false;
    let isTransitioning = false;
    let autoSlideInterval;

    // Manual Buttons
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);

    // Pause on hover
    container.addEventListener('mouseenter', () => { isHovering = true; });
    container.addEventListener('mouseleave', () => { isHovering = false; });
    container.addEventListener('touchstart', () => { isHovering = true; }, {passive: true});
    container.addEventListener('touchend', () => { 
      setTimeout(() => { isHovering = false; }, 2000); 
    });

    const slideNext = () => {
      if (isTransitioning || track.children.length <= 1) return;
      isTransitioning = true;
      
      const firstCard = track.firstElementChild;
      const moveDistance = firstCard.offsetWidth + 20; // width + gap
      
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = `translateX(-${moveDistance}px)`;
      
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        track.appendChild(firstCard);
        isTransitioning = false;
      }, 500); // Wait for transition to finish
    };

    const slidePrev = () => {
      if (isTransitioning || track.children.length <= 1) return;
      isTransitioning = true;
      
      const lastCard = track.lastElementChild;
      const moveDistance = lastCard.offsetWidth + 20; // width + gap
      
      // Move last card to front instantly, but offset the track so it looks like it hasn't moved
      track.style.transition = 'none';
      track.insertBefore(lastCard, track.firstElementChild);
      track.style.transform = `translateX(-${moveDistance}px)`;
      
      // Force reflow
      track.offsetHeight; 
      
      // Now animate it sliding back into place (to 0)
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        slideNext();
        resetInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        slidePrev();
        resetInterval();
      });
    }

    const resetInterval = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        if (!isHovering) slideNext();
      }, 3500);
    };

    // Start auto slide
    resetInterval();
  }
}
