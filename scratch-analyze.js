const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.html')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allHtml = getFiles(__dirname);
const titles = {};
const contents = {};

allHtml.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  
  // Title
  const titleMatch = content.match(/<title>(.*?)<\/title>/is);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    if (!titles[title]) titles[title] = [];
    titles[title].push(f);
  }

  // Content (strip scripts, tags, whitespace for basic diff)
  const stripped = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                          .replace(/<[^>]+>/g, '')
                          .replace(/\s+/g, ' ')
                          .trim();
  if (!contents[stripped]) contents[stripped] = [];
  contents[stripped].push(f);
});

console.log('--- Duplicate Titles ---');
let dupTitles = 0;
for (const [title, files] of Object.entries(titles)) {
  if (files.length > 1) {
    console.log(`Title: ${title} (${files.length} pages)`);
    files.forEach(f => console.log(`  - ${f}`));
    dupTitles += files.length;
  }
}
console.log(`Total pages with duplicate titles: ${dupTitles}\n`);

console.log('--- Duplicate Content ---');
let dupContent = 0;
for (const [contentStr, files] of Object.entries(contents)) {
  if (files.length > 1) {
    console.log(`Content length: ${contentStr.length} (${files.length} pages)`);
    files.forEach(f => console.log(`  - ${f}`));
    dupContent += files.length;
  }
}
console.log(`Total pages with duplicate content: ${dupContent}\n`);
