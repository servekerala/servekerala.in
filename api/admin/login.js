module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password, fbToken, fbAuthSuccess } = req.body || {};
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'servekerala2026';

  const isMasterValid = ((username === validUser || username === 'servekerala.in@gmail.com') && password === validPass);
  const isFbValid = Boolean(fbAuthSuccess === true && fbToken);
  const isValid = isMasterValid || isFbValid;

  if (isValid) {
    res.setHeader('Set-Cookie', 'sk_admin_session=sk_sec_servekerala_admin_2026; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400');
    return res.status(200).json({ success: true, redirect: '/admin/' });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect email/username or password. Please try again.' });
  }
};