const fs = require('fs');

let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const mappingCode = `
      const schemaTypeMap = { plumbing: 'Plumber', electrical: 'Electrician', ac: 'HVACBusiness' };
      const schemaType = schemaTypeMap[category] || 'LocalBusiness';
`;

const newSchemaScript = `  <script type="application/ld+json">\${JSON.stringify({'@context':'https://schema.org','@type':schemaType,name,description:desc,url:\`https://servekerala.in/business/\${slug}/\`,telephone:phone,address:{'@type':'PostalAddress',addressRegion:'Kerala',addressCountry:'IN',addressLocality:district}})}<\\/script>`;

content = content.replace(/const catIcons = /, mappingCode + '\n      const catIcons = ');
content = content.replace(/<script type="application\/ld\+json">.*?<\/script>/, newSchemaScript);

fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log('Updated admin.js with dynamic schema types!');
