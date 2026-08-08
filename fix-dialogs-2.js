const fs = require('fs');

function fixJoinAuto() {
  let text = fs.readFileSync('assets/js/join-auto.js', 'utf8');
  
  // Re-inject the lost logic
  const brokenPart = `        availability: 'online', // Default is online when approved
      })
      .finally(() => {`;
      
  const fixedLogic = `        availability: 'online', // Default is online when approved
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

  if (text.includes(brokenPart)) {
    text = text.replace(brokenPart, fixedLogic);
    fs.writeFileSync('assets/js/join-auto.js', text, 'utf8');
    console.log('Fixed join-auto.js');
  } else {
    // Maybe it's intact? Let's check for the original string
    if (text.includes("statusMsg.textContent = 'Thank you! Your driver profile has been successfully saved.")) {
      // It means it wasn't botched, but just needs the new dialog.
      const oldSuccess = `      .then(() => {
        statusMsg.textContent = 'Thank you! Your driver profile has been successfully saved. Our moderation team will review and publish it within 24 hours.';
        statusMsg.classList.add('alert-success');
        statusMsg.style.display = 'block';
        joinForm.reset();
        if (timeSelect && timeInput) {
          timeSelect.value = '24 Hours Available';
          timeInput.style.display = 'none';
          timeInput.value = '24 Hours Available';
          timeInput.required = false;
        }
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })`;
      
      const newSuccess = `      .then(() => {
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
      })`;

      text = text.replace(oldSuccess, newSuccess);
      fs.writeFileSync('assets/js/join-auto.js', text, 'utf8');
      console.log('Updated intact join-auto.js');
    }
  }
}

function fixListing() {
  let text = fs.readFileSync('assets/js/listing.js', 'utf8');
  
  const oldSuccess = `      .then((docRef) => {
        // Success
        statusMsg.textContent = 'Thank you! Your business listing application has been successfully saved to our database. Our moderation team will review and publish your listing within 24 hours.';
        statusMsg.classList.add('alert-success');
        statusMsg.style.display = 'block';

        // Reset the form
        listingForm.reset();

        // Scroll to status message
        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })`;

  const newSuccess = `      .then((docRef) => {
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

  if (text.includes(oldSuccess)) {
    text = text.replace(oldSuccess, newSuccess);
    fs.writeFileSync('assets/js/listing.js', text, 'utf8');
    console.log('Fixed listing.js');
  } else {
    console.log('Could not find exact oldSuccess string in listing.js');
  }
}

fixJoinAuto();
fixListing();
