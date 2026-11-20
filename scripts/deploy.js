const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const { execSync } = require('child_process');

// 1. Read environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val.trim();
      }
    }
  }
}
loadEnv();

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_9fOueXTpGOP2iR3ASpWPdxaU';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'prj_4lzhiqdhmdJTMioys9zBSePVATrD';

if (!TOKEN) {
  console.error('Error: VERCEL_TOKEN is not defined in .env.local');
  process.exit(1);
}

const IGNORED_DIRS = new Set(['.git', '.vercel', 'node_modules', '.gemini', '.vercel.bak', 'scratch', '.system_generated']);
const IGNORED_FILES = new Set(['.env', '.env.local', '.env.production', 'package-lock.json']);

function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const relPath = path.join(baseDir, item).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (IGNORED_DIRS.has(item)) continue;
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      if (IGNORED_FILES.has(item)) continue;
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadFile(sha, buffer, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const req = https.request(`https://api.vercel.com/v2/files?teamId=${TEAM_ID}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/octet-stream',
            'Content-Length': buffer.length,
            'x-vercel-digest': sha
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.write(buffer);
        req.end();
      });
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function run() {
  console.log('===> 1. Building SEO pages & Sitemap...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n===> 2. Pushing latest commits to GitHub...');
  try {
    execSync('git push origin master:main', { stdio: 'inherit' });
    console.log('GitHub updated successfully!');
  } catch (err) {
    console.warn('Note: Git push skipped or already up-to-date.');
  }

  console.log('\n===> 3. Deploying directly to Vercel (https://www.servekerala.in)...');
  const scanned = getFiles(process.cwd());
  const fileMap = new Map();
  const deploymentFiles = [];

  for (const f of scanned) {
    const buf = fs.readFileSync(f.fullPath);
    const sha = crypto.createHash('sha1').update(buf).digest('hex');
    fileMap.set(sha, { path: f.relPath, buf });
    deploymentFiles.push({
      file: f.relPath,
      sha,
      size: buf.length
    });
  }

  const payload = {
    name: 'servekerala.in',
    project: PROJECT_ID,
    target: 'production',
    files: deploymentFiles
  };

  const body = JSON.stringify(payload);
  let res = await request({
    hostname: 'api.vercel.com',
    path: `/v13/deployments?teamId=${TEAM_ID}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  if (res.status === 400 && res.data && res.data.error && res.data.error.code === 'missing_files') {
    const missing = res.data.error.missing;
    console.log(`Uploading ${missing.length} changed files to Vercel...`);
    const concurrency = 5;
    for (let i = 0; i < missing.length; i += concurrency) {
      const batch = missing.slice(i, i + concurrency);
      await Promise.all(batch.map(async sha => {
        const item = fileMap.get(sha);
        if (item) await uploadFile(sha, item.buf);
      }));
    }
    res = await request({
      hostname: 'api.vercel.com',
      path: `/v13/deployments?teamId=${TEAM_ID}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, body);
  }

  if (res.status !== 200 && res.status !== 201) {
    console.error('Deployment error:', res.data || res.raw);
    process.exit(1);
  }

  const deployment = res.data;
  console.log(`\nDeployment triggered! ID: ${deployment.id}`);
  console.log('Waiting for build verification...');

  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 3000));
    const check = await request({
      hostname: 'api.vercel.com',
      path: `/v13/deployments/${deployment.id}?teamId=${TEAM_ID}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    if (check.data && check.data.readyState) {
      if (check.data.readyState === 'READY') {
        console.log('\n=============================================');
        console.log('🚀 LIVE ON PRODUCTION: https://www.servekerala.in');
        console.log('=============================================');
        return;
      }
      if (check.data.readyState === 'ERROR') {
        console.error('Build error:', check.data.errorMessage);
        process.exit(1);
      }
    }
  }
}

run().catch(err => {
  console.error('Deployment failed:', err);
  process.exit(1);
});
