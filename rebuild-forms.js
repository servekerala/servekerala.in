const fs = require('fs');

let joinJs = fs.readFileSync('assets/js/join-auto.js', 'utf8');

// Anchor 1:
//         autoStand: newStandName,

// Anchor 2:
//     });
//   });
// } else {
//   console.error('Firebase SDK not loaded.');

const anchor1 = "        autoStand: newStandName,";
const anchor2 = "    });\n  });\n} else {\n  console.error('Firebase SDK not loaded.');";

const insertCode1 = `        standLocation: newStandName + ", " + newLocality + ", " + newTown,
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
        statusMsg.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; color: var(--primary); margin-bottom: 16px;">✓</div>
            <h2 style="color: var(--primary); margin-bottom: 16px;">Application Submitted Successfully!</h2>
            <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 32px; line-height: 1.6;">Thank you for joining Auto Mithram. Your driver profile has been securely saved.<br>Our moderation team will review and publish it within 24 hours.</p>
            <a href="/" class="btn-primary" style="display: inline-block; padding: 12px 32px; text-decoration: none;">Return to Home</a>
          </div>
        \`;
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
`;

let idx1 = joinJs.indexOf(anchor1);
let idx2 = joinJs.indexOf(anchor2);

if (idx1 !== -1 && idx2 !== -1) {
    let partA = joinJs.substring(0, idx1 + anchor1.length + 1); // include newline
    let partB = joinJs.substring(idx2);
    fs.writeFileSync('assets/js/join-auto.js', partA + insertCode1 + partB, 'utf8');
    console.log("join-auto.js fixed.");
} else {
    console.error("Anchors not found in join-auto.js", idx1, idx2);
}

// --------------------- LISTING JS ---------------------
let listingJs = fs.readFileSync('assets/js/listing.js', 'utf8');

const listingAnchor1 = `      // Save to Firestore
      db.collection('listings').add(dataToSave)`;

const listingAnchor2 = `      .catch((error) => {
        console.error('Error adding document to database: ', error);`;

const listingInsert = `
      .then((docRef) => {
        listingForm.style.display = 'none';
        statusMsg.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 64px; color: var(--primary); margin-bottom: 16px;">✓</div>
            <h2 style="color: var(--primary); margin-bottom: 16px;">Application Submitted Successfully!</h2>
            <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 32px; line-height: 1.6;">Thank you for registering your business. Your application has been securely saved.<br>Our moderation team will review and publish your listing within 24 hours.</p>
            <a href="/" class="btn-primary" style="display: inline-block; padding: 12px 32px; text-decoration: none;">Return to Home</a>
          </div>
        \`;
        statusMsg.classList.add('card-glass');
        statusMsg.classList.remove('alert-box', 'alert-success', 'alert-error');
        statusMsg.style.display = 'block';
        statusMsg.style.border = '2px solid var(--primary)';
        statusMsg.style.borderRadius = '12px';
        listingForm.reset();
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
`;

let lIdx1 = listingJs.indexOf(listingAnchor1);
let lIdx2 = listingJs.indexOf(listingAnchor2);

if (lIdx1 !== -1 && lIdx2 !== -1) {
    let lPartA = listingJs.substring(0, lIdx1 + listingAnchor1.length);
    let lPartB = listingJs.substring(lIdx2);
    fs.writeFileSync('assets/js/listing.js', lPartA + listingInsert + lPartB, 'utf8');
    console.log("listing.js fixed.");
} else {
    console.error("Anchors not found in listing.js", lIdx1, lIdx2);
}
