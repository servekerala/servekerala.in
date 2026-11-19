// ==========================================================
// SERVEKERALA.IN – FIREBASE FIRESTORE BUSINESS LISTINGS WRITER
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

const GLOBAL_CONFIG_FALLBACK = {
  categories: [
    { id: 'solar', name: 'Solar Installation' },
    { id: 'plumbing', name: 'Plumber' },
    { id: 'electrical', name: 'Electrician' },
    { id: 'ac', name: 'AC Service' },
    { id: 'cctv', name: 'CCTV Installation' },
    { id: 'cleaning', name: 'Home Cleaning' },
    { id: 'pest', name: 'Pest Control' },
    { id: 'water', name: 'Water Purifier Service' }
  ],
  services: [
    { id: 'on-grid-solar', categoryId: 'solar', name: 'On-Grid Solar Plant' },
    { id: 'off-grid-solar', categoryId: 'solar', name: 'Off-Grid Solar System' },
    { id: 'hybrid-solar', categoryId: 'solar', name: 'Hybrid Solar Setup' },
    { id: 'solar-amc', categoryId: 'solar', name: 'Solar Maintenance & AMC' },
    { id: 'pipe-leakage', categoryId: 'plumbing', name: 'Emergency Pipe Leakage' },
    { id: 'fitting-installation', categoryId: 'plumbing', name: 'Bathroom Fittings & Taps' },
    { id: 'drainage-cleaning', categoryId: 'plumbing', name: 'Drainage & Clog Clearing' },
    { id: 'water-tank-install', categoryId: 'plumbing', name: 'Water Tank & Pump Setup' },
    { id: 'house-wiring', categoryId: 'electrical', name: 'House Wiring & Rewiring' },
    { id: 'inverter-install', categoryId: 'electrical', name: 'Inverter & Battery Setup' },
    { id: 'appliance-repair', categoryId: 'electrical', name: 'Home Appliances & Fan Fitting' },
    { id: 'mcb-db-fixing', categoryId: 'electrical', name: 'MCB & DB Board Repairs' },
    { id: 'ac-cleaning', categoryId: 'ac', name: 'AC Deep Cleaning & Service' },
    { id: 'ac-gas-refill', categoryId: 'ac', name: 'Gas Charging & Refill' },
    { id: 'ac-installation', categoryId: 'ac', name: 'AC Installation/Removal' },
    { id: 'ac-repair', categoryId: 'ac', name: 'AC Board & Fan Repair' },
    { id: 'cctv-install', categoryId: 'cctv', name: 'Camera Mounting & Cabling' },
    { id: 'nvr-dvr-config', categoryId: 'cctv', name: 'NVR/DVR Configuration' },
    { id: 'cctv-repair', categoryId: 'cctv', name: 'CCTV Signal & Wiring Faults' },
    { id: 'ip-camera-setup', categoryId: 'cctv', name: 'IP Camera & App Integration' },
    { id: 'deep-house-clean', categoryId: 'cleaning', name: 'Deep House Cleaning' },
    { id: 'sofa-carpet-clean', categoryId: 'cleaning', name: 'Sofa & Carpet Shampooing' },
    { id: 'bathroom-cleaning', categoryId: 'cleaning', name: 'Deep Bathroom Cleaning' },
    { id: 'water-tank-cleaning', categoryId: 'cleaning', name: 'Water Tank & Sump Cleaning' },
    { id: 'termite-control', categoryId: 'pest', name: 'Termite Treatment' },
    { id: 'cockroach-control', categoryId: 'pest', name: 'Cockroach & Ant Gel Treatment' },
    { id: 'rodent-control', categoryId: 'pest', name: 'Rat & Rodent Control' },
    { id: 'bedbug-control', categoryId: 'pest', name: 'Bed Bug Elimination' },
    { id: 'filter-replacement', categoryId: 'water', name: 'Filter & Membrane Change' },
    { id: 'purifier-repair', categoryId: 'water', name: 'RO/UV Purifier Repair' },
    { id: 'new-purifier-install', categoryId: 'water', name: 'New Purifier Installation' },
    { id: 'purifier-amc', categoryId: 'water', name: 'RO Annual Maintenance Contract' }
  ],
  districts: ['Kottayam', 'Pathanamthitta', 'Alappuzha', 'Kollam'],
  towns: {
    kottayam: [
      { id: 'kottayam', name: 'Kottayam Town', areas: ['Kottayam Town', 'Kanjikuzhy', 'Muttambalam', 'Kumaranalloor', 'Gandhi Nagar'] },
      { id: 'changanacherry', name: 'Changanacherry', areas: ['Changanacherry Town', 'Thangana', 'Kurisummoodu', 'Perunna', 'Mathumoola', 'Paippad'] },
      { id: 'ettumanoor', name: 'Ettumanoor', areas: ['Ettumanoor Town', 'Athirampuzha', 'Neendoor', 'Peroor'] },
      { id: 'pala', name: 'Pala', areas: ['Pala Town', 'Mutholy', 'Lalam', 'Pravithanam'] },
      { id: 'vaikom', name: 'Vaikom', areas: ['Vaikom Town', 'Vadayar', 'T.V. Puram'] }
    ],
    pathanamthitta: [
      { id: 'thiruvalla', name: 'Thiruvalla', areas: ['Thiruvalla Town', 'Kuttapuzha', 'Kaviyoor', 'Kuttoor', 'Manjadi', 'Ramanchira'] },
      { id: 'adoor', name: 'Adoor', areas: ['Adoor Town', 'Parakode', 'Anandapally'] },
      { id: 'ranni', name: 'Ranni', areas: ['Ranni Town', 'Pazhavangadi', 'Angadi'] },
      { id: 'kozhencherry', name: 'Kozhencherry', areas: ['Kozhencherry Town', 'Thekkemala', 'Karanthur'] },
      { id: 'pandalam', name: 'Pandalam', areas: ['Pandalam Town', 'Kurampala', 'Thonnallur'] }
    ],
    alappuzha: [
      { id: 'alappuzha', name: 'Alappuzha Town', areas: ['Alappuzha Town', 'Kalavoor', 'Punnapra'] },
      { id: 'chengannur', name: 'Chengannur', areas: ['Chengannur Town', 'Kallissery', 'Mulakuzha'] },
      { id: 'cherthala', name: 'Cherthala', areas: ['Cherthala Town', 'Arthunkal', 'Vayalar'] },
      { id: 'kayamkulam', name: 'Kayamkulam', areas: ['Kayamkulam Town', 'Krishnapuram', 'Kayamkulam Market'] }
    ],
    kollam: [
      { id: 'kollam', name: 'Kollam Town', areas: ['Kollam Town', 'Chathannoor', 'Kadavoor'] },
      { id: 'karunagappally', name: 'Karunagappally', areas: ['Karunagappally Town', 'Oachira', 'Lalaji Junction'] },
      { id: 'kottarakkara', name: 'Kottarakkara', areas: ['Kottarakkara Town', 'Pulamon', 'Kizhakkekara'] },
      { id: 'punalur', name: 'Punalur', areas: ['Punalur Town', 'Chemmanthoor', 'Paper Mill'] }
    ]
  }
};

