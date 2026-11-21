// ==========================================================
// SERVEKERALA.IN – REAL-TIME DIRECTORY CLICK TRACKER & ANALYTICS (v1.8)
// ==========================================================

const firebaseConfigTracker = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfigTracker);
  }
  const db = firebase.firestore();

  // Helper to parse URL query parameters
  function getUrlParam(name) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name) || '';
    } catch (e) {
      return '';
    }
  }

  // Persistent anonymous unique visitor ID
  function getVisitorId() {
    try {
      let vid = localStorage.getItem('sk_visitor_id');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
        localStorage.setItem('sk_visitor_id', vid);
      }
      return vid;
    } catch (e) {
      return 'v_' + Math.random().toString(36).slice(2, 10);
    }
  }

  // Helper to parse location & category from pathname
  function parseUrlContext(pathname) {
    const parts = (pathname || window.location.pathname).split('/').filter(Boolean);
    let district = '';
    let category = '';
    let town = '';

    const knownDistricts = [
      'alappuzha', 'ernakulam', 'idukki', 'kannur', 'kasaragod',
      'kollam', 'kottayam', 'kozhikode', 'malappuram', 'palakkad',
      'pathanamthitta', 'thiruvananthapuram', 'thrissur', 'wayanad'
    ];

    if (parts.length > 0 && knownDistricts.includes(parts[0].toLowerCase())) {
      district = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      if (parts.length >= 2) {
        category = parts[1];
      }
      if (parts.length >= 3) {
        town = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
      }
    } else if (parts[0] === 'services' && parts[1]) {
      category = parts[1];
    } else if (parts[0] === 'auto-mithram') {
      category = 'auto-mithram';
    }

    return { district, category, town };
  }

  // Determine traffic source
  function getTrafficSource() {
    const utmSource = getUrlParam('utm_source');
    if (utmSource) return utmSource;
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin !== window.location.origin) {
          const host = refUrl.hostname.toLowerCase();
          if (host.includes('google')) return 'Google Search';
          if (host.includes('facebook') || host.includes('fb.')) return 'Facebook';
          if (host.includes('instagram')) return 'Instagram';
          if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp';
          return host;
        }
      } catch (e) {}
    }
    return 'Direct / Organic';
  }

  // Master function to push structured events to dataLayer and Firestore
  window.pushAnalyticsEvent = function(eventName, params = {}) {
    const pagePath = params.page_path || window.location.pathname;
    const pageTitle = params.page_title || document.title || 'ServeKerala';

    // 1. Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    const payload = {
      event: eventName,
      page_path: pagePath,
      page_title: pageTitle,
      ...params
    };
    window.dataLayer.push(payload);

    // 2. Write visitor interactions to Firestore analytics_events
    const fsLogEvents = [
      'page_view',
      'whatsapp_click',
      'phone_click',
      'website_click',
      'callback_request',
      'business_profile_view',
      'business_listing_submit',
      'form_lead'
    ];

    if (fsLogEvents.includes(eventName)) {
      const urlCtx = parseUrlContext(pagePath);
      const district = params.district || urlCtx.district || '';
      const category = params.category || urlCtx.category || '';
      const town = params.town || urlCtx.town || '';

      db.collection('analytics_events').add({
        event_name: eventName,
        visitor_id: params.visitor_id || getVisitorId(),
        business_id: params.business_id || '',
        business_collection: params.business_collection || '',
        business_name: params.business_name || '',
        category: category,
        district: district,
        town: town,
        page_path: pagePath,
        page_title: pageTitle,
        button_location: params.button_location || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        source: getTrafficSource(),
        medium: getUrlParam('utm_medium') || 'organic',
        campaign: getUrlParam('utm_campaign') || (getUrlParam('utm_source') ? 'Campaign' : 'Direct / Organic'),
        term: getUrlParam('utm_term') || '',
        referrer: document.referrer || '',
        device: (/Mobi|Android|iPhone/i.test(navigator.userAgent)) ? 'Mobile' : 'Desktop'
      }).catch(err => console.error("Firestore analytics log error:", err));
    }
  };

  // Centralized Listing click tracker (maintains signature compatibility)
  window.trackListingClick = function(identifier, actionType, isDocId, collectionName, extraData) {
    const coll = collectionName || 'listings';
    const logUnifiedEvent = (docId, docData) => {
      const eventName = actionType === 'call' ? 'phone_click' :
                        actionType === 'whatsapp' ? 'whatsapp_click' :
                        actionType === 'website' ? 'website_click' :
                        actionType === 'view' ? 'business_profile_view' :
                        actionType === 'callback' ? 'callback_request' : null;
      if (!eventName) return;

      const eventParams = {
        business_id: docId || '',
        business_collection: coll,
        business_name: docData.name || '',
        category: docData.category || '',
        district: docData.district || '',
        town: docData.towns || docData.town || '',
        button_location: extraData?.button_location || docData.button_location || 'pro_card'
      };

      window.pushAnalyticsEvent(eventName, eventParams);
    };

    if (isDocId) {
      const listingRef = db.collection(coll).doc(identifier);
      if (extraData && extraData.name) {
        logUnifiedEvent(identifier, extraData);
      } else {
        listingRef.get().then(doc => {
          if (doc.exists) logUnifiedEvent(identifier, doc.data());
        }).catch(e => console.error("Fetch listing error:", e));
      }
    } else {
      db.collection(coll).where('website', '==', identifier).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            logUnifiedEvent(doc.id, doc.data());
          });
        })
        .catch(err => console.error("Track find error:", err));
    }
  };

  // Track Auto Mithram events (maintains compatibility)
  window.trackAutoClick = function(docId, actionType) {
    if (!docId) return;
    const updateData = {};
    if (actionType === 'call') {
      updateData.callClicks = firebase.firestore.FieldValue.increment(1);
    } else if (actionType === 'whatsapp') {
      updateData.whatsappClicks = firebase.firestore.FieldValue.increment(1);
    } else if (actionType === 'view') {
      updateData.profileViews = firebase.firestore.FieldValue.increment(1);
    }

    const logUnifiedEvent = (id, data) => {
      const eventName = actionType === 'call' ? 'phone_click' :
                        actionType === 'whatsapp' ? 'whatsapp_click' :
                        actionType === 'view' ? 'business_profile_view' : null;
      if (!eventName) return;

      const eventParams = {
        business_id: id || '',
        business_name: data.name || '',
        category: 'auto-mithram',
        district: data.district || '',
        town: data.town || '',
        button_location: 'auto-mithram'
      };

      window.pushAnalyticsEvent(eventName, eventParams);
    };

    db.collection('auto_mithram').doc(docId).update(updateData)
      .then(() => {
        db.collection('auto_mithram').doc(docId).get().then(doc => {
          if (doc.exists) logUnifiedEvent(docId, doc.data());
        }).catch(e => console.error("Fetch auto error:", e));
      })
      .catch(err => {
        db.collection('auto_mithram').get().then(snap => {
          snap.forEach(d => {
            if (d.id === docId || d.data().phone === docId) {
              db.collection('auto_mithram').doc(d.id).update(updateData).then(() => {
                logUnifiedEvent(d.id, d.data());
              }).catch(e => console.error("Track auto fallback update error:", e));
            }
          });
        }).catch(e => console.error("Track auto fallback query error:", e));
      });
  };

  // Automatic Page View tracking (executed once per page view for non-admin visitors)
  function initAutomaticPageView() {
    if (window.location.pathname.startsWith('/admin')) return;
    if (window.__sk_pv_tracked) return;
    window.__sk_pv_tracked = true;

    const urlCtx = parseUrlContext(window.location.pathname);
    window.pushAnalyticsEvent('page_view', {
      page_title: document.title || 'ServeKerala.in',
      district: urlCtx.district,
      category: urlCtx.category,
      town: urlCtx.town,
      visitor_id: getVisitorId()
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutomaticPageView);
  } else {
    setTimeout(initAutomaticPageView, 100);
  }

  // Global event delegation for clicks (calls, whatsapp, directory categories)
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href') || anchor.href || '';

    // 1. Phone click interception (tel:...)
    if (href.startsWith('tel:')) {
      const phoneNumber = href.replace(/^tel:/i, '').replace(/[^0-9+]/g, '').trim();
      const card = anchor.closest('.pro-card, .listing-card, .business-card, .card, article') || anchor.parentElement;
      const titleEl = card ? card.querySelector('h2, h3, h4, .business-name, .pro-name, strong') : null;
      const bizName = titleEl ? titleEl.textContent.trim() : (document.title.split('–')[0].split('-')[0].trim() || 'Direct Call');
      const urlCtx = parseUrlContext(window.location.pathname);

      window.pushAnalyticsEvent('phone_click', {
        business_name: bizName,
        phone: phoneNumber,
        button_location: 'call_button',
        category: urlCtx.category,
        district: urlCtx.district,
        town: urlCtx.town
      });
      return;
    }

    // 2. WhatsApp click interception (wa.me / whatsapp.com)
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      const card = anchor.closest('.pro-card, .listing-card, .business-card, .card, article') || anchor.parentElement;
      const titleEl = card ? card.querySelector('h2, h3, h4, .business-name, .pro-name, strong') : null;
      const bizName = titleEl ? titleEl.textContent.trim() : (document.title.split('–')[0].split('-')[0].trim() || 'WhatsApp Lead');
      const urlCtx = parseUrlContext(window.location.pathname);

      window.pushAnalyticsEvent('whatsapp_click', {
        business_name: bizName,
        button_location: 'whatsapp_button',
        category: urlCtx.category,
        district: urlCtx.district,
        town: urlCtx.town
      });
      return;
    }

    // 3. Category & Location navigation clicks
    try {
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const path = url.pathname;
      const parts = path.split('/').filter(Boolean);

      // Category clicks (/services/plumber/)
      if (parts[0] === 'services' && parts[1]) {
        window.pushAnalyticsEvent('category_click', { category: parts[1] });
      }

      // District, Town, or Service navigation
      const districts = ['kottayam', 'pathanamthitta', 'alappuzha', 'kollam', 'thiruvananthapuram', 'ernakulam', 'kochi', 'thrissur', 'malappuram', 'kozhikode', 'palakkad', 'kannur', 'idukki', 'wayanad', 'kasaragod'];
      if (districts.includes(parts[0].toLowerCase())) {
        const districtName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

        if (parts.length === 1) {
          window.pushAnalyticsEvent('district_click', { district: districtName });
        } else if (parts.length === 2) {
          const categories = ['solar-installation', 'plumber', 'electrician', 'ac-service', 'cctv-installation', 'home-cleaning', 'pest-control', 'water-purifier-service'];
          if (categories.includes(parts[1])) {
            window.pushAnalyticsEvent('category_click', { category: parts[1] });
          } else {
            const townName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            window.pushAnalyticsEvent('town_click', { district: districtName, town: townName });
          }
        } else if (parts.length === 3) {
          const townName = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
          window.pushAnalyticsEvent('town_click', { district: districtName, town: townName });
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }, true);
} else {
  console.warn("Tracker: Firebase not detected.");
}
