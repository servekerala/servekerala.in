const fs = require('fs');

let html = fs.readFileSync('admin/index.html', 'utf8');

const correctHead = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Dashboard | ServeKerala.in</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />

  <!-- Main CSS -->
  <link rel="stylesheet" href="/assets/css/main.css?v=2.6">

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="/assets/js/admin.js?v=2.5" defer></script>

  <!-- ================= GOOGLE TAG MANAGER ================= -->
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PP7859BT');
  </script>
  <!-- =============== END GOOGLE TAG MANAGER =============== -->
</head>

<body class="admin-page">

<!-- ================= GOOGLE TAG MANAGER (NOSCRIPT) ================= -->
<noscript>`;

// We'll just replace everything up to the first <noscript> with correctHead.
const noscriptIndex = html.indexOf('<noscript>');
if (noscriptIndex !== -1) {
  html = correctHead + html.substring(noscriptIndex + 10);
  fs.writeFileSync('admin/index.html', html, 'utf8');
  console.log('Fixed admin/index.html head');
} else {
  console.log('Could not find noscript');
}
