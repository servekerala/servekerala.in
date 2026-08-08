// ==========================================================
// SERVEKERALA.IN – AUTO MITHRAM LOADER & SEARCH
// ==========================================================

var db = null;

const firebaseConfig = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

// --- FALLBACK DRIVERS (Pre-populated to guarantee instant rendering even if Firestore is slow/offline) ---
const FALLBACK_DRIVERS = [
  {
    id: "UHLl0ZEH7ZtFS0kjWgsB",
    driverName: "Ramesh Kumar",
    vehicleNumber: "KL-33-M-1234",
    phone: "9876543210",
    whatsapp: "9876543210",
    district: "kottayam",
    town: "Changanacherry",
    locality: "Railway Station",
    autoStand: "Changanacherry Railway Station",
    standLocation: "Changanacherry Railway Station, Railway Station, Changanacherry",
    availableHours: "6:00 AM - 9:00 PM",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  },
  {
    id: "lM6RzNi3okvkaCqQ3d8J",
    driverName: "Rajesh",
    vehicleNumber: "KL-25-B-8992",
    phone: "7012868664",
    whatsapp: "7012868664",
    district: "kollam",
    town: "Punalur",
    locality: "Punalur",
    autoStand: "KSRTC Bus Stand",
    standLocation: "Chemmanthur, Railwaystation, KSRTC Bus Stand, Market, Poyyaniyil Hospital, Punalur",
    availableHours: "8:00 AM - 8:00 PM",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  },
  {
    id: "5enl9wj9bImdKloZ2hPS",
    driverName: "Shinoy Thomas",
    vehicleNumber: "KL-27-C-4589",
    phone: "9447123456",
    whatsapp: "9447123456",
    district: "pathanamthitta",
    town: "Thiruvalla",
    locality: "KSRTC Stand",
    autoStand: "Thiruvalla KSRTC Stand",
    standLocation: "Thiruvalla KSRTC Bus Stand, Thiruvalla",
    availableHours: "24 Hours Service",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  },
  {
    id: "fb_driver_4",
    driverName: "Anil Kumar",
    vehicleNumber: "KL-04-A-7711",
    phone: "9847055443",
    whatsapp: "9847055443",
    district: "alappuzha",
    town: "Alappuzha",
    locality: "Railway Station",
    autoStand: "Alappuzha Railway Station Stand",
    standLocation: "Alappuzha Railway Station Stand, Alappuzha",
    availableHours: "6:00 AM - 10:00 PM",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  },
  {
    id: "fb_driver_5",
    driverName: "Vijayan Pillai",
    vehicleNumber: "KL-02-D-3344",
    phone: "9400112233",
    whatsapp: "9400112233",
    district: "kollam",
    town: "Kollam",
    locality: "District Hospital",
    autoStand: "Kollam District Hospital Stand",
    standLocation: "Kollam District Hospital Stand, Kollam",
    availableHours: "7:00 AM - 9:00 PM",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  },
  {
    id: "fb_driver_6",
    driverName: "Mathew Joseph",
    vehicleNumber: "KL-05-F-9012",
    phone: "9745112244",
    whatsapp: "9745112244",
    district: "kottayam",
    town: "Kottayam",
    locality: "Medical College",
    autoStand: "Kottayam Medical College Stand",
    standLocation: "Kottayam Medical College Stand, Kottayam",
    availableHours: "24 Hours Service",
    availability: "online",
    status: "approved",
    pinCode: "123456"
  }
];

let allDrivers = [];
let currentFilter = {
  search: "",
  district: "all",
  stand: "all"
};

// Driver Portal active session driver object reference
let activeSessionDriver = null;

