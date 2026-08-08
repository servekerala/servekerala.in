// ==========================================================
// SERVEKERALA.IN – REAL-TIME DIRECTORY CLICK TRACKER
// ==========================================================

const firebaseConfigTracker = {
  apiKey: "AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc",
  authDomain: "servekerala2026.firebaseapp.com",
  projectId: "servekerala2026",
  storageBucket: "servekerala2026.firebasestorage.app",
  messagingSenderId: "122091003614",
  appId: "1:122091003614:web:e2114b7064aceff4f5ac4f",
  measurementId: "G-P3J3NLRKDL"
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfigTracker);
  }
  const db = firebase.firestore();

  window.trackListingClick = function(identifier, actionType, isDocId) {
    const updateData = {};
    if (actionType === 'call') {
      updateData.callClicks = firebase.firestore.FieldValue.increment(1);
    } else if (actionType === 'whatsapp') {
      updateData.whatsappClicks = firebase.firestore.FieldValue.increment(1);
    }

    if (isDocId) {
      // Direct document ID update
      db.collection('listings').doc(identifier).update(updateData)
        .catch(err => console.error("Track click error:", err));
    } else {
      // Find listing by website path/slug
      db.collection('listings').where('website', '==', identifier).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            db.collection('listings').doc(doc.id).update(updateData);
          });
        })
        .catch(err => console.error("Track click error:", err));
    }
  };

  // Track Auto Mithram events
  window.trackAutoClick = function(docId, actionType) {
    if (!docId) return;
    const updateData = {};
    if (actionType === 'call') {
      updateData.callClicks = firebase.firestore.FieldValue.increment(1);
    } else if (actionType === 'whatsapp') {
      updateData.whatsappClicks = firebase.firestore.FieldValue.increment(1);
    } else if (actionType === 'view') {
      updateData.profileViews = firebase.firestore.FieldValue.increment(1);
    }

    db.collection('auto_mithram').doc(docId).update(updateData)
      .catch(err => console.error("Track auto click error:", err));
  };
}
