const project_id = "servekerala2026";
const collection = "listings";

async function runQuery() {
  const url = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents:runQuery`;
  const body = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'approved' } } },
            { fieldFilter: { field: { fieldPath: 'isFeatured' }, op: 'EQUAL', value: { booleanValue: true } } }
          ]
        }
      }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  console.log("Status:", res.status);
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

runQuery();