let activeConfig = GLOBAL_CONFIG_FALLBACK;

if (typeof firebase !== 'undefined') {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();
  const storage = firebase.storage();

  document.addEventListener('DOMContentLoaded', () => {
    const listingForm = document.getElementById('listing-form');
    const statusMsg = document.getElementById('form-status-message');
    const nextBtn = document.getElementById('next-step-btn');
    const prevBtn = document.getElementById('prev-step-btn');
    const customServiceChk = document.getElementById('request-custom-service-chk');
    
    if (!listingForm || !statusMsg) return;

    let currentStep = 0;
    const totalSteps = 8;
    let importedData = null;

    // Toggle custom service input field display
    if (customServiceChk) {
      customServiceChk.addEventListener('change', () => {
        const container = document.getElementById('custom-service-field-container');
        if (container) {
          container.style.display = customServiceChk.checked ? 'block' : 'none';
        }
      });
    }

    // Step 0 - Find Your Business Handlers
    const btnFetch = document.getElementById('btn-fetch-business');
    const btnSkip = document.getElementById('btn-skip-import');
    const btnTryAnother = document.getElementById('btn-try-another');
    const btnUseImported = document.getElementById('btn-use-imported');

    const gbpUrlInput = document.getElementById('import-gbp-url');
    const webUrlInput = document.getElementById('import-web-url');

    const importLoading = document.getElementById('import-loading');
    const importLoadingText = document.getElementById('import-loading-text');
    const importError = document.getElementById('import-error');
    const importErrorReason = document.getElementById('import-error-reason');
    const importConfirmPanel = document.getElementById('import-confirm-panel');

    if (btnFetch) {
      btnFetch.addEventListener('click', async () => {
        const gbpUrl = gbpUrlInput ? gbpUrlInput.value.trim() : '';
        const webUrl = webUrlInput ? webUrlInput.value.trim() : '';

        const targetUrl = gbpUrl || webUrl;
        if (!targetUrl) {
          alert('Please enter either a Google Business Profile Link or a Business Website URL.');
          return;
        }

        // Reset display states
        if (importLoading) importLoading.style.display = 'flex';
        if (importLoadingText) importLoadingText.textContent = 'Analyzing link & fetching business details...';
        if (importError) importError.style.display = 'none';
        if (importConfirmPanel) importConfirmPanel.style.display = 'none';
        btnFetch.disabled = true;

        try {
          const res = await fetch(`/api/fetch-business?url=${encodeURIComponent(targetUrl)}`);
          btnFetch.disabled = false;
          if (importLoading) importLoading.style.display = 'none';

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.error || 'Fetcher API returned error status.');
          }

          const data = await res.json();
          if (!data || (!data.name && !data.phone && !data.address)) {
            throw new Error('No valid business information found.');
          }

          importedData = data;

          // Render Confirmation panel
          document.getElementById('found-name').textContent = data.name || 'N/A';
          document.getElementById('found-address').textContent = data.address || 'N/A';
          document.getElementById('found-phone').textContent = data.phone || 'N/A';
          document.getElementById('found-website').textContent = data.website || 'N/A';
          document.getElementById('found-source').textContent = data.source || 'website';
          
          const hoursRow = document.getElementById('found-hours-row');
          if (hoursRow) {
            if (data.hours) {
              const daysOpen = Object.keys(data.hours).filter(d => data.hours[d].open).length;
              document.getElementById('found-hours').textContent = `Structured hours fetched (${daysOpen} days open)`;
              hoursRow.style.display = 'block';
            } else {
              hoursRow.style.display = 'none';
            }
          }

          const coordsRow = document.getElementById('found-coords-row');
          if (coordsRow) {
            if (data.latitude && data.longitude) {
              document.getElementById('found-lat').textContent = data.latitude;
              document.getElementById('found-lng').textContent = data.longitude;
              coordsRow.style.display = 'block';
            } else {
              coordsRow.style.display = 'none';
            }
          }

          if (importConfirmPanel) importConfirmPanel.style.display = 'block';

        } catch (err) {
          console.error(err);
          btnFetch.disabled = false;
          if (importLoading) importLoading.style.display = 'none';
          if (importErrorReason) importErrorReason.textContent = err.message || 'We could not fetch your business automatically. Please check the URL or skip to manually enter your information.';
          if (importError) importError.style.display = 'block';
        }
      });
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        importedData = null;
        currentStep = 1;
        showStep(currentStep);
      });
    }

    if (btnTryAnother) {
      btnTryAnother.addEventListener('click', () => {
        importedData = null;
        if (gbpUrlInput) gbpUrlInput.value = '';
        if (webUrlInput) webUrlInput.value = '';
        if (importConfirmPanel) importConfirmPanel.style.display = 'none';
      });
    }

    if (btnUseImported) {
      btnUseImported.addEventListener('click', () => {
        handleUseImportedData();
      });
    }

    function handleUseImportedData() {
      if (!importedData) return;

      // 1. Business Info
      if (importedData.name) {
        document.getElementById('bname').value = importedData.name;
      }
      if (importedData.website) {
        document.getElementById('bweb').value = importedData.website;
      }
      if (importedData.tagline) {
        document.getElementById('bshortdesc').value = importedData.tagline;
      }
      if (importedData.description) {
        document.getElementById('bdesc').value = importedData.description;
      }

      // Try to auto-select Category if matched from keywords
      if (importedData.name) {
        const nameLower = importedData.name.toLowerCase();
        let matchedCat = '';
        if (nameLower.includes('solar') || nameLower.includes('energy') || nameLower.includes('power')) matchedCat = 'solar';
        else if (nameLower.includes('plumb') || nameLower.includes('pipe') || nameLower.includes('leak')) matchedCat = 'plumbing';
        else if (nameLower.includes('electr') || nameLower.includes('wire') || nameLower.includes('light')) matchedCat = 'electrical';
        else if (nameLower.includes(' ac ') || nameLower.includes('air') || nameLower.includes('cool') || nameLower.includes('chiller')) matchedCat = 'ac';
        else if (nameLower.includes('cctv') || nameLower.includes('camera') || nameLower.includes('secur')) matchedCat = 'cctv';
        else if (nameLower.includes('clean') || nameLower.includes('wash') || nameLower.includes('scrub')) matchedCat = 'cleaning';
        else if (nameLower.includes('pest') || nameLower.includes('termite') || nameLower.includes('bug')) matchedCat = 'pest';
        else if (nameLower.includes('water') || nameLower.includes('purif')) matchedCat = 'water';
        
        if (matchedCat) {
          const catSelect = document.getElementById('bcat');
          if (catSelect) {
            catSelect.value = matchedCat;
            catSelect.dispatchEvent(new Event('change'));
          }
        }
      }

      // 2. Photos Step Preview: Load previews from proxy
      const photoStatus = document.getElementById('logo-upload-status');
      if (importedData.photos && importedData.photos.length > 0) {
        if (photoStatus) {
          photoStatus.textContent = `✓ Found ${importedData.photos.length} Google photos to import on submit.`;
          photoStatus.style.color = '#16a34a';
        }
        const logoPreview = document.getElementById('logo-preview-img');
        if (logoPreview) {
          logoPreview.src = `/api/places-photo?name=${encodeURIComponent(importedData.photos[0])}`;
          logoPreview.style.display = 'block';
        }
        if (importedData.photos.length > 1) {
          const coverPreview = document.getElementById('cover-preview-img');
          if (coverPreview) {
            coverPreview.src = `/api/places-photo?name=${encodeURIComponent(importedData.photos[1])}`;
            coverPreview.style.display = 'block';
          }
          const coverStatus = document.getElementById('cover-upload-status');
          if (coverStatus) {
            coverStatus.textContent = '✓ Google cover photo will be imported on submit.';
            coverStatus.style.color = '#16a34a';
          }
        }
        const galleryContainer = document.getElementById('gallery-preview-container');
        if (galleryContainer) {
          galleryContainer.innerHTML = '';
          importedData.photos.slice(2).forEach(photo => {
            const img = document.createElement('img');
            img.className = 'preview-thumbnail';
            img.src = `/api/places-photo?name=${encodeURIComponent(photo)}`;
            img.style.display = 'block';
            galleryContainer.appendChild(img);
          });
          const galleryStatus = document.getElementById('gallery-upload-status');
          if (galleryStatus) {
            galleryStatus.textContent = `✓ Google gallery photos will be imported on submit.`;
            galleryStatus.style.color = '#16a34a';
          }
        }
      }

      // 3. Location Details
      if (importedData.address) {
        document.getElementById('baddress').value = importedData.address;
        const pinMatch = importedData.address.match(/\b\d{6}\b/);
        if (pinMatch) {
          document.getElementById('bpincode').value = pinMatch[0];
        }
      }
      if (importedData.googleMapsUrl) {
        document.getElementById('bmap').value = importedData.googleMapsUrl;
      }

      // Match district and town automatically
      if (importedData.address) {
        const addrLower = importedData.address.toLowerCase();
        let matchedDist = '';
        if (addrLower.includes('kottayam')) matchedDist = 'kottayam';
        else if (addrLower.includes('pathanamthitta') || addrLower.includes('thiruvalla') || addrLower.includes('adoor')) matchedDist = 'pathanamthitta';
        else if (addrLower.includes('alappuzha') || addrLower.includes('chengannur')) matchedDist = 'alappuzha';
        else if (addrLower.includes('kollam')) matchedDist = 'kollam';

        if (matchedDist) {
          const distSelect = document.getElementById('bdist');
          if (distSelect) {
            distSelect.value = matchedDist;
            distSelect.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
              const townSelect = document.getElementById('btown');
              if (townSelect && activeConfig.towns[matchedDist]) {
                const foundTown = activeConfig.towns[matchedDist].find(t => 
                  addrLower.includes(t.name.toLowerCase()) || addrLower.includes(t.id.toLowerCase())
                );
                if (foundTown) {
                  townSelect.value = foundTown.id;
                  townSelect.dispatchEvent(new Event('change'));
                }
              }
            }, 300);
          }
        }
      }

      // 4. Contact Details
      if (importedData.phone) {
        const cleanedPhone = importedData.phone.replace(/[^0-9]/g, '');
        const displayPhone = cleanedPhone.length > 10 ? cleanedPhone.slice(-10) : cleanedPhone;
        document.getElementById('bphone').value = displayPhone;
        document.getElementById('bwa').value = displayPhone;
      }
      if (importedData.email) {
        document.getElementById('bemail').value = importedData.email;
      }
      if (importedData.socials) {
        if (importedData.socials.facebook) document.getElementById('bsocfb').value = importedData.socials.facebook;
        if (importedData.socials.instagram) document.getElementById('bsocig').value = importedData.socials.instagram;
        if (importedData.socials.linkedin) document.getElementById('bsocln').value = importedData.socials.linkedin;
      }

      // 5. Opening Hours
      if (importedData.hours) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
          const h = importedData.hours[day];
          const row = document.querySelector(`.hours-row[data-day="${day}"]`);
          if (row && h) {
            const closedChk = row.querySelector('.hour-closed');
            const h24Chk = row.querySelector('.hour-24h');
            const times = row.querySelectorAll('input[type="time"]');

            if (closedChk) {
              closedChk.checked = h.closed;
              closedChk.dispatchEvent(new Event('change'));
            }
            if (h24Chk) {
              h24Chk.checked = h.open24Hours;
              h24Chk.dispatchEvent(new Event('change'));
            }
            if (times[0] && h.openTime) {
              times[0].value = h.openTime;
            }
            if (times[1] && h.closeTime) {
              times[1].value = h.closeTime;
            }
          }
        });
      }

      // Transition to Step 1
      currentStep = 1;
      showStep(currentStep);
    }

    // Track background file uploads
    let uploads = {
      logo: null,
      cover: null,
      gallery: []
    };

    // Load definitions from cms_settings/global
    db.collection('cms_settings').doc('global').get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.categories && data.districts && data.towns && data.services) {
            activeConfig = data;
            console.log("Loaded global configurations from Firestore.");
          }
        }
        initializeFormOptions();
      })
      .catch((err) => {
        console.warn("Failed to read global config from db, using hardcoded fallback:", err);
        initializeFormOptions();
      });

    function initializeFormOptions() {
      // Step 1: Categories dropdown
      const catSelect = document.getElementById('bcat');
      if (catSelect) {
        catSelect.innerHTML = '<option value="">Select Category</option>' + 
          activeConfig.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      }

      // Step 3: District dropdown
      const distSelect = document.getElementById('bdist');
      if (distSelect) {
        distSelect.innerHTML = '<option value="">Select District</option>' +
          activeConfig.districts.map(d => `<option value="${d.toLowerCase()}">${d}</option>`).join('');
      }

      // Step 5: Service Coverage Areas (Districts checkbox grid)
      const serviceDistrictsContainer = document.getElementById('service-districts-container');
      if (serviceDistrictsContainer) {
        serviceDistrictsContainer.innerHTML = activeConfig.districts.map(d => `
          <label class="checkbox-card">
            <input type="checkbox" name="service_districts" value="${d.toLowerCase()}">
            <span>${d}</span>
          </label>
        `).join('');

        // Trigger updates for Towns Coverage based on checked districts
        serviceDistrictsContainer.querySelectorAll('input').forEach(checkbox => {
          checkbox.addEventListener('change', updateServiceTownsCheckboxGrid);
        });
      }
    }

    // Step 1 Category Change event -> Dynamic Services
    const catSelect = document.getElementById('bcat');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        const categoryId = e.target.value;
        const container = document.getElementById('services-checkboxes-container');
        if (!container) return;

        if (!categoryId) {
          container.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">Please select a Service Category in Step 1 to load services.</p>';
          return;
        }

        const filteredServices = activeConfig.services.filter(s => s.categoryId === categoryId);
        if (filteredServices.length === 0) {
          container.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">No specific services found for this category.</p>';
          return;
        }

        container.innerHTML = filteredServices.map(s => `
          <label class="checkbox-card">
            <input type="checkbox" name="services" value="${s.id}" data-name="${s.name}">
            <span>${s.name}</span>
          </label>
        `).join('');
      });
    }

    const serviceOptionsContainer = document.getElementById('services-checkboxes-container');
    const serviceSelectionStatus = document.getElementById('service-selection-status');
    if (serviceOptionsContainer) {
      serviceOptionsContainer.addEventListener('change', event => {
        if (event.target?.name !== 'services') return;
        const checked = serviceOptionsContainer.querySelectorAll('input[name="services"]:checked');
        if (checked.length > 10) {
          event.target.checked = false;
          if (serviceSelectionStatus) serviceSelectionStatus.textContent = 'Select up to 10 relevant services.';
          return;
        }
        if (serviceSelectionStatus) serviceSelectionStatus.textContent = `${checked.length} of 10 selected`;
      });
    }

    // Step 3 District Change event -> Dynamic Towns
    const distSelect = document.getElementById('bdist');
    const townSelect = document.getElementById('btown');
    if (distSelect && townSelect) {
      distSelect.addEventListener('change', (e) => {
        const districtId = e.target.value;
        const areasContainer = document.getElementById('areas-checkboxes-container');

        if (!districtId) {
          townSelect.innerHTML = '<option value="">Select District First</option>';
          townSelect.disabled = true;
          if (areasContainer) areasContainer.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">Select Primary Town to load areas.</p>';
          return;
        }

        const towns = activeConfig.towns[districtId] || [];
        townSelect.innerHTML = '<option value="">Select Primary Town</option>' +
          towns.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        townSelect.disabled = false;
        if (areasContainer) areasContainer.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">Select Primary Town to load areas.</p>';
      });
    }

    // Step 3 Town Change event -> Dynamic Areas list
    if (townSelect) {
      townSelect.addEventListener('change', (e) => {
        const townId = e.target.value;
        const districtId = distSelect.value;
        const container = document.getElementById('areas-checkboxes-container');
        if (!container) return;

        if (!townId || !districtId) {
          container.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">Select Primary Town to load areas.</p>';
          return;
        }

        const towns = activeConfig.towns[districtId] || [];
        const townObj = towns.find(t => t.id === townId);
        if (!townObj || !townObj.areas || townObj.areas.length === 0) {
          container.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">No sub-areas registered for this town.</p>';
          return;
        }

        container.innerHTML = townObj.areas.map(area => `
          <label class="checkbox-card">
            <input type="checkbox" name="local_areas" value="${area}">
            <span>${area}</span>
          </label>
        `).join('');
      });
    }

    // Step 5 Districts Served Change event -> Dynamic Towns Served
    function updateServiceTownsCheckboxGrid() {
      const container = document.getElementById('service-towns-container');
      if (!container) return;

      const checkedDistricts = Array.from(document.querySelectorAll('input[name="service_districts"]:checked')).map(el => el.value);

      if (checkedDistricts.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); font-size:13px; margin:0;">Check a district above to view towns.</p>';
        return;
      }

      let townsHTML = '';
      checkedDistricts.forEach(distId => {
        const districtName = distId.charAt(0).toUpperCase() + distId.slice(1);
        const towns = activeConfig.towns[distId] || [];
        if (towns.length > 0) {
          townsHTML += `<div style="grid-column: 1/-1; font-weight: 700; margin-top: 10px; font-size: 13px; color: var(--primary);">${districtName} Towns:</div>`;
          townsHTML += towns.map(t => `
            <label class="checkbox-card">
              <input type="checkbox" name="service_towns" value="${t.id}" data-district="${distId}">
              <span>${t.name}</span>
            </label>
          `).join('');
        }
      });

      container.innerHTML = townsHTML || '<p style="color:var(--text-muted); font-size:13px; margin:0;">No towns found.</p>';
    }

    // Step 7 Daily Business Hours inputs control
    document.querySelectorAll('.hours-row').forEach(row => {
      const closedCheck = row.querySelector('.hour-closed');
      const allDayCheck = row.querySelector('.hour-24h');
      const timeInputs = row.querySelectorAll('input[type="time"]');

      closedCheck.addEventListener('change', () => {
        if (closedCheck.checked) {
          allDayCheck.checked = false;
          timeInputs.forEach(input => {
            input.disabled = true;
            input.value = '';
          });
        } else {
          timeInputs.forEach(input => input.disabled = false);
          timeInputs[0].value = "09:00";
          timeInputs[1].value = "18:00";
        }
      });

      allDayCheck.addEventListener('change', () => {
        if (allDayCheck.checked) {
          closedCheck.checked = false;
          timeInputs.forEach(input => {
            input.disabled = true;
            input.value = '';
          });
          timeInputs[0].value = "00:00";
          timeInputs[1].value = "23:59";
        } else {
          timeInputs.forEach(input => input.disabled = false);
          timeInputs[0].value = "09:00";
          timeInputs[1].value = "18:00";
        }
      });
    });

    // Step 2 background file uploads
    const logoInput = document.getElementById('blogo');
    if (logoInput) {
      logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('logo-preview-img');
        const status = document.getElementById('logo-upload-status');
        if (!file) return;

        // Max logo size: 500 KB (500 * 1024 bytes)
        const maxLogoSize = 500 * 1024;
        if (file.size > maxLogoSize) {
          alert('Logo file size exceeds the 500KB limit. Please choose a smaller or optimized image.');
          logoInput.value = '';
          preview.src = '';
          preview.style.display = 'none';
          status.textContent = '❌ File too large (Max 500KB)';
          status.style.color = '#dc2626';
          return;
        }

        // Show Local Preview
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        status.textContent = 'Uploading to storage...';
        status.style.color = '';

        const path = `logos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const ref = storage.ref().child(path);
        
        uploads.logo = ref.put(file).then(snapshot => snapshot.ref.getDownloadURL().then(url => {
          status.textContent = '✓ Uploaded successfully!';
          status.style.color = '#16a34a';
          return { url, storagePath: path, altText: file.name };
        })).catch(err => {
          status.textContent = '❌ Upload failed. Retrying during submission.';
          status.style.color = '#dc2626';
          console.error(err);
          return null;
        });
      });
    }

    const coverInput = document.getElementById('bcover');
    if (coverInput) {
      coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('cover-preview-img');
        const status = document.getElementById('cover-upload-status');
        if (!file) return;

        // Max cover size: 1 MB (1024 * 1024 bytes)
        const maxCoverSize = 1024 * 1024;
        if (file.size > maxCoverSize) {
          alert('Cover photo file size exceeds the 1MB limit. Please choose a smaller or optimized image.');
          coverInput.value = '';
          preview.src = '';
          preview.style.display = 'none';
          status.textContent = '❌ File too large (Max 1MB)';
          status.style.color = '#dc2626';
          return;
        }

        // Show Local Preview
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        status.textContent = 'Uploading to storage...';
        status.style.color = '';

        const path = `covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const ref = storage.ref().child(path);

        uploads.cover = ref.put(file).then(snapshot => snapshot.ref.getDownloadURL().then(url => {
          status.textContent = '✓ Uploaded successfully!';
          status.style.color = '#16a34a';
          return { url, storagePath: path, altText: file.name };
        })).catch(err => {
          status.textContent = '❌ Upload failed. Retrying during submission.';
          status.style.color = '#dc2626';
          console.error(err);
          return null;
        });
      });
    }

    const galleryInput = document.getElementById('bgallery');
    if (galleryInput) {
      galleryInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const container = document.getElementById('gallery-preview-container');
        const status = document.getElementById('gallery-upload-status');
        if (files.length === 0) return;

        // Max gallery image size: 1 MB (1024 * 1024 bytes) per file
        const maxGallerySize = 1024 * 1024;
        const tooLargeFiles = files.filter(f => f.size > maxGallerySize);
        if (tooLargeFiles.length > 0) {
          alert(`Some gallery files exceed the 1MB limit:\n${tooLargeFiles.map(f => `- ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join('\n')}\nPlease choose smaller images.`);
          galleryInput.value = '';
          container.innerHTML = '';
          status.textContent = '❌ Files too large (Max 1MB each)';
          status.style.color = '#dc2626';
          return;
        }

        container.innerHTML = '';
        status.textContent = `Uploading ${files.length} images...`;
        status.style.color = '';
        uploads.gallery = [];

        files.forEach((file, index) => {
          // Show Local Preview
          const img = document.createElement('img');
          img.className = 'preview-thumbnail';
          img.style.display = 'block';
          img.src = URL.createObjectURL(file);
          container.appendChild(img);

          const path = `gallery/${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const ref = storage.ref().child(path);

          const uploadTask = ref.put(file).then(snapshot => snapshot.ref.getDownloadURL().then(url => {
            return { url, storagePath: path, caption: file.name.substring(0, file.name.lastIndexOf('.')), altText: file.name };
          })).catch(err => {
            console.error(err);
            return null;
          });

          uploads.gallery.push(uploadTask);
        });

        Promise.all(uploads.gallery).then(results => {
          const successCount = results.filter(Boolean).length;
          status.textContent = `✓ Uploaded ${successCount}/${files.length} images successfully!`;
          status.style.color = '#16a34a';
        });
      });
    }

    // Render Summary inside Step 8
    function renderSummary() {
      const summaryContainer = document.getElementById('step-8-summary-container');
      if (!summaryContainer) return;

      const name = document.getElementById('bname') ? document.getElementById('bname').value.trim() : '';
      const catSelect = document.getElementById('bcat');
      const category = catSelect ? catSelect.options[catSelect.selectedIndex]?.text || '' : '';
      const desc = document.getElementById('bdesc') ? document.getElementById('bdesc').value.trim() : '';
      const phone = document.getElementById('bphone') ? document.getElementById('bphone').value.trim() : '';
      const whatsapp = document.getElementById('bwa') ? document.getElementById('bwa').value.trim() : '';
      const email = document.getElementById('bemail') ? document.getElementById('bemail').value.trim() : '';
      const website = document.getElementById('bweb') ? document.getElementById('bweb').value.trim() : '';
      
      const distSelect = document.getElementById('bdist');
      const districtId = distSelect ? distSelect.value : '';
      const townSelect = document.getElementById('btown');
      const townId = townSelect ? townSelect.value : '';
      const address = document.getElementById('baddress') ? document.getElementById('baddress').value.trim() : '';
      
      const serviceNames = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.getAttribute('data-name') || el.value);
      const serviceTowns = Array.from(document.querySelectorAll('input[name="service_towns"]:checked')).map(el => el.value);

      // logo/cover thumbnails check
      const logoImg = document.getElementById('logo-preview-img');
      const hasLogo = (logoImg && logoImg.src && logoImg.style.display !== 'none') || (importedData && importedData.photos && importedData.photos.length > 0);
      const coverImg = document.getElementById('cover-preview-img');
      const hasCover = (coverImg && coverImg.src && coverImg.style.display !== 'none') || (importedData && importedData.photos && importedData.photos.length > 1);

      // get hours count
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      let hoursCount = 0;
      days.forEach(day => {
        const row = document.querySelector(`.hours-row[data-day="${day}"]`);
        if (row) {
          const closed = row.querySelector('.hour-closed')?.checked;
          if (!closed) hoursCount++;
        }
      });

      let html = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Section 1 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: var(--primary);">Business Information</strong>
              <div style="margin-top: 4px;">Name: ${name || 'N/A'}</div>
              <div>Category: ${category || 'N/A'}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${desc || 'No description entered.'}</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="1" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 2 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--primary);">Branding & Photos</strong>
              <div style="margin-top: 4px;">Logo: ${hasLogo ? '✅ Selected' : '❌ Missing'} | Cover: ${hasCover ? '✅ Selected' : '❌ Missing'}</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="2" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 3 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: var(--primary);">Primary Location</strong>
              <div style="margin-top: 4px;">District: ${districtId ? districtId.toUpperCase() : 'N/A'}</div>
              <div>Town: ${townId ? townId : 'N/A'}</div>
              <div style="font-size: 12px; color: var(--text-muted);">${address || 'No physical address.'}</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="3" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 4 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: var(--primary);">Services</strong>
              <div style="margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${serviceNames.join(', ') || 'No services checked.'}</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="4" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 5 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: var(--primary);">Service Areas</strong>
              <div style="margin-top: 4px;">Serving: ${serviceTowns.length} towns</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="5" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 6 -->
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="color: var(--primary);">Contact Info</strong>
              <div style="margin-top: 4px;">Phone: ${phone || 'N/A'} | WhatsApp: ${whatsapp || 'N/A'}</div>
              <div>Email: ${email || 'N/A'} | Web: ${website || 'N/A'}</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="6" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>

          <!-- Section 7 -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="color: var(--primary);">Business Hours</strong>
              <div style="margin-top: 4px;">Open ${hoursCount} days a week</div>
            </div>
            <button type="button" class="btn-edit-step" data-target="7" style="color: var(--primary); background: none; border: none; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0;">Edit</button>
          </div>
        </div>
      `;

      summaryContainer.innerHTML = html;

      // Add listeners to edit buttons
      summaryContainer.querySelectorAll('.btn-edit-step').forEach(btn => {
        btn.addEventListener('click', () => {
          const step = parseInt(btn.getAttribute('data-target'));
          currentStep = step;
          showStep(currentStep);
        });
      });
    }

    // Step Wizard Navigation Logic
    function showStep(step) {
      document.querySelectorAll('.wizard-step-content').forEach(el => el.classList.remove('active'));
      const targetStepContent = document.getElementById(`step-${step}-content`);
      if (targetStepContent) targetStepContent.classList.add('active');

      document.querySelectorAll('.step-indicator').forEach(el => {
        const indicatorStep = parseInt(el.getAttribute('data-step'));
        if (indicatorStep <= step) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      if (step === 0) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      } else if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Next ➔';
        nextBtn.style.background = '';
      } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Next ➔';
        nextBtn.style.background = '';
      }

      if (step === totalSteps) {
        renderSummary(); // Populate summary panel in Step 8 Confirm
        nextBtn.textContent = 'Submit Application';
        nextBtn.style.background = 'var(--primary)';
      }

      // Scroll to form header
      const formBox = document.querySelector('.lead-form-box');
      if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(step) {
      if (step === 0) return true; // Step 0 has its own button handlers
      const container = document.getElementById(`step-${step}-content`);
      if (!container) return true;
      const requiredInputs = container.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
          input.reportValidity();
          isValid = false;
        }
      });

      // Special verification for step 4: Services selection
      if (step === 4 && isValid) {
        const checkedServices = container.querySelectorAll('input[name="services"]:checked');
        if (checkedServices.length === 0) {
          alert('Please check at least one of the services you offer.');
          isValid = false;
        }
      }

      // Special verification for step 6: Contact numbers
      if (step === 6 && isValid) {
        const phoneInput = document.getElementById('bphone');
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const whatsappInput = document.getElementById('bwa');
        const whatsapp = whatsappInput ? whatsappInput.value.trim() : '';
        if (phone.length !== 10 || isNaN(phone)) {
          alert('Please enter a valid 10-digit direct phone number.');
          isValid = false;
        } else if (whatsapp.length !== 10 || isNaN(whatsapp)) {
          alert('Please enter a valid 10-digit WhatsApp number.');
          isValid = false;
        }
      }

      return isValid;
    }

    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
        } else {
          // Submit the Form!
          submitWizardForm();
        }
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });

    // Handle direct step indicators click
    document.querySelectorAll('.step-indicator').forEach(el => {
      el.addEventListener('click', () => {
        const targetStep = parseInt(el.getAttribute('data-step'));
        if (targetStep < currentStep) {
          // Let them go backwards freely
          currentStep = targetStep;
          showStep(currentStep);
        } else if (targetStep > currentStep) {
          // Validate intermediate steps before jumping forward
          let canJump = true;
          for (let i = currentStep; i < targetStep; i++) {
            if (!validateStep(i)) {
              currentStep = i;
              showStep(currentStep);
              canJump = false;
              break;
            }
          }
          if (canJump) {
            currentStep = targetStep;
            showStep(currentStep);
          }
        }
      });
    });

    const withTimeout = (promise, ms = 8000) => {
      let id;
      const timeoutPromise = new Promise((resolve) => {
        id = setTimeout(() => {
          console.warn(`Promise timed-out after ${ms}ms`);
          resolve(null);
        }, ms);
      });
      return Promise.race([
        promise.then(val => { clearTimeout(id); return val; }),
        timeoutPromise
      ]);
    };

    async function submitWizardForm() {
      // Show loading screen status
      nextBtn.disabled = true;
      prevBtn.disabled = true;
      nextBtn.textContent = 'Uploading files...';

      statusMsg.style.display = 'none';
      statusMsg.className = 'alert-box';
      statusMsg.textContent = '';

      try {
        // 1. Resolve Background Uploads (using timeouts to prevent hanging)
        let logoData = null;
        let coverData = null;
        let galleryData = [];

        // Helper to download Google Place Photo via proxy and upload to Firebase
        const downloadAndUploadGooglePhoto = async (photoName, folderName) => {
          try {
            const res = await withTimeout(fetch(`/api/places-photo?name=${encodeURIComponent(photoName)}`), 8000);
            if (!res || !res.ok) return null;
            const blob = await res.blob();
            const filename = `google_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
            const path = `${folderName}/${filename}`;
            const ref = storage.ref().child(path);
            const snapshot = await ref.put(blob);
            const url = await snapshot.ref.getDownloadURL();
            return { url, storagePath: path, altText: bname };
          } catch(e) {
            console.error('Failed to import Google photo:', photoName, e);
            return null;
          }
        };

        const bname = document.getElementById('bname') ? document.getElementById('bname').value.trim() : '';

        if (importedData && importedData.photos && importedData.photos.length > 0) {
          nextBtn.textContent = 'Importing Google photos...';
          
          // Logo resolver
          if (uploads.logo) {
            logoData = await withTimeout(uploads.logo, 8000);
          } else if (logoInput && logoInput.files && logoInput.files[0]) {
            logoData = await withTimeout(uploadFileSync(logoInput.files[0], 'logos'), 8000);
          } else {
            logoData = await downloadAndUploadGooglePhoto(importedData.photos[0], 'logos');
          }

          // Cover resolver
          if (uploads.cover) {
            coverData = await withTimeout(uploads.cover, 8000);
          } else if (coverInput && coverInput.files && coverInput.files[0]) {
            coverData = await withTimeout(uploadFileSync(coverInput.files[0], 'covers'), 8000);
          } else if (importedData.photos.length > 1) {
            coverData = await downloadAndUploadGooglePhoto(importedData.photos[1], 'covers');
          }

          // Gallery resolver
          let manualGallery = [];
          if (uploads.gallery && uploads.gallery.length > 0) {
            const galleryPromises = uploads.gallery.map(p => withTimeout(p, 8000));
            const resolvedGallery = await Promise.all(galleryPromises);
            manualGallery = resolvedGallery.filter(Boolean);
          }
          
          let googleGallery = [];
          const googlePhotoTargets = importedData.photos.slice(2);
          if (googlePhotoTargets.length > 0) {
            const googlePromises = googlePhotoTargets.map(photo => downloadAndUploadGooglePhoto(photo, 'gallery'));
            const resolvedGoogle = await Promise.all(googlePromises);
            googleGallery = resolvedGoogle.filter(Boolean);
          }
          galleryData = [...manualGallery, ...googleGallery];

        } else {
          // Standard upload flow
          if (uploads.logo) {
            logoData = await withTimeout(uploads.logo, 8000);
          } else if (logoInput && logoInput.files && logoInput.files[0]) {
            logoData = await withTimeout(uploadFileSync(logoInput.files[0], 'logos'), 8000);
          }

          if (uploads.cover) {
            coverData = await withTimeout(uploads.cover, 8000);
          } else if (coverInput && coverInput.files && coverInput.files[0]) {
            coverData = await withTimeout(uploadFileSync(coverInput.files[0], 'covers'), 8000);
          }

          if (uploads.gallery && uploads.gallery.length > 0) {
            const galleryPromises = uploads.gallery.map(p => withTimeout(p, 8000));
            const resolvedGallery = await Promise.all(galleryPromises);
            galleryData = resolvedGallery.filter(Boolean);
          }
        }

        nextBtn.textContent = 'Writing to Firestore...';

        // 2. Gather form inputs
        const districtId = distSelect ? distSelect.value : '';
        const townId = townSelect ? townSelect.value : '';
        const areaIds = Array.from(document.querySelectorAll('input[name="local_areas"]:checked')).map(el => el.value);

        const categoryId = catSelect ? catSelect.value : '';
        const serviceIds = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.value);
        const serviceNames = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(el => el.getAttribute('data-name'));

        const serviceDistricts = Array.from(document.querySelectorAll('input[name="service_districts"]:checked')).map(el => el.value);
        const serviceTowns = Array.from(document.querySelectorAll('input[name="service_towns"]:checked')).map(el => el.value);

        const phone = document.getElementById('bphone') ? document.getElementById('bphone').value.trim() : '';
        const whatsapp = document.getElementById('bwa') ? document.getElementById('bwa').value.trim() : '';
        const email = document.getElementById('bemail') ? document.getElementById('bemail').value.trim() : '';
        const website = document.getElementById('bweb') ? document.getElementById('bweb').value.trim() : '';

        // 3. Structured hours gathering
        const hoursObj = {};
        document.querySelectorAll('.hours-row').forEach(row => {
          const day = row.getAttribute('data-day');
          const closedEl = row.querySelector('.hour-closed');
          const is24hEl = row.querySelector('.hour-24h');
          const isClosed = closedEl ? closedEl.checked : false;
          const is24h = is24hEl ? is24hEl.checked : false;
          const times = row.querySelectorAll('input[type="time"]');

          hoursObj[day] = {
            closed: isClosed,
            open: !isClosed,
            open24Hours: is24h,
            openTime: (isClosed || is24h || !times[0]) ? '' : times[0].value,
            closeTime: (isClosed || is24h || !times[1]) ? '' : times[1].value
          };
        });

        // 4. Calculate Completeness Score
        let score = 0;
        if (bname) score += 10;
        if (categoryId) score += 10;
        
        const shortDescText = document.getElementById('bshortdesc') ? document.getElementById('bshortdesc').value.trim() : '';
        const descText = document.getElementById('bdesc') ? document.getElementById('bdesc').value.trim() : '';
        if (shortDescText && descText) score += 15;
        
        if (districtId && townId) score += 10;
        
        const addressText = document.getElementById('baddress') ? document.getElementById('baddress').value.trim() : '';
        const pincodeText = document.getElementById('bpincode') ? document.getElementById('bpincode').value.trim() : '';
        if (addressText && pincodeText) score += 10;
        
        if (phone && whatsapp && email) score += 15;
        if (logoData || coverData) score += 10;
        if (Object.keys(hoursObj).length > 0) score += 10;
        if (serviceIds.length > 0) score += 10;

        // Safely resolve primary town name
        let primaryTownName = '';
        if (districtId && townId && activeConfig.towns && activeConfig.towns[districtId]) {
          const foundTown = activeConfig.towns[districtId].find(t => t.id === townId);
          if (foundTown) {
            primaryTownName = foundTown.name;
          }
        }
        if (!primaryTownName) {
          primaryTownName = townId || '';
        }

        const requestedServiceField = document.getElementById('requested-custom-service');
        const requestedCustomService = (customServiceChk && customServiceChk.checked && requestedServiceField) ? requestedServiceField.value.trim() : '';

        // 5. Package Document Object (Mirroring Upgraded Schema)
        const dataToSave = {
          name: bname,
          listingTier: 'regular',
          category: categoryId,
          website: website,
          district: districtId ? districtId.charAt(0).toUpperCase() + districtId.slice(1) : '',
          towns: primaryTownName,
          phone: phone,
          whatsapp: whatsapp,
          email: email,
          description: descText,
          
          servicesOffered: serviceNames.join('\n'), 
          whyChooseUs: document.getElementById('bwhychoose') ? document.getElementById('bwhychoose').value.trim() : '',
          address: addressText,
          mapUrl: document.getElementById('bmap') ? document.getElementById('bmap').value.trim() : '',

          categoryId: categoryId,
          serviceIds: serviceIds,
          shortDescription: shortDescText,
          establishedYear: (document.getElementById('bestablished') && document.getElementById('bestablished').value.trim()) ? parseInt(document.getElementById('bestablished').value.trim(), 10) : null,
          
          logo: logoData,
          coverImage: coverData,
          gallery: galleryData,

          districtId: districtId,
          townId: townId,
          areaIds: areaIds,

          serviceAreas: {
            districtIds: serviceDistricts,
            townIds: serviceTowns
          },

          hours: hoursObj,
          
          socials: {
            facebook: document.getElementById('bsocfb') ? document.getElementById('bsocfb').value.trim() : '',
            instagram: document.getElementById('bsocig') ? document.getElementById('bsocig').value.trim() : '',
            linkedin: document.getElementById('bsocln') ? document.getElementById('bsocln').value.trim() : ''
          },

          locationDetails: {
            physicalAddress: addressText,
            pincode: pincodeText,
            googleMapsUrl: document.getElementById('bmap') ? document.getElementById('bmap').value.trim() : ''
          },

          // Google Place import metadata
          googlePlaceId: (importedData && importedData.googlePlaceId) ? importedData.googlePlaceId : '',
          googleMapsUrl: (importedData && importedData.googleMapsUrl) ? importedData.googleMapsUrl : '',
          googleImportedAt: (importedData && importedData.googlePlaceId) ? new Date().toISOString() : '',
          googleDataSource: (importedData && importedData.source) ? importedData.source : '',

          // Custom Service request suggestion
          requestedServices: requestedCustomService,

          status: 'pending',
          completenessScore: score,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 6. Write to Firestore
        db.collection('listings').add(dataToSave)
          .then(() => {
            if (typeof pushAnalyticsEvent === 'function') {
              pushAnalyticsEvent('business_listing_submit', {
                category: dataToSave.category || '',
                district: dataToSave.district || '',
                town: dataToSave.towns || ''
              });
            }
            listingForm.style.display = 'none';

            // Hide the lead-form-box headers/descriptions to cleanly show the thank-you screen
            const leadFormBox = document.querySelector('.lead-form-box');
            if (leadFormBox) {
              const h3 = leadFormBox.querySelector('h3');
              const p = leadFormBox.querySelector('p');
              if (h3) h3.style.display = 'none';
              if (p) p.style.display = 'none';
            }

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
            if (customServiceChk) {
              customServiceChk.checked = false;
              customServiceChk.dispatchEvent(new Event('change'));
            }
            statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          })
          .catch((error) => {
            console.error('Error adding document to database: ', error);
            showSubmitError();
          });

      } catch (err) {
        console.error('Submission prep failed: ', err);
        showSubmitError();
      }
    }

    function showSubmitError() {
      statusMsg.textContent = 'Error: We could not submit your application. Please check your internet connection or verify your Firebase configuration.';
      statusMsg.classList.add('alert-error');
      statusMsg.style.display = 'block';
      nextBtn.disabled = false;
      prevBtn.disabled = false;
      nextBtn.textContent = 'Submit Application';
    }

    async function uploadFileSync(file, folder) {
      if (!file) return null;
      try {
        const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const ref = storage.ref().child(path);
        const snapshot = await ref.put(file);
        const url = await snapshot.ref.getDownloadURL();
        return { url, storagePath: path, altText: file.name };
      } catch (err) {
        console.error(`Sync upload failed for ${file.name}:`, err);
        return null;
      }
    }

  });
} else {
  console.error('Firebase SDK not loaded. Please verify the CDN links inside the head tag.');
}
