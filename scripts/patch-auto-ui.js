const fs = require('fs');

// 1. UPDATE CSS (assets/css/main.css)
let css = fs.readFileSync('assets/css/main.css', 'utf8');

const oldDriverCardRegex = /\.driver-card-premium\s*\{[\s\S]*?overflow:\s*hidden;\s*\}/;
const newDriverCard = `.driver-card-premium {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}`;
css = css.replace(oldDriverCardRegex, newDriverCard);

const oldHoverRegex = /\.driver-card-premium:hover\s*\{[\s\S]*?\}/;
const newHover = `.driver-card-premium:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px 0 rgba(0, 166, 126, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.85);
}`;
css = css.replace(oldHoverRegex, newHover);

// Add elegant styles for map
css += `\n
/* Map Mockup Premium Overhaul */
.map-mockup-premium {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 4px solid rgba(255,255,255,0.6);
  position: relative;
  background: white;
}

/* Beautiful Background for Auto Directory Wrapper */
.auto-directory-wrapper {
  background: linear-gradient(135deg, #e0f2fe 0%, #dcfce7 50%, #fef3c7 100%);
  position: relative;
  padding-bottom: 60px;
}
.auto-directory-wrapper::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 100%;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.4) 0%, transparent 60%);
  pointer-events: none;
}
`;
fs.writeFileSync('assets/css/main.css', css);
console.log('Patched main.css');

// 2. UPDATE HTML (auto-mithram/index.html & scripts/auto-seo-template.html)
function patchHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Wrap the main content in .auto-directory-wrapper
  const startSplit = '<!-- ================= BREADCRUMBS ================= -->';
  const newStartSplit = '<div class="auto-directory-wrapper">\n' + startSplit;
  if (html.includes(startSplit) && !html.includes('class="auto-directory-wrapper"')) {
    html = html.replace(startSplit, newStartSplit);
    
    // Close the wrapper before the ServeKerala Local Ecosystem or footer
    const endSplit = '<!-- ServeKerala Local Ecosystem Integration -->';
    if (html.includes(endSplit)) {
      html = html.replace(endSplit, '</div><!-- /auto-directory-wrapper -->\n    ' + endSplit);
    }
  }

  // Add id to map iframe
  const oldIframeRegex = /<iframe[^>]*src="https:\/\/maps\.google\.com[^>]*><\/iframe>/;
  if (oldIframeRegex.test(html)) {
    const matched = html.match(oldIframeRegex)[0];
    const newIframe = matched.replace('<iframe ', '<iframe id="auto-map-iframe" ');
    html = html.replace(matched, newIframe);
  }

  fs.writeFileSync(filePath, html);
  console.log('Patched ' + filePath);
}

patchHTML('auto-mithram/index.html');
patchHTML('scripts/auto-seo-template.html');

// 3. UPDATE JS (assets/js/auto-loader.js) to dynamically update map
let js = fs.readFileSync('assets/js/auto-loader.js', 'utf8');
const searchFuncRegex = /function executeSearch\(\)\s*\{[\s\S]*?renderResults\(results\);\s*\}/;

if (searchFuncRegex.test(js)) {
  const matched = js.match(searchFuncRegex)[0];
  const mapUpdateLogic = `
    // Dynamic Map Update
    const mapIframe = document.getElementById('auto-map-iframe');
    if (mapIframe) {
      let mapQuery = "Kerala";
      if (sTown && sTown !== 'all') {
        mapQuery = sTown + ", Kerala";
      } else if (sDist && sDist !== 'all') {
        mapQuery = sDist + " District, Kerala";
      }
      mapIframe.src = "https://maps.google.com/maps?q=" + encodeURIComponent(mapQuery) + "&t=&z=13&ie=UTF8&iwloc=&output=embed";
    }
    renderResults(results);
  }`;
  const newSearchFunc = matched.replace('renderResults(results);', mapUpdateLogic);
  js = js.replace(matched, newSearchFunc);
  fs.writeFileSync('assets/js/auto-loader.js', js);
  console.log('Patched auto-loader.js');
} else {
  console.log('Could not patch auto-loader.js');
}

