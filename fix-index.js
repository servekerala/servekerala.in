const fs = require('fs');

const indexFile = 'd:/Antigravity/servekerala.in/index.html';
let content = fs.readFileSync(indexFile, 'utf8');

const correctHead = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>ServeKerala.in | Hire Local Pros: Electricians, Plumbers & Solar Installers</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="canonical" href="https://servekerala.in/" />

  <!-- Open Graph / Social Tags -->
  <meta property="og:title" content="ServeKerala.in | Hire Local Pros: Electricians, Plumbers & Solar Installers" />
  <meta property="og:description" content="Skip the directory. ServeKerala connects you directly with verified local professionals—from AC repair in Thiruvalla to Solar installation in Kottayam. Call or WhatsApp directly." />
  <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
  <meta property="og:url" content="https://servekerala.in/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ServeKerala.in | Hire Local Pros: Electricians, Plumbers & Solar Installers" />
  <meta name="twitter:description" content="Skip the directory. ServeKerala connects you directly with verified local professionals—from AC repair in Thiruvalla to Solar installation in Kottayam. Call or WhatsApp directly." />
  <meta name="twitter:image" content="https://servekerala.in/assets/images/logo.png" />

  <!-- SEO Meta -->
  <meta name="description"
    content="Skip the directory. ServeKerala connects you directly with verified local professionals—from AC repair in Thiruvalla to Solar installation in Kottayam. Call or WhatsApp directly." />
  <meta name="keywords"
    content="local services kerala, hire professionals kerala, solar installation kerala, electricians kottayam, plumbers thiruvalla, local lead marketplace" />
  <meta name="author" content="ServeKerala.in" />

  <!-- Main CSS and Font script -->
  <link rel="stylesheet" href="/assets/css/main.css?v=2.6">
  <script src="/assets/js/search.js?v=2.3" defer></script>

  <!-- Firebase SDKs & CMS Loader -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="/assets/js/cms-loader.js?v=2.3" defer></script>

  <!-- WebSite and Organization Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://servekerala.in/#website",
          "url": "https://servekerala.in/",
          "name": "ServeKerala",
          "description": "ServeKerala connects you directly with verified local professionals.",
          "publisher": {
            "@id": "https://servekerala.in/#organization"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://servekerala.in/#organization",
          "name": "ServeKerala.in",
          "url": "https://servekerala.in/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://servekerala.in/assets/images/logo.png"
          }
        }
      ]
    }
  </script>

  <!-- ================= GOOGLE TAG MANAGER ================= -->
  <script>(function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-PP7859BT');</script>
  <!-- =============== END GOOGLE TAG MANAGER =============== -->

  <!-- Structured Data for Featured Listings -->
  <script type="application/ld+json">`;

// Find where to splice
const splitIdx = content.indexOf('  {');

if (splitIdx > -1) {
    const finalContent = correctHead + '\n' + content.substring(splitIdx);
    fs.writeFileSync(indexFile, finalContent, 'utf8');
    console.log("Fixed index.html!");
} else {
    console.log("Could not find split point");
}
