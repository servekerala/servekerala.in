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
      .then((docRef) => {
        joinForm.style.display = 'none';

        let driverWaNum = dataToSave.whatsapp.replace(/\D/g, '');
        if (driverWaNum.length === 10) driverWaNum = '91' + driverWaNum;

        const driverProfileUrl = `https://www.servekerala.in/auto-mithram/?search=${encodeURIComponent(dataToSave.driverName)}`;
        const waMsgText = encodeURIComponent(`Hi ${dataToSave.driverName}! 🛺 Welcome to Auto Mithram on ServeKerala.in!\n\nYour driver application for vehicle ${dataToSave.vehicleNumber} (${dataToSave.autoStand}) is submitted!\n\n🔗 Profile Link: ${driverProfileUrl}\n\nKeep this link saved to share with customers!`);
        const sendWaUrl = `https://wa.me/${driverWaNum}?text=${waMsgText}`;
        const shareWaUrl = `https://wa.me/?text=${encodeURIComponent(`Hi! I have registered my Autorickshaw on ServeKerala Auto Mithram. Call or WhatsApp me directly for rides: ${driverProfileUrl}`)}`;

        statusMsg.innerHTML = `
          <div style="text-align: center; padding: 30px 20px;">
            <div style="font-size: 56px; color: #059669; margin-bottom: 12px;">✓</div>
            <h2 style="color: #064e3b; font-size: 26px; margin-bottom: 12px; font-weight: 800;">Application Submitted Successfully!</h2>
            <p style="color: var(--text-muted); font-size: 15px; margin-bottom: 24px; line-height: 1.6; max-width: 540px; margin-left: auto; margin-right: auto;">
              Thank you <strong>${dataToSave.driverName}</strong>! Your autorickshaw profile (<strong>${dataToSave.vehicleNumber}</strong>) is registered. Our moderation team will verify and activate your listing within 24 hours.
            </p>

            <!-- WhatsApp Actions Card -->
            <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #6ee7b7; padding: 20px; border-radius: 14px; margin-bottom: 28px; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.1);">
              <h4 style="color: #065f46; font-size: 17px; margin-bottom: 8px; font-weight: 700;">📱 Get Welcome Confirmation on WhatsApp</h4>
              <p style="font-size: 13px; color: #047857; margin-bottom: 16px;">Click below to send your profile details & live link directly to your WhatsApp app:</p>
              
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="${sendWaUrl}" target="_blank" class="btn-primary" style="background: #25d366; border: none; color: white; padding: 12px 24px; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 15px; box-shadow: 0 4px 10px rgba(37,211,102,0.3);">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Receive Profile Link on WhatsApp
                </a>
                <a href="${shareWaUrl}" target="_blank" class="btn-outline" style="border: 2px solid #059669; color: #047857; padding: 12px 24px; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 15px; background: white;">
                  📢 Share Profile with Friends / Drivers
                </a>
              </div>
            </div>

            <a href="/auto-mithram/" class="btn-primary" style="display: inline-block; padding: 12px 32px; text-decoration: none;">Go to Auto Mithram Directory</a>
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
