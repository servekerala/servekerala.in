const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const templatePath = path.join(__dirname, 'auto-seo-template.html');

const https = require('https');
const PROJECT_ID = 'servekerala2026';
const API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';
const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/page_generator_config/global?key=${API_KEY}`;

function fetchConfig() {
  return new Promise((resolve, reject) => {
    https.get(URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.warn('Could not fetch Page Generator settings from Firebase. Using defaults. Status:', res.statusCode);
          return resolve(null);
        }
        try {
          const response = JSON.parse(data);
          if (!response.fields || !response.fields.auto_mithram) return resolve(null);
          
          function parseFirestoreValue(val) {
            if (val.stringValue !== undefined) return val.stringValue;
            if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
            if (val.booleanValue !== undefined) return val.booleanValue;
            if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseFirestoreValue);
            if (val.mapValue !== undefined) {
              const res = {};
              for (const k in val.mapValue.fields) {
                res[k] = parseFirestoreValue(val.mapValue.fields[k]);
              }
              return res;
            }
            return null;
          }
          
          const config = parseFirestoreValue({ mapValue: { fields: response.fields } });
          resolve(config.auto_mithram);
        } catch (err) {
          console.error('Error parsing config:', err);
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}

const sitemapPath = path.join(rootDir, 'sitemap.xml');

let config = {
  "Pathanamthitta": {
    "Thiruvalla": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Pushpagiri Medical College","Believers Medical College","Government Hospital"],
    "Adoor": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Pathanamthitta": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Kozhencherry": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Pandalam": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Ranni": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"]
  },
  "Kottayam": {
    "Kottayam": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Medical College","District Hospital"],
    "Changanassery": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Ettumanoor": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Pala": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Vaikom": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"]
  },
  "Alappuzha": {
    "Alappuzha": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","District Hospital","Medical College"],
    "Cherthala": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Kayamkulam": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Haripad": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Mavelikkara": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"]
  },
  "Kollam": {
    "Kollam": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","District Hospital"],
    "Karunagappally": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Kottarakkara": ["KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Punalur": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"],
    "Paravur": ["Railway Station","KSRTC Bus Stand","Private Bus Stand","Government Hospital"]
  }
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function getHeroImage(standName) {
  const name = standName.toLowerCase();
  if (name.includes('railway')) {
    return 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=2070&auto=format&fit=crop';
  } else if (name.includes('hospital') || name.includes('medical')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop';
  } else if (name.includes('market')) {
    return 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop';
  } else {
    // Default Kerala / Auto stand generic image
    return 'https://images.unsplash.com/photo-1629845347348-18e95ea5b6c3?q=80&w=2070&auto=format&fit=crop';
  }
}

function generateNearbyDestinations(standName, townName) {
  const sn = standName.toLowerCase();
  const tn = townName.toLowerCase();
  
  // Specific mocks for Thiruvalla Railway Station
  if (sn.includes('railway') && tn === 'thiruvalla') {
    return `
    <div class="destinations-table-wrapper">
      <table class="destinations-table">
        <thead><tr><th>Nearby Destination</th><th>Approx. Distance</th></tr></thead>
        <tbody>
          <tr><td>Pushpagiri Medical College</td><td>~2-3 km</td></tr>
          <tr><td>Believers Church Medical College</td><td>~4-6 km</td></tr>
          <tr><td>KSRTC Bus Stand</td><td>~1 km</td></tr>
          <tr><td>Private Bus Stand</td><td>~1 km</td></tr>
          <tr><td>Kavumbhagom</td><td>~2 km</td></tr>
          <tr><td>Kuttapuzha</td><td>~1.5 km</td></tr>
        </tbody>
      </table>
    </div>`;
  }
  
  // Generic mock for other stands
  return `
    <div class="destinations-table-wrapper">
      <table class="destinations-table">
        <thead><tr><th>Popular Destinations in ${townName}</th><th>Approx. Distance</th></tr></thead>
        <tbody>
          <tr><td>Town Center / Market</td><td>~1-2 km</td></tr>
          <tr><td>KSRTC Bus Stand</td><td>~2-3 km</td></tr>
          <tr><td>Government Hospital</td><td>~3-4 km</td></tr>
        </tbody>
      </table>
    </div>`;
}

function generateFaqs(targetName) {
  return `
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">Is there an auto stand at ${targetName}?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">Yes, there is an active auto stand at ${targetName}. You can find verified local drivers operating from here.</p>
    </details>
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">Are autos available late at night?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">Night availability varies by driver. Check the availability indicator on the driver cards above or call them directly to confirm night service.</p>
    </details>
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">Do you charge any commission for booking?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">No, Auto Mithram is a free directory. We do not charge customers or drivers any commission. You pay the driver directly based on the meter or agreed fare.</p>
    </details>
  `;
}

function generateFaqSchema(targetName) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is there an auto stand at ${targetName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, there is an active auto stand at ${targetName}. You can find verified local drivers operating from here.`
        }
      },
      {
        "@type": "Question",
        "name": "Are autos available late at night?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Night availability varies by driver. Check the availability indicator on the driver cards above or call them directly to confirm night service."
        }
      },
      {
        "@type": "Question",
        "name": "Do you charge any commission for booking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Auto Mithram is a free directory. We do not charge customers or drivers any commission. You pay the driver directly based on the meter or agreed fare."
        }
      }
    ]
  };
}

