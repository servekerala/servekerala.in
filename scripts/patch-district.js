const fs = require('fs');

// Patch admin.js
let adminJs = fs.readFileSync('assets/js/admin.js', 'utf8');
const oldAdminRegex = /const distOptions = '<option value="">Select District<\/option>' \+ activeDistricts\.map\(d => `<option value="\$\{d\.toLowerCase\(\)\}">\$\{d\}<\/option>`\)\.join\(''\);/;
const newAdminStr = `const distOptions = '<option value="">Select District</option>' + activeDistricts.map(d => \`<option value="\${d.toLowerCase()}">\${d}</option>\`).join('') + '<option value="Multiple">Multiple (Enter Towns Below)</option>';`;

if (oldAdminRegex.test(adminJs)) {
  adminJs = adminJs.replace(oldAdminRegex, newAdminStr);
  fs.writeFileSync('assets/js/admin.js', adminJs, 'utf8');
  console.log("Patched admin.js");
} else {
  console.log("Could not find district string in admin.js");
}

// Patch listing.js
let listingJs = fs.readFileSync('assets/js/listing.js', 'utf8');
const oldListingRegex = /bdistSelect\.innerHTML = data\.districts\.map\(d => `<option value="\$\{d\.toLowerCase\(\)\}">\$\{d\}<\/option>`\)\.join\(''\);/;
const newListingStr = `bdistSelect.innerHTML = '<option value="">Select District</option>' + data.districts.map(d => \`<option value="\${d.toLowerCase()}">\${d}</option>\`).join('') + '<option value="Multiple">Multiple (Enter Towns Below)</option>';`;

if (oldListingRegex.test(listingJs)) {
  listingJs = listingJs.replace(oldListingRegex, newListingStr);
  fs.writeFileSync('assets/js/listing.js', listingJs, 'utf8');
  console.log("Patched listing.js");
} else {
  console.log("Could not find district string in listing.js");
}
