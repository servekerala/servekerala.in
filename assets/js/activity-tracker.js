// ==========================================================
// SERVEKERALA.IN – REAL-TIME DIRECTORY CLICK TRACKER & ANALYTICS
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

  // Helper to parse URL parameters
  function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || '';
  }

  // Master function to push structured events to dataLayer and Firestore
  window.pushAnalyticsEvent = function(eventName, params = {}) {
    // 1. Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    const payload = {
      event: eventName,
      page_path: window.location.pathname,
      ...params
    };
    window.dataLayer.push(payload);

    // 2. Write business interactions and listing submissions to Firestore analytics_events
    const fsLogEvents = ['whatsapp_click', 'phone_click', 'website_click', 'callback_request', 'business_profile_view', 'business_listing_submit'];
    if (fsLogEvents.includes(eventName)) {
      db.collection('analytics_events').add({
        event_name: eventName,
        business_id: params.business_id || '',
        business_collection: params.business_collection || '',
        business_name: params.business_name || '',
        category: params.category || '',
        district: params.district || '',
        town: params.town || '',
        page_path: payload.page_path,
        button_location: params.button_location || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        source: getUrlParam('utm_source'),
        medium: getUrlParam('utm_medium'),
        campaign: getUrlParam('utm_campaign'),
        referrer: document.referrer || ''
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
        button_location: extraData?.button_location || docData.button_location || 'other'
      };

      window.pushAnalyticsEvent(eventName, eventParams);
    };

    if (isDocId) {
      // Public visitors write analytics events, never profile documents/counters.
      const listingRef = db.collection(coll).doc(identifier);
      if (extraData && extraData.name) {
        logUnifiedEvent(identifier, extraData);
      } else {
        listingRef.get().then(doc => {
          if (doc.exists) logUnifiedEvent(identifier, doc.data());
        }).catch(e => console.error("Fetch listing error:", e));
      }
    } else {
      // Find listing by website slug
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

  // Global event delegation for directory category & location clicks
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    try {
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      const path = url.pathname;
      const parts = path.split('/').filter(Boolean);

      // Skip external links like WhatsApp (tracked directly on click)
      if (anchor.href.includes('wa.me') || anchor.href.includes('whatsapp.com')) {
        return;
      }

      // 1. Category clicks (under /services/)
      if (parts[0] === 'services' && parts[1]) {
        window.pushAnalyticsEvent('category_click', { category: parts[1] });
      }

      // 2. District, Town, or Service navigation
      const districts = ['kottayam', 'pathanamthitta', 'alappuzha', 'kollam'];
      if (districts.includes(parts[0])) {
        const districtName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

        if (parts.length === 1) {
          // District clicked (/kottayam/)
          window.pushAnalyticsEvent('district_click', { district: districtName });
        } else if (parts.length === 2) {
          const categories = ['solar-installation', 'plumber', 'electrician', 'ac-service', 'cctv-installation', 'home-cleaning', 'pest-control', 'water-purifier-service'];
          if (categories.includes(parts[1])) {
            // Category clicked inside a district (/kottayam/plumber/)
            window.pushAnalyticsEvent('category_click', { category: parts[1] });
          } else {
            // Town clicked (/kottayam/pala/)
            const townName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            window.pushAnalyticsEvent('town_click', { district: districtName, town: townName });
          }
        } else if (parts.length === 3) {
          // Service in town clicked (/kottayam/plumber/pala/)
          const townName = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
          window.pushAnalyticsEvent('town_click', { district: districtName, town: townName });
        }
      }
    } catch (e) {
      // Ignore URL parsing errors for malformed hrefs
    }
  }, true);
} else {
  console.warn("Tracker: Firebase not detected.");
}
