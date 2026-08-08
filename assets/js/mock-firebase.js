// ==========================================================
// SERVEKERALA.IN – FIREBASE MOCK FOR TESTING & VERIFICATION
// ==========================================================

(function() {
  // Only activate mock if query parameter ?mock=true is present or localStorage mock is enabled
  const isMockEnabled = window.location.search.includes('mock=true') || 
                        localStorage.getItem('firebase_mock') === 'true';

  if (!isMockEnabled) {
    console.log('Firebase mock not enabled. Using real Firebase SDK.');
    return;
  }

  console.warn('⚠️ Firebase Mock is ACTIVE for local testing.');

  // Pre-populate mock listings in localStorage to persist across page reloads
  const STORAGE_KEY = 'servekerala_mock_listings';
  let mockListings = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!mockListings) {
    mockListings = [
      {
        id: 'listing_1',
        name: 'Solis Green India Mock',
        category: 'solar',
        description: 'A mock solar EPC provider in Kottayam for local sandbox verification.',
        district: 'Kottayam',
        towns: 'Changanacherry, Thengana',
        phone: '9539316623',
        whatsapp: '9539316623',
        email: 'info@solisgreenindia.in',
        website: 'https://www.solisgreenindia.in',
        status: 'pending',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600 }
      },
      {
        id: 'listing_2',
        name: 'Quick Plumbers Kottayam',
        category: 'plumbing',
        description: 'Professional plumbing services and pipe fitting in Kottayam.',
        district: 'Kottayam',
        towns: 'Changanacherry',
        phone: '9876543210',
        whatsapp: '9876543210',
        email: 'plumbing@kottayam.com',
        website: '',
        status: 'approved',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 7200 }
      },
      {
        id: 'listing_3',
        name: 'Cherthala Solar Solutions',
        category: 'solar',
        description: 'Top-tier residential and commercial solar panels in Cherthala, Alappuzha.',
        district: 'Alappuzha',
        towns: 'Cherthala',
        phone: '9446012345',
        whatsapp: '9446012345',
        email: 'cherthalasolar@gmail.com',
        website: 'https://cherthalasolar.example.com',
        status: 'approved',
        createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 }
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockListings));
  }

  function saveListings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockListings));
    // Trigger snapshot callbacks to simulate real-time updates
    snapshotListeners.forEach(listener => listener());
  }

  // Active snapshot listeners
  const snapshotListeners = [];

  // Mock Auth State
  let currentUser = JSON.parse(localStorage.getItem('servekerala_mock_user')) || null;
  const authStateListeners = [];

  function triggerAuthStateChanged() {
    authStateListeners.forEach(listener => listener(currentUser));
  }

  // Define Mock SDK
  const mockAuth = {
    onAuthStateChanged: function(callback) {
      authStateListeners.push(callback);
      // Call immediately with current state
      setTimeout(() => callback(currentUser), 10);
      return () => {
        const idx = authStateListeners.indexOf(callback);
        if (idx > -1) authStateListeners.splice(idx, 1);
      };
    },
    signInWithEmailAndPassword: function(email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@servekerala.in' && password === 'admin123') {
            currentUser = { email: email, uid: 'mock_admin_uid' };
            localStorage.setItem('servekerala_mock_user', JSON.stringify(currentUser));
            triggerAuthStateChanged();
            resolve(currentUser);
          } else {
            reject(new Error('auth/invalid-credential'));
          }
        }, 300);
      });
    },
    signOut: function() {
      return new Promise((resolve) => {
        setTimeout(() => {
          currentUser = null;
          localStorage.removeItem('servekerala_mock_user');
          triggerAuthStateChanged();
          resolve();
        }, 100);
      });
    }
  };

  const mockFirestore = function() {
    return {
      collection: function(colName) {
        if (colName !== 'listings') {
          throw new Error('Mock only supports "listings" collection');
        }

        // Return query object
        return createQueryObject(mockListings);
      }
    };
  };

  mockFirestore.FieldValue = {
    serverTimestamp: () => ({ seconds: Math.floor(Date.now() / 1000) })
  };

  function createQueryObject(items, filters = []) {
    return {
      where: function(field, op, value) {
        const newFilters = [...filters, { field, op, value }];
        // Apply filter
        let filteredItems = [...items];
        newFilters.forEach(f => {
          filteredItems = filteredItems.filter(item => {
            if (f.op === '==') {
              return item[f.field] === f.value;
            }
            return true;
          });
        });
        return createQueryObject(filteredItems, newFilters);
      },
      get: function() {
        return new Promise((resolve) => {
          setTimeout(() => {
            const snapshot = {
              forEach: function(callback) {
                items.forEach(item => {
                  callback({
                    id: item.id,
                    data: () => item
                  });
                });
              }
            };
            resolve(snapshot);
          }, 100);
        });
      },
      onSnapshot: function(callback, errorCallback) {
        const listener = () => {
          const snapshot = {
            forEach: function(callback) {
              items.forEach(item => {
                callback({
                  id: item.id,
                  data: () => item
                });
              });
            }
          };
          callback(snapshot);
        };
        
        snapshotListeners.push(listener);
        // Initial call
        setTimeout(listener, 10);

        // Return unsubscribe
        return () => {
          const idx = snapshotListeners.indexOf(listener);
          if (idx > -1) snapshotListeners.splice(idx, 1);
        };
      },
      doc: function(id) {
        return {
          update: function(data) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                const idx = mockListings.findIndex(l => l.id === id);
                if (idx > -1) {
                  mockListings[idx] = { ...mockListings[idx], ...data };
                  saveListings();
                  resolve();
                } else {
                  reject(new Error('Document not found'));
                }
              }, 200);
            });
          }
        };
      },
      add: function(data) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newId = 'listing_' + Date.now();
            const newDoc = {
              id: newId,
              ...data,
              createdAt: data.createdAt === 'SERVER_TIMESTAMP' || !data.createdAt ? { seconds: Math.floor(Date.now() / 1000) } : data.createdAt
            };
            mockListings.push(newDoc);
            saveListings();
            resolve({ id: newId });
          }, 200);
        });
      }
    };
  }

  // Override window.firebase
  window.firebase = {
    apps: [{ name: '[DEFAULT]' }],
    initializeApp: () => {
      console.log('Firebase initialized (mock).');
      return {};
    },
    auth: () => mockAuth,
    firestore: mockFirestore
  };

  // Dispatch custom event to notify scripts that Firebase Mock has been loaded
  window.dispatchEvent(new Event('firebase-mock-loaded'));
})();
