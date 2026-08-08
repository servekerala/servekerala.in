// ==========================================================
// SERVEKERALA.IN – SECURE ADMIN MODERATION CONTROL PANEL
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
  const auth = firebase.auth();
  const db = firebase.firestore();

  let activeCategories = [];
  let activeDistricts = [];
  let globalAutoConfig = {};

  function loadDirectoryParameters() {
    return Promise.all([
      db.collection('cms_settings').doc('global').get(),
      db.collection('page_generator_config').doc('global').get()
    ]).then(([cmsDoc, pgDoc]) => {
      let data = cmsDoc.exists ? cmsDoc.data() : {};
      
      if (!data.categories || !data.categories.length) {
        activeCategories = [
          { id: 'solar', name: 'Solar Installation' },
          { id: 'plumbing', name: 'Plumber' }
        ];
      } else {
        activeCategories = data.categories;
      }

      let pgData = pgDoc.exists ? pgDoc.data() : {};
      if (pgData.auto_mithram) {
        globalAutoConfig = typeof pgData.auto_mithram === 'string' ? JSON.parse(pgData.auto_mithram) : pgData.auto_mithram;
      } else {
        globalAutoConfig = {};
      }
      activeDistricts = Object.keys(globalAutoConfig);

      populateDropdowns();
      renderParameterLists();
      if(window.setupHierarchicalDirectoryUI) window.setupHierarchicalDirectoryUI();
    }).catch(err => {
      console.error("Error loading params:", err);
    });
  }

  function populateDropdowns() {
    const bcatSelect = document.getElementById('edit-bcat');
    const bdistSelect = document.getElementById('edit-bdist');
    const bpCatSelect = document.getElementById('bp-category');
    const bpDistSelect = document.getElementById('bp-district');
    const editAutoDist = document.getElementById('edit-auto-dist');
    const editAutoTown = document.getElementById('edit-auto-town');
    const editAutoLocality = document.getElementById('edit-auto-locality');

    const manageTownDist = document.getElementById('manage-town-district-select');
    const manageLocDist = document.getElementById('manage-locality-district-select');
    const manageLocTown = document.getElementById('manage-locality-town-select');

    if (bcatSelect) bcatSelect.innerHTML = activeCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (bpCatSelect) bpCatSelect.innerHTML = activeCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const distOptions = '<option value="">Select District</option>' + activeDistricts.map(d => `<option value="${d.toLowerCase()}">${d}</option>`).join('') + '<option value="Multiple">Multiple (Enter Towns Below)</option>';
    
    if (bdistSelect) bdistSelect.innerHTML = distOptions;
    if (bpDistSelect) bpDistSelect.innerHTML = distOptions;
    if (editAutoDist) editAutoDist.innerHTML = distOptions + '<option value="other">Other District</option>';
    
    if (manageTownDist) {
      const prevTownDist = manageTownDist.value;
      manageTownDist.innerHTML = distOptions;
      if (prevTownDist) manageTownDist.value = prevTownDist;
    }
    if (manageLocDist) {
      const prevLocDist = manageLocDist.value;
      manageLocDist.innerHTML = distOptions;
      if (prevLocDist) manageLocDist.value = prevLocDist;
    }
    
    if (editAutoTown) editAutoTown.innerHTML = '';
    if (editAutoLocality) editAutoLocality.innerHTML = '';
  }

  function renderParameterLists() {
    const districtContainer = document.getElementById('district-list-container');
    const categoryContainer = document.getElementById('category-list-container');
    const townContainer = document.getElementById('town-list-container');
    const localityContainer = document.getElementById('locality-list-container');

    // 1. Districts
    if (districtContainer) {
      if (!activeDistricts.length) {
        districtContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No districts configured.</p>';
      } else {
        districtContainer.innerHTML = activeDistricts.map(d => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
            <span style="font-weight: 500;">${d}</span>
            <button type="button" class="btn-delete-district" data-name="${d}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
          </div>
        `).join('');

        districtContainer.querySelectorAll('.btn-delete-district').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const name = e.currentTarget.getAttribute('data-name');
            if (confirm(`Delete district ${name} and all its towns and localities?`)) {
              delete globalAutoConfig[name];
              saveDirectoryParameters();
            }
          });
        });
      }
    }

    // 2. Categories
    if (categoryContainer) {
      if (!activeCategories.length) {
        categoryContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No categories configured.</p>';
      } else {
        categoryContainer.innerHTML = activeCategories.map((c, index) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
            <span><strong style="color: var(--text-main);">${c.name}</strong> <span style="font-size: 12px; color: var(--text-muted);">(${c.id})</span></span>
            <button type="button" class="btn-delete-category" data-index="${index}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
          </div>
        `).join('');

        categoryContainer.querySelectorAll('.btn-delete-category').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            activeCategories.splice(idx, 1);
            saveDirectoryParameters();
          });
        });
      }
    }

    // 3. Towns
    const selTownDistVal = document.getElementById('manage-town-district-select')?.value;
    const selTownDistKey = activeDistricts.find(d => d.toLowerCase() === selTownDistVal);
    if (townContainer) {
      if (!selTownDistKey) {
        townContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">Please select a District first.</p>';
      } else {
        const townsObj = globalAutoConfig[selTownDistKey] || {};
        const towns = Object.keys(townsObj);
        if (!towns.length) {
          townContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No towns in ${selTownDistKey}.</p>`;
        } else {
          townContainer.innerHTML = towns.map(t => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
              <span style="font-weight: 500;">${t}</span>
              <button type="button" class="btn-delete-town" data-dist="${selTownDistKey}" data-town="${t}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
            </div>
          `).join('');

          townContainer.querySelectorAll('.btn-delete-town').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const d = e.currentTarget.getAttribute('data-dist');
              const t = e.currentTarget.getAttribute('data-town');
              if (confirm(`Delete town ${t} and all its localities?`)) {
                delete globalAutoConfig[d][t];
                saveDirectoryParameters();
              }
            });
          });
        }
      }
    }

    // 4. Localities
    const selLocDistVal = document.getElementById('manage-locality-district-select')?.value;
    const selLocDistKey = activeDistricts.find(d => d.toLowerCase() === selLocDistVal);
    const selLocTownKey = document.getElementById('manage-locality-town-select')?.value;
    
    if (localityContainer) {
      if (!selLocTownKey) {
        localityContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">Please select Town first.</p>';
      } else {
        const locs = (globalAutoConfig[selLocDistKey] && globalAutoConfig[selLocDistKey][selLocTownKey]) || [];
        if (!locs.length) {
          localityContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); padding: 4px;">No localities in ${selLocTownKey}.</p>`;
        } else {
          localityContainer.innerHTML = locs.map((l, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: var(--bg-base); border-radius: 4px; margin-bottom: 6px; font-size: 14px; border: 1px solid var(--border-color);">
              <span style="font-weight: 500;">${l}</span>
              <button type="button" class="btn-delete-locality" data-dist="${selLocDistKey}" data-town="${selLocTownKey}" data-index="${index}" style="background: none; border: none; color: #dc2626; font-size: 18px; font-weight: bold; cursor: pointer; padding: 0 4px;">&times;</button>
            </div>
          `).join('');

          localityContainer.querySelectorAll('.btn-delete-locality').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const d = e.currentTarget.getAttribute('data-dist');
              const t = e.currentTarget.getAttribute('data-town');
              const idx = parseInt(e.currentTarget.getAttribute('data-index'));
              globalAutoConfig[d][t].splice(idx, 1);
              saveDirectoryParameters();
            });
          });
        }
      }
    }
  }

  function saveDirectoryParameters() {
    activeDistricts = Object.keys(globalAutoConfig);
    
    const p1 = db.collection('cms_settings').doc('global').update({
      categories: activeCategories
    });
    
    const p2 = db.collection('page_generator_config').doc('global').set({
      auto_mithram: globalAutoConfig
    }, { merge: true });

    Promise.all([p1, p2]).then(() => {
      localStorage.removeItem('cms_settings'); // Clear cache
      populateDropdowns();
      renderParameterLists();
      
      const autoTextarea = document.getElementById('pg-auto-config');
      if (autoTextarea) autoTextarea.value = JSON.stringify(globalAutoConfig, null, 2);

      showDashboardStatus('Directory parameters updated.', 'alert-success');
    }).catch(err => {
      console.error("Error saving params:", err);
      showDashboardStatus('Failed to save parameters.', 'alert-error');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error-message');
    const signoutBtn = document.getElementById('admin-signout-btn');
    const userEmailSpan = document.getElementById('admin-user-email');
    
    const contentTypeBtns = document.querySelectorAll('.content-type-btn');
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const listingsContainer = document.getElementById('admin-listings-container');
    const dbStatusMsg = document.getElementById('dashboard-status-message');

    // Counts Spans
    const countPendingSpan = document.getElementById('count-pending');
    const countApprovedSpan = document.getElementById('count-approved');
    const countRejectedSpan = document.getElementById('count-rejected');

    // Edit Modal Elements (Business)
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-listing-form');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');

    // Edit Modal Elements (Auto Mithram)
    const editModalAuto = document.getElementById('edit-modal-auto');
    const editFormAuto = document.getElementById('edit-auto-form');
    const closeModalBtnAuto = document.getElementById('close-modal-btn-auto');
    const cancelModalBtnAuto = document.getElementById('cancel-modal-btn-auto');

    // CMS Elements
    const cmsContainer = document.getElementById('admin-cms-container');
    const locContainer = document.getElementById('admin-locations-container');
    const seoContainer = document.getElementById('admin-seo-container');
    const seoForm = document.getElementById('seo-settings-form');
    const statusTabs = document.getElementById('admin-status-tabs');
    const cmsForm = document.getElementById('cms-settings-form');
    const kpiContainer = document.getElementById('admin-kpi-container');

    let activeStatusTab = 'pending';
    let activeCollection = 'listings';
    let allDocuments = []; // Global cache for real-time local filtering
    let unsubscribeSnapshot = null;

    // ==================== AUTH OBSERVATION ====================
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Logged In
        loginContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
        loadDirectoryParameters().then(() => {
          initializeDashboard();
        });
      } else {
        // Logged Out
        dashboardContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginForm.reset();
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
      }
    });

    // ==================== LOGIN / SIGNOUT ====================
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        loginError.style.display = 'none';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Signing In...';
        }

        auth.signInWithEmailAndPassword(email, password)
          .then(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
          })
          .catch((error) => {
            console.error('Login Error: ', error);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
            let msg = 'Invalid email or password. Please try again.';
            if (error.code === 'auth/unauthorized-domain') {
              msg = 'Domain unauthorized in Firebase Console. Please add this domain under Firebase Console -> Auth -> Settings -> Authorized Domains.';
            } else if (error.code === 'auth/user-not-found') {
              msg = 'No admin user account found for this email address in Firebase.';
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
              msg = 'Incorrect email or password. Please double-check your credentials.';
            } else if (error.code === 'auth/too-many-requests') {
              msg = 'Too many failed login attempts. Access temporarily blocked. Please try again later.';
            } else if (error.message) {
              msg = error.message;
            }
            loginError.textContent = msg;
            loginError.style.display = 'block';
          });
      });
    }

    if (signoutBtn) {
      signoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
          showDashboardStatus('Signed out successfully.', 'alert-success');
        });
      });
    }

    // ==================== DASHBOARD LOAD & SNAPSHOT ====================
    function initializeDashboard() {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot(); // Stop listening to previous collection
      }

      if (activeCollection === 'location_settings') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (locContainer) locContainer.style.display = 'block';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        const pgContainer = document.getElementById('admin-page-generator-container');
        if (pgContainer) pgContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        return;
      } else if (activeCollection === 'cms_settings') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'block';
        if (locContainer) locContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadCmsSettings();
        return;
                  } else if (activeCollection === 'page_generator') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (locContainer) locContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (typeof seoContainer !== 'undefined' && seoContainer) seoContainer.style.display = 'none';
        const pgContainer = document.getElementById('admin-page-generator-container');
        if (pgContainer) pgContainer.style.display = 'block';
        if (locContainer) locContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadPageGeneratorSettings();
        return;
      } else if (activeCollection === 'seo_settings') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        if (locContainer) locContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'block';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadSeoSettings();
        return;
      } else if (activeCollection === 'kpi_dashboard') {
        listingsContainer.style.display = 'none';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (locContainer) locContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'block';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
        loadKPIReports();
        return;
      } else if (activeCollection === 'business_pages') {
        listingsContainer.style.display = 'grid';
        statusTabs.style.display = 'none';
        cmsContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'block';
      } else {
        listingsContainer.style.display = 'grid';
        statusTabs.style.display = 'flex';
        cmsContainer.style.display = 'none';
        if (kpiContainer) kpiContainer.style.display = 'none';
        if (seoContainer) seoContainer.style.display = 'none';
        const bpBar = document.getElementById('business-pages-action-bar');
        if (bpBar) bpBar.style.display = 'none';
      }

      listingsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">Loading data...</p>`;

      // Real-time listener for the active collection
      unsubscribeSnapshot = db.collection(activeCollection).onSnapshot((snapshot) => {
        allDocuments = [];
        snapshot.forEach(doc => {
          allDocuments.push({ id: doc.id, ...doc.data() });
        });
        updateTabCounts();
        renderListings();
      }, (error) => {
        console.error('Database read error:', error);
        showDashboardStatus('Permission denied or error fetching data.', 'alert-error');
      });
    }

    function updateTabCounts() {
      const pendingCount = allDocuments.filter(d => d.status === 'pending').length;
      const approvedCount = allDocuments.filter(d => d.status === 'approved').length;
      const rejectedCount = allDocuments.filter(d => d.status === 'rejected').length;

      if (countPendingSpan) countPendingSpan.textContent = pendingCount;
      if (countApprovedSpan) countApprovedSpan.textContent = approvedCount;
      if (countRejectedSpan) countRejectedSpan.textContent = rejectedCount;
    }

    // ==================== RENDER CARD ELEMENT ====================
    function renderListings() {
      listingsContainer.innerHTML = '';

      // business_pages don't use a status workflow — show all of them
      const filtered = (activeCollection === 'business_pages'
        ? allDocuments
        : allDocuments.filter(d => d.status === activeStatusTab)
      ).sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA; // Newest first
      });

      if (filtered.length === 0) {
        const emptyMsg = activeCollection === 'business_pages'
          ? 'No listing pages yet. Click "+ Create New Listing Page" to add your first one.'
          : 'No items found in this section.';
        listingsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">${emptyMsg}</p>`;
        return;
      }

      filtered.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'admin-card';
        const dateString = item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('en-IN') : 'Just now';

        // Action Buttons HTML
        let actionsHTML = '';
        if (item.status === 'pending') {
          actionsHTML = `
            <button class="btn-admin btn-approve" data-id="${item.id}">Approve</button>
            <button class="btn-admin btn-reject" data-id="${item.id}">Archive</button>
            <button class="btn-admin btn-edit-listing" data-id="${item.id}">Edit Details</button>
          `;
        } else if (item.status === 'approved') {
          const isFeat = item.isFeatured === true;
          actionsHTML = `
            <button class="btn-admin btn-reject" data-id="${item.id}">Archive</button>
            <button class="btn-admin btn-edit-listing" data-id="${item.id}">Edit Details</button>
            <label style="display:inline-flex; align-items:center; cursor:pointer; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 4px; font-weight: 600; margin-left: 4px;">
                <input type="checkbox" class="feature-checkbox" data-id="${item.id}" ${isFeat ? 'checked' : ''} style="margin-right: 6px; transform: scale(1.2);"> Feature on Homepage
              </label>
          `;
        } else {
          actionsHTML = `
            <button class="btn-admin btn-approve" data-id="${item.id}">Re-Approve</button>
            <button class="btn-admin btn-edit-listing" data-id="${item.id}">Edit Details</button>
            <button class="btn-admin btn-delete-archived" data-id="${item.id}" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;">🗑 Delete</button>
          `;
        }

        if (activeCollection === 'business_pages') {
          // Render Business Page Card
          const catMatch = activeCategories.find(c => c.id === item.category);
          const categoryLabel = catMatch ? catMatch.name : (item.category || 'General');
          const listingUrl = `/business/${item.id}/`;
          card.innerHTML = `
            <div class="admin-card-header">
              <h4>${item.name || item.id}</h4>
              <span class="category-badge">${categoryLabel}</span>
            </div>
            <div class="admin-meta-grid">
              <div class="admin-meta-item"><strong>Slug:</strong> <a href="${listingUrl}" target="_blank" style="color:var(--primary);text-decoration:underline;">${item.id}</a></div>
              <div class="admin-meta-item"><strong>District:</strong> ${item.district || '—'}</div>
              <div class="admin-meta-item"><strong>Phone:</strong> ${item.phone || '—'}</div>
              <div class="admin-meta-item"><strong>WhatsApp:</strong> ${item.whatsapp || '—'}</div>
              ${item.email ? `<div class="admin-meta-item"><strong>Email:</strong> ${item.email}</div>` : ''}
              ${item.website ? `<div class="admin-meta-item"><strong>Website:</strong> <a href="${item.website}" target="_blank" style="color:var(--primary);">Visit</a></div>` : ''}
              <div class="admin-meta-item" style="grid-column:span 2;color:var(--accent);font-weight:700;background:var(--accent-light);padding:4px 8px;border-radius:4px;display:inline-block;width:fit-content;margin-top:4px;">📊 Clicks: ${item.callClicks || 0} Calls | ${item.whatsappClicks || 0} WhatsApp</div>
            </div>
            <div class="admin-desc" style="font-size:13px;color:var(--text-muted);margin-top:10px;line-height:1.5;">${(item.description || '').slice(0, 140)}${item.description && item.description.length > 140 ? '...' : ''}</div>
            <div class="admin-actions" style="margin-top:16px;flex-wrap:wrap;gap:8px;">
              <a href="${listingUrl}" target="_blank" class="btn-admin" style="background:#e0f2fe;color:#0369a1;border:none;">👁 View Live</a>
              <button class="btn-admin btn-edit-bp" data-id="${item.id}" style="background:#f0fdf4;color:#15803d;border:none;">✏️ Edit</button>
              <button class="btn-admin btn-gen-html" data-id="${item.id}" style="background:#fef3c7;color:#92400e;border:none;">⬇ Download HTML</button>
              <button class="btn-admin btn-delete-bp" data-id="${item.id}" style="background:#fee2e2;color:#dc2626;border:none;">🗑 Delete</button>
            </div>
          `;
        } else if (activeCollection === 'listings') {
          // Render Business Listing Card
          const websiteHTML = item.website ? `<div class="admin-meta-item"><strong>Website:</strong> <a href="${item.website}" target="_blank" style="color: var(--primary); text-decoration: underline;">Visit</a></div>` : '';
          const addressHTML = item.address ? `<div class="admin-meta-item"><strong>Address:</strong> ${item.address}</div>` : '';
          const mapHTML = item.mapUrl ? `<div class="admin-meta-item"><strong>Map:</strong> <a href="${item.mapUrl}" target="_blank" style="color: var(--primary); text-decoration: underline;">View Link</a></div>` : '';
          const catMatch = activeCategories.find(c => c.id === item.category);
          const categoryLabel = catMatch ? catMatch.name : item.category;

          card.innerHTML = `
            <div class="admin-card-header">
              <h4>${item.name}</h4>
              <span class="category-badge">${categoryLabel}</span>
            </div>
            <div class="admin-meta-grid">
              <div class="admin-meta-item"><strong>Location:</strong> ${item.district} (${item.towns})</div>
              <div class="admin-meta-item"><strong>Email:</strong> ${item.email}</div>
              <div class="admin-meta-item"><strong>Phone:</strong> ${item.phone}</div>
              <div class="admin-meta-item"><strong>WhatsApp:</strong> ${item.whatsapp}</div>
              <div class="admin-meta-item"><strong>Date:</strong> ${dateString}</div>
              ${addressHTML}
              ${mapHTML}
              <div class="admin-meta-item" style="grid-column: span 2; color: var(--accent); font-weight: 700; background: var(--accent-light); padding: 4px 8px; border-radius: 4px; display: inline-block; width: fit-content; margin-top: 4px;">📊 Calls: ${item.callClicks || 0} | WhatsApp: ${item.whatsappClicks || 0}</div>
              ${websiteHTML}
            </div>
            <div class="admin-desc">
              ${item.description ? item.description.replace(/\n/g, '<br>') : ''}
            </div>
            <div class="admin-actions">
              ${actionsHTML}
            </div>
          `;
        } else if (activeCollection === 'auto_mithram') {
          // Render Auto Mithram Card
          card.innerHTML = `
            <div class="admin-card-header">
              <h4>${item.driverName}</h4>
              <span class="category-badge" style="background: #fbbf24; color: #78350f;">Auto Mithram</span>
            </div>
            <div class="admin-meta-grid">
              <div class="admin-meta-item"><strong>Vehicle No:</strong> ${item.vehicleNumber}</div>
              <div class="admin-meta-item"><strong>District:</strong> ${item.district}</div>
              <div class="admin-meta-item"><strong>Stand:</strong> ${item.standLocation}</div>
              <div class="admin-meta-item"><strong>Phone:</strong> ${item.phone}</div>
              <div class="admin-meta-item"><strong>WhatsApp:</strong> ${item.whatsapp}</div>
              <div class="admin-meta-item"><strong>Hours:</strong> ${item.availableHours || 'N/A'}</div>
              <div class="admin-meta-item"><strong>Date:</strong> ${dateString}</div>
            </div>
            <div class="admin-actions" style="margin-top: 16px;">
              ${actionsHTML}
            </div>
          `;
        }

        listingsContainer.appendChild(card);
      });

      attachListingActionEventListeners();
    }

    // ==================== ACTION LISTENERS ====================
    function attachListingActionEventListeners() {
      listingsContainer.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          updateListingStatus(id, 'approved');
        });
      });

      listingsContainer.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          updateListingStatus(id, 'rejected');
        });
      });

      listingsContainer.querySelectorAll('.feature-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const id = e.target.getAttribute('data-id');
          const isCurrentlyFeatured = e.target.checked;
          db.collection(activeCollection).doc(id).update({
            isFeatured: isCurrentlyFeatured
          }).then(() => {
            // initializeDashboard(); // Don't reload entire dashboard on checkbox tick to prevent annoying jump
            console.log('Featured status updated');
          }).catch(error => {
            console.error(error);
            e.target.checked = !isCurrentlyFeatured; // revert on error
          });
        });
      });

      listingsContainer.querySelectorAll('.btn-edit-listing').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          if (activeCollection === 'listings') {
            openEditModal(id);
          } else if (activeCollection === 'auto_mithram') {
            openEditAutoModal(id);
          }
        });
      });

      // Business Pages actions
      listingsContainer.querySelectorAll('.btn-edit-bp').forEach(btn => {
        btn.addEventListener('click', (e) => {
          openBusinessPageModal(e.currentTarget.getAttribute('data-id'));
        });
      });

      listingsContainer.querySelectorAll('.btn-gen-html').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const doc = allDocuments.find(d => d.id === id);
          if (doc) generateAndDownloadHTML(doc);
        });
      });

      listingsContainer.querySelectorAll('.btn-delete-bp').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          if (confirm(`Delete listing page "${id}"? This cannot be undone.`)) {
            db.collection('business_pages').doc(id).delete()
              .then(() => showDashboardStatus('Listing page deleted.', 'alert-success'))
              .catch(err => { console.error(err); showDashboardStatus('Delete failed.', 'alert-error'); });
          }
        });
      });

      // Delete archived items handler
      listingsContainer.querySelectorAll('.btn-delete-archived').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const item = allDocuments.find(d => d.id === id);
          const name = item ? (item.driverName || item.name || id) : id;
          if (confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
            db.collection(activeCollection).doc(id).delete()
              .then(() => showDashboardStatus(`"${name}" has been permanently deleted.`, 'alert-success'))
              .catch(err => { console.error(err); showDashboardStatus('Delete failed.', 'alert-error'); });
          }
        });
      });
    }

    function updateListingStatus(id, status) {
      db.collection(activeCollection).doc(id).update({ status: status })
      .then(() => {
        showDashboardStatus(`Item successfully moved to ${status}.`, 'alert-success');
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        showDashboardStatus('Failed to update status. Try refreshing.', 'alert-error');
      });
    }

    // ==================== UI TOGGLES (CONTENT TYPE & STATUS TABS) ====================
    contentTypeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        contentTypeBtns.forEach(t => {
          t.classList.remove('active');
          t.style.background = '#e5e7eb';
          t.style.color = 'var(--text-dark)';
        });
        e.target.classList.add('active');
        e.target.style.background = 'var(--primary)';
        e.target.style.color = 'white';

        activeCollection = e.target.getAttribute('data-type');
        initializeDashboard(); // Reload data for new collection
      });
    });

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        activeStatusTab = e.target.getAttribute('data-status');
        renderListings();
      });
    });

    // ==================== EDIT MODALS ====================
    
    // BUSINESS MODAL
    function openEditModal(id) {
      const doc = allDocuments.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('edit-id').value = id;
      document.getElementById('edit-bname').value = doc.name;
      document.getElementById('edit-bcat').value = doc.category;
      document.getElementById('edit-bweb').value = doc.website || '';
      document.getElementById('edit-bdist').value = doc.district;
      document.getElementById('edit-btowns').value = doc.towns;
      document.getElementById('edit-bphone').value = doc.phone;
      document.getElementById('edit-bwa').value = doc.whatsapp;
      document.getElementById('edit-bemail').value = doc.email;
      document.getElementById('edit-bdesc').value = doc.description;
      document.getElementById('edit-bservices').value = doc.servicesOffered || '';
      document.getElementById('edit-bwhychoose').value = doc.whyChooseUs || '';
      document.getElementById('edit-baddress').value = doc.address || '';
      document.getElementById('edit-bmap').value = doc.mapUrl || '';

      editModal.style.display = 'flex';
    }

    function closeEditModal() {
      editModal.style.display = 'none';
      if (editForm) editForm.reset();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeEditModal);

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;

        db.collection('listings').doc(id).update({
          name: document.getElementById('edit-bname').value.trim(),
          category: document.getElementById('edit-bcat').value,
          website: document.getElementById('edit-bweb').value.trim(),
          district: document.getElementById('edit-bdist').value,
          towns: document.getElementById('edit-btowns').value.trim(),
          phone: document.getElementById('edit-bphone').value.trim(),
          whatsapp: document.getElementById('edit-bwa').value.trim(),
          email: document.getElementById('edit-bemail').value.trim(),
          description: document.getElementById('edit-bdesc').value.trim(),
          servicesOffered: document.getElementById('edit-bservices').value.trim(),
          whyChooseUs: document.getElementById('edit-bwhychoose').value.trim(),
          address: document.getElementById('edit-baddress').value.trim(),
          mapUrl: document.getElementById('edit-bmap').value.trim()
        })
        .then(() => {
          closeEditModal();
          showDashboardStatus('Listing updated successfully.', 'alert-success');
        })
        .catch((error) => {
          console.error('Error updating details:', error);
          showDashboardStatus('Failed to save listing edits.', 'alert-error');
        });
      });
    }

    // ==================== BUSINESS PAGE MODAL ====================
    const modalBP = document.getElementById('modal-business-page');
    const formBP = document.getElementById('form-business-page');
    const bpNameInput = document.getElementById('bp-name');
    const bpSlugInput = document.getElementById('bp-slug');
    const slugPreview = document.getElementById('slug-preview');
    const btnGenerateHtml = document.getElementById('btn-generate-html');
    const btnCreateBP = document.getElementById('btn-create-business-page');

    function nameToSlug(name) {
      return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    if (bpNameInput && bpSlugInput) {
      bpNameInput.addEventListener('input', () => {
        const slug = nameToSlug(bpNameInput.value);
        bpSlugInput.value = slug;
        if (slugPreview) slugPreview.textContent = slug || 'your-slug';
      });
      bpSlugInput.addEventListener('input', () => {
        if (slugPreview) slugPreview.textContent = bpSlugInput.value || 'your-slug';
      });
    }

    function openBusinessPageModal(docId) {
      const titleEl = document.getElementById('modal-bp-title');
      const docIdInput = document.getElementById('bp-doc-id');

      if (docId) {
        // Edit mode
        const doc = allDocuments.find(d => d.id === docId);
        if (!doc) return;
        if (titleEl) titleEl.textContent = 'Edit Business Listing Page';
        if (btnGenerateHtml) btnGenerateHtml.style.display = 'inline-flex';
        if (docIdInput) docIdInput.value = docId;
        if (bpSlugInput) { bpSlugInput.value = docId; bpSlugInput.disabled = true; }
        if (slugPreview) slugPreview.textContent = docId;
        document.getElementById('bp-name').value = doc.name || '';
        document.getElementById('bp-category').value = doc.category || '';
        document.getElementById('bp-district').value = doc.district || '';
        document.getElementById('bp-towns').value = doc.towns || '';
        document.getElementById('bp-phone').value = doc.phone || '';
        document.getElementById('bp-whatsapp').value = doc.whatsapp || '';
        document.getElementById('bp-email').value = doc.email || '';
        document.getElementById('bp-website').value = doc.website || '';
        document.getElementById('bp-desc').value = doc.description || '';
        document.getElementById('bp-services').value = doc.servicesOffered || '';
        document.getElementById('bp-whychoose').value = doc.whyChooseUs || '';
        document.getElementById('bp-address').value = doc.address || '';
        document.getElementById('bp-mapurl').value = doc.mapUrl || '';
        document.getElementById('bp-gbp-rating').value = doc.gbpRating || '';
        document.getElementById('bp-gbp-reviews').value = doc.gbpReviews || '';
        document.getElementById('bp-gbp-url').value = doc.gbpUrl || '';
      } else {
        // Create mode
        if (titleEl) titleEl.textContent = 'Create Business Listing Page';
        if (btnGenerateHtml) btnGenerateHtml.style.display = 'none';
        if (docIdInput) docIdInput.value = '';
        if (bpSlugInput) bpSlugInput.disabled = false;
        if (formBP) formBP.reset();
        if (slugPreview) slugPreview.textContent = 'your-slug';
      }

      if (modalBP) modalBP.style.display = 'flex';
    }

    function closeBusinessPageModal() {
      if (modalBP) modalBP.style.display = 'none';
      if (formBP) formBP.reset();
      if (bpSlugInput) bpSlugInput.disabled = false;
      if (slugPreview) slugPreview.textContent = 'your-slug';
      if (btnGenerateHtml) btnGenerateHtml.style.display = 'none';
    }

    if (btnCreateBP) {
      btnCreateBP.addEventListener('click', () => openBusinessPageModal(null));
    }

    const closeBPBtn = document.getElementById('close-modal-bp');
    const cancelBPBtn = document.getElementById('cancel-modal-bp');
    if (closeBPBtn) closeBPBtn.addEventListener('click', closeBusinessPageModal);
    if (cancelBPBtn) cancelBPBtn.addEventListener('click', closeBusinessPageModal);

    if (formBP) {
      formBP.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = document.getElementById('bp-doc-id').value.trim();
        const slug = document.getElementById('bp-slug').value.trim();
        const saveBtn = document.getElementById('btn-save-bp');

        const ratingVal = document.getElementById('bp-gbp-rating').value.trim();
        const reviewsVal = document.getElementById('bp-gbp-reviews').value.trim();

        const data = {
          name: document.getElementById('bp-name').value.trim(),
          category: document.getElementById('bp-category').value,
          district: document.getElementById('bp-district').value,
          towns: document.getElementById('bp-towns').value.trim(),
          phone: document.getElementById('bp-phone').value.trim(),
          whatsapp: document.getElementById('bp-whatsapp').value.trim(),
          email: document.getElementById('bp-email').value.trim(),
          website: document.getElementById('bp-website').value.trim(),
          description: document.getElementById('bp-desc').value.trim(),
          servicesOffered: document.getElementById('bp-services').value.trim(),
          whyChooseUs: document.getElementById('bp-whychoose').value.trim(),
          address: document.getElementById('bp-address').value.trim(),
          mapUrl: document.getElementById('bp-mapurl').value.trim(),
          gbpRating: ratingVal ? parseFloat(ratingVal) : null,
          gbpReviews: reviewsVal ? parseInt(reviewsVal, 10) : null,
          gbpUrl: document.getElementById('bp-gbp-url').value.trim(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

        const targetId = docId || slug;
        if (!targetId) {
          showDashboardStatus('Please fill in a valid slug.', 'alert-error');
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Listing Page'; }
          return;
        }

        const ref = db.collection('business_pages').doc(targetId);
        const saveOp = docId ? ref.update(data) : ref.set(Object.assign(data, { createdAt: firebase.firestore.FieldValue.serverTimestamp() }));

        saveOp
          .then(() => {
            closeBusinessPageModal();
            showDashboardStatus(`Listing page "${targetId}" saved! View at /business/${targetId}/`, 'alert-success');
          })
          .catch(err => {
            console.error('Save error:', err);
            showDashboardStatus('Failed to save listing page.', 'alert-error');
          })
          .finally(() => {
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Listing Page'; }
          });
      });
    }

    // Generate HTML button inside modal
    if (btnGenerateHtml) {
      btnGenerateHtml.addEventListener('click', () => {
        const docId = document.getElementById('bp-doc-id').value.trim();
        const doc = allDocuments.find(d => d.id === docId);
        if (doc) generateAndDownloadHTML(doc);
      });
    }

    // ==================== STATIC HTML GENERATOR ====================
    function generateAndDownloadHTML(doc) {
      const slug = doc.id;
      const name = doc.name || '';
      const desc = doc.description || '';
      const phone = doc.phone || '';
      const wa = doc.whatsapp || phone;
      const email = doc.email || '';
      const website = doc.website || '';
      const district = doc.district || '';
      const towns = doc.towns || '';
      const category = doc.category || '';
      const address = doc.address || '';
      const mapUrl = doc.mapUrl || '';
      const gbpRating = doc.gbpRating || null;
      const gbpReviews = doc.gbpReviews || null;
      const gbpUrl = doc.gbpUrl || '';
      const services = doc.servicesOffered ? doc.servicesOffered.split('\n').filter(Boolean) : [];
      const whyList = doc.whyChooseUs ? doc.whyChooseUs.split('\n').filter(Boolean) : [];

      
      const schemaTypeMap = { plumbing: 'Plumber', electrical: 'Electrician', ac: 'HVACBusiness' };
      const schemaType = schemaTypeMap[category] || 'LocalBusiness';

      const catIcons = { solar: '☀️', plumbing: '🔧', electrical: '⚡', ac: '❄️', cctv: '📷', cleaning: '🧹', pest: '🐛', water: '💧', default: '🏢' };
      const icon = catIcons[category] || catIcons.default;
      const whyIcons = ['⭐','🔒','💡','🚀','🎯','🏆','✅','💎'];

      const servicesHTML = services.length ? `
  <!-- SERVICES -->
  <section class="section">
    <div class="container">
      <h2>Services Offered</h2>
      <ul style="list-style:none;padding:0;margin:20px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">
        ${services.map(s => `<li style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;font-size:15px;font-weight:500;"><span style="width:22px;height:22px;background:var(--primary);color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">✓</span>${s}</li>`).join('')}
      </ul>
    </div>
  </section>` : '';

      const whyHTML = whyList.length ? `
  <!-- WHY CHOOSE -->
  <section class="section light-bg">
    <div class="container">
      <h2>Why Choose ${name}?</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-top:20px;">
        ${whyList.map((w, i) => `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;"><div style="font-size:28px;margin-bottom:8px;">${whyIcons[i%8]}</div><p style="font-size:14px;font-weight:600;margin:0;">${w}</p></div>`).join('')}
      </div>
    </div>
  </section>` : '';

      const mapHTML = mapUrl ? `<div style="margin-top:16px;"><a href="${mapUrl}" target="_blank" rel="noopener" style="display:block;text-align:center;padding:10px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;color:#0369a1;font-weight:600;text-decoration:none;">📍 View on Google Maps</a></div>` : '';
      const gbpButtonHTML = gbpUrl ? `<div style="margin-top:10px;"><a href="${gbpUrl}" target="_blank" rel="noopener" style="display:block;text-align:center;padding:10px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;color:#4b5563;font-weight:600;text-decoration:none;">✍️ Write a Google Review</a></div>` : '';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${name} | ${district ? district + ', ' : ''}Kerala | ServeKerala.in</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${desc.replace(/"/g, '&quot;').slice(0, 160)}" />
  <meta name="keywords" content="${name.toLowerCase()}, ${category}, ${district.toLowerCase()}, kerala" />
  <meta name="author" content="ServeKerala.in" />
  <link rel="stylesheet" href="/assets/css/main.css?v=1.6">
  <script src="/assets/js/search.js?v=1.6" defer><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"><\/script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"><\/script>
  <script src="/assets/js/activity-tracker.js?v=1.6" defer><\/script>
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PP7859BT');<\/script>
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name,description:desc,url:`https://servekerala.in/business/${slug}/`,telephone:phone,address:{'@type':'PostalAddress',addressRegion:'Kerala',addressCountry:'IN',addressLocality:district}})}<\/script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PP7859BT" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<header class="site-header">
  <div class="container">
    <div class="logo">ServeKerala<span>.in</span></div>
    <div class="header-search">
      <input type="text" id="header-search-input" placeholder="Search service or city..." autocomplete="off">
      <button id="header-search-submit" class="btn-header-search"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
      <div id="header-search-dropdown" class="suggestions-dropdown"></div>
    </div>
    <nav class="main-nav">
      <a href="/">Home</a>
      <a href="/services/?v=1.6">Services</a>
      <a href="/list-your-business/?v=1.6">List Your Business</a>
      <a href="/contact/?v=1.6">Contact</a>
    </nav>
  </div>
</header>

<!-- HERO -->
<section style="background:linear-gradient(135deg,#1b4f8a 0%,#1e3a5f 100%);padding:60px 0 50px;color:white;">
  <div class="container">
    <div style="display:flex;align-items:flex-start;gap:24px;">
      <div style="width:80px;height:80px;background:rgba(255,255,255,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0;">${icon}</div>
      <div>
        <h1 style="font-size:clamp(28px,5vw,42px);font-weight:800;color:white;margin-bottom:10px;">${name}</h1>
        ${gbpRating && gbpReviews ? `
        <div style="margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <a href="${gbpUrl || mapUrl || '#'}" target="_blank" rel="noopener" style="text-decoration:none; display:flex; align-items:center; gap:6px; color:#facc15;">
            <span style="font-size:18px; letter-spacing:1px;">${'★'.repeat(Math.round(gbpRating)) + '☆'.repeat(5 - Math.round(gbpRating))}</span>
            <span style="color:#ffffff; font-weight:600; font-size:15px;">${gbpRating}</span>
            <span style="color:rgba(255,255,255,0.7); font-size:14px; font-weight:400;">(${gbpReviews} Google Reviews)</span>
          </a>
        </div>
        ` : ''}
        <p style="color:rgba(255,255,255,0.82);font-size:17px;margin:0;line-height:1.6;max-width:680px;">${desc}</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px;">
          ${district ? `<span style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;">📍 ${district}, Kerala</span>` : ''}
          ${category ? `<span style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;">💼 ${category.charAt(0).toUpperCase()+category.slice(1)}</span>` : ''}
          <span style="background:rgba(134,239,172,0.2);border:1px solid rgba(134,239,172,0.4);padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;color:#bbf7d0;">✅ Verified Listing</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- BREADCRUMB -->
<div class="breadcrumb-container"><div class="container"><nav class="breadcrumb"><a href="/">Home</a><span class="separator"></span><span class="current">${name}</span></nav></div></div>

<!-- CONTACT GRID -->
<section class="section light-bg">
  <div class="container">
    <h2>Contact ${name}</h2>
    <div class="grid grid-3" style="margin-top:20px;">
      ${phone ? `<div class="info-box" style="text-align:center;"><h3>📞 Phone</h3><p><a href="tel:${phone}" onclick="if(typeof dataLayer!=='undefined')dataLayer.push({event:'business_click',business_name:'${name}',action_type:'call'});if(typeof trackListingClick==='function')trackListingClick('/business/${slug}/','call');"><strong>Call Now</strong></a></p></div>` : ''}
      ${wa ? `<div class="info-box" style="text-align:center;"><h3>💬 WhatsApp</h3><p><a href="https://wa.me/${wa.replace(/[^0-9]/g,'')}" target="_blank" rel="noopener" onclick="if(typeof dataLayer!=='undefined')dataLayer.push({event:'business_click',business_name:'${name}',action_type:'whatsapp'});if(typeof trackListingClick==='function')trackListingClick('/business/${slug}/','whatsapp');"><strong>Chat on WhatsApp</strong></a></p></div>` : ''}
      ${email ? `<div class="info-box" style="text-align:center;"><h3>✉️ Email</h3><p><a href="mailto:${email}">${email}</a></p></div>` : `<div class="info-box"><h3>Business Type</h3><p>${category ? category.charAt(0).toUpperCase()+category.slice(1) : 'Local Service'}</p></div>`}
    </div>
  </div>
</section>

${servicesHTML}
${whyHTML}

<!-- DETAILS SIDEBAR SECTION -->
<section class="section">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 320px;gap:40px;align-items:start;">
      <div>
        ${address ? `<h2 style="margin-bottom:16px;">Location</h2><p style="font-size:16px;color:var(--text-muted);">${address}</p>${mapHTML}${gbpButtonHTML}` : ''}
        ${towns ? `<p style="margin-top:20px;"><strong>Service Areas:</strong> ${towns}</p>` : ''}
        ${website ? `<p style="margin-top:16px;"><strong>Official Website:</strong> <a href="${website}" target="_blank" rel="noopener" style="color:var(--primary);">${website.replace(/^https?:\/\//,'')}</a></p>` : ''}
      </div>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:24px;text-align:center;">
        <div style="font-size:40px;margin-bottom:10px;">🛡️</div>
        <p style="font-size:14px;font-weight:700;color:#166534;margin:0;">Verified &amp; Listed on<br>ServeKerala.in</p>
        <p style="font-size:12px;color:#15803d;margin:8px 0 0;">Direct contact. No middlemen.</p>
      </div>
    </div>
  </div>
</section>

<!-- TRUST NOTE -->
<section class="section light-bg">
  <div class="container">
    <p><strong>Note:</strong> ServeKerala.in is a local business discovery platform. We do not sell leads or interfere in communication. Customers contact ${name} directly.</p>
  </div>
</section>

<footer class="site-footer">
  <div class="container">
    <p>&copy; 2026 ServeKerala.in. All rights reserved.</p>
    <nav class="footer-nav">
      <a href="/privacy-policy/?v=1.6">Privacy Policy</a>
      <a href="/terms/?v=1.6">Terms</a>
      <a href="/contact/?v=1.6">Contact Us</a>
    </nav>
  </div>
</footer>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${slug}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      showDashboardStatus(`Static HTML for "${name}" downloaded! Place it in a folder named "${slug}/" and deploy.`, 'alert-success');
    }

    // AUTO MITHRAM MODAL
    function setupDynamicEditAutoDropdowns(selectedDist, selectedTown, selectedLocality) {
      const distSelect = document.getElementById('edit-auto-dist');
      const townSelect = document.getElementById('edit-auto-town');
      const localitySelect = document.getElementById('edit-auto-locality');
      
      if (!distSelect || !townSelect || !localitySelect) return;
      
      // Populate Districts
      const districts = Object.keys(globalAutoConfig);
      distSelect.innerHTML = '<option value="">Select District</option>' + districts.map(d => `<option value="${d.toLowerCase()}">${d}</option>`).join('');
      distSelect.innerHTML += '<option value="other">Other District</option>';
      
      function updateTowns() {
        const distVal = distSelect.value;
        if (distVal === 'other' || distVal === '') {
          townSelect.innerHTML = '<option value="">Select Town</option>';
          localitySelect.innerHTML = '<option value="">Select Locality</option>';
          return;
        }
        
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        if (distKey && globalAutoConfig[distKey]) {
          const towns = Object.keys(globalAutoConfig[distKey]);
          townSelect.innerHTML = '<option value="">Select Town</option>' + towns.map(t => `<option value="${t}">${t}</option>`).join('');
        } else {
          townSelect.innerHTML = '<option value="">Select Town</option>';
        }
        updateLocalities();
      }
      
      function updateLocalities() {
        const distVal = distSelect.value;
        const townVal = townSelect.value;
        const distKey = Object.keys(globalAutoConfig).find(d => d.toLowerCase() === (distVal || '').toLowerCase());
        
        if (distKey && townVal && globalAutoConfig[distKey] && globalAutoConfig[distKey][townVal]) {
          const locs = globalAutoConfig[distKey][townVal];
          localitySelect.innerHTML = '<option value="">Select Locality</option>' + locs.map(l => `<option value="${l}">${l}</option>`).join('');
        } else {
          localitySelect.innerHTML = '<option value="">Select Locality</option>';
        }
      }
      
      if (!distSelect.hasAttribute('data-bound')) {
        distSelect.setAttribute('data-bound', 'true');
        distSelect.addEventListener('change', updateTowns);
        townSelect.addEventListener('change', updateLocalities);
      }
      
      // Set initial values
      distSelect.value = selectedDist || '';
      updateTowns();
      if (selectedTown) {
        if (!Array.from(townSelect.options).some(o => o.value === selectedTown)) {
          townSelect.innerHTML += `<option value="${selectedTown}">${selectedTown}</option>`;
        }
        townSelect.value = selectedTown;
      }
      updateLocalities();
      if (selectedLocality) {
        if (!Array.from(localitySelect.options).some(o => o.value === selectedLocality)) {
          localitySelect.innerHTML += `<option value="${selectedLocality}">${selectedLocality}</option>`;
        }
        localitySelect.value = selectedLocality;
      }
    }

    function openEditAutoModal(id) {
      const doc = allDocuments.find(d => d.id === id);
      if (!doc) return;

      document.getElementById('edit-auto-id').value = id;
      document.getElementById('edit-auto-name').value = doc.driverName || '';
      document.getElementById('edit-auto-vehicle').value = doc.vehicleNumber || '';
      
      const parts = (doc.standLocation || "").split(',').map(s => s.trim());
      const selectedDist = doc.district || 'other';
      const selectedTown = doc.town || parts[2] || parts[1] || '';
      const selectedLocality = doc.locality || parts[1] || '';
      
      setupDynamicEditAutoDropdowns(selectedDist, selectedTown, selectedLocality);
      
      document.getElementById('edit-auto-stand').value = doc.autoStand || parts[0] || '';
      document.getElementById('edit-auto-phone').value = doc.phone || '';
      document.getElementById('edit-auto-wa').value = doc.whatsapp || '';
      document.getElementById('edit-auto-time').value = doc.availableHours || '';

      if (editModalAuto) editModalAuto.style.display = 'flex';
    }

    function closeEditAutoModal() {
      if (editModalAuto) editModalAuto.style.display = 'none';
      if (editFormAuto) editFormAuto.reset();
    }

    if (closeModalBtnAuto) closeModalBtnAuto.addEventListener('click', closeEditAutoModal);
    if (cancelModalBtnAuto) cancelModalBtnAuto.addEventListener('click', closeEditAutoModal);

    if (editFormAuto) {
      editFormAuto.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-auto-id').value;

        const newTown = document.getElementById('edit-auto-town').value.trim();
        const newLocality = document.getElementById('edit-auto-locality').value.trim();
        const newStand = document.getElementById('edit-auto-stand').value.trim();
        const compiledLocation = `${newStand}, ${newLocality}, ${newTown}`;

        db.collection('auto_mithram').doc(id).update({
          driverName: document.getElementById('edit-auto-name').value.trim(),
          vehicleNumber: document.getElementById('edit-auto-vehicle').value.trim(),
          district: document.getElementById('edit-auto-dist').value,
          town: newTown,
          locality: newLocality,
          autoStand: newStand,
          standLocation: compiledLocation,
          phone: document.getElementById('edit-auto-phone').value.trim(),
          whatsapp: document.getElementById('edit-auto-wa').value.trim(),
          availableHours: document.getElementById('edit-auto-time').value.trim()
        })
        .then(() => {
          closeEditAutoModal();
          showDashboardStatus('Auto Mithram profile updated.', 'alert-success');
        })
        .catch((error) => {
          console.error('Error updating details:', error);
          showDashboardStatus('Failed to save edits.', 'alert-error');
        });
      });
    }

    // ==================== CMS SETTINGS LOGIC ====================
    function loadCmsSettings() {
      db.collection('cms_settings').doc('global').get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          document.getElementById('cms-hero-title').value = data.heroTitle || '';
          document.getElementById('cms-hero-desc').value = data.heroDescription || '';
          document.getElementById('cms-contact-email').value = data.contactEmail || '';
          document.getElementById('cms-contact-phone').value = data.contactPhone || '';
          document.getElementById('cms-contact-wa').value = data.contactWhatsApp || '';
          document.getElementById('cms-contact-hours').value = data.contactHours || '';
          document.getElementById('cms-contact-address').value = data.contactAddress || '';
        }
      }).catch((error) => {
        console.error('Error fetching CMS settings:', error);
        showDashboardStatus('Error loading CMS settings.', 'alert-error');
      });
    }

    if (cmsForm) {
      cmsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (btnSaveCms) {
          btnSaveCms.disabled = true;
          btnSaveCms.textContent = 'Saving...';
        }

        const newSettings = {
          heroTitle: document.getElementById('cms-hero-title').value.trim(),
          heroDescription: document.getElementById('cms-hero-desc').value.trim(),
          contactEmail: document.getElementById('cms-contact-email').value.trim(),
          contactPhone: document.getElementById('cms-contact-phone').value.trim(),
          contactWhatsApp: document.getElementById('cms-contact-wa').value.trim(),
          contactHours: document.getElementById('cms-contact-hours').value.trim(),
          contactAddress: document.getElementById('cms-contact-address').value.trim()
        };

        db.collection('cms_settings').doc('global').set(newSettings, { merge: true })
        .then(() => {
          // Clear the localStorage cache so the frontend fetches the fresh data across all tabs
          localStorage.removeItem('cms_settings');
          showDashboardStatus('Global settings updated successfully! Refresh main site to see changes.', 'alert-success');
        })
        .catch((error) => {
          console.error('Error saving CMS settings:', error);
          showDashboardStatus('Failed to save CMS settings.', 'alert-error');
        })
        .finally(() => {
          if (btnSaveCms) {
            btnSaveCms.disabled = false;
            btnSaveCms.textContent = 'Save Global Settings';
          }
        });
      });
    }

    // Helper: Show notification on dashboard
    function showDashboardStatus(message, className) {
      dbStatusMsg.textContent = message;
      dbStatusMsg.className = `alert-box ${className}`;
      dbStatusMsg.style.display = 'block';

      setTimeout(() => {
        dbStatusMsg.style.display = 'none';
      }, 5000);
    }

    // Bind Parameter Add Buttons
    
    window.setupHierarchicalDirectoryUI = function() {
      const manageTownDist = document.getElementById('manage-town-district-select');
      const newTownInput = document.getElementById('new-town-input');
      const btnAddTown = document.getElementById('btn-add-town');
      
      const manageLocDist = document.getElementById('manage-locality-district-select');
      const manageLocTown = document.getElementById('manage-locality-town-select');
      const newLocalityInput = document.getElementById('new-locality-input');
      const btnAddLocality = document.getElementById('btn-add-locality');

      const btnAddDistrict = document.getElementById('btn-add-district');
      const newDistrictInput = document.getElementById('new-district-input');

      const btnAddCategory = document.getElementById('btn-add-category');
      const newCategoryName = document.getElementById('new-category-name');
      const newCategoryId = document.getElementById('new-category-id');

      // Add District
      if (btnAddDistrict && newDistrictInput) {
        btnAddDistrict.addEventListener('click', () => {
          const name = newDistrictInput.value.trim();
          if (name) {
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            if (!globalAutoConfig[capitalized]) {
              globalAutoConfig[capitalized] = {};
              newDistrictInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('District already exists!');
            }
          }
        });
      }

      // Add Category
      if (btnAddCategory && newCategoryName && newCategoryId) {
        btnAddCategory.addEventListener('click', () => {
          const name = newCategoryName.value.trim();
          const id = newCategoryId.value.trim().toLowerCase().replace(/\s+/g, '-');
          if (name && id) {
            if (!activeCategories.some(c => c.id === id)) {
              activeCategories.push({ id, name });
              newCategoryName.value = '';
              newCategoryId.value = '';
              saveDirectoryParameters();
            } else {
              alert('Category ID already exists!');
            }
          }
        });
      }

      // Manage Towns
      if (manageTownDist) {
        manageTownDist.addEventListener('change', () => {
          if (manageTownDist.value) {
            newTownInput.disabled = false;
            btnAddTown.disabled = false;
          } else {
            newTownInput.disabled = true;
            btnAddTown.disabled = true;
          }
          renderParameterLists();
        });
      }
      if (btnAddTown && newTownInput) {
        btnAddTown.addEventListener('click', () => {
          const distVal = manageTownDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          const town = newTownInput.value.trim();
          if (distKey && town) {
            const capitalized = town.charAt(0).toUpperCase() + town.slice(1);
            if (!globalAutoConfig[distKey]) globalAutoConfig[distKey] = {};
            if (!globalAutoConfig[distKey][capitalized]) {
              globalAutoConfig[distKey][capitalized] = [];
              newTownInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('Town already exists in this district!');
            }
          }
        });
      }

      // Manage Localities
      if (manageLocDist) {
        manageLocDist.addEventListener('change', () => {
          const distVal = manageLocDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          manageLocTown.innerHTML = '<option value="">Select Town</option>';
          if (distKey && globalAutoConfig[distKey]) {
            const towns = Object.keys(globalAutoConfig[distKey]);
            manageLocTown.innerHTML += towns.map(t => `<option value="${t}">${t}</option>`).join('');
            manageLocTown.disabled = false;
          } else {
            manageLocTown.disabled = true;
          }
          manageLocTown.value = '';
          manageLocTown.dispatchEvent(new Event('change'));
        });
      }
      
      if (manageLocTown) {
        manageLocTown.addEventListener('change', () => {
          if (manageLocTown.value) {
            newLocalityInput.disabled = false;
            btnAddLocality.disabled = false;
          } else {
            newLocalityInput.disabled = true;
            btnAddLocality.disabled = true;
          }
          renderParameterLists();
        });
      }

      if (btnAddLocality && newLocalityInput) {
        btnAddLocality.addEventListener('click', () => {
          const distVal = manageLocDist.value;
          const distKey = activeDistricts.find(d => d.toLowerCase() === distVal);
          const townKey = manageLocTown.value;
          const loc = newLocalityInput.value.trim();
          if (distKey && townKey && loc) {
            if (!globalAutoConfig[distKey][townKey]) globalAutoConfig[distKey][townKey] = [];
            if (!globalAutoConfig[distKey][townKey].includes(loc)) {
              globalAutoConfig[distKey][townKey].push(loc);
              newLocalityInput.value = '';
              saveDirectoryParameters();
            } else {
              alert('Locality already exists in this town!');
            }
          }
        });
      }
    };
    
    // Bind the old parameter add buttons is now handled by setupHierarchicalDirectoryUI
    // ==================== KPI DASHBOARD ====================
    const kpiForm = document.getElementById('kpi-report-form');
    const kpiTableBody = document.getElementById('kpi-table-body');
    
    function loadKPIReports() {
      if (!kpiTableBody) return;
      kpiTableBody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">Loading reports...</td></tr>';
      
      db.collection('kpi_reports').orderBy('weekStart', 'desc').get().then((snapshot) => {
        if (snapshot.empty) {
          kpiTableBody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No reports logged yet.</td></tr>';
          return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
          const data = doc.data();
          html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
              <td style="padding: 12px; border-right: 1px solid var(--border-color); font-weight: 600;">${data.weekStart || 'N/A'}</td>
              <td style="padding: 12px; border-right: 1px solid var(--border-color);">${data.users || 0} / ${data.sessions || 0}</td>
              <td style="padding: 12px; border-right: 1px solid var(--border-color);">${data.impressions || 0} / ${data.clicks || 0} <span style="font-size:11px;color:var(--text-muted);">(${data.ctr || 0}%)</span></td>
              <td style="padding: 12px; border-right: 1px solid var(--border-color);">${data.waClicks || 0} / ${data.phoneClicks || 0} / ${data.bizRegs || 0}</td>
              <td style="padding: 12px;">${data.newListings || 0} / ${data.newDistricts || 0}</td>
            </tr>
          `;
        });
        kpiTableBody.innerHTML = html;
      }).catch(err => {
        console.error("Error loading KPIs:", err);
        kpiTableBody.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #dc2626;">Error loading reports.</td></tr>';
      });
    }
    
    if (kpiForm) {
      kpiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weekStart = document.getElementById('kpi-week').value;
        if (!weekStart) return;
        
        const btnSave = document.getElementById('btn-save-kpi');
        if (btnSave) { btnSave.disabled = true; btnSave.textContent = 'Saving...'; }
        
        const data = {
          weekStart: weekStart,
          users: parseInt(document.getElementById('kpi-users').value) || 0,
          sessions: parseInt(document.getElementById('kpi-sessions').value) || 0,
          impressions: parseInt(document.getElementById('kpi-impressions').value) || 0,
          clicks: parseInt(document.getElementById('kpi-clicks').value) || 0,
          ctr: parseFloat(document.getElementById('kpi-ctr').value) || 0,
          waClicks: parseInt(document.getElementById('kpi-wa-clicks').value) || 0,
          phoneClicks: parseInt(document.getElementById('kpi-phone-clicks').value) || 0,
          bizRegs: parseInt(document.getElementById('kpi-biz-regs').value) || 0,
          newListings: parseInt(document.getElementById('kpi-new-listings').value) || 0,
          newDistricts: parseInt(document.getElementById('kpi-new-districts').value) || 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        db.collection('kpi_reports').doc(weekStart).set(data)
          .then(() => {
            showDashboardStatus('KPI Report saved successfully.', 'alert-success');
            kpiForm.reset();
            loadKPIReports(); // Refresh table
          })
          .catch(err => {
            console.error('Error saving KPI:', err);
            showDashboardStatus('Failed to save KPI report.', 'alert-error');
          })
          .finally(() => {
            if (btnSave) { btnSave.disabled = false; btnSave.textContent = '💾 Save Weekly Report'; }
          });
      });
    }

  
    // ==================== SEO SETTINGS LOGIC ====================
    function loadSeoSettings() {
      db.collection('site_seo').doc('global').get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.home) {
            document.getElementById('seo-home-title').value = data.home.title || '';
            document.getElementById('seo-home-desc').value = data.home.description || '';
            document.getElementById('seo-home-keywords').value = data.home.keywords || '';
          }
          if (data.auto) {
            document.getElementById('seo-auto-title').value = data.auto.title || '';
            document.getElementById('seo-auto-desc').value = data.auto.description || '';
            document.getElementById('seo-auto-keywords').value = data.auto.keywords || '';
          }
          if (data.services) {
            document.getElementById('seo-services-title').value = data.services.title || '';
            document.getElementById('seo-services-desc').value = data.services.description || '';
            document.getElementById('seo-services-keywords').value = data.services.keywords || '';
          }
        }
      }).catch((error) => {
        console.error('Error fetching SEO settings:', error);
        showDashboardStatus('Error loading SEO settings.', 'alert-error');
      });
    }

    if (seoForm) {
      seoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSaveSeo = document.getElementById('btn-save-seo');
        if (btnSaveSeo) {
          btnSaveSeo.disabled = true;
          btnSaveSeo.textContent = 'Saving...';
        }

        const newSeoSettings = {
          home: {
            title: document.getElementById('seo-home-title').value.trim(),
            description: document.getElementById('seo-home-desc').value.trim(),
            keywords: document.getElementById('seo-home-keywords').value.trim()
          },
          auto: {
            title: document.getElementById('seo-auto-title').value.trim(),
            description: document.getElementById('seo-auto-desc').value.trim(),
            keywords: document.getElementById('seo-auto-keywords').value.trim()
          },
          services: {
            title: document.getElementById('seo-services-title').value.trim(),
            description: document.getElementById('seo-services-desc').value.trim(),
            keywords: document.getElementById('seo-services-keywords').value.trim()
          }
        };

        db.collection('site_seo').doc('global').set(newSeoSettings, { merge: true }).then(() => {
          showDashboardStatus('SEO Settings saved successfully. They will be applied on the next build.', 'alert-success');
          if (btnSaveSeo) {
            btnSaveSeo.disabled = false;
            btnSaveSeo.textContent = 'Save SEO Settings';
          }
        }).catch((error) => {
          console.error('Error saving SEO:', error);
          showDashboardStatus('Failed to save SEO settings.', 'alert-error');
          if (btnSaveSeo) {
            btnSaveSeo.disabled = false;
            btnSaveSeo.textContent = 'Save SEO Settings';
          }
        });
      });
    }

    // ==================== PAGE GENERATOR LOGIC ====================
    const defaultServiceConfig = {
      'Kottayam': ['Kottayam', 'Changanacherry', 'Ettumanoor', 'Pala'],
      'Pathanamthitta': ['Thiruvalla', 'Adoor', 'Ranni', 'Kozhencherry', 'Pandalam'],
      'Alappuzha': ['Alappuzha', 'Chengannur', 'Cherthala', 'Kayamkulam'],
      'Kollam': ['Kollam', 'Karunagappally', 'Kottarakkara', 'Punalur']
    };

    const defaultAutoConfig = {
  "pathanamthitta": {
    "thiruvalla": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "pushpagiri-medical-college",
      "believers-medical-college",
      "government-hospital"
    ],
    "adoor": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "pathanamthitta": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "kozhencherry": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "pandalam": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "ranni": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ]
  },
  "kottayam": {
    "kottayam": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "medical-college",
      "district-hospital"
    ],
    "changanassery": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "ettumanoor": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "pala": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "vaikom": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ]
  },
  "alappuzha": {
    "alappuzha": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "district-hospital",
      "medical-college"
    ],
    "cherthala": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "kayamkulam": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "haripad": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "mavelikkara": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ]
  },
  "kollam": {
    "kollam": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "district-hospital"
    ],
    "karunagappally": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "kottarakkara": [
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "punalur": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ],
    "paravur": [
      "railway-station",
      "ksrtc-bus-stand",
      "private-bus-stand",
      "government-hospital"
    ]
  }
};

    function loadPageGeneratorSettings() {
      db.collection('page_generator_config').doc('global').get().then((doc) => {
        const data = doc.exists ? doc.data() : {};
        
        const serviceData = data.service_directory || defaultServiceConfig;
        const autoData = data.auto_mithram || defaultAutoConfig;

        const serviceTextarea = document.getElementById('pg-service-config');
        const autoTextarea = document.getElementById('pg-auto-config');

        if (serviceTextarea) serviceTextarea.value = JSON.stringify(serviceData, null, 2);
        if (autoTextarea) autoTextarea.value = JSON.stringify(autoData, null, 2);
      }).catch((error) => {
        console.error('Error fetching Page Generator settings:', error);
        showDashboardStatus('Error loading Page Generator settings.', 'alert-error');
      });
    }

    const btnSavePageGen = document.getElementById('btn-save-page-generator');
    if (btnSavePageGen) {
      btnSavePageGen.addEventListener('click', (e) => {
        e.preventDefault();
        
        btnSavePageGen.disabled = true;
        btnSavePageGen.textContent = 'Saving...';

        try {
          const serviceVal = document.getElementById('pg-service-config').value;
          const autoVal = document.getElementById('pg-auto-config').value;
          
          const serviceConfig = JSON.parse(serviceVal);
          const autoConfig = JSON.parse(autoVal);

          db.collection('page_generator_config').doc('global').set({
            service_directory: serviceConfig,
            auto_mithram: autoConfig
          }, { merge: true }).then(() => {
            showDashboardStatus('Page Generator configurations saved! Run "vercel --prod" to deploy.', 'alert-success');
          }).catch((error) => {
            console.error('Error saving configs:', error);
            showDashboardStatus('Failed to save configurations.', 'alert-error');
          }).finally(() => {
            btnSavePageGen.disabled = false;
            btnSavePageGen.textContent = 'Save Configuration & Deploy';
          });
        } catch (err) {
          showDashboardStatus('Invalid JSON format. Please check your syntax and try again.', 'alert-error');
          btnSavePageGen.disabled = false;
          btnSavePageGen.textContent = 'Save Configuration & Deploy';
        }
      });
    }
});
} else {
  console.error('Firebase SDK not loaded inside the browser.');
}

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

document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'edit-auto-vehicle') {
        let cursor = e.target.selectionStart;
        let oldLength = e.target.value.length;
        e.target.value = formatVehicleNumber(e.target.value);
        let newLength = e.target.value.length;
        e.target.setSelectionRange(cursor + (newLength - oldLength), cursor + (newLength - oldLength));
    }
});
