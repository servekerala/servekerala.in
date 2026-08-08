const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'js', 'auto-loader.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace loadMapplsScript call
content = content.replace('loadMapplsScript();', 'initLeafletMap();');

// 2. Remove Google Map iframe update logic
const iframeLogicRegex = /\/\/ Dynamic Google Map Update[\s\S]*?mapIframe\.src[^;]+;/;
content = content.replace(iframeLogicRegex, '');

// 3. Replace Mappls block with Leaflet block
const mapplsBlockRegex = /\/\/ --- MAPPLS INTERACTIVE MAP INTEGRATION ---[\s\S]*?function highlightMapPinByStand\(standLocation, isHighlighted\) \{\s*\/\/[^\n]*\s*\}/;

const leafletBlock = `// --- LEAFLET INTERACTIVE MAP INTEGRATION ---
  let leafletMap = null;
  let leafletMarkers = [];
  let leafletMarkerGroup = null;

  const TOWN_COORDINATES = {
    'thiruvalla': [9.3833, 76.5750],
    'adoor': [9.1526, 76.7356],
    'pathanamthitta': [9.2648, 76.7870],
    'kozhencherry': [9.3283, 76.6853],
    'pandalam': [9.2272, 76.6811],
    'ranni': [9.3867, 76.7836],
    'kottayam': [9.5916, 76.5222],
    'changanassery': [9.4448, 76.5360],
    'ettumanoor': [9.6649, 76.5645],
    'pala': [9.7118, 76.6833],
    'vaikom': [9.7460, 76.3957],
    'alappuzha': [9.4981, 76.3388],
    'cherthala': [9.6841, 76.3392],
    'kayamkulam': [9.1729, 76.5002],
    'haripad': [9.2783, 76.4589],
    'mavelikkara': [9.2458, 76.5511],
    'kollam': [8.8932, 76.6141],
    'karunagappally': [9.0558, 76.5356],
    'kottarakkara': [9.0028, 76.7797],
    'punalur': [9.0143, 76.9249],
    'paravur': [8.8143, 76.6661]
  };

  function simpleStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  function getStandOffsetCoordinates(townCoords, standName) {
    // Generate deterministic offset so stands don't perfectly overlap
    const hash = simpleStringHash(standName.toLowerCase());
    const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
    const radius = 0.005 + ((Math.abs(hash) % 15) * 0.001);
    
    return [
      townCoords[0] + (Math.sin(angle) * radius),
      townCoords[1] + (Math.cos(angle) * radius)
    ];
  }

  window.initLeafletMap = function() {
    const mapContainer = document.getElementById('interactive-stand-map');
    if (!mapContainer || typeof L === 'undefined') return;
    
    leafletMap = L.map('interactive-stand-map', { zoomControl: false }).setView([9.4000, 76.5000], 8);
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);
    
    leafletMarkerGroup = L.featureGroup().addTo(leafletMap);
    
    if (allDrivers && allDrivers.length > 0) {
      updateMapPinsState(allDrivers);
    }
  };

  function updateMapPinsState(filteredDrivers) {
    if (!leafletMap || !leafletMarkerGroup) return;

    leafletMarkerGroup.clearLayers();

    const standGroups = {};
    filteredDrivers.forEach(d => {
       if (d.availability === 'offline') return;
       const townKey = Object.keys(TOWN_COORDINATES).find(t => (d.standLocation || '').toLowerCase().includes(t.toLowerCase()) || (d.town || '').toLowerCase() === t.toLowerCase());
       
       if (townKey) {
           const fullStandName = d.standLocation || d.autoStand || townKey;
           if (!standGroups[fullStandName]) {
               standGroups[fullStandName] = { count: 0, town: townKey, drivers: [] };
           }
           standGroups[fullStandName].count++;
           standGroups[fullStandName].drivers.push(d);
       }
    });

    Object.keys(standGroups).forEach(standName => {
       const group = standGroups[standName];
       const townCoords = TOWN_COORDINATES[group.town];
       const coords = getStandOffsetCoordinates(townCoords, standName);
       
       const iconHtml = \`<div class="stand-marker-icon" style="width: 32px; height: 32px;">\${group.count}</div>\`;
       
       const customIcon = L.divIcon({
           className: 'custom-leaflet-icon',
           html: iconHtml,
           iconSize: [32, 32],
           iconAnchor: [16, 16],
           popupAnchor: [0, -16]
       });
       
       const popupHtml = \`
         <div style="padding: 2px;">
           <div class="stand-popup-title">\${standName}</div>
           <div class="stand-popup-count">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             \${group.count} Available Auto\${group.count > 1 ? 's' : ''}
           </div>
         </div>
       \`;
       
       const marker = L.marker(coords, { icon: customIcon }).bindPopup(popupHtml);
       leafletMarkerGroup.addLayer(marker);
    });

    if (Object.keys(standGroups).length > 0) {
       leafletMap.flyToBounds(leafletMarkerGroup.getBounds(), { padding: [50, 50], maxZoom: 14, duration: 1.5 });
    } else {
       leafletMap.flyTo([9.4000, 76.5000], 8, { duration: 1.5 });
    }
  }

  function highlightMapPinByStand(standLocation, isHighlighted) {}
`;

content = content.replace(mapplsBlockRegex, leafletBlock);

fs.writeFileSync(filePath, content);
console.log('Successfully patched auto-loader.js with Leaflet map logic!');