function getDb() {
  if (db) return db;
  if (typeof window !== 'undefined' && typeof window.firebase !== 'undefined' && window.firebase.apps) {
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      db = window.firebase.firestore();
    } catch (err) {
      console.error("Firebase initialization failed:", err);
    }
  }
  return db;
}

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

    const vehicleInput = document.getElementById('portal-edit-vehicle');
    if (vehicleInput) {
        vehicleInput.addEventListener('input', function(e) {
            let cursor = this.selectionStart;
            let oldLength = this.value.length;
            this.value = formatVehicleNumber(this.value);
            let newLength = this.value.length;
            this.setSelectionRange(cursor + (newLength - oldLength), cursor + (newLength - oldLength));
        });
    }

  const container = document.getElementById('auto-mithram-container');
  if (!container) return;

  // Set up elements
  const searchInput = document.getElementById('auto-search-input');
  const districtSelect = document.getElementById('district-select');
  const standSelect = document.getElementById('stand-select');
  const activeFiltersContainer = document.getElementById('active-filters');
  const totalCountEl = document.getElementById('total-count');

  function normalizeDrivers(driversList) {
    return driversList.map(d => {
      const parts = (d.standLocation || "").split(',').map(s => s.trim());
      return {
        ...d,
        town: d.town || parts[2] || parts[1] || "",
        locality: d.locality || parts[1] || "",
        autoStand: d.autoStand || parts[0] || "",
        rating: d.rating || (4.5 + Math.random() * 0.5).toFixed(1),
        trips: d.trips || Math.floor(50 + Math.random() * 400),
        avatarSeed: d.avatarSeed || (d.driverName ? d.driverName.toLowerCase().split(' ')[0] : 'driver'),
        availability: d.availability || 'online'
      };
    });
  }

  let activeTowns = [];
  let activeLocalities = [];
  let globalAutoConfig = {};

  function populatePortalDropdowns() {}

  function setupDynamicPortalDropdowns(district, selectedTown, selectedLocality) {
    const portalEditTown = document.getElementById('portal-edit-town');
    const portalEditLocality = document.getElementById('portal-edit-locality');
    
    if (!portalEditTown || !portalEditLocality) return;
    
    const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (district || '').toLowerCase());
    
    function updateTowns() {
      portalEditTown.innerHTML = '<option value="">Select Town</option>';
      if (distKey && globalAutoConfig[distKey]) {
        const towns = Object.keys(globalAutoConfig[distKey]);
        portalEditTown.innerHTML += towns.map(t => `<option value="${t}">${t}</option>`).join('');
      }
    }
    
    function updateLocalities() {
      const townVal = portalEditTown.value;
      portalEditLocality.innerHTML = '<option value="">Select Locality</option>';
      if (distKey && townVal && globalAutoConfig[distKey] && globalAutoConfig[distKey][townVal]) {
        const locs = globalAutoConfig[distKey][townVal];
        portalEditLocality.innerHTML += locs.map(l => `<option value="${l}">${l}</option>`).join('');
      }
    }
    
    if (!portalEditTown.hasAttribute('data-bound')) {
      portalEditTown.setAttribute('data-bound', 'true');
      portalEditTown.addEventListener('change', updateLocalities);
    }
    
    updateTowns();
    if (selectedTown) {
      if (!Array.from(portalEditTown.options).some(opt => opt.value === selectedTown)) {
         portalEditTown.innerHTML += `<option value="${selectedTown}">${selectedTown}</option>`;
      }
      portalEditTown.value = selectedTown;
    }
    
    updateLocalities();
    if (selectedLocality) {
      if (!Array.from(portalEditLocality.options).some(opt => opt.value === selectedLocality)) {
         portalEditLocality.innerHTML += `<option value="${selectedLocality}">${selectedLocality}</option>`;
      }
      portalEditLocality.value = selectedLocality;
    }
  }

  let isInitialized = false;

  function safeInitializeWithDrivers(driversList) {
    allDrivers = normalizeDrivers(driversList);
    allDrivers.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    if (!isInitialized) {
      isInitialized = true;
      initializeDirectory();
    } else {
      populateStands();
      filterAndRender();
    }
  }

  // Set short 300ms timeout for Firestore load to ensure fast initial rendering
  const fetchTimeout = setTimeout(() => {
    if (!isInitialized) {
      safeInitializeWithDrivers([...FALLBACK_DRIVERS]);
    }
  }, 300);

  const activeDb = getDb();
  if (activeDb) {
    activeDb.collection('auto_mithram')
      .where('status', '==', 'approved')
      .get()
      .then((querySnapshot) => {
        clearTimeout(fetchTimeout);
        const tempDrivers = [];
        querySnapshot.forEach(doc => {
          tempDrivers.push({ id: doc.id, ...doc.data() });
        });
        if (tempDrivers.length > 0) {
          safeInitializeWithDrivers(tempDrivers);
        } else {
          safeInitializeWithDrivers([...FALLBACK_DRIVERS]);
        }
      })
      .catch((error) => {
        clearTimeout(fetchTimeout);
        console.error("Firestore retrieval error, falling back to local database:", error);
        safeInitializeWithDrivers([...FALLBACK_DRIVERS]);
      });
  } else {
    clearTimeout(fetchTimeout);
    safeInitializeWithDrivers([...FALLBACK_DRIVERS]);
  }

  function initializeDirectory() {
    try {
      populateStands();
      
      if (searchInput && !searchInput.hasAttribute('data-bound')) {
        searchInput.setAttribute('data-bound', 'true');
        searchInput.addEventListener('input', (e) => {
          currentFilter.search = e.target.value.toLowerCase().trim();
          filterAndRender();
        });
      }

      if (districtSelect && !districtSelect.hasAttribute('data-bound')) {
        districtSelect.setAttribute('data-bound', 'true');
        districtSelect.addEventListener('change', (e) => {
          currentFilter.district = e.target.value;
          populateStands();
          currentFilter.stand = "all";
          if (standSelect) standSelect.value = "all";
          filterAndRender();
        });
      }

      if (standSelect && !standSelect.hasAttribute('data-bound')) {
        standSelect.setAttribute('data-bound', 'true');
        standSelect.addEventListener('change', (e) => {
          currentFilter.stand = e.target.value;
          filterAndRender();
        });
      }
    } catch (err) {
      console.error("Filter binding error:", err);
    }

    // Initial render - ALWAYS execute
    filterAndRender();

    try {
      if (typeof window.initLeafletMap === 'function') {
        window.initLeafletMap();
      }
      setupDriverPortal();
    } catch (err) {
      console.error("Map/Portal init error:", err);
    }
  }

  function populateStands() {
    if (!standSelect) return;
    
    standSelect.innerHTML = '<option value="all">All Auto Stands</option>';
    
    const uniqueStands = new Set();
    allDrivers.forEach(d => {
      if (currentFilter.district === 'all' || d.district === currentFilter.district) {
        const standName = (d.autoStand || d.standLocation || '').split(',')[0].trim();
        if (standName) uniqueStands.add(standName);
      }
    });

    Array.from(uniqueStands).sort().forEach(stand => {
      const option = document.createElement('option');
      option.value = stand.toLowerCase().trim();
      option.textContent = stand;
      standSelect.appendChild(option);
    });
  }

  function filterAndRender() {
    const filtered = allDrivers.filter(driver => {
      // 1. Search filter
      const searchQ = (currentFilter.search || '').toLowerCase();
      const matchesSearch = !searchQ || 
        (driver.driverName || '').toLowerCase().includes(searchQ) ||
        (driver.vehicleNumber || '').toLowerCase().includes(searchQ) ||
        (driver.standLocation || '').toLowerCase().includes(searchQ) ||
        (driver.autoStand || '').toLowerCase().includes(searchQ) ||
        (driver.town || '').toLowerCase().includes(searchQ) ||
        (driver.locality || '').toLowerCase().includes(searchQ) ||
        (driver.district || '').toLowerCase().includes(searchQ) ||
        (driver.phone || '').includes(searchQ) ||
        (driver.availability || '').toLowerCase().includes(searchQ);

      // 2. District filter
      const matchesDistrict = currentFilter.district === 'all' || 
        (driver.district || '').toLowerCase() === currentFilter.district.toLowerCase();

      // 3. Stand filter
      const matchesStand = currentFilter.stand === 'all' || 
        (driver.standLocation || '').toLowerCase().includes(currentFilter.stand) ||
        (driver.autoStand || '').toLowerCase().includes(currentFilter.stand);

      return matchesSearch && matchesDistrict && matchesStand;
    });

    renderDrivers(filtered);
    updateActiveFiltersUI();
    updateMapPinsState(filtered);
    
    if (totalCountEl) {
      const activeAutosCount = filtered.filter(d => d.availability !== 'offline').length;
      totalCountEl.textContent = `${activeAutosCount} active auto${activeAutosCount === 1 ? '' : 's'}`;
    }
  }

  function renderDrivers(drivers) {
    container.innerHTML = '';

    if (drivers.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 60px 20px; background: #fff; border-radius: 20px; grid-column: 1 / -1; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
          <img src="/assets/images/kerala-auto-pin.png" alt="Auto Mithram" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 16px; display: inline-block; filter: drop-shadow(0 6px 12px rgba(6, 78, 59, 0.1));">
          <h3 style="font-size: 22px; font-weight: 800; color: var(--primary); margin-bottom: 8px;">No Auto Drivers Found</h3>
          <p style="color: var(--text-muted); margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto;">Try adjusting your filters or search keywords to find drivers in another area.</p>
          <button id="btn-reset-filters" class="btn btn-outline" style="border-radius: 999px;">Clear All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (districtSelect) districtSelect.value = 'all';
          if (standSelect) standSelect.value = 'all';
          currentFilter = { search: "", district: "all", stand: "all" };
          populateStands();
          filterAndRender();
        });
      }
      return;
    }

    if (typeof trackAutoClick === 'function' && !window.autoViewTrackerSet) {
      window.autoViewTrackerSet = new Set();
      window.autoViewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const docId = entry.target.getAttribute('data-id');
            if (docId && !window.autoViewTrackerSet.has(docId)) {
              window.autoViewTrackerSet.add(docId);
              trackAutoClick(docId, 'view');
            }
            window.autoViewObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
    }

    drivers.forEach((auto) => {
      const card = document.createElement('div');
      card.className = 'driver-card-premium';
      card.setAttribute('data-stand', (auto.standLocation || '').toLowerCase());
      
      let waLink = '';
      if (auto.whatsapp) {
        let waNumber = auto.whatsapp.replace(/\D/g, '');
        if (waNumber.length === 10) waNumber = '91' + waNumber;
        waLink = `
          <a href="https://wa.me/${waNumber}?text=Hi,%20I%20found%20your%20profile%20on%20Auto%20Mithram." target="_blank" class="btn-action btn-wa" title="Chat on WhatsApp" onclick="if(typeof trackAutoClick===\'function\') trackAutoClick(\'${auto.id}\', \'whatsapp\')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span>WhatsApp</span>
          </a>
        `;
      }

      const plateNum = (auto.vehicleNumber || 'KL-XX-0000').toUpperCase();
      const avatarColor = getHashColor(auto.driverName || 'Driver');
      const initials = (auto.driverName || 'Driver').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      const isOnline = auto.availability !== 'offline';
      
      const statusBadge = isOnline 
        ? `<div class="verified-badge-premium"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg> Verified</div>` 
        : `<div class="verified-badge-premium" style="background:#f3f4f6;color:#4b5563;"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Offline</div>`;

      card.innerHTML = `
        <div class="driver-card-header" style="${isOnline ? '' : 'opacity: 0.85;'}">
          <div class="driver-avatar" style="background: linear-gradient(135deg, ${avatarColor.start}, ${avatarColor.end}); box-shadow: 0 4px 12px ${avatarColor.end}40;">
            ${initials}
          </div>
          <div class="driver-info">
            <h3>${auto.driverName}</h3>
            ${statusBadge}
          </div>
        </div>
        
        <div class="vehicle-plate" style="${isOnline ? '' : 'opacity: 0.85;'}">🇮🇳 ${plateNum}</div>
        
        <div class="driver-meta" style="${isOnline ? '' : 'opacity: 0.85;'}">
          <div class="driver-meta-item" style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span><strong>Stand:</strong> ${auto.standLocation}</span>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(auto.standLocation + ' Auto Stand ' + (auto.town || 'Kerala'))}" target="_blank" rel="noopener" title="Open location in Google Maps" style="margin-left: 6px; font-size: 11px; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 6px; text-decoration: none; font-weight: 700; flex-shrink: 0; display: inline-flex; align-items: center; gap: 2px;">📍 Map</a>
          </div>
          <div class="driver-meta-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span><strong>Hours:</strong> ${auto.availableHours || 'Call for Availability'}</span>
          </div>
        </div>
        
        <div class="driver-actions" style="${isOnline ? '' : 'opacity: 0.6; pointer-events: none;'}">
          <a href="tel:${auto.phone}" class="btn-action btn-call" ${isOnline ? '' : 'style="pointer-events: none;"'} onclick="if(typeof trackAutoClick===\'function\') trackAutoClick(\'${auto.id}\', \'call\')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>Call</span>
          </a>
          ${waLink}
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        if (isOnline) highlightMapPinByStand(auto.standLocation, true);
      });
      card.addEventListener('mouseleave', () => {
        if (isOnline) highlightMapPinByStand(auto.standLocation, false);
      });

      if (window.autoViewObserver && auto.id) {
        card.setAttribute('data-id', auto.id);
        window.autoViewObserver.observe(card);
      }

      container.appendChild(card);
    });
  }

  function updateActiveFiltersUI() {
    if (!activeFiltersContainer) return;
    activeFiltersContainer.innerHTML = '';

    const createBadge = (text, type, value) => {
      const badge = document.createElement('span');
      badge.className = 'filter-badge';
      badge.innerHTML = `
        <span>${text}</span>
        <button class="remove-filter-btn" data-type="${type}" data-val="${value}">&times;</button>
      `;
      activeFiltersContainer.appendChild(badge);
    };

    if (currentFilter.search) {
      createBadge(`"${currentFilter.search}"`, 'search', '');
    }

    if (currentFilter.district !== 'all') {
      const name = currentFilter.district.charAt(0).toUpperCase() + currentFilter.district.slice(1);
      createBadge(name, 'district', 'all');
    }

    if (currentFilter.stand !== 'all') {
      const opt = Array.from(standSelect.options).find(o => o.value === currentFilter.stand);
      createBadge(opt ? opt.textContent : currentFilter.stand, 'stand', 'all');
    }

    document.querySelectorAll('.remove-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-type');
        if (type === 'search') {
          if (searchInput) searchInput.value = '';
          currentFilter.search = '';
        } else if (type === 'district') {
          if (districtSelect) districtSelect.value = 'all';
          currentFilter.district = 'all';
          populateStands();
        } else if (type === 'stand') {
          if (standSelect) standSelect.value = 'all';
          currentFilter.stand = 'all';
        }
        filterAndRender();
      });
    });
  }

  // --- LEAFLET INTERACTIVE MAP INTEGRATION ---
  let leafletMap = null;
  let leafletMarkerGroup = null;

  const TOWN_COORDINATES = {
    'thiruvalla': [9.3833, 76.5750],
    'tiruvalla': [9.3833, 76.5750],
    'adoor': [9.1526, 76.7356],
    'pathanamthitta': [9.2648, 76.7870],
    'kozhencherry': [9.3283, 76.6853],
    'pandalam': [9.2272, 76.6811],
    'ranni': [9.3867, 76.7836],
    'kottayam': [9.5916, 76.5222],
    'changanacherry': [9.4448, 76.5360],
    'changanassery': [9.4448, 76.5360],
    'ettumanoor': [9.6649, 76.5645],
    'pala': [9.7118, 76.6833],
    'vaikom': [9.7460, 76.3957],
    'alappuzha': [9.4981, 76.3388],
    'cherthala': [9.6841, 76.3392],
    'kayamkulam': [9.1729, 76.5002],
    'haripad': [9.2783, 76.4589],
    'mavelikkara': [9.2458, 76.5511],
    'kollam': [8.8932, 76.6141],
    'karunagappally': [9.0558, 76.5356],
    'kottarakkara': [9.0028, 76.7797],
    'punalur': [9.0143, 76.9249],
    'paravur': [8.8143, 76.6661]
  };

  const DISTRICT_COORDINATES = {
    'kottayam': [9.5916, 76.5222],
    'pathanamthitta': [9.2648, 76.7870],
    'alappuzha': [9.4981, 76.3388],
    'kollam': [8.8932, 76.6141]
  };

  function simpleStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  function getStandOffsetCoordinates(baseCoords, standName) {
    const hash = simpleStringHash(standName.toLowerCase());
    const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
    const radius = 0.004 + ((Math.abs(hash) % 12) * 0.0008);
    
    return [
      baseCoords[0] + (Math.sin(angle) * radius),
      baseCoords[1] + (Math.cos(angle) * radius)
    ];
  }

  window.initLeafletMap = function() {
    const mapContainer = document.getElementById('interactive-stand-map');
    if (!mapContainer || typeof L === 'undefined') return;
    
    if (leafletMap) {
      leafletMap.invalidateSize();
      if (allDrivers && allDrivers.length > 0) {
        updateMapPinsState(allDrivers);
      }
      return;
    }
    
    leafletMap = L.map('interactive-stand-map', { zoomControl: false }).setView([9.4000, 76.5000], 8);
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);
    
    leafletMarkerGroup = L.featureGroup().addTo(leafletMap);
    
    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 250);

    if (allDrivers && allDrivers.length > 0) {
      updateMapPinsState(allDrivers);
    }
  };

  function updateMapPinsState(filteredDrivers) {
    if (!leafletMap || !leafletMarkerGroup) return;

    leafletMarkerGroup.clearLayers();

    const standGroups = {};
    filteredDrivers.forEach(d => {
       if (d.availability === 'offline') return;
       
       const standText = `${d.standLocation || ''} ${d.autoStand || ''} ${d.town || ''}`.toLowerCase();
       let townKey = Object.keys(TOWN_COORDINATES).find(t => standText.includes(t));
       
       let baseCoords = townKey ? TOWN_COORDINATES[townKey] : null;
       if (!baseCoords && d.district && DISTRICT_COORDINATES[d.district.toLowerCase()]) {
         baseCoords = DISTRICT_COORDINATES[d.district.toLowerCase()];
       }
       if (!baseCoords) {
         baseCoords = [9.4000, 76.5000];
       }

       const fullStandName = d.autoStand || d.standLocation || d.town || 'Local Auto Stand';
       if (!standGroups[fullStandName]) {
           standGroups[fullStandName] = { count: 0, baseCoords: baseCoords, drivers: [] };
       }
       standGroups[fullStandName].count++;
       standGroups[fullStandName].drivers.push(d);
    });

    Object.keys(standGroups).forEach(standName => {
       const group = standGroups[standName];
       const coords = getStandOffsetCoordinates(group.baseCoords, standName);
       
       const iconHtml = `
         <div class="cute-map-pin-wrapper">
           <img src="/assets/images/cute-auto-pin.png" class="cute-auto-pin-img" alt="Auto" onError="this.onerror=null; this.src='/assets/images/kerala-auto-pin.png';">
           <span class="cute-pin-badge">${group.count}</span>
         </div>
       `;
       
       const customIcon = L.divIcon({
           className: 'cute-leaflet-icon',
           html: iconHtml,
           iconSize: [54, 60],
           iconAnchor: [27, 54],
           popupAnchor: [0, -50]
       });
       
       const popupHtml = `
         <div style="padding: 4px;">
           <div style="font-weight: 800; font-size: 14px; color: #064e3b; margin-bottom: 4px;">${standName}</div>
           <div style="font-size: 13px; font-weight: 600; color: #059669;">
             🛺 ${group.count} Available Auto${group.count > 1 ? 's' : ''}
           </div>
         </div>
       `;
       
       const marker = L.marker(coords, { icon: customIcon }).bindPopup(popupHtml);
       leafletMarkerGroup.addLayer(marker);
    });

    if (Object.keys(standGroups).length > 0) {
       try {
         leafletMap.flyToBounds(leafletMarkerGroup.getBounds(), { padding: [50, 50], maxZoom: 14, duration: 1.2 });
       } catch(e) {
         leafletMap.flyTo([9.4000, 76.5000], 8, { duration: 1.2 });
       }
    } else {
       leafletMap.flyTo([9.4000, 76.5000], 8, { duration: 1.2 });
    }

    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 300);
  }

  function highlightMapPinByStand(standLocation, isHighlighted) {}

  function getHashColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      { start: '#10b981', end: '#047857' },
      { start: '#3b82f6', end: '#1d4ed8' },
      { start: '#f59e0b', end: '#b45309' },
      { start: '#8b5cf6', end: '#6d28d9' },
      { start: '#ec4899', end: '#be185d' },
      { start: '#06b6d4', end: '#0891b2' }
    ];
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  }

  // --- ZERO-COST DRIVER PORTAL CONTROLLER ---
  function setupDriverPortal() {
    const btnPortal = document.getElementById('btn-driver-portal');
    const modal = document.getElementById('driver-portal-modal');
    const btnClose = document.getElementById('close-modal-btn');
    const loginForm = document.getElementById('portal-login-form');
    const dashboardArea = document.getElementById('portal-dashboard');
    const editForm = document.getElementById('portal-edit-form');
    const alertBox = document.getElementById('portal-alert');
    const logoutBtn = document.getElementById('logout-portal-btn');
    const availToggle = document.getElementById('portal-availability-toggle');
    const statusText = document.getElementById('status-desc-text');

    if (!btnPortal || !modal) return;

    btnPortal.addEventListener('click', () => {
      modal.style.display = 'flex';
      showAlert('', '', false);
      if (activeSessionDriver) {
        showDashboard();
      } else {
        showLogin();
      }
    });

    const closeModal = () => {
      modal.style.display = 'none';
    };
    if (btnClose) btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    function showAlert(text, type, show = true) {
      if (!alertBox) return;
      if (!show) {
        alertBox.style.display = 'none';
        return;
      }
      alertBox.textContent = text;
      alertBox.style.display = 'block';
      alertBox.style.background = type === 'success' ? '#e6fdf5' : '#fef2f2';
      alertBox.style.color = type === 'success' ? '#047857' : '#b91c1c';
      alertBox.style.border = type === 'success' ? '1px solid #a7f3d0' : '1px solid #fecaca';
    }

    function showLogin() {
      if (loginForm) loginForm.style.display = 'block';
      if (dashboardArea) dashboardArea.style.display = 'none';
    }

    function showDashboard() {
      if (loginForm) loginForm.style.display = 'none';
      if (dashboardArea) dashboardArea.style.display = 'block';

      if (document.getElementById('dashboard-stat-views')) {
        document.getElementById('dashboard-stat-views').textContent = activeSessionDriver.profileViews || 0;
      }
      if (document.getElementById('dashboard-stat-calls')) {
        document.getElementById('dashboard-stat-calls').textContent = activeSessionDriver.callClicks || 0;
      }
      if (document.getElementById('dashboard-stat-wa')) {
        document.getElementById('dashboard-stat-wa').textContent = activeSessionDriver.whatsappClicks || 0;
      }
      if (document.getElementById('dashboard-driver-name')) {
        document.getElementById('dashboard-driver-name').textContent = activeSessionDriver.driverName;
      }
      if (document.getElementById('dashboard-vehicle-num')) {
        document.getElementById('dashboard-vehicle-num').textContent = activeSessionDriver.vehicleNumber;
      }
      
      const avatarColor = getHashColor(activeSessionDriver.driverName);
      const initials = activeSessionDriver.driverName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const avatarEl = document.getElementById('dashboard-avatar');
      if (avatarEl) {
        avatarEl.style.background = `linear-gradient(135deg, ${avatarColor.start}, ${avatarColor.end})`;
        avatarEl.textContent = initials;
      }

      if (document.getElementById('portal-edit-phone')) document.getElementById('portal-edit-phone').value = activeSessionDriver.phone || '';
      if (document.getElementById('portal-edit-wa')) document.getElementById('portal-edit-wa').value = activeSessionDriver.whatsapp || '';
      
      const locationParts = (activeSessionDriver.standLocation || '').split(',').map(s => s.trim());
      const townVal = activeSessionDriver.town || locationParts[2] || locationParts[1] || '';
      const localityVal = activeSessionDriver.locality || locationParts[1] || '';
      
      setupDynamicPortalDropdowns(activeSessionDriver.district, townVal, localityVal);

      if (document.getElementById('portal-edit-stand')) document.getElementById('portal-edit-stand').value = activeSessionDriver.autoStand || locationParts[0] || '';
      
      const timeVal = activeSessionDriver.availableHours || '';
      const timeSelect = document.getElementById('portal-edit-time-select');
      const timeInput = document.getElementById('portal-edit-time');
      if (timeSelect && timeInput) {
        let matched = false;
        for (let i = 0; i < timeSelect.options.length; i++) {
          if (timeSelect.options[i].value === timeVal) {
            timeSelect.value = timeVal;
            matched = true;
            break;
          }
        }
        if (matched) {
          timeInput.style.display = 'none';
          timeInput.value = timeVal;
          timeInput.required = false;
        } else {
          timeSelect.value = 'custom';
          timeInput.style.display = 'block';
          timeInput.value = timeVal;
          timeInput.required = true;
        }
      } else if (timeInput) {
        timeInput.value = timeVal;
      }

      const isOnline = activeSessionDriver.availability !== 'offline';
      if (availToggle) availToggle.checked = isOnline;
      updateStatusLabelText(isOnline);
    }

    function updateStatusLabelText(isOnline) {
      if (!statusText) return;
      if (isOnline) {
        statusText.textContent = "You are currently Available (visible in stands).";
        statusText.style.color = '#059669';
      } else {
        statusText.textContent = "You are currently Offline / Idle (hidden/greyed out).";
        statusText.style.color = '#64748b';
      }
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showAlert('', '', false);

        const enteredPhone = document.getElementById('portal-login-phone').value.trim();
        const enteredPin = document.getElementById('portal-login-pin').value.trim();

        const cleanEnteredPhone = enteredPhone.replace(/\D/g, '');
        let foundDriver = allDrivers.find(d => {
          const cleanPhone = (d.phone || '').replace(/\D/g, '');
          const cleanWa = (d.whatsapp || '').replace(/\D/g, '');
          const phoneMatch = cleanPhone === cleanEnteredPhone || cleanWa === cleanEnteredPhone || 
                             cleanPhone.endsWith(cleanEnteredPhone) || cleanEnteredPhone.endsWith(cleanPhone);
          return phoneMatch && (d.pinCode === enteredPin || !d.pinCode);
        });

        if (!foundDriver) {
          const fallbackMatch = FALLBACK_DRIVERS.find(d => {
            const cleanPhone = (d.phone || '').replace(/\D/g, '');
            const cleanWa = (d.whatsapp || '').replace(/\D/g, '');
            const phoneMatch = cleanPhone === cleanEnteredPhone || cleanWa === cleanEnteredPhone || 
                               cleanPhone.endsWith(cleanEnteredPhone) || cleanEnteredPhone.endsWith(cleanPhone);
            return phoneMatch && (d.pinCode === enteredPin || !d.pinCode);
          });
          if (fallbackMatch) {
            foundDriver = { ...fallbackMatch };
            allDrivers.push(foundDriver);
          }
        }

        if (foundDriver) {
          activeSessionDriver = foundDriver;
          showDashboard();
          showAlert("Welcome back, " + foundDriver.driverName + "!", "success");
        } else {
          showAlert("Driver profile not found or PIN code is incorrect. Please check your credentials.", "error");
        }
      });
    }

    if (availToggle) {
      availToggle.addEventListener('change', (e) => {
        if (!activeSessionDriver) return;
        
        const isOnline = e.target.checked;
        const newStatus = isOnline ? 'online' : 'offline';
        
        activeSessionDriver.availability = newStatus;
        const localIdx = allDrivers.findIndex(d => d.id === activeSessionDriver.id);
        if (localIdx > -1) {
          allDrivers[localIdx].availability = newStatus;
        }

        updateStatusLabelText(isOnline);

        const activeDb = getDb();
        if (activeDb && !activeSessionDriver.id.startsWith('mock_') && !activeSessionDriver.id.startsWith('fb_')) {
          activeDb.collection('auto_mithram').doc(activeSessionDriver.id).update({
            availability: newStatus
          })
          .then(() => {
            showAlert("Status updated to " + (isOnline ? "Available" : "Offline") + " successfully!", "success");
            filterAndRender();
          })
          .catch(err => {
            console.error("Error updating availability status:", err);
            showAlert("Local status updated. Failed to save to database (check connection).", "error");
            filterAndRender();
          });
        } else {
          showAlert("Status updated to " + (isOnline ? "Available" : "Offline") + " (Local Simulation)!", "success");
          filterAndRender();
        }
      });
    }

    const timeSelect = document.getElementById('portal-edit-time-select');
    const timeInput = document.getElementById('portal-edit-time');
    if (timeSelect && timeInput) {
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

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeSessionDriver) return;
        showAlert('', '', false);

        const newPhone = document.getElementById('portal-edit-phone').value.trim();
        const newWa = document.getElementById('portal-edit-wa').value.trim();
        const newTown = document.getElementById('portal-edit-town').value.trim();
        const newLocality = document.getElementById('portal-edit-locality').value.trim();
        const newStand = document.getElementById('portal-edit-stand').value.trim();
        const newTime = document.getElementById('portal-edit-time').value.trim();

        const compiledLocation = `${newStand}, ${newLocality}, ${newTown}`;

        activeSessionDriver.phone = newPhone;
        activeSessionDriver.whatsapp = newWa;
        activeSessionDriver.town = newTown;
        activeSessionDriver.locality = newLocality;
        activeSessionDriver.autoStand = newStand;
        activeSessionDriver.standLocation = compiledLocation;
        activeSessionDriver.availableHours = newTime;

        const localIdx = allDrivers.findIndex(d => d.id === activeSessionDriver.id);
        if (localIdx > -1) {
          allDrivers[localIdx] = { ...allDrivers[localIdx], ...activeSessionDriver };
        }

        const activeDb = getDb();
        if (activeDb && !activeSessionDriver.id.startsWith('mock_') && !activeSessionDriver.id.startsWith('fb_')) {
          activeDb.collection('auto_mithram').doc(activeSessionDriver.id).update({
            phone: newPhone,
            whatsapp: newWa,
            town: newTown,
            locality: newLocality,
            autoStand: newStand,
            standLocation: compiledLocation,
            availableHours: newTime
          })
          .then(() => {
            showAlert("Your profile changes have been successfully saved!", "success");
            populateStands();
            filterAndRender();
          })
          .catch(err => {
            console.error("Error updating profile details:", err);
            showAlert("Profile saved locally. Error writing to database server.", "error");
            filterAndRender();
          });
        } else {
          showAlert("Profile changes saved locally (Local Simulation)!", "success");
          populateStands();
          filterAndRender();
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        activeSessionDriver = null;
        if (loginForm) loginForm.reset();
        showLogin();
        showAlert("Logged out successfully.", "success");
      });
    }
  }

  if (typeof window.initLeafletMap === 'function') {
    window.initLeafletMap();
  }
});
