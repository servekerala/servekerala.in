const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const templatePath = path.join(__dirname, 'seo-template.html');
const districtTemplatePath = path.join(__dirname, 'district-seo-template.html');
const districtServiceTemplatePath = path.join(__dirname, 'district-service-seo-template.html');
const townHubTemplatePath = path.join(__dirname, 'town-hub-seo-template.html');
const sitemapPath = path.join(rootDir, 'sitemap.xml');


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
          if (!response.fields || !response.fields.service_directory) return resolve(null);
          
          // Parse the JSON string from the Firestore field if it's stored as a string,
          // but wait, in admin.js I set it as an object!
          // Actually, in admin.js we parsed it into an object and set it in Firestore.
          // Firestore stores maps. To parse it from REST API is annoying.
          // Let me just fetch it, but wait, the REST API returns deeply nested mapValue objects.
          // Let's create a recursive parser, or just use the default hardcoded data if it's too complex.
          // Wait, actually, admin.js saves it as a complex object.
          // Let me use a recursive parser for Firestore REST fields.
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
          resolve(config.service_directory);
        } catch (err) {
          console.error('Error parsing config:', err);
          resolve(null);
        }
      });
    }).on('error', err => resolve(null));
  });
}

// Configuration
let districtsWithTowns = {
  'Kottayam': ['Kottayam', 'Changanacherry', 'Ettumanoor', 'Pala'],
  'Pathanamthitta': ['Thiruvalla', 'Adoor', 'Ranni', 'Kozhencherry', 'Pandalam'],
  'Alappuzha': ['Alappuzha', 'Chengannur', 'Cherthala', 'Kayamkulam'],
  'Kollam': ['Kollam', 'Karunagappally', 'Kottarakkara', 'Punalur']
};

const services = [
  { id: 'solar', slug: 'solar-installation', name: 'Solar Installation', plural: 'Solar Installers' },
  { id: 'plumbing', slug: 'plumber', name: 'Plumber', plural: 'Plumbers' },
  { id: 'electrical', slug: 'electrician', name: 'Electrician', plural: 'Electricians' },
  { id: 'ac', slug: 'ac-service', name: 'AC Service', plural: 'AC Service Technicians' },
  { id: 'cctv', slug: 'cctv-installation', name: 'CCTV Installation', plural: 'CCTV Technicians' },
  { id: 'cleaning', slug: 'home-cleaning', name: 'Home Cleaning', plural: 'Home Cleaners' },
  { id: 'pest', slug: 'pest-control', name: 'Pest Control', plural: 'Pest Control Services' },
  { id: 'water', slug: 'water-purifier-service', name: 'Water Purifier Service', plural: 'Water Purifier Technicians' }
];

function generateFaqs(servicePlural, town, district) {
  return `
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">How should I confirm a provider is right for my job?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">Review the provider's profile and contact them directly to confirm service coverage, availability, pricing, and any qualifications needed for your job.</p>
    </details>
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">How do I contact a provider?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">When a listing is available, use its call or WhatsApp option to contact the business directly. If no listing appears yet, browse a nearby town or check back later.</p>
    </details>
    <details style="background: var(--bg-surface); padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid var(--border-color); cursor: pointer;">
      <summary style="font-weight: 600; color: var(--text-main); font-size: 16px;">Do you charge any commission for booking?</summary>
      <p style="color: var(--text-muted); margin-top: 12px; line-height: 1.6; font-size: 15px;">No, ServeKerala is an open local lead marketplace. We do not charge customers or professionals any commission. You negotiate and pay the professional directly.</p>
    </details>
  `;
}

function generateNearbyTowns(currentTown, allTownsInDistrict, districtId, serviceSlug, district) {
  let list = allTownsInDistrict
    .filter(t => t !== currentTown)
    .map(t => `<li><a href="/${districtId}/${serviceSlug}/${t.toLowerCase()}/" style="color: var(--primary); text-decoration: none;">➜ ${t}</a></li>`)
    .join('');
  
  if (district) {
    list = `<li><a href="/${districtId}/${serviceSlug}/" style="color: var(--primary); text-decoration: none; font-weight: bold;">➜ All ${district} Towns</a></li>` + list;
  }
  return list;
}

