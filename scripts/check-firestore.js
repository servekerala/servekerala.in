const project_id = "servekerala2026";
const collection = "listings";

async function fetchListings() {
  const url = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/${collection}`;
  const res = await fetch(url);
  const json = await res.json();
  json.documents.forEach(doc => {
    if (doc.fields.status && doc.fields.status.stringValue === 'approved') {
      console.log(doc.fields.name.stringValue, doc.fields.isFeatured);
    }
  });
}

fetchListings();
