const fs = require('fs');

let js = fs.readFileSync('assets/js/auto-loader.js', 'utf8');

const filterFuncRegex = /function filterAndRender\(\)\s*\{[\s\S]*?updateMapPinsState\(filtered\);\s*/;

if (filterFuncRegex.test(js)) {
  const matched = js.match(filterFuncRegex)[0];
  const mapUpdateLogic = `
    // Dynamic Google Map Update
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
  `;
  const newFunc = matched + mapUpdateLogic;
  js = js.replace(matched, newFunc);
  fs.writeFileSync('assets/js/auto-loader.js', js);
  console.log('Patched auto-loader.js');
} else {
  console.log('Could not patch auto-loader.js');
}
