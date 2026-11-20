module.exports = async (req, res) => {
  res.setHeader('Set-Cookie', 'sk_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  if (req.method === 'GET') {
    res.writeHead(302, { Location: '/admin/login/' });
    return res.end();
  }
  return res.status(200).json({ success: true, redirect: '/admin/login/' });
};