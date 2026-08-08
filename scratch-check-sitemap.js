const fs = require('fs');
const path = require('path');

const rootDir = 'd:/Antigravity/servekerala.in';
const sitemapPath = path.join(rootDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
    console.log('sitemap.xml not found!');
    process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Extract URLs using a simple regex since XML parsing might require third party libs
const urlRegex = /<loc>(.*?)<\/loc>/g;
let match;
const urls = [];

while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
}

console.log(`Found ${urls.length} URLs in sitemap.xml. Checking against local filesystem...`);

let brokenLinks = [];
let checked = 0;

for (let url of urls) {
    // Assuming URL format is like https://servekerala.in/some/path/
    try {
        const urlObj = new URL(url);
        let pathname = urlObj.pathname;
        
        // Remove trailing slash
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        
        // Remove leading slash
        if (pathname.startsWith('/')) {
            pathname = pathname.substring(1);
        }

        // Possible local file paths
        let file1 = path.join(rootDir, pathname);
        let file2 = path.join(rootDir, pathname, 'index.html');
        let file3 = path.join(rootDir, pathname + '.html');
        
        let exists = false;
        
        // Root case (https://servekerala.in/)
        if (pathname === '') {
            exists = fs.existsSync(path.join(rootDir, 'index.html'));
        } else {
            if (fs.existsSync(file1) && fs.statSync(file1).isFile()) {
                exists = true;
            } else if (fs.existsSync(file2) && fs.statSync(file2).isFile()) {
                exists = true;
            } else if (fs.existsSync(file3) && fs.statSync(file3).isFile()) {
                exists = true;
            }
        }
        
        if (!exists) {
            brokenLinks.push({ url, pathsChecked: [file1, file2, file3] });
        }
    } catch (e) {
        console.error(`Error processing URL: ${url}`, e);
        brokenLinks.push({ url, error: e.message });
    }
    checked++;
}

console.log(`\nChecked ${checked} URLs.`);
if (brokenLinks.length > 0) {
    console.log(`\n⚠️ Found ${brokenLinks.length} broken links:`);
    brokenLinks.forEach(b => console.log(`- ${b.url}`));
} else {
    console.log('\n✅ All links in sitemap.xml are valid and correspond to local files!');
}
