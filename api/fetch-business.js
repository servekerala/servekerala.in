const https = require('https');

// Helper to follow redirects and get final URL
async function resolveRedirects(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        return resolveRedirects(location);
      }
    }
    return url;
  } catch (err) {
    console.error('Error resolving redirects:', err);
    return url;
  }
}

// Simple Helper to fetch text content
async function fetchText(url) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(id);
    return await res.text();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Parse website details using regex
function parseWebsiteHtml(html, url) {
  const result = {
    source: 'website',
    name: '',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    website: url,
    socials: { facebook: '', instagram: '', linkedin: '', youtube: '' }
  };

  // Title -> Business Name
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    result.name = titleMatch[1].split('|')[0].split('-')[0].trim();
  }

  // Meta Description -> Tagline / Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) {
    result.tagline = descMatch[1].substring(0, 150).trim();
    result.description = descMatch[1].trim();
  }

  // Phone match (Indian formats e.g. +91 98765 43210 or 0481 234567)
  const phoneMatch = html.match(/tel:([^"'>\s]+)/i) || 
                     html.match(/(?:\+91|0)[0-9\-\s]{10,14}/);
  if (phoneMatch) {
    result.phone = phoneMatch[1] ? phoneMatch[1].replace(/[^0-9+]/g, '') : phoneMatch[0].trim();
  }

  // Email match
  const emailMatch = html.match(/mailto:([^"'>\s]+)/i) ||
                     html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.email = emailMatch[1] ? emailMatch[1].trim() : emailMatch[0].trim();
  }

  // Social Links
  const fbMatch = html.match(/href=["'](https?:\/\/(?:www\.)?facebook\.com\/[^"'\s>]+)["']/i);
  if (fbMatch) result.socials.facebook = fbMatch[1];

  const igMatch = html.match(/href=["'](https?:\/\/(?:www\.)?instagram\.com\/[^"'\s>]+)["']/i);
  if (igMatch) result.socials.instagram = igMatch[1];

  const liMatch = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/[^"'\s>]+)["']/i);
  if (liMatch) result.socials.linkedin = liMatch[1];

  const ytMatch = html.match(/href=["'](https?:\/\/(?:www\.)?youtube\.com\/[^"'\s>]+)["']/i);
  if (ytMatch) result.socials.youtube = ytMatch[1];

  return result;
}

// Handler for Vercel serverless function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const queryUrl = parsedUrl.searchParams.get('url') || (req.body && req.body.url);
  if (!queryUrl) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    // 1. Check if it's a website search or GBP link
    const isGoogleLink = queryUrl.includes('google.com') || 
                         queryUrl.includes('maps.app.goo.gl') || 
                         queryUrl.includes('goo.gl') ||
                         queryUrl.match(/^[A-Za-z0-9_-]{20,50}$/); // raw Place ID check

    if (!isGoogleLink) {
      // Treat as website URL
      const resolvedUrl = queryUrl.startsWith('http') ? queryUrl : `https://${queryUrl}`;
      console.log('Fetching website:', resolvedUrl);
      const html = await fetchText(resolvedUrl);
      const details = parseWebsiteHtml(html, resolvedUrl);
      res.status(200).json(details);
      return;
    }

    // Treat as Google Maps / GBP
    if (!apiKey) {
      res.status(500).json({ error: 'Google Places API key is not configured on the server.' });
      return;
    }

    let placeId = null;
    let textSearchQuery = null;

    if (queryUrl.match(/^[A-Za-z0-9_-]{20,50}$/)) {
      // It's a raw Place ID
      placeId = queryUrl;
    } else {
      // Resolve redirects for shortened Google Maps links
      const resolvedUrl = await resolveRedirects(queryUrl);
      console.log('Resolved maps link:', resolvedUrl);

      // Attempt to match Place ID inside maps link
      const placeIdMatch = resolvedUrl.match(/place_id=([A-Za-z0-9_-]+)/) ||
                           resolvedUrl.match(/ftid=([A-Za-z0-9_-]+)/) ||
                           resolvedUrl.match(/\/places\/([A-Za-z0-9_-]+)/);
      
      if (placeIdMatch) {
        placeId = placeIdMatch[1];
      } else {
        // Match cid hex parameters or hex strings
        const hexMatch = resolvedUrl.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
        if (hexMatch) {
          // If we got the CID, we can perform a text search with it or search query
          textSearchQuery = hexMatch[1];
        } else {
          // Extract name from maps/place/Name
          const placeNameMatch = resolvedUrl.match(/\/maps\/place\/([^\/\?]+)/);
          if (placeNameMatch) {
            textSearchQuery = decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' '));
          }
        }
      }
    }

    // 2. Resolve placeId via Text Search if we don't have one directly
    if (!placeId && textSearchQuery) {
      console.log('Performing Places API Text Search for:', textSearchQuery);
      const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
        },
        body: JSON.stringify({ textQuery: textSearchQuery })
      });
      const searchJson = await searchRes.json();
      if (searchJson.places && searchJson.places.length > 0) {
        placeId = searchJson.places[0].id;
      }
    }

    if (!placeId) {
      res.status(404).json({ error: 'Could not identify a Google Place ID from the provided link.' });
      return;
    }

    // 3. Fetch Place Details
    console.log('Fetching Place Details for:', placeId);
    const detailsRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,regularOpeningHours,location,googleMapsUri,photos'
      }
    });

    if (!detailsRes.ok) {
      const errText = await detailsRes.text();
      res.status(detailsRes.status).json({ error: 'Google Place Details lookup failed', details: errText });
      return;
    }

    const place = await detailsRes.json();
    
    // Map opening hours into standard ServeKerala format
    const hours = {};
    if (place.regularOpeningHours && place.regularOpeningHours.periods) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Initialize all days as closed
      days.forEach(d => {
        hours[d] = { closed: true, open: false, open24Hours: false, openTime: '', closeTime: '' };
      });

      place.regularOpeningHours.periods.forEach(p => {
        const openDayIndex = p.open && p.open.day;
        if (openDayIndex !== undefined && openDayIndex >= 0 && openDayIndex < 7) {
          const dayName = days[openDayIndex];
          const openH = p.open.hour !== undefined ? String(p.open.hour).padStart(2, '0') : '09';
          const openM = p.open.minute !== undefined ? String(p.open.minute).padStart(2, '0') : '00';
          
          let closed = false;
          let open24Hours = false;
          let closeTime = '';
          
          if (!p.close) {
            // Google uses open but no close to represent 24 hours
            open24Hours = true;
          } else {
            const closeH = String(p.close.hour).padStart(2, '0');
            const closeM = String(p.close.minute).padStart(2, '0');
            closeTime = `${closeH}:${closeM}`;
            if (openH === '00' && openM === '00' && closeH === '23' && closeM === '59') {
              open24Hours = true;
            }
          }

          hours[dayName] = {
            closed,
            open: !closed,
            open24Hours,
            openTime: open24Hours ? '' : `${openH}:${openM}`,
            closeTime: open24Hours ? '' : closeTime
          };
        }
      });
    }

    // Map output schema
    const result = {
      source: 'google',
      name: place.displayName ? place.displayName.text : '',
      address: place.formattedAddress || '',
      phone: place.nationalPhoneNumber || '',
      website: place.websiteUri || '',
      googlePlaceId: place.id || placeId,
      googleMapsUrl: place.googleMapsUri || '',
      latitude: place.location ? place.location.latitude : null,
      longitude: place.location ? place.location.longitude : null,
      hours: Object.keys(hours).length > 0 ? hours : null,
      photos: place.photos ? place.photos.slice(0, 5).map(p => p.name) : []
    };

    res.status(200).json(result);

  } catch (err) {
    console.error('Fetch business info failed:', err);
    res.status(500).json({ error: 'Internal server error while resolving business details.', message: err.message });
  }
};