function generateNearbyStands(townStands, currentStandSlug, districtId, townSlug) {
  return townStands
    .filter(s => slugify(s) !== currentStandSlug)
    .map(s => `<li><a href="/auto/${districtId}/${townSlug}/${slugify(s)}/" style="color: var(--accent); text-decoration: none;">➜ Auto near ${s}</a></li>`)
    .join('');
}

function generateNearbyTowns(districtTowns, currentTown, districtId) {
  let list = Object.keys(districtTowns)
    .filter(t => t !== currentTown)
    .map(t => `<li><a href="/auto/${districtId}/${slugify(t)}/" style="color: var(--accent); text-decoration: none;">➜ Auto Drivers in ${t}</a></li>`)
    .join('');
  
  list = `<li><a href="/auto-mithram/" style="color: var(--accent); text-decoration: none; font-weight: bold;">➜ All Districts Directory</a></li>` + list;
  return list;
}

async function generatePages() {
  console.log('Starting Auto Mithram SEO page generation...');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found at', templatePath);
    return;
  }
  
  const template = fs.readFileSync(templatePath, 'utf8');
  const generatedUrls = [];

  for (const [district, towns] of Object.entries(config)) {
    const districtId = district.toLowerCase();
    
      // 0. Generate District-Level Page
      const districtDir = path.join(rootDir, 'auto', districtId);
      if (!fs.existsSync(districtDir)) fs.mkdirSync(districtDir, { recursive: true });
      
      const titleDistrict = `Auto Drivers in ${district} District | Auto Mithram`;
      const metaDistrict = `Find verified autorickshaw drivers across ${district} district. Get direct contact numbers for auto stands in ${Object.keys(towns).join(', ')}. No commissions.`;
      const h1District = `Find Verified Auto Drivers in ${district} District`;
      
      const breadcrumbsDistrict = `<span class="separator"></span><a href="/auto-mithram/">All Districts</a><span class="separator"></span><span class="current">${district}</span>`;
      
      const breadcrumbSchemaDistrict = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Auto Mithram", "item": "https://servekerala.in/auto-mithram/" },
          { "@type": "ListItem", "position": 2, "name": district, "item": `https://servekerala.in/auto/${districtId}/` }
        ]
      };
      
      const districtSchema = {
        "@context": "https://schema.org",
        "@type": "TaxiService",
        "name": "Auto Drivers in " + district + " District",
        "description": metaDistrict,
        "areaServed": { "@type": "AdministrativeArea", "name": district },
        "provider": { "@type": "LocalBusiness", "name": "Auto Mithram - " + district }
      };
      const districtSchemaScript = `<script type="application/ld+json">\n${JSON.stringify(districtSchema, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchemaDistrict, null, 2)}\n</script>`;

      const districtTownsList = Object.keys(towns).map(t => `<li><a href="/auto/${districtId}/${slugify(t)}/" style="color: var(--accent); text-decoration: none;">➜ Auto Drivers in ${t}</a></li>`).join('');
      const nearbyTownsDistrictHTML = `<li><a href="/auto-mithram/" style="color: var(--accent); text-decoration: none; font-weight: bold;">➜ All Districts Directory</a></li>` + districtTownsList;

      let htmlDistrict = template
        .replace(/\{\{TITLE\}\}/g, titleDistrict)
        .replace(/\{\{META_DESCRIPTION\}\}/g, metaDistrict)
        .replace(/\{\{H1_HEADING\}\}/g, h1District)
        .replace(/\{\{SEO_HERO_IMAGE\}\}/g, getHeroImage(district))
        .replace(/\{\{STAND_NAME_DISPLAY\}\}/g, `${district} District`)
        .replace(/\{\{SEO_NEARBY_DESTINATIONS\}\}/g, '')
        .replace(/\{\{SEO_FAQS\}\}/g, generateFaqs(`${district} district`))
        .replace(/\{\{SEO_NEARBY_STANDS\}\}/g, '')
        .replace(/\{\{SEO_NEARBY_TOWNS\}\}/g, nearbyTownsDistrictHTML)
        .replace(/\{\{TOWN_NAME\}\}/g, district)
        .replace(/\{\{DISTRICT_NAME\}\}/g, district)
        .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
        .replace(/\{\{STAND_NAME\}\}/g, '')
        .replace(/\{\{BREADCRUMB_TRAIL\}\}/g, breadcrumbsDistrict)
        .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/auto/${districtId}/" />`)
        .replace(/\{\{OG_TAGS\}\}/g, `
    <meta property="og:title" content="${titleDistrict}" />
    <meta property="og:description" content="${metaDistrict}" />
    <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
    <meta property="og:url" content="https://servekerala.in/auto/${districtId}/" />
    <meta property="og:type" content="website" />`);

      htmlDistrict = htmlDistrict.replace('</head>', `  ${districtSchemaScript}\n</head>`);
      fs.writeFileSync(path.join(districtDir, 'index.html'), htmlDistrict, 'utf8');
      console.log(`Generated District Page: /auto/${districtId}/`);
      generatedUrls.push(`https://servekerala.in/auto/${districtId}/`);

    for (const [town, stands] of Object.entries(towns)) {
      const townSlug = slugify(town);
      
      // 1. Generate Town-Level Page
      const townDir = path.join(rootDir, 'auto', districtId, townSlug);
      if (!fs.existsSync(townDir)) fs.mkdirSync(townDir, { recursive: true });
      
      const titleTown = `Auto Drivers in ${town} | Auto Mithram`;
      const metaTown = `Find verified autorickshaw drivers in ${town}. Call or WhatsApp drivers from local stands like ${stands[0]} without any commissions.`;
      const h1Town = `Find Verified Auto Drivers in ${town}`;
      const breadcrumbsTown = `<span class="separator"></span><a href="/auto/${districtId}/">${district}</a><span class="separator"></span><span class="current">${town}</span>`;
      
      const breadcrumbSchemaTown = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Auto Mithram", "item": "https://servekerala.in/auto-mithram/" },
          { "@type": "ListItem", "position": 2, "name": district, "item": `https://servekerala.in/auto/${districtId}/` },
          { "@type": "ListItem", "position": 3, "name": town, "item": `https://servekerala.in/auto/${districtId}/${townSlug}/` }
        ]
      };
      
      const townSchema = {
        "@context": "https://schema.org",
        "@type": "TaxiService",
        "name": "Auto Drivers in " + town + ", " + district,
        "description": metaTown,
        "areaServed": { "@type": "City", "name": town, "containedInPlace": { "@type": "AdministrativeArea", "name": district } },
        "provider": { "@type": "LocalBusiness", "name": "Auto Mithram - " + town }
      };
      const townSchemaScript = `<script type="application/ld+json">\n${JSON.stringify(townSchema, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchemaTown, null, 2)}\n</script>`;

      let htmlTown = template
        .replace(/\{\{TITLE\}\}/g, titleTown)
        .replace(/\{\{META_DESCRIPTION\}\}/g, metaTown)
        .replace(/\{\{H1_HEADING\}\}/g, h1Town)
        .replace(/\{\{SEO_HERO_IMAGE\}\}/g, getHeroImage(town))
        .replace(/\{\{STAND_NAME_DISPLAY\}\}/g, `${town} Town`)
        .replace(/\{\{SEO_NEARBY_DESTINATIONS\}\}/g, generateNearbyDestinations(town, town))
        .replace(/\{\{SEO_FAQS\}\}/g, generateFaqs(town))
        .replace(/\{\{SEO_NEARBY_STANDS\}\}/g, generateNearbyStands(stands, '', districtId, townSlug))
        .replace(/\{\{SEO_NEARBY_TOWNS\}\}/g, generateNearbyTowns(towns, town, districtId))
        .replace(/\{\{TOWN_NAME\}\}/g, town)
        .replace(/\{\{DISTRICT_NAME\}\}/g, district)
        .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
        .replace(/\{\{STAND_NAME\}\}/g, '')
        .replace(/\{\{BREADCRUMB_TRAIL\}\}/g, breadcrumbsTown)
        .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/auto/${districtId}/${townSlug}/" />`)
        .replace(/\{\{OG_TAGS\}\}/g, `
  <meta property="og:title" content="${titleTown}" />
  <meta property="og:description" content="${metaTown}" />
  <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
  <meta property="og:url" content="https://servekerala.in/auto/${districtId}/${townSlug}/" />
  <meta property="og:type" content="website" />`);

      htmlTown = htmlTown.replace('</head>', `  ${townSchemaScript}\n  <script type="application/ld+json">\n${JSON.stringify(generateFaqSchema(town), null, 2)}\n</script>\n</head>`);

      fs.writeFileSync(path.join(townDir, 'index.html'), htmlTown, 'utf8');
      console.log(`Generated Town Page: /auto/${districtId}/${townSlug}/`);
      generatedUrls.push(`https://servekerala.in/auto/${districtId}/${townSlug}/`);
      
      // 2. Generate Stand-Level Pages
      for (const stand of stands) {
        const standSlug = slugify(stand);
        const standDir = path.join(rootDir, 'auto', districtId, townSlug, standSlug);
        if (!fs.existsSync(standDir)) fs.mkdirSync(standDir, { recursive: true });
        
        // Exact wording as requested by user
        const titleStand = `Auto at ${stand} | Verified Auto Drivers | Auto Mithram`;
        const metaStand = `Looking for an auto at ${stand}? Find verified local auto drivers, direct phone numbers, WhatsApp contact, nearby destinations, estimated fares, and 24/7 availability with Auto Mithram.`;
        const h1Stand = `Find Verified Auto Drivers at ${stand}`;
        const breadcrumbsStand = `<span class="separator"></span><a href="/auto/${districtId}/">${district}</a><span class="separator"></span><a href="/auto/${districtId}/${townSlug}/">${town}</a><span class="separator"></span><span class="current">${stand}</span>`;

        const breadcrumbSchemaStand = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Auto Mithram", "item": "https://servekerala.in/auto-mithram/" },
            { "@type": "ListItem", "position": 2, "name": district, "item": `https://servekerala.in/auto/${districtId}/` },
            { "@type": "ListItem", "position": 3, "name": town, "item": `https://servekerala.in/auto/${districtId}/${townSlug}/` },
            { "@type": "ListItem", "position": 4, "name": stand, "item": `https://servekerala.in/auto/${districtId}/${townSlug}/${standSlug}/` }
          ]
        };
        
        const standSchema = {
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": "Auto Stand near " + stand + ", " + town,
          "description": metaStand,
          "areaServed": { "@type": "Place", "name": stand, "containedInPlace": { "@type": "City", "name": town } },
          "provider": { "@type": "LocalBusiness", "name": "Auto Mithram - " + stand + " Stand" }
        };
        const standSchemaScript = `<script type="application/ld+json">\n${JSON.stringify(standSchema, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchemaStand, null, 2)}\n</script>`;

        let htmlStand = template
          .replace(/\{\{TITLE\}\}/g, titleStand)
          .replace(/\{\{META_DESCRIPTION\}\}/g, metaStand)
          .replace(/\{\{H1_HEADING\}\}/g, h1Stand)
          .replace(/\{\{SEO_HERO_IMAGE\}\}/g, getHeroImage(stand))
          .replace(/\{\{STAND_NAME_DISPLAY\}\}/g, `${stand}, ${town}`)
          .replace(/\{\{SEO_NEARBY_DESTINATIONS\}\}/g, generateNearbyDestinations(stand, town))
          .replace(/\{\{SEO_FAQS\}\}/g, generateFaqs(`the ${stand} stand`))
          .replace(/\{\{SEO_NEARBY_STANDS\}\}/g, generateNearbyStands(stands, standSlug, districtId, townSlug))
          .replace(/\{\{SEO_NEARBY_TOWNS\}\}/g, generateNearbyTowns(towns, town, districtId))
          .replace(/\{\{TOWN_NAME\}\}/g, town)
          .replace(/\{\{DISTRICT_NAME\}\}/g, district)
          .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
          .replace(/\{\{STAND_NAME\}\}/g, stand)
          .replace(/\{\{BREADCRUMB_TRAIL\}\}/g, breadcrumbsStand)
          .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/auto/${districtId}/${townSlug}/${standSlug}/" />`)
          .replace(/\{\{OG_TAGS\}\}/g, `
  <meta property="og:title" content="${titleStand}" />
  <meta property="og:description" content="${metaStand}" />
  <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
  <meta property="og:url" content="https://servekerala.in/auto/${districtId}/${townSlug}/${standSlug}/" />
  <meta property="og:type" content="website" />`);

        htmlStand = htmlStand.replace('</head>', `  ${standSchemaScript}\n  <script type="application/ld+json">\n${JSON.stringify(generateFaqSchema(`the ${stand} stand`), null, 2)}\n</script>\n</head>`);

        fs.writeFileSync(path.join(standDir, 'index.html'), htmlStand, 'utf8');
        console.log(`Generated Stand Page: /auto/${districtId}/${townSlug}/${standSlug}/`);
        generatedUrls.push(`https://servekerala.in/auto/${districtId}/${townSlug}/${standSlug}/`);
      }
    }
  }
  
  console.log(`\nSuccessfully generated ${generatedUrls.length} Auto Mithram SEO pages.`);
}

fetchConfig().then(remoteConfig => {
  if (false) {
    console.log('Using Remote Auto Configuration from Firebase! Merging with local config...');
    for (const district in remoteConfig) {
      if (!config[district]) config[district] = {};
      for (const town in remoteConfig[district]) {
        if (!config[district][town]) config[district][town] = [];
        // Add unique stands
        const localStands = config[district][town];
        const remoteStands = remoteConfig[district][town];
        config[district][town] = [...new Set([...localStands, ...remoteStands])];
      }
    }
  }
  generatePages().catch(console.error);
});
