// ==========================================================
// SERVEKERALA.IN – FIREBASE FIRESTORE BUSINESS LISTINGS WRITER
// ==========================================================

// Firebase configuration (Replace with your actual keys from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', () => {
    const listingForm = document.getElementById('listing-form');
    const statusMsg = document.getElementById('form-status-message');
    const submitBtn = listingForm ? listingForm.querySelector('button[type="submit"]') : null;

    if (!listingForm || !statusMsg) return;

    // Load category and district options dynamically from Firestore cms_settings/global
    db.collection('cms_settings').doc('global').get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const bcatSelect = document.getElementById('bcat');
        const bdistSelect = document.getElementById('bdist');

        if (data.categories && data.categories.length && bcatSelect) {
          bcatSelect.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
        if (data.districts && data.districts.length && bdistSelect) {
          bdistSelect.innerHTML = '<option value="">Select District</option>' + data.districts.map(d => `<option value="${d.toLowerCase()}">${d}</option>`).join('') + '<option value="Multiple">Multiple (Enter Towns Below)</option>';
        }
      }
    }).catch(err => console.error("Error loading dropdown parameters:", err));

    listingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable submit button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Application...';
      }

      // Hide previous status messages
      statusMsg.style.display = 'none';
      statusMsg.className = 'alert-box';
      statusMsg.textContent = '';

      // Collect form values
      const dataToSave = {
        name: document.getElementById('bname').value.trim(),
        category: document.getElementById('bcat').value,
        website: document.getElementById('bweb').value.trim(),
        district: document.getElementById('bdist').value,
        towns: document.getElementById('btowns').value.trim(),
        phone: document.getElementById('bphone').value.trim(),
        whatsapp: document.getElementById('bwa').value.trim(),
        email: document.getElementById('bemail').value.trim(),
        description: document.getElementById('bdesc').value.trim(),
        servicesOffered: document.getElementById('bservices').value.trim(),
        whyChooseUs: document.getElementById('bwhychoose').value.trim(),
        address: document.getElementById('baddress').value.trim(),
        mapUrl: document.getElementById('bmap').value.trim(),
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Save to Firestore
      db.collection('listings').add(dataToSave)
      .then((docRef) => {
        listingForm.style.display = 'none';
        statusMsg.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; color: var(--primary); margin-bottom: 16px;">✓</div>
            <h2 style="color: var(--primary); margin-bottom: 16px;">Application Submitted Successfully!</h2>
            <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 32px; line-height: 1.6;">Thank you for registering your business. Your application has been securely saved.<br>Our moderation team will review and publish your listing within 24 hours.</p>
            <a href="/" class="btn-primary" style="display: inline-block; padding: 12px 32px; text-decoration: none;">Return to Home</a>
          </div>
        `;
        statusMsg.classList.add('card-glass');
        statusMsg.classList.remove('alert-box', 'alert-success', 'alert-error');
        statusMsg.style.display = 'block';
        statusMsg.style.border = '2px solid var(--primary)';
        statusMsg.style.borderRadius = '12px';
        listingForm.reset();
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch((error) => {
        console.error('Error adding document to database: ', error);
        statusMsg.textContent = 'Error: We could not submit your application. Please check your internet connection or verify your Firebase configuration.';
        statusMsg.classList.add('alert-error');
        statusMsg.style.display = 'block';
      })
      .finally(() => {
        // Restore submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }
      });
    });
  });
} else {
  console.error('Firebase SDK not loaded. Please verify the CDN links inside the head tag.');
}
