// ==========================================================
// SERVEKERALA.IN – DYNAMIC CLIENT-SIDE SEARCH AUTOCOMPLETE & ROUTING
// ==========================================================

const initSearch = () => {
  // Comprehensive Directory Services & Destinations Index
  const servicesList = [
    { name: 'Solar Installation', path: '/services/solar-installation/', keywords: ['solar', 'panel', 'inverter', 'green energy'] },
    { name: 'Plumber & Plumbing', path: '/services/plumber/', keywords: ['plumber', 'pipe', 'leak', 'water fitting'] },
    { name: 'Electrician & Electrical Services', path: '/services/electrician/', keywords: ['electrician', 'wiring', 'fuse', 'power'] },
    { name: 'AC Service & Repair', path: '/services/ac-service/', keywords: ['ac', 'air conditioner', 'cooling', 'fridge'] },
    { name: 'CCTV Installation & Security', path: '/services/cctv-installation/', keywords: ['cctv', 'camera', 'security', 'surveillance'] },
    { name: 'Home Cleaning', path: '/services/home-cleaning/', keywords: ['cleaning', 'housekeeping', 'deep clean'] },
    { name: 'Pest Control', path: '/services/pest-control/', keywords: ['pest', 'termite', 'cockroach', 'disinfection'] },
    { name: 'Water Purifier Service', path: '/services/water-purifier-service/', keywords: ['water purifier', 'ro', 'filter', 'water filter'] },
    { name: 'Battery Shops & Dealers', path: '/services/', keywords: ['battery', 'inverter battery', 'car battery'] },
    { name: 'Fuel Stations & Petrol Pumps', path: '/services/', keywords: ['fuel', 'petrol', 'diesel', 'gas station'] },
    { name: 'Hotels & Accommodations', path: '/services/', keywords: ['hotel', 'resort', 'stay', 'lodge'] },
    { name: 'Restaurants & Dining', path: '/services/', keywords: ['restaurant', 'food', 'dining', 'bakery'] },
    { name: 'Hospitals & Medical Centers', path: '/services/', keywords: ['hospital', 'clinic', 'doctor', 'healthcare'] }
  ];

  // Specific Verified Business Profiles
  const businessList = [
    { name: 'Aqua Wellness (KYK Water Purifiers)', path: '/business/aquawellness/', keywords: ['aquawellness', 'aqua wellness', 'kyk', 'alkaline'] },
    { name: 'Battery House (Thiruvalla)', path: '/business/battery-house-thiruvalla/', keywords: ['battery house', 'battery house thiruvalla'] },
  ];

  // Complete Kerala Districts & Major Towns Index
  const locationsList = [
    { name: 'Pathanamthitta', type: 'district', path: '/pathanamthitta/solar-installation/' },
    { name: 'Thiruvalla', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/thiruvalla/' },
    { name: 'Adoor', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/adoor/' },
    { name: 'Ranni', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/ranni/' },
    { name: 'Pandalam', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/pandalam/' },
    { name: 'Kozhencherry', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/kozhencherry/' },
    { name: 'Konni', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/konni/' },
    
    { name: 'Kottayam', type: 'district', path: '/kottayam/solar-installation/' },
    { name: 'Changanacherry', type: 'town', district: 'Kottayam', path: '/kottayam/solar-installation/changanacherry/' },
    { name: 'Ettumanoor', type: 'town', district: 'Kottayam', path: '/kottayam/solar-installation/ettumanoor/' },
    { name: 'Pala', type: 'town', district: 'Kottayam', path: '/kottayam/solar-installation/pala/' },
    { name: 'Vaikom', type: 'town', district: 'Kottayam', path: '/kottayam/solar-installation/vaikom/' },

    { name: 'Alappuzha', type: 'district', path: '/alappuzha/solar-installation/' },
    { name: 'Cherthala', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/cherthala/' },
    { name: 'Haripad', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/haripad/' },
    { name: 'Kayamkulam', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/kayamkulam/' },
    { name: 'Mavelikkara', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/mavelikkara/' },

    { name: 'Kollam', type: 'district', path: '/kollam/solar-installation/' },
    { name: 'Karunagappally', type: 'town', district: 'Kollam', path: '/kollam/solar-installation/karunagappally/' },
    { name: 'Kottarakkara', type: 'town', district: 'Kollam', path: '/kollam/solar-installation/kottarakkara/' },
    { name: 'Punalur', type: 'town', district: 'Kollam', path: '/kollam/solar-installation/punalur/' },
    { name: 'Paravur', type: 'town', district: 'Kollam', path: '/kollam/solar-installation/paravur/' }
  ];

  // Combined Route Dispatcher logic
  function routeSearchQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    if (!q) return;

    if (typeof pushAnalyticsEvent === 'function') {
      const locationInputEl = document.getElementById('search-location');
      const locationVal = locationInputEl ? locationInputEl.value.trim() : '';
      pushAnalyticsEvent('search', {
        search_term: rawQuery,
        location: locationVal,
        category: ''
      });
    }

    // 1. Auto Rickshaw & Auto Mithram queries -> Dedicated Site
    if (['auto', 'autorickshaw', 'rickshaw', 'driver', 'auto mithram', 'mithram', 'auto stand'].some(k => q.includes(k))) {
      window.location.href = 'https://www.automithram.com/';
      return;
    }

    // 2. Specific Business Profile Matches
    const bMatch = businessList.find(b => b.keywords.some(k => q.includes(k)) || b.name.toLowerCase().includes(q));
    if (bMatch) {
      window.location.href = bMatch.path;
      return;
    }

    // 3. Exact or Partial Service Matches
    const sMatch = servicesList.find(s => s.name.toLowerCase() === q || s.keywords.some(k => q.includes(k)));
    if (sMatch) {
      window.location.href = sMatch.path;
      return;
    }

    // 4. Location Matches
    const lMatch = locationsList.find(l => l.name.toLowerCase() === q || q.includes(l.name.toLowerCase()));
    if (lMatch) {
      window.location.href = lMatch.path;
      return;
    }

    // Default Fallback
    window.location.href = '/services/';
  }

  // ==================== HOMEPAGE HERO SEARCH ====================
  const serviceInput = document.getElementById('search-service');
  const locationInput = document.getElementById('search-location');
  const searchBtn = document.getElementById('search-submit');

  if (serviceInput && locationInput && searchBtn) {
    const serviceDropdown = document.createElement('div');
    serviceDropdown.className = 'suggestions-dropdown';
    serviceInput.parentNode.appendChild(serviceDropdown);

    const locationDropdown = document.createElement('div');
    locationDropdown.className = 'suggestions-dropdown';
    locationInput.parentNode.appendChild(locationDropdown);

    function setupAutocomplete(inputEl, dropdownEl, items) {
      inputEl.addEventListener('input', () => {
        const query = inputEl.value.toLowerCase().trim();
        dropdownEl.innerHTML = '';
        if (!query) {
          dropdownEl.style.display = 'none';
          return;
        }

        const filtered = items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          (item.keywords && item.keywords.some(k => k.includes(query)))
        );

        if (filtered.length === 0) {
          dropdownEl.style.display = 'none';
          return;
        }

        filtered.forEach(item => {
          const row = document.createElement('div');
          row.textContent = item.name + (item.district ? ` (${item.district})` : '');
          row.addEventListener('click', () => {
            inputEl.value = item.name;
            dropdownEl.style.display = 'none';
            inputEl.dataset.selectedPath = item.path;
          });
          dropdownEl.appendChild(row);
        });
        dropdownEl.style.display = 'block';
      });

      document.addEventListener('click', (e) => {
        if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
          dropdownEl.style.display = 'none';
        }
      });
    }

    setupAutocomplete(serviceInput, serviceDropdown, [...servicesList, ...businessList]);
    setupAutocomplete(locationInput, locationDropdown, locationsList);

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceVal = serviceInput.value.trim();
      const locationVal = locationInput.value.trim();

      if (serviceVal) {
        routeSearchQuery(serviceVal);
      } else if (locationVal) {
        routeSearchQuery(locationVal);
      } else {
        window.location.href = '/services/';
      }
    });
  }

  // ==================== GLOBAL HEADER SEARCH ====================
  const headerSearchInput = document.getElementById('header-search-input');
  const headerSearchSubmit = document.getElementById('header-search-submit');
  const headerSearchDropdown = document.getElementById('header-search-dropdown');

  if (headerSearchInput && headerSearchSubmit && headerSearchDropdown) {
    headerSearchInput.addEventListener('input', () => {
      const query = headerSearchInput.value.toLowerCase().trim();
      headerSearchDropdown.innerHTML = '';
      if (!query) {
        headerSearchDropdown.style.display = 'none';
        return;
      }

      // Filter services, business profiles, and locations
      const filteredServices = servicesList.filter(s => s.name.toLowerCase().includes(query) || (s.keywords && s.keywords.some(k => k.includes(query))));
      const filteredBusinesses = businessList.filter(b => b.name.toLowerCase().includes(query) || (b.keywords && b.keywords.some(k => k.includes(query))));
      const filteredLocations = locationsList.filter(l => l.name.toLowerCase().includes(query));

      if (filteredServices.length === 0 && filteredBusinesses.length === 0 && filteredLocations.length === 0) {
        headerSearchDropdown.style.display = 'none';
        return;
      }

      // 1. Populate Businesses
      filteredBusinesses.forEach(b => {
        const row = document.createElement('div');
        row.innerHTML = `<span class="suggest-icon">🏢</span> <strong>${b.name}</strong>`;
        row.addEventListener('click', () => {
          headerSearchInput.value = b.name;
          headerSearchDropdown.style.display = 'none';
          if (typeof pushAnalyticsEvent === 'function') {
            pushAnalyticsEvent('search', { search_term: b.name, location: '', category: '' });
          }
          window.location.href = b.path;
        });
        headerSearchDropdown.appendChild(row);
      });

      // 2. Populate Services
      filteredServices.forEach(s => {
        const row = document.createElement('div');
        row.innerHTML = `<span class="suggest-icon">🔧</span> ${s.name}`;
        row.addEventListener('click', () => {
          headerSearchInput.value = s.name;
          headerSearchDropdown.style.display = 'none';
          if (typeof pushAnalyticsEvent === 'function') {
            pushAnalyticsEvent('search', { search_term: s.name, location: '', category: '' });
          }
          window.location.href = s.path;
        });
        headerSearchDropdown.appendChild(row);
      });

      // 3. Populate Locations
      filteredLocations.forEach(l => {
        const row = document.createElement('div');
        row.innerHTML = `<span class="suggest-icon">📍</span> ${l.name}${l.district ? ` (${l.district})` : ''}`;
        row.addEventListener('click', () => {
          headerSearchInput.value = l.name;
          headerSearchDropdown.style.display = 'none';
          if (typeof pushAnalyticsEvent === 'function') {
            pushAnalyticsEvent('search', { search_term: l.name, location: '', category: '' });
          }
          window.location.href = l.path;
        });
        headerSearchDropdown.appendChild(row);
      });

      headerSearchDropdown.style.display = 'block';
    });

    headerSearchSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      routeSearchQuery(headerSearchInput.value);
    });

    headerSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        routeSearchQuery(headerSearchInput.value);
      }
    });

    document.addEventListener('click', (e) => {
      if (!headerSearchInput.contains(e.target) && !headerSearchDropdown.contains(e.target)) {
        headerSearchDropdown.style.display = 'none';
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch);
} else {
  initSearch();
}

