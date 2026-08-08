// ==========================================================
// SERVEKERALA.IN – DYNAMIC CLIENT-SIDE SEARCH AUTOCOMPLETE
// ==========================================================

const initSearch = () => {
  // Directory mapping index
  const servicesList = [
    { name: 'Solar Installation', path: '/services/solar-installation/' },
    { name: 'Plumber', path: '/services/plumber/' },
    { name: 'Electrician', path: '/services/electrician/' },
    { name: 'AC Service', path: '/services/ac-service/' },
    { name: 'CCTV Installation', path: '/services/cctv-installation/' },
    { name: 'Home Cleaning', path: '/services/home-cleaning/' },
    { name: 'Pest Control', path: '/services/pest-control/' },
    { name: 'Water Purifier Service', path: '/services/water-purifier-service/' }
  ];

  const locationsList = [
    { name: 'Alappuzha', type: 'district', path: '/alappuzha/solar-installation/' },
    { name: 'Cherthala', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/cherthala/' },
    { name: 'Haripad', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/haripad/' },
    { name: 'Kayamkulam', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/kayamkulam/' },
    { name: 'Mavelikkara', type: 'town', district: 'Alappuzha', path: '/alappuzha/solar-installation/mavelikkara/' },
    { name: 'Kottayam', type: 'district', path: '/kottayam/solar-installation/' },
    { name: 'Changanacherry', type: 'town', district: 'Kottayam', path: '/kottayam/solar-installation/changanacherry/' },
    { name: 'Pathanamthitta', type: 'district', path: '/pathanamthitta/solar-installation/' },
    { name: 'Thiruvalla', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/thiruvalla/' },
    { name: 'Adoor', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/adoor/' },
    { name: 'Konni', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/konni/' },
    { name: 'Ranni', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/ranni/' },
    { name: 'Pandalam', type: 'town', district: 'Pathanamthitta', path: '/pathanamthitta/solar-installation/pandalam/' }
  ];

  // Specific combinations index
  const exactComboPaths = {
    'plumber:pathanamthitta': '/pathanamthitta/plumber/',
    'plumber:thiruvalla': '/pathanamthitta/plumber/thiruvalla/',
    'solar-installation:alappuzha': '/alappuzha/solar-installation/',
    'solar-installation:cherthala': '/alappuzha/solar-installation/cherthala/',
    'solar-installation:haripad': '/alappuzha/solar-installation/haripad/',
    'solar-installation:kayamkulam': '/alappuzha/solar-installation/kayamkulam/',
    'solar-installation:mavelikkara': '/alappuzha/solar-installation/mavelikkara/',
    'solar-installation:kottayam': '/kottayam/solar-installation/',
    'solar-installation:changanacherry': '/kottayam/solar-installation/changanacherry/',
    'solar-installation:pathanamthitta': '/pathanamthitta/solar-installation/',
    'solar-installation:thiruvalla': '/pathanamthitta/solar-installation/thiruvalla/',
    'solar-installation:adoor': '/pathanamthitta/solar-installation/adoor/',
    'solar-installation:konni': '/pathanamthitta/solar-installation/konni/',
    'solar-installation:ranni': '/pathanamthitta/solar-installation/ranni/',
    'solar-installation:pandalam': '/pathanamthitta/solar-installation/pandalam/'
  };

  // ==================== HOMEPAGE HERO SEARCH ====================
  const serviceInput = document.getElementById('search-service');
  const locationInput = document.getElementById('search-location');
  const searchBtn = document.getElementById('search-submit');

  if (serviceInput && locationInput && searchBtn) {
    // Create suggestion dropdowns
    const serviceDropdown = document.createElement('div');
    serviceDropdown.className = 'suggestions-dropdown';
    serviceInput.parentNode.appendChild(serviceDropdown);

    const locationDropdown = document.createElement('div');
    locationDropdown.className = 'suggestions-dropdown';
    locationInput.parentNode.appendChild(locationDropdown);

    // Helper: setup autocomplete trigger
    function setupAutocomplete(inputEl, dropdownEl, items, type) {
      inputEl.addEventListener('input', () => {
        const query = inputEl.value.toLowerCase().trim();
        dropdownEl.innerHTML = '';
        if (!query) {
          dropdownEl.style.display = 'none';
          return;
        }

        const filtered = items.filter(item => item.name.toLowerCase().includes(query));
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
            inputEl.dataset.selectedKey = item.name.toLowerCase().replace(/\s+/g, '-');
          });
          dropdownEl.appendChild(row);
        });
        dropdownEl.style.display = 'block';
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
          dropdownEl.style.display = 'none';
        }
      });
    }

    setupAutocomplete(serviceInput, serviceDropdown, servicesList, 'service');
    setupAutocomplete(locationInput, locationDropdown, locationsList, 'location');

    // Submit action
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceVal = serviceInput.value.trim();
      const locationVal = locationInput.value.trim();

      if (!serviceVal && !locationVal) return;

      const serviceKey = serviceVal.toLowerCase().replace(/\s+/g, '-');
      const locationKey = locationVal.toLowerCase().replace(/\s+/g, '-');
      const comboKey = `${serviceKey}:${locationKey}`;

      // 1. Try exact combined route
      if (exactComboPaths[comboKey]) {
        window.location.href = exactComboPaths[comboKey];
        return;
      }

      // 2. Try selected service input path
      const serviceMatch = servicesList.find(s => s.name.toLowerCase() === serviceVal.toLowerCase());
      if (serviceMatch && !locationVal) {
        window.location.href = serviceMatch.path;
        return;
      }

      // 3. Try selected location input path
      const locationMatch = locationsList.find(l => l.name.toLowerCase() === locationVal.toLowerCase());
      if (locationMatch && !serviceVal) {
        window.location.href = locationMatch.path;
        return;
      }

      // 4. Default fallback combos if not exact:
      if (serviceMatch) {
        window.location.href = serviceMatch.path;
        return;
      }

      if (locationMatch) {
        window.location.href = locationMatch.path;
        return;
      }

      // Ultimate fallback: service directory
      window.location.href = '/services/';
    });
  }

  // ==================== HEADER SEARCH ====================
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

      // Filter services and locations
      const filteredServices = servicesList.filter(s => s.name.toLowerCase().includes(query));
      const filteredLocations = locationsList.filter(l => l.name.toLowerCase().includes(query));

      if (filteredServices.length === 0 && filteredLocations.length === 0) {
        headerSearchDropdown.style.display = 'none';
        return;
      }

      // Populate services first
      filteredServices.forEach(s => {
        const row = document.createElement('div');
        row.innerHTML = `<span class="suggest-icon">🔧</span> ${s.name}`;
        row.addEventListener('click', () => {
          headerSearchInput.value = s.name;
          headerSearchDropdown.style.display = 'none';
          window.location.href = s.path;
        });
        headerSearchDropdown.appendChild(row);
      });

      // Populate locations
      filteredLocations.forEach(l => {
        const row = document.createElement('div');
        row.innerHTML = `<span class="suggest-icon">📍</span> ${l.name}${l.district ? ` (${l.district})` : ''}`;
        row.addEventListener('click', () => {
          headerSearchInput.value = l.name;
          headerSearchDropdown.style.display = 'none';
          window.location.href = l.path;
        });
        headerSearchDropdown.appendChild(row);
      });

      headerSearchDropdown.style.display = 'block';
    });

    const performHeaderSearch = () => {
      const val = headerSearchInput.value.trim().toLowerCase();
      if (!val) return;

      // Try exact matches
      const serviceMatch = servicesList.find(s => s.name.toLowerCase() === val);
      if (serviceMatch) {
        window.location.href = serviceMatch.path;
        return;
      }

      const locationMatch = locationsList.find(l => l.name.toLowerCase() === val);
      if (locationMatch) {
        window.location.href = locationMatch.path;
        return;
      }

      // Partial match fallback
      const partialService = servicesList.find(s => s.name.toLowerCase().includes(val));
      if (partialService) {
        window.location.href = partialService.path;
        return;
      }

      const partialLocation = locationsList.find(l => l.name.toLowerCase().includes(val));
      if (partialLocation) {
        window.location.href = partialLocation.path;
        return;
      }

      // Default fallback
      window.location.href = '/services/';
    };

    headerSearchSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      performHeaderSearch();
    });

    headerSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performHeaderSearch();
      }
    });

    // Close when clicking outside
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
