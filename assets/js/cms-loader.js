// ==========================================================
// SERVEKERALA.IN – DYNAMIC CMS LOADER
// ==========================================================

// This script expects the Firebase SDK to be loaded.
if (typeof firebase !== 'undefined') {
  
  // We initialize only if it hasn't been initialized by another script on the page
  if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
      authDomain: "servekerala2026.firebaseapp.com",
      projectId: "servekerala2026",
      storageBucket: "servekerala2026.firebasestorage.app",
      messagingSenderId: "122091003614",
      appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
      measurementId: "G-P3J3NLRKDL"
    };
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', () => {
    
    // Check if we have cached settings in localStorage to avoid unnecessary DB reads
    const cachedSettings = localStorage.getItem('cms_settings');
    
    if (cachedSettings) {
      applyCmsSettings(JSON.parse(cachedSettings));
    } else {
      // Fetch from Firestore
      db.collection('cms_settings').doc('global').get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Cache it
          localStorage.setItem('cms_settings', JSON.stringify(data));
          applyCmsSettings(data);
        } else {
          applyCmsSettings({});
        }
      }).catch(err => {
        console.error("CMS Load Error: ", err);
        applyCmsSettings({});
      });
    }

  });

  function applyCmsSettings(data) {
    // Find all elements with data-cms attribute
    const cmsElements = document.querySelectorAll('[data-cms]');
    
    cmsElements.forEach(el => {
      const key = el.getAttribute('data-cms');
      const value = data[key];
      
      if (value) {
        // If it's a link (like mailto or wa.me), we need to handle hrefs
        if (el.tagName === 'A') {
          if (key === 'contactEmail') {
            el.href = `mailto:${value}`;
            el.textContent = value;
          } else if (key === 'contactWhatsApp') {
            // Strip non-numeric characters for the href
            const cleanNum = value.replace(/\D/g, '');
            el.href = `https://wa.me/${cleanNum}`;
            // Optional: update text if the original text was just the number, otherwise leave button text alone
            // We'll leave the text content of the WhatsApp button alone to keep it saying "Chat on WhatsApp"
          } else if (key === 'contactPhone') {
            const cleanNum = value.replace(/[^\d+]/g, '');
            el.href = `tel:${cleanNum}`;
            el.textContent = value;
          }
        } else {
          // Normal text element (h1, p, div). Use innerHTML to allow <br> tags.
          el.innerHTML = value;
        }
      }
      
      // Remove the invisible class so either CMS value or fallback shows
      el.classList.remove('cms-loading');
    });
  }
} else {
  console.warn("CMS Loader: Firebase not detected.");
}
