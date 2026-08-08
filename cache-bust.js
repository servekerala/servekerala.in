const fs = require('fs');

let html = fs.readFileSync('auto-mithram/index.html', 'utf8');
html = html.replace(/src="\/assets\/js\/auto-loader\.js\?v=[\d.]+"/g, 'src="/assets/js/auto-loader.js?v=' + Date.now() + '"');
fs.writeFileSync('auto-mithram/index.html', html);

console.log('Cache busted.');
