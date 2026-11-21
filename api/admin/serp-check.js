/**
 * Live Google SERP Checker API Endpoint
 * Queries live Google India results via Serper.dev (Free tier: 2,500 queries/mo)
 * Detects real-time ranking positions for servekerala.in and competitors
 */
const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { keyword, apiKey, domain = 'servekerala.in', competitors = [] } = req.body || {};

    if (!keyword) {
      return res.status(400).json({ success: false, error: 'Keyword is required.' });
    }

    const key = apiKey || process.env.SERPER_API_KEY;
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'NO_API_KEY',
        message: 'Serper.dev API key is required to query live Google rankings. Get 2,500 free searches/month at https://serper.dev'
      });
    }

    // Call Serper.dev Google Search API
    const postData = JSON.stringify({
      q: keyword,
      gl: 'in', // Google India
      hl: 'en',
      num: 40   // Top 40 results
    });

    const searchResults = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'google.serper.dev',
        path: '/search',
        method: 'POST',
        headers: {
          'X-API-KEY': key.trim(),
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 10000
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(new Error('Failed to parse Serper JSON response.'));
            }
          } else {
            let errMsg = `Serper API Error (HTTP ${response.statusCode})`;
            try {
              const errObj = JSON.parse(data);
              if (errObj.message) errMsg += `: ${errObj.message}`;
            } catch (e) {}
            reject(new Error(errMsg));
          }
        });
      });

      request.on('error', err => reject(err));
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Google Serper API timed out after 10s.'));
      });

      request.write(postData);
      request.end();
    });

    const organic = searchResults.organic || [];
    let servekeralaPosition = null;
    let servekeralaUrl = null;
    let servekeralaTitle = null;

    const competitorRanks = {};
    (competitors || ['justdial.com', 'sulekha.com', 'indiamart.com', 'naatilepani.com']).forEach(c => {
      competitorRanks[c] = null;
    });

    // Inspect organic results for target and competitor domains
    organic.forEach((item, index) => {
      const rank = item.position || (index + 1);
      const link = (item.link || '').toLowerCase();

      // Check main domain
      if (!servekeralaPosition && link.includes(domain.toLowerCase())) {
        servekeralaPosition = rank;
        servekeralaUrl = item.link;
        servekeralaTitle = item.title;
      }

      // Check competitors
      for (const comp of Object.keys(competitorRanks)) {
        if (!competitorRanks[comp] && link.includes(comp.toLowerCase())) {
          competitorRanks[comp] = rank;
        }
      }
    });

    return res.status(200).json({
      success: true,
      live: true,
      keyword,
      position: servekeralaPosition,
      url: servekeralaUrl,
      title: servekeralaTitle,
      competitors: competitorRanks,
      totalScanned: organic.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('SERP Check error:', error);
    return res.status(500).json({
      success: false,
      error: 'SERP_FETCH_FAILED',
      message: error.message || 'Failed to query live Google SERP.'
    });
  }
};
