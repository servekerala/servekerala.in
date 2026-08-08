// ==========================================================
// SERVEKERALA.IN – JOIN AUTO MITHRAM HANDLER
// ==========================================================

const firebaseConfig = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  document.addEventListener('DOMContentLoaded', () => {
    
    function formatVehicleNumber(val) {
      let v = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      let result = '';
      
      let stateCode = v.match(/^[A-Z]{1,2}/);
      if (stateCode) {
        result += stateCode[0];
        v = v.substring(stateCode[0].length);
      } else if (v.length > 0) {
        return v;
      }
      
      if (v.length > 0) {
        result += '-';
        let rtoCode = v.match(/^\d{1,2}/);
        if (rtoCode) {
          result += rtoCode[0];
          v = v.substring(rtoCode[0].length);
        } else {
          let letters = v.match(/^[A-Z]+/);
          if(letters) return result + v;
        }
      }
      
      if (v.length > 0) {
        let series = v.match(/^[A-Z]{1,3}/);
        if (series) {
          result += series[0];
          v = v.substring(series[0].length);
        }
      }
      
      if (v.length > 0) {
        result += '-';
        let num = v.match(/^\d{1,4}/);
        if (num) {
          result += num[0];
        } else {
          result += v;
        }
      }
      
      return result;
    }

    const vehicleInput = document.getElementById('auto-vehicle');
    if (vehicleInput) {
        vehicleInput.addEventListener('input', function(e) {
            let cursor = this.selectionStart;
            let oldLength = this.value.length;
            this.value = formatVehicleNumber(this.value);
            // Adjust cursor position roughly
            let newLength = this.value.length;
            this.setSelectionRange(cursor + (newLength - oldLength), cursor + (newLength - oldLength));
        });
    }

    const joinForm = document.getElementById('join-auto-form');
    const statusMsg = document.getElementById('form-status-message');
    const submitBtn = joinForm ? joinForm.querySelector('button[type="submit"]') : null;

    if (!joinForm || !statusMsg) return;

    // Load Auto Mithram hierarchy from Page Generator Config
    function loadLocationParameters() {
      db.collection('page_generator_config').doc('global').get().then((doc) => {
        let autoConfig = null;
        if (doc.exists) {
          const data = doc.data();
          if (data.auto_mithram) {
            autoConfig = typeof data.auto_mithram === 'string' ? JSON.parse(data.auto_mithram) : data.auto_mithram;
          }
        }
        
        if (!autoConfig) {
          // Fallback to defaults if not configured
          autoConfig = {
            'Pathanamthitta': {
              'Thiruvalla': ['Railway Station', 'KSRTC Bus Stand', 'Pushpagiri Medical College', 'Muthoor', 'Cross Junction'],
              'Kozhencherry': ['Private Bus Stand', 'District Hospital', 'Thelliyoor'],
              'Adoor': ['KSRTC Bus Stand', 'Bypass Junction', 'General Hospital']
            },
            'Kottayam': {
              'Kottayam': ['Railway Station', 'KSRTC Bus Stand', 'Medical College', 'Collectorate', 'Baker Junction'],
              'Changanacherry': ['Railway Station', 'KSRTC Bus Stand', 'Market', 'Perunna']
            },
            'Alappuzha': {
              'Chengannur': ['Railway Station', 'KSRTC Bus Stand', 'Engineering College', 'MC Road']
            }
          };
        }
        
        setupDependentDropdowns(autoConfig);
      }).catch(err => {
        console.error("Error loading location parameters:", err);
        // Fallback
        const autoConfig = {
          'Pathanamthitta': {
            'Thiruvalla': ['Railway Station', 'KSRTC Bus Stand']
          }
        };
        setupDependentDropdowns(autoConfig);
      });
    }

    function setupDependentDropdowns(autoConfig) {
      const distSelect = document.getElementById('auto-dist');
      const townSelect = document.getElementById('auto-town');
      const localitySelect = document.getElementById('auto-locality');

      if (!distSelect || !townSelect || !localitySelect) return;

      // Populate Districts
      const districts = Object.keys(autoConfig);
      distSelect.innerHTML = '<option value="">Select District</option>' + districts.map(d => `<option value="${d.toLowerCase()}">${d}</option>`).join('');

      function updateTowns() {
        const selectedDistKey = Object.keys(autoConfig).find(k => k.toLowerCase() === distSelect.value.toLowerCase());
        if (selectedDistKey && autoConfig[selectedDistKey]) {
          const towns = Object.keys(autoConfig[selectedDistKey]);
          townSelect.innerHTML = '<option value="">Select Town</option>' + towns.map(t => `<option value="${t}">${t}</option>`).join('');
        } else {
          townSelect.innerHTML = '<option value="">Select Town</option>';
        }
        updateLocalities(); // Reset localities
      }

      function updateLocalities() {
        const selectedDistKey = Object.keys(autoConfig).find(k => k.toLowerCase() === distSelect.value.toLowerCase());
        const selectedTown = townSelect.value;
        if (selectedDistKey && autoConfig[selectedDistKey] && selectedTown && autoConfig[selectedDistKey][selectedTown]) {
          const localities = autoConfig[selectedDistKey][selectedTown];
          localitySelect.innerHTML = '<option value="">Select Locality</option>' + localities.map(l => `<option value="${l}">${l}</option>`).join('');
        } else {
          localitySelect.innerHTML = '<option value="">Select Locality</option>';
        }
      }

      distSelect.addEventListener('change', updateTowns);
      townSelect.addEventListener('change', updateLocalities);

      // Force initial state
      distSelect.value = '';
      updateTowns();
    }

    loadLocationParameters();

    // Available Hours select/input sync
    const timeSelect = document.getElementById('auto-time-select');
    const timeInput = document.getElementById('auto-time');
    if (timeSelect && timeInput) {
      // Initialize default value
      timeInput.value = timeSelect.value;
      timeInput.required = false;

      timeSelect.addEventListener('change', () => {
        if (timeSelect.value === 'custom') {
          timeInput.style.display = 'block';
          timeInput.value = '';
          timeInput.required = true;
          timeInput.focus();
        } else {
          timeInput.style.display = 'none';
          timeInput.value = timeSelect.value;
          timeInput.required = false;
        }
      });
    }

    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Application...';
      }

      statusMsg.style.display = 'none';
      statusMsg.className = 'alert-box';
      statusMsg.textContent = '';

      const newTown = document.getElementById('auto-town').value.trim();
      const newLocality = document.getElementById('auto-locality').value.trim();
      const newStandName = document.getElementById('auto-stand').value.trim();

      const dataToSave = {
        driverName: document.getElementById('auto-name').value.trim(),
        vehicleNumber: document.getElementById('auto-vehicle').value.trim(),
        district: document.getElementById('auto-dist').value,
        town: newTown,
        locality: newLocality,
        autoStand: newStandName,        standLocation: newStandName + ", " + newLocality + ", " + newTown,
        phone: document.getElementById('auto-phone').value.trim(),
        whatsapp: document.getElementById('auto-wa').value.trim(),
        availableHours: document.getElementById('auto-time').value.trim(),
        pinCode: document.getElementById('auto-pin').value.trim(), // Secret PIN for profile edits
        availability: 'online', // Default is online when approved
        status: 'pending',
        driverDeclarationAccepted: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      db.collection('auto_mithram').add(dataToSave)
      .then(() => {
        joinForm.style.display = 'none';
        statusMsg.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; color: var(--primary); margin-bottom: 16px;">✓</div>
            <h2 style="color: var(--primary); margin-bottom: 16px;">Application Submitted Successfully!</h2>
            <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 32px; line-height: 1.6;">Thank you for joining Auto Mithram. Your driver profile has been securely saved.<br>Our moderation team will review and publish it within 24 hours.</p>
            <a href="/" class="btn-primary" style="display: inline-block; padding: 12px 32px; text-decoration: none;">Return to Home</a>
          </div>
        `;
        statusMsg.classList.add('card-glass');
        statusMsg.classList.remove('alert-box', 'alert-success', 'alert-error');
        statusMsg.style.display = 'block';
        statusMsg.style.border = '2px solid var(--primary)';
        statusMsg.style.borderRadius = '12px';
        joinForm.reset();
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
        statusMsg.textContent = 'Error: We could not submit your application. Please check your internet connection.';
        statusMsg.classList.add('alert-error');
        statusMsg.style.display = 'block';
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }
      });
    });
  });
} else {
  console.error('Firebase SDK not loaded.');
}
