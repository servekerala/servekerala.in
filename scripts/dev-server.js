const http = require('http');
const fs = require('fs');
const path = require('path');

// Load local secrets from the ignored .env.local file for local development.
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !Object.prototype.hasOwnProperty.call(process.env, match[1])) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  });
}

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '..');
const ADMIN_SECRET = 'sk_sec_servekerala_admin_2026';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let reqPath = parsedUrl.pathname;

  // 1. Auto Mithram 301 Redirects
  if (reqPath.startsWith('/auto-mithram') || reqPath.startsWith('/join-auto-mithram') || reqPath.startsWith('/auto/')) {
    let dest = 'https://www.automithram.com/';
    if (reqPath.startsWith('/join-auto-mithram')) dest = 'https://www.automithram.com/join/';
    else if (reqPath.startsWith('/auto/')) dest = 'https://www.automithram.com' + reqPath;
    res.writeHead(301, { 'Location': dest });
    res.end();
    return;
  }

  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Cloudinary owner-image upload signature API (same handler as the deployed Vercel function).
  if (pathname === '/api/cloudinary-signature' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 16 * 1024) req.destroy();
    });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body || '{}');
        const handler = require('../api/cloudinary-signature');
        const response = {
          status(code) { res.statusCode = code; return this; },
          json(payload) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(payload));
          }
        };
        await handler(req, response);
      } catch (error) {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'Malformed request.'}));
      }
    });
    return;
  }

  // 2. Server-Level Authentication API Endpoints
  if (req.method === 'POST' && (pathname === '/api/admin/login' || pathname === '/api/admin/login/')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password, fbToken, fbAuthSuccess } = JSON.parse(body || '{}');
        const validUser = process.env.ADMIN_USER || 'admin';
        const validPass = process.env.ADMIN_PASSWORD || 'servekerala2026';
        const isMasterValid = ((username === validUser || username === 'servekerala.in@gmail.com') && password === validPass);
        const isFbValid = Boolean(fbAuthSuccess === true && fbToken);
        const isValid = isMasterValid || isFbValid;

        if (isValid) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `sk_admin_session=${ADMIN_SECRET}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
          });
          res.end(JSON.stringify({ success: true, redirect: '/admin/' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Incorrect email/username or password. Please try again.' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed JSON.' }));
      }
    });
    return;
  }

  if (pathname === '/api/admin/logout' || pathname === '/admin/logout' || pathname === '/admin/logout/') {
    res.writeHead(302, {
      'Location': '/admin/login/',
      'Set-Cookie': 'sk_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
    });
    res.end();
    return;
  }

  // 3. Server-Level Protection for /admin
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    const cookies = parseCookies(req);
    const isAuthenticated = cookies['sk_admin_session'] === ADMIN_SECRET;

    if (!isAuthenticated) {
      res.writeHead(302, { 'Location': '/admin/login/' });
      res.end();
      return;
    } else {
      pathname = '/admin/index.html';
    }
  }

  // 4. Rewrites matching vercel.json
  if (pathname === '/submit-event' || pathname === '/submit-event/') {
    pathname = '/events/submit.html';
  } else if (pathname.startsWith('/listing/') && pathname !== '/listing/' && pathname !== '/listing/index.html') {
    pathname = '/listing/index.html';
  } else if (pathname.startsWith('/business/') && pathname !== '/business/' && pathname !== '/business/index.html') {
    pathname = '/business/index.html';
  } else if (pathname === '/events/submit' || pathname === '/events/submit/' || pathname === '/events/submit/index.html') {
    pathname = '/events/submit.html';
  } else if (pathname.startsWith('/events/') && pathname !== '/events/' && pathname !== '/events/index.html' && pathname !== '/events/submit.html' && pathname !== '/events/detail.html') {
    pathname = '/events/detail.html';
  }

  let filePath = path.join(ROOT, pathname);

  // Check if target is a directory or needs index.html
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (err && !path.extname(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 Not Found</h1><p>The requested path <code>${pathname}</code> was not found.</p><p><a href="/">Go to Home</a></p>`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 ServeKerala Local Server Running!`);
  console.log(`👉 Home:          http://localhost:${PORT}/`);
  console.log(`👉 Admin:         http://localhost:${PORT}/admin/`);
  console.log(`=================================================\n`);
});
