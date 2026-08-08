const project_id = "servekerala2026";
const collection = "listings";

async function updateDoc(id) {
  const url = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/${collection}/${id}?updateMask.fieldPaths=isFeatured`;
  const data = {
    name: `projects/${project_id}/databases/(default)/documents/${collection}/${id}`,
    fields: {
      isFeatured: { booleanValue: true }
    }
  };

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  console.log(json);
}

async function run() {
  await updateDoc("Wpv49HCWfjzMZUNJUqN4"); // Solis
  await updateDoc("TrTxFBoVaILdFn0Dmbze"); // Celtron
  console.log("Done updating isFeatured flag");
}

run();
