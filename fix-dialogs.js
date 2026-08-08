const fs = require('fs');

let joinJs = fs.readFileSync('assets/js/join-auto.js', 'utf8');

// The botched state:
//         availability: 'online', // Default is online when approved
//       })
//       .finally(() => {
//
// We need to restore it from availability: 'online' downwards.

const joinJsBotchedPart = `        availability: 'online', // Default is online when approved
      })
      .finally(() => {`;

const joinJsCorrectPart = `        availability: 'online', // Default is online when approved
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
      .finally(() => {`;

if (joinJs.includes(joinJsBotchedPart)) {
    joinJs = joinJs.replace(joinJsBotchedPart, joinJsCorrectPart);
    fs.writeFileSync('assets/js/join-auto.js', joinJs, 'utf8');
    console.log('Fixed join-auto.js');
} else {
    console.log('Could not find botched part in join-auto.js');
}

// Now let's fix listing.js using explicit split to be 100% safe.
let listingJs = fs.readFileSync('assets/js/listing.js', 'utf8');

const listingOldSuccess = `      // Save to Firestore
      db.collection('listings').add(dataToSave)
      .then((docRef) => {
        // Success
        statusMsg.textContent = 'Thank you! Your business listing application has been successfully saved to our database. Our moderation team will review and publish your listing within 24 hours.';
        statusMsg.classList.add('alert-success');
        statusMsg.style.display = 'block';

        // Reset the form
        listingForm.reset();

        // Scroll to status message
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })`;

const listingNewSuccess = `      // Save to Firestore
      db.collection('listings').add(dataToSave)
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
      })`;

if (listingJs.includes(listingOldSuccess)) {
    listingJs = listingJs.replace(listingOldSuccess, listingNewSuccess);
    fs.writeFileSync('assets/js/listing.js', listingJs, 'utf8');
    console.log('Fixed listing.js');
} else {
    console.log('Could not find success block in listing.js');
}
