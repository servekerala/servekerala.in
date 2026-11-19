const crypto = require('crypto');

const FIREBASE_PROJECT_ID = 'servekerala2026';
// Firebase web API keys are public identifiers; the Cloudinary API secret remains server-only.
const FIREBASE_WEB_API_KEY = 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc';

function respond(res, status, body) {
  return res.status(status).json(body);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, { error: 'Method Not Allowed' });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return respond(res, 503, { error: 'Cloudinary uploads are not configured on the server yet.' });
  }

  const authorization = req.headers.authorization || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const { collection, profileId, kind } = req.body || {};
  if (!idToken || !['listings', 'business_pages'].includes(collection)
      || typeof profileId !== 'string' || !/^[A-Za-z0-9_-]{1,150}$/.test(profileId)
      || !['logo', 'coverImage'].includes(kind)) {
    return respond(res, 400, { error: 'A valid signed-in account and business profile are required.' });
  }

  try {
    const identityResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_WEB_API_KEY)}`, {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ idToken })
    });
    if (!identityResponse.ok) return respond(res, 401, { error: 'Your sign-in expired. Sign in again and retry.' });
    const identity = await identityResponse.json();
    const account = identity.users?.[0];
    if (!account?.emailVerified || !account.email) return respond(res, 403, { error: 'Verify your account email before uploading images.' });

    const documentResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${encodeURIComponent(profileId)}`, {
      headers: {Authorization: `Bearer ${idToken}`}
    });
    if (!documentResponse.ok) return respond(res, 404, { error: 'The selected business profile could not be found.' });
    const document = await documentResponse.json();
    const ownerEmail = (document.fields?.email?.stringValue || '').toLowerCase();
    const alternateOwnerEmail = (document.fields?.ownerEmail?.stringValue || '').toLowerCase();
    if (account.email.toLowerCase() !== ownerEmail && account.email.toLowerCase() !== alternateOwnerEmail) {
      return respond(res, 403, { error: 'Your verified account is not linked to this business profile.' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `servekerala/business_profiles/${collection}/${profileId}`;
    const publicId = `${kind}-${timestamp}-${crypto.randomBytes(6).toString('hex')}`;
    const parameters = {folder, public_id: publicId, timestamp};
    const toSign = Object.keys(parameters).sort().map(key => `${key}=${parameters[key]}`).join('&') + CLOUDINARY_API_SECRET;
    const signature = crypto.createHash('sha1').update(toSign).digest('hex');

    return respond(res, 200, {cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, folder, publicId, signature});
  } catch (error) {
    console.error('Cloudinary signature request failed:', error);
    return respond(res, 500, { error: 'Could not prepare the image upload. Please retry.' });
  }
};
