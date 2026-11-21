const FIREBASE_PROJECT_ID = 'servekerala2026';
const FIREBASE_WEB_API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';

function reply(res, status, data) {
  return res.status(status).json(data);
}

function normalizeDomain(value) {
  return String(value || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, {error: 'Method not allowed.'});
  }

  const idToken = (req.headers.authorization || '').startsWith('Bearer ')
    ? req.headers.authorization.slice(7) : '';
  if (!idToken) return reply(res, 401, {error: 'Sign in to the admin dashboard and try again.'});

  try {
    const identityResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_API_KEY}`, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({idToken})
    });
    if (!identityResponse.ok) return reply(res, 401, {error: 'Your sign-in expired. Sign in again and retry.'});
    const identity = await identityResponse.json();
    const account = identity.users?.[0];
    if (!account?.emailVerified || account.email?.toLowerCase() !== 'servekerala.in@gmail.com') {
      return reply(res, 403, {error: 'Only the verified ServeKerala administrator can run rank checks.'});
    }

    const {DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD} = process.env;
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
      return reply(res, 503, {error: 'SERP provider is not configured. Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD to the server environment.'});
    }

    const body = req.body || {};
    const keyword = typeof body.keyword === 'string' ? body.keyword.trim().slice(0, 180) : '';
    const locationName = typeof body.locationName === 'string' ? body.locationName.trim().slice(0, 120) : '';
    const languageCode = typeof body.languageCode === 'string' && /^[a-z]{2,3}$/.test(body.languageCode) ? body.languageCode : 'en';
    const device = body.device === 'mobile' ? 'mobile' : 'desktop';
    const depth = Number(body.depth) === 100 ? 100 : 10;
    const targetDomain = normalizeDomain(body.targetDomain || 'servekerala.in');
    const competitors = Array.isArray(body.competitors)
      ? [...new Set(body.competitors.map(normalizeDomain).filter(domain => domain && domain.includes('.')))].slice(0, 5)
      : [];

    if (!keyword || !locationName || !targetDomain) return reply(res, 400, {error: 'Keyword, location, and target domain are required.'});
    if (keyword.length < 2 || locationName.length < 2) return reply(res, 400, {error: 'Enter a valid keyword and search location.'});

    const providerResponse = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{keyword, location_name: locationName, language_code: languageCode, device, depth}])
    });
    const providerData = await providerResponse.json();
    const task = providerData.tasks?.[0];
    if (!providerResponse.ok || !task || task.status_code !== 20000) {
      console.error('SERP provider returned an error:', task?.status_code, task?.status_message || providerResponse.status);
      return reply(res, 502, {error: task?.status_message || 'The SERP provider could not complete this ranking check.'});
    }

    const result = task.result?.[0] || {};
    const organicItems = (result.items || []).filter(item => item.type === 'organic');
    const entries = organicItems.map((item, index) => ({
      position: Number(item.rank_group || item.rank_absolute || index + 1),
      domain: normalizeDomain(item.domain || (() => { try { return new URL(item.url).hostname; } catch (_) { return ''; } })()),
      url: item.url || '',
      title: item.title || ''
    })).filter(item => item.domain);
    const trackedDomains = [targetDomain, ...competitors];
    const rankings = Object.fromEntries(trackedDomains.map(domain => {
      const match = entries.find(entry => entry.domain === domain || entry.domain.endsWith(`.${domain}`));
      return [domain, match ? {position: match.position, url: match.url, title: match.title} : null];
    }));

    return reply(res, 200, {
      keyword, locationName, languageCode, device, depth, targetDomain, rankings,
      topResults: entries.slice(0, 10), checkedAt: new Date().toISOString(),
      providerCost: Number(task.cost || 0)
    });
  } catch (error) {
    console.error('SEO rank check failed:', error);
    return reply(res, 500, {error: 'Could not complete the rank check. Please retry.'});
  }
};
