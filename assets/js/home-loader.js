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
    if (!document.querySelector('script[src*="lead-engine.js"]')) {
      const ls = document.createElement('script');
      ls.src = '/assets/js/lead-engine.js?v=1.0';
      ls.defer = true;
      document.head.appendChild(ls);
    }
    // === HERO CARD SLIDESHOW ===
    const heroSliderWrapper = document.getElementById('hero-card-slider-wrapper');
    const heroDotsContainer = document.getElementById('hero-slider-dots');

    if (heroSliderWrapper) {
      db.collection('listings')
        .where('status', '==', 'approved')
        .where('isHeroFeatured', '==', true)
        .get()
        .then((querySnapshot) => {
          let heroListings = [];
          querySnapshot.forEach((doc) => { heroListings.push({ id: doc.id, ...doc.data() }); });
          heroListings = dedupeFeaturedBusinesses(heroListings);
          heroListings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

          if (heroListings.length === 0) {
            // Fallback: fetch general featured listings
            db.collection('listings')
              .where('status', '==', 'approved')
              .where('isFeatured', '==', true)
              .get()
              .then((fallbackSnapshot) => {
                let fallbackListings = [];
                fallbackSnapshot.forEach((doc) => { fallbackListings.push({ id: doc.id, ...doc.data() }); });
                fallbackListings = dedupeFeaturedBusinesses(fallbackListings);
                fallbackListings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                
                if (fallbackListings.length > 0) {
                  initializeHeroSlideshow(fallbackListings, heroSliderWrapper, heroDotsContainer);
                }
              });
          } else {
            initializeHeroSlideshow(heroListings, heroSliderWrapper, heroDotsContainer);
          }
        })
        .catch((error) => { console.error('Error fetching hero listings:', error); });
    }

    // === FEATURED BUSINESSES (SLIDER) ===
    const bTrack = document.getElementById('featured-slider-track');
    const bContainer = document.getElementById('featured-slider-container');
    if (bTrack) {
      db.collection('listings')
        .where('status', '==', 'approved')
        .where('isFeatured', '==', true)
        .get()
        .then((querySnapshot) => {
          let listings = [];
          querySnapshot.forEach((doc) => { listings.push({ id: doc.id, ...doc.data() }); });
          listings = dedupeFeaturedBusinesses(listings);
          listings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          const sliderListings = listings.slice(0, 10);
          
          if (sliderListings.length === 0) {
            bTrack.innerHTML = '<p style="padding: 20px;">No featured listings available at the moment.</p>';
          } else {
            renderFeaturedListings(sliderListings, bTrack);
            if (bContainer) {
              initAutoScroll(bContainer, bTrack, 'featured-slider-prev', 'featured-slider-next');
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching featured listings:', error);
          bTrack.innerHTML = '<div class="directory-empty-state" role="status"><h2>Featured listings are temporarily unavailable</h2><p>Please refresh the page or browse a service category.</p><a class="btn btn-outline" href="/services/">Browse services</a></div>';
        });
    }
  });

  function renderFeaturedListings(listings, container) {
    container.innerHTML = ''; // Clear previous/loading content

    listings.forEach((listing) => {
      const box = document.createElement('div');
      box.className = 'info-box';

      // Safe description
      let desc = listing.description || '';
      if (desc.length > 120) desc = desc.substring(0, 117) + '...';

      const profileLink = getFeaturedProfileUrl(listing);
      const smartWa = typeof buildWhatsAppUrl === 'function'
        ? buildWhatsAppUrl(listing.whatsapp || listing.phone, listing.name, listing.category, listing.district)
        : `https://wa.me/91${(listing.whatsapp || listing.phone || '').replace(/\D/g, '')}`;
      const actualRating = Number(listing.gbpRating);
      const actualReviewCount = Number(listing.gbpReviews);
      const ratingHTML = Number.isFinite(actualRating) && actualRating > 0 && actualReviewCount > 0
        ? `<p class="listing-rating" aria-label="${actualRating.toFixed(1)} out of 5 from ${actualReviewCount} Google reviews">★ ${actualRating.toFixed(1)} · ${actualReviewCount} Google reviews</p>`
        : '';
      const phoneHTML = listing.phone
        ? `<a href="tel:${String(listing.phone).replace(/[^0-9+]/g, '')}" class="btn btn-primary" style="padding: 9px 16px; font-size: 13.5px; border-radius: 999px;">📞 Call</a>`
        : '';
      const whatsappHTML = (listing.whatsapp || listing.phone)
        ? `<a href="${smartWa}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 9px 16px; font-size: 13.5px; border-radius: 999px; border-color: #16A34A; color: #15803d;">💬 WhatsApp</a>`
        : '';
      const quoteData = JSON.stringify({
        businessId: listing.id,
        businessName: listing.name || '',
        phone: listing.phone || '',
        whatsapp: listing.whatsapp || '',
        category: listing.category || '',
        district: listing.district || ''
      }).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

      box.innerHTML = `
        <h3>${listing.name || 'Local provider'} <span class="verified-badge">Listed</span></h3>
        ${ratingHTML}
        <p class="provider-meta" style="min-height: 52px; color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">${desc || 'Contact this provider to ask about services and availability.'}</p>
        <div class="action-buttons" style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${phoneHTML}
          ${whatsappHTML}
          <button type="button" class="btn btn-primary" style="padding: 9px 16px; font-size: 13.5px; border-radius: 999px; background: #0B3B2C; border: none; cursor: pointer;" data-quote="${quoteData}" onclick="if(typeof openQuoteModal==='function')openQuoteModal(JSON.parse(this.dataset.quote))">⚡ Get Quote</button>
          <a href="${profileLink}" class="btn btn-outline" style="padding: 9px 16px; font-size: 13.5px; border-radius: 999px;">Profile</a>
        </div>
      `;
      container.appendChild(box);
    });
  }

  function normalizeFeaturedValue(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function dedupeFeaturedBusinesses(listings) {
    const unique = new Map();
    listings.forEach(listing => {
      const name = normalizeFeaturedValue(listing.name);
      const contact = String(listing.phone || listing.whatsapp || listing.email || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
      const identity = `${name}|${contact || normalizeFeaturedValue(listing.website)}`;
      const quality = item => (item.phone ? 8 : 0) + (item.whatsapp ? 6 : 0) + (item.website ? 4 : 0)
        + (item.description ? Math.min(String(item.description).length, 500) / 100 : 0) + (item.towns ? 2 : 0);
      const current = unique.get(identity);
      if (!current || quality(listing) > quality(current)) unique.set(identity, listing);
    });
    return Array.from(unique.values());
  }

  function getFeaturedProfileUrl(listing) {
    if (listing.profileUrl || listing.publicProfileUrl) return listing.profileUrl || listing.publicProfileUrl;
    const name = normalizeFeaturedValue(listing.name);
    try {
      const oldProfile = new URL(listing.website);
      if ((oldProfile.hostname === 'servekerala.in' || oldProfile.hostname.endsWith('.servekerala.in')) && oldProfile.pathname !== '/') return `${oldProfile.pathname.replace(/\/$/, '')}/`;
    } catch (_) {}
    return `/listing/${encodeURIComponent(listing.id)}/`;
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

  function initializeHeroSlideshow(listings, wrapper, dotsContainer) {
    let currentIndex = 0;
    let slideInterval = null;

    function renderSlide(index) {
      const listing = listings[index];
      
      // Fade out
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        // Update DOM elements
        const titleEl = document.getElementById('hero-card-title');
        const locationEl = document.getElementById('hero-card-location');
        const descEl = document.getElementById('hero-card-desc');
        const servicesEl = document.getElementById('hero-card-services');
        const callbackEl = document.getElementById('hero-card-callback');
        const callEl = document.getElementById('hero-card-call');
        const waEl = document.getElementById('hero-card-wa');
        const callbackBtnEl = document.getElementById('hero-card-callback-btn');

        if (titleEl && listing.name) titleEl.textContent = listing.name;
        if (locationEl && listing.district) {
          const locText = `${listing.towns ? listing.towns + ', ' : ''}${listing.district}, Kerala`;
          locationEl.textContent = locText;
        }
        if (descEl && listing.description) {
          descEl.textContent = listing.description.length > 180 ? listing.description.slice(0, 180) + '...' : listing.description;
        }
        
        if (servicesEl) {
          const servicesText = listing.services ? listing.services.split('\n')[0] : (listing.category ? listing.category.toUpperCase() : 'General Services');
          servicesEl.textContent = servicesText;
        }

        if (callbackEl) {
          callbackEl.textContent = listing.languages || 'Malayalam / English';
        }

        if (callEl) {
          if (listing.phone) {
            callEl.href = `tel:${listing.phone.replace(/[^0-9+]/g, '')}`;
            callEl.setAttribute('data-biz-id', listing.id || '');
            callEl.setAttribute('data-biz-name', listing.name || '');
            callEl.setAttribute('data-biz-category', listing.category || '');
            callEl.setAttribute('data-biz-district', listing.district || '');
            callEl.setAttribute('data-biz-town', listing.towns || '');
            callEl.setAttribute('data-biz-location', 'hero');
            callEl.onclick = function() {
              if (typeof trackListingClick === 'function') {
                trackListingClick(listing.id, 'call', true, 'listings', {
                  name: listing.name,
                  category: listing.category || '',
                  district: listing.district || '',
                  towns: listing.towns || '',
                  button_location: 'hero'
                });
              }
            };
            callEl.style.display = 'flex';
          } else {
            callEl.style.display = 'none';
          }
        }

        if (waEl) {
          if (listing.whatsapp) {
            waEl.href = `https://wa.me/${listing.whatsapp.replace(/[^0-9+]/g, '')}`;
            waEl.setAttribute('data-biz-id', listing.id || '');
            waEl.setAttribute('data-biz-name', listing.name || '');
            waEl.setAttribute('data-biz-category', listing.category || '');
            waEl.setAttribute('data-biz-district', listing.district || '');
            waEl.setAttribute('data-biz-town', listing.towns || '');
            waEl.setAttribute('data-biz-location', 'hero');
            waEl.onclick = function() {
              if (typeof trackListingClick === 'function') {
                trackListingClick(listing.id, 'whatsapp', true, 'listings', {
                  name: listing.name,
                  category: listing.category || '',
                  district: listing.district || '',
                  towns: listing.towns || '',
                  button_location: 'hero'
                });
              }
            };
            waEl.style.display = 'flex';
          } else {
            waEl.style.display = 'none';
          }
        }

        if (callbackBtnEl) {
          callbackBtnEl.href = `/contact/?biz=${encodeURIComponent(listing.name)}`;
          callbackBtnEl.setAttribute('data-biz-id', listing.id || '');
          callbackBtnEl.setAttribute('data-biz-name', listing.name || '');
          callbackBtnEl.setAttribute('data-biz-category', listing.category || '');
          callbackBtnEl.setAttribute('data-biz-district', listing.district || '');
          callbackBtnEl.setAttribute('data-biz-town', listing.towns || '');
          callbackBtnEl.setAttribute('data-biz-location', 'hero');
        }

        // Update active dot
        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.hero-slider-dot');
          dots.forEach((dot, idx) => {
            if (idx === index) dot.classList.add('active');
            else dot.classList.remove('active');
          });
        }

        // Fade in
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'scale(1)';
      }, 400);
    }

    // Render dot indicators
    if (dotsContainer && listings.length > 1) {
      dotsContainer.innerHTML = '';
      listings.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `hero-slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          currentIndex = idx;
          renderSlide(currentIndex);
          resetInterval();
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Initialize first slide
    renderSlide(0);

    // Auto rotate if multiple
    function resetInterval() {
      if (slideInterval) clearInterval(slideInterval);
      if (listings.length > 1) {
        slideInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % listings.length;
          renderSlide(currentIndex);
        }, 5500);
      }
    }

    resetInterval();
  }
}