function generateRelatedServices(currentServiceSlug, districtId, townSlug) {
  return services
    .filter(s => s.slug !== currentServiceSlug)
    .map(s => `<li><a href="/${districtId}/${s.slug}/${townSlug}/" style="color: var(--primary); text-decoration: none;">➜ ${s.name}</a></li>`)
    .join('');
}

async function generatePages() {
  console.log('Starting Deep Town-Level SEO page generation...');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found at', templatePath);
    return;
  }
  
  const template = fs.readFileSync(templatePath, 'utf8');
  const districtTemplate = fs.existsSync(districtTemplatePath) ? fs.readFileSync(districtTemplatePath, 'utf8') : '';
  const districtServiceTemplate = fs.existsSync(districtServiceTemplatePath) ? fs.readFileSync(districtServiceTemplatePath, 'utf8') : '';
  const townHubTemplate = fs.existsSync(townHubTemplatePath) ? fs.readFileSync(townHubTemplatePath, 'utf8') : '';
  const generatedUrls = [];

  for (const [district, towns] of Object.entries(districtsWithTowns)) {
    const districtId = district.toLowerCase();
    
    for (const service of services) {
      const { id: serviceId, slug: serviceSlug, name: serviceName, plural: servicePlural } = service;
      
      const displayService = (serviceId === 'solar' || serviceId === 'cctv' || serviceId === 'ac' || serviceId === 'cleaning' || serviceId === 'pest' || serviceId === 'water') ? serviceName : servicePlural;

      // Generate District-Service Middle Hub
      if (districtServiceTemplate) {
        const middleDir = path.join(rootDir, districtId, serviceSlug);
        if (!fs.existsSync(middleDir)) fs.mkdirSync(middleDir, { recursive: true });
        
        const middleFile = path.join(middleDir, 'index.html');
        
        const title = `${displayService} in ${district} | ServeKerala`;
        const metaDesc = `Browse ${servicePlural.toLowerCase()} by town in ${district}. View available business profiles and contact providers directly.`;
        const h1 = `${servicePlural} in ${district}`;
        const introText = `Browse towns in ${district} to find local ${servicePlural.toLowerCase()}. Listing availability varies by town; contact each provider directly to confirm service coverage and availability.`;
        
        const districtTownsHtml = towns.map(t => {
          return `
          <a href="/${districtId}/${serviceSlug}/${t.toLowerCase()}/" class="card" style="padding: 24px; text-align: center; height: auto; border-radius: 16px; border: 1px solid var(--border-color); text-decoration: none;">
            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">${t}</h3>
          </a>
          `;
        }).join('');
        
        let html = districtServiceTemplate
          .replace(/\{\{TITLE\}\}/g, title)
          .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
          .replace(/\{\{H1_HEADING\}\}/g, h1)
          .replace(/\{\{SEO_INTRO\}\}/g, introText)
          .replace(/\{\{DISTRICT_NAME\}\}/g, district)
          .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
          .replace(/\{\{SERVICE_NAME\}\}/g, serviceName)
          .replace(/\{\{SERVICE_SLUG\}\}/g, serviceSlug)
          .replace(/\{\{DISTRICT_TOWNS_HTML\}\}/g, districtTownsHtml)
          .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/${districtId}/${serviceSlug}/" />`)
          .replace(/\{\{OG_TAGS\}\}/g, '');
          
        fs.writeFileSync(middleFile, html, 'utf8');
        console.log(`Generated Middle Hub: /${districtId}/${serviceSlug}/`);
        generatedUrls.push(`https://servekerala.in/${districtId}/${serviceSlug}/`);
      }
      
      for (const town of towns) {
        const townSlug = town.toLowerCase();
        
        const targetDir = path.join(rootDir, districtId, serviceSlug, townSlug);
        
        // Ensure directory exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const targetFile = path.join(targetDir, 'index.html');
        
        // Replacements
        const displayServiceTown = (serviceId === 'solar' || serviceId === 'cctv' || serviceId === 'ac' || serviceId === 'cleaning' || serviceId === 'pest' || serviceId === 'water') ? serviceName : servicePlural;
        
        const titleTown = `${displayServiceTown} in ${town} | ServeKerala`;
        const placeName = town.toLowerCase() === district.toLowerCase() ? town : `${town}, ${district}`;
        const metaDesc = `Browse local ${servicePlural.toLowerCase()} in ${town}. View available business profiles and contact providers directly.`;
        const h1 = `${servicePlural} in ${town}`;
        
        // Unique Intro to avoid thin content
        const introText = `
          <p style="margin-bottom: 16px;">
            Browse local <strong>${servicePlural.toLowerCase()} in ${placeName}</strong>. Check each profile for the services and contact options provided by the business.
          </p>
          <p style="margin-bottom: 16px;">
            Listings may vary by area. Contact a provider directly to confirm service coverage, availability, pricing, and any qualifications needed for your project. ServeKerala does not charge customers a booking commission.
          </p>
        `;
        
        const faqs = generateFaqs(servicePlural, town, district);
        const nearbyTowns = generateNearbyTowns(town, towns, districtId, serviceSlug, district);
        const relatedServices = generateRelatedServices(serviceSlug, districtId, townSlug);
        
        
        const schema = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": servicePlural + " in " + placeName,
          "description": metaDesc,
          "url": `https://servekerala.in/${districtId}/${serviceSlug}/${townSlug}/`
        };

        const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
        
        let html = template
          .replace(/\{\{TITLE\}\}/g, titleTown)
          .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
          .replace(/\{\{H1_HEADING\}\}/g, h1)
          .replace(/\{\{SEO_INTRO\}\}/g, introText)
          .replace(/\{\{SEO_FAQS\}\}/g, faqs)
          .replace(/\{\{SEO_NEARBY_TOWNS\}\}/g, nearbyTowns)
          .replace(/\{\{SEO_RELATED_SERVICES\}\}/g, relatedServices)
          .replace(/\{\{SERVICE_NAME\}\}/g, serviceName)
          .replace(/\{\{SERVICE_SLUG\}\}/g, serviceSlug)
          .replace(/\{\{TOWN_NAME\}\}/g, town)
          .replace(/\{\{DISTRICT_NAME\}\}/g, district)
          .replace(/\{\{SERVICE_ID\}\}/g, serviceId)
          .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
          .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/${districtId}/${serviceSlug}/${townSlug}/" />`)
          .replace(/\{\{OG_TAGS\}\}/g, `
  <meta property="og:title" content="${titleTown}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:image" content="https://servekerala.in/assets/images/logo.png" />
  <meta property="og:url" content="https://servekerala.in/${districtId}/${serviceSlug}/${townSlug}/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${titleTown}" />
  <meta name="twitter:description" content="${metaDesc}" />
  <meta name="twitter:image" content="https://servekerala.in/assets/images/logo.png" />`);

        // Inject schema before </head>
        html = html.replace('</head>', `  ${schemaScript}
</head>`);

          
        fs.writeFileSync(targetFile, html, 'utf8');
        console.log(`Generated: /${districtId}/${serviceSlug}/${townSlug}/`);
        
        generatedUrls.push(`https://servekerala.in/${districtId}/${serviceSlug}/${townSlug}/`);
      }
    }
    
    // Generate Town Hub Pages
    if (townHubTemplate) {
      for (const town of towns) {
        const townSlug = town.toLowerCase();
        const targetDir = path.join(rootDir, districtId, townSlug);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const targetFile = path.join(targetDir, 'index.html');
        const title = `Local Services in ${town} | ServeKerala`;
        const metaDesc = `Browse local service categories and provider listings in ${town}, ${district}. Contact businesses directly to confirm availability.`;
        const h1 = `Local Services in ${town}`;
        const introText = `Browse service categories and available local business listings in ${town}, ${district}. Contact providers directly to confirm coverage and availability.`;
        
        let townServicesHtml = services.map(s => {
          return `
          <a href="/${districtId}/${s.slug}/${townSlug}/" class="card" style="padding: 24px; text-align: left; height: auto; border-radius: 16px; border: 1px solid var(--border-color); text-decoration: none;">
            <h3 style="font-size: 18px; color: var(--primary); margin-bottom: 8px;">${s.name}</h3>
            <p style="color: var(--text-muted); font-size: 14px; margin: 0;">Find ${s.plural.toLowerCase()} in ${town}</p>
          </a>
          `;
        }).join('');
        
        let html = townHubTemplate
          .replace(/\{\{TITLE\}\}/g, title)
          .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
          .replace(/\{\{H1_HEADING\}\}/g, h1)
          .replace(/\{\{SEO_INTRO\}\}/g, introText)
          .replace(/\{\{TOWN_NAME\}\}/g, town)
          .replace(/\{\{DISTRICT_NAME\}\}/g, district)
          .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
          .replace(/\{\{TOWN_SERVICES_HTML\}\}/g, townServicesHtml)
          .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/${districtId}/${townSlug}/" />`)
          .replace(/\{\{OG_TAGS\}\}/g, '');
          
        fs.writeFileSync(targetFile, html, 'utf8');
        console.log(`Generated Town Hub: /${districtId}/${townSlug}/`);
        generatedUrls.push(`https://servekerala.in/${districtId}/${townSlug}/`);
      }
    }
    
    // Generate District Hub Page
    if (districtTemplate) {
      const targetDir = path.join(rootDir, districtId);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetFile = path.join(targetDir, 'index.html');
      const title = `Local Services in ${district} | ServeKerala`;
      const metaDesc = `Browse local service categories and provider listings in ${district}. Contact businesses directly to confirm availability.`;
      const h1 = `Local Services in ${district}`;
      const introText = `Browse service categories and available local business listings across ${district}. Select a town or service to view current listings.`;
      
      let districtServicesHtml = services.map(s => {
        return `
        <a href="/${districtId}/${s.slug}/" class="card" style="padding: 24px; text-align: left; height: auto; border-radius: 16px; border: 1px solid var(--border-color); text-decoration: none;">
          <h3 style="font-size: 18px; color: var(--primary); margin-bottom: 8px;">${s.name}</h3>
          <p style="color: var(--text-muted); font-size: 14px; margin: 0;">Find ${s.plural.toLowerCase()} in ${district}</p>
        </a>
        `;
      }).join('');
      
      const districtTownsHtml = towns.map(t => {
        return `<li><a href="/${districtId}/${t.toLowerCase()}/" style="color: var(--primary); text-decoration: none;">➜ ${t}</a></li>`;
      }).join('');
      
      let html = districtTemplate
        .replace(/\{\{TITLE\}\}/g, title)
        .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
        .replace(/\{\{H1_HEADING\}\}/g, h1)
        .replace(/\{\{SEO_INTRO\}\}/g, introText)
        .replace(/\{\{DISTRICT_NAME\}\}/g, district)
        .replace(/\{\{DISTRICT_ID\}\}/g, districtId)
        .replace(/\{\{DISTRICT_SERVICES_HTML\}\}/g, districtServicesHtml)
        .replace(/\{\{DISTRICT_TOWNS_HTML\}\}/g, districtTownsHtml)
        .replace(/\{\{CANONICAL_TAG\}\}/g, `<link rel="canonical" href="https://servekerala.in/${districtId}/" />`)
        .replace(/\{\{OG_TAGS\}\}/g, '');
        
      fs.writeFileSync(targetFile, html, 'utf8');
      console.log(`Generated District Hub: /${districtId}/`);
      generatedUrls.push(`https://servekerala.in/${districtId}/`);
    }
  }
  
  console.log(`\nSuccessfully generated ${generatedUrls.length} deep town-level pages.`);
}

fetchConfig().then(remoteConfig => {
  if (remoteConfig) {
    console.log('Using Remote Service Configuration from Firebase!');
    districtsWithTowns = remoteConfig;
  }
  generatePages().catch(console.error);
});
