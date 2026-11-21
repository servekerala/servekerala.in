const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'js', 'seo-tracker.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Cleans DEFAULT_KEYWORDS of fake mock positions
const startIdx = code.indexOf('const DEFAULT_KEYWORDS = [');
const endIdx = code.indexOf('let trackedKeywords = [];', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  let kwSection = code.substring(startIdx, endIdx);
  // Replace position: <num> with position: null
  kwSection = kwSection.replace(/position:\s*\d+,/g, 'position: null,');
  kwSection = kwSection.replace(/prevPosition:\s*\d+,/g, 'prevPosition: null,');
  // Set all competitor rankings to null initially until scanned
  kwSection = kwSection.replace(/competitors:\s*\{[^}]+\}/g, "competitors: { 'justdial.com': null, 'sulekha.com': null, 'indiamart.com': null, 'naatilepani.com': null }, liveVerified: false");
  code = code.substring(0, startIdx) + kwSection + code.substring(endIdx);
}

// 2. Cleans generateDefaultRuns to return empty runs (no fake historical trend curves)
const genStart = code.indexOf('function generateDefaultRuns() {');
const genEnd = code.indexOf('async function initSeoSuite() {', genStart);
if (genStart !== -1 && genEnd !== -1) {
  code = code.substring(0, genStart) + 'function generateDefaultRuns() {\n    return [];\n  }\n\n  ' + code.substring(genEnd);
}

// 3. Update avgPosition rendering in the matrix table
code = code.replace(/<strong style="color:#1e293b; font-size:13px;">#\$\{m\.avgPosition\}<\/strong>/g, '<strong style="color:#1e293b; font-size:13px;">${m.avgPosition > 0 ? `#${m.avgPosition}` : \'—\'}</strong>');

// 4. Update avgPosition rendering in Top KPI Card
code = code.replace(/<span>#\$\{mainMetrics\.avgPosition\}<\/span>\s*<span class="sk-semrush-delta up">▲ \+1\.2 pos<\/span>/g, `<span>\${mainMetrics.avgPosition > 0 ? \`#\${mainMetrics.avgPosition}\` : '—'}</span>\n            <span class="sk-semrush-delta \${mainMetrics.avgPosition > 0 ? 'up' : 'same'}">\${mainMetrics.avgPosition > 0 ? '▲ Live' : 'Unranked'}</span>`);

// 5. Update delta for Visibility in Top KPI Card
code = code.replace(/\$\{visDelta >= 0 \? '▲ \+' : '▼ '\}\$\{visDelta\}%/g, `\${scanRuns.length >= 2 ? (visDelta >= 0 ? '▲ +' : '▼ ') + visDelta + '%' : 'Baseline'}`);

// 6. Update Estimated Traffic delta
code = code.replace(/<span class="sk-semrush-delta up">▲ \+\$\{trafficDelta\.toLocaleString\(\)\}<\/span>/g, `<span class="sk-semrush-delta \${mainMetrics.estTraffic > 0 ? 'up' : 'same'}">\${mainMetrics.estTraffic > 0 ? '▲ +' + trafficDelta.toLocaleString() : '0'}</span>`);

// 7. Ensure Firestore loaded keywords do not retain unverified mock positions
const kwLoadTarget = "trackedKeywords = kwSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));";
const kwLoadReplacement = `trackedKeywords = kwSnap.docs.map(doc => {
            const d = doc.data();
            if (!d.liveVerified) {
              d.position = null;
              d.prevPosition = null;
            }
            return { id: doc.id, ...d };
          });`;
code = code.replace(kwLoadTarget, kwLoadReplacement);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully applied clean SEO updates.');
