const https = require('https');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const name = parsedUrl.searchParams.get('name');
  if (!name || !name.startsWith('places/')) {
    res.status(400).json({ error: 'Missing or invalid photo name parameter. Must start with "places/"' });
    return;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Google Places API key is not configured on the server.' });
    return;
  }

  const photoUrl = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=1200`;

  try {
    console.log('Proxying Places photo:', name);
    const response = await fetch(photoUrl);

    if (!response.ok) {
      res.status(response.status).json({ error: 'Google Places Photo API request failed' });
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable'); // Cache for 24h

    // Get buffer and send
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.status(200).send(buffer);

  } catch (err) {
    console.error('Proxy photo request failed:', err);
    res.status(500).json({ error: 'Internal server error while retrieving photo.' });
  }
};
