const fs = require('fs');

let content = fs.readFileSync('assets/js/auto-loader.js', 'utf8');

// 1. Update WhatsApp text and onclick tracking
content = content.replace(
  '<a href="https://wa.me/${waNumber}?text=Hi,%20I%20found%20your%20auto%20on%20ServeKerala.in" target="_blank" class="btn-wa" title="Chat on WhatsApp">',
  '<a href="https://wa.me/${waNumber}?text=Hi,%20I%20found%20your%20profile%20on%20Auto%20Mithram." target="_blank" class="btn-wa" title="Chat on WhatsApp" onclick="if(typeof trackAutoClick===\\\'function\\\') trackAutoClick(\\\'${auto.id}\\\', \\\'whatsapp\\\')">'
);

// 2. Update Call tracking
content = content.replace(
  '<a href="tel:${auto.phone}" class="btn-call" ${isOnline ? \'\' : \'style="pointer-events: none;"\'}>',
  '<a href="tel:${auto.phone}" class="btn-call" ${isOnline ? \'\' : \'style="pointer-events: none;"\'} onclick="if(typeof trackAutoClick===\\\'function\\\') trackAutoClick(\\\'${auto.id}\\\', \\\'call\\\')">'
);

// 3. Populate Dashboard stats
const dashboardStatsInject = `      // Populate dashboard stats
      document.getElementById('dashboard-stat-views').textContent = activeSessionDriver.profileViews || 0;
      document.getElementById('dashboard-stat-calls').textContent = activeSessionDriver.callClicks || 0;
      document.getElementById('dashboard-stat-wa').textContent = activeSessionDriver.whatsappClicks || 0;`;

if (!content.includes('dashboard-stat-views')) {
  content = content.replace(
    `document.getElementById('dashboard-driver-name').textContent = activeSessionDriver.driverName;`,
    `${dashboardStatsInject}\n      document.getElementById('dashboard-driver-name').textContent = activeSessionDriver.driverName;`
  );
}

// 4. Add IntersectionObserver for profile_view tracking
const observerInject = `
    // Add intersection observer to track profile views once per page load per driver
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
`;

const observeInject = `
      // Observe for view tracking
      if (window.autoViewObserver && auto.id) {
        card.setAttribute('data-id', auto.id);
        window.autoViewObserver.observe(card);
      }
`;

if (!content.includes('autoViewTrackerSet')) {
  content = content.replace(
    `drivers.forEach((auto) => {`,
    `${observerInject}\n    drivers.forEach((auto) => {`
  );
}

if (!content.includes('autoViewObserver.observe(card)')) {
  content = content.replace(
    `container.appendChild(card);`,
    `${observeInject}\n      container.appendChild(card);`
  );
}

fs.writeFileSync('assets/js/auto-loader.js', content, 'utf8');
console.log('auto-loader.js updated successfully!');
