const fs = require('fs');

let js = fs.readFileSync('assets/js/listing.js', 'utf8');

const regex = /db\.collection\('listings'\)\.add\(dataToSave\)/;

const newPart = `db.collection('listings').add(dataToSave)
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
      .catch((error) => {
        console.error('Error adding document to database: ', error);
        statusMsg.textContent = 'Error: We could not submit your application. Please check your internet connection or verify your Firebase configuration.';
        statusMsg.classList.add('alert-error');
        statusMsg.style.display = 'block';
      })
      .finally(() => {
        // Restore submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Application';
        }
      });
    });
  });
} else {
  console.error('Firebase SDK not loaded. Please verify the CDN links inside the head tag.');
}
`;

let match = js.match(regex);
if (match) {
    let partA = js.substring(0, match.index); 
    fs.writeFileSync('assets/js/listing.js', partA + newPart, 'utf8');
    console.log('Fixed listing.js');
} else {
    console.log('Anchor not found in listing.js using Regex');
}
