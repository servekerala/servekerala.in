const project_id = "servekerala2026";
const collection = "listings";
const url = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/${collection}`;

const solis = {
  fields: {
    name: { stringValue: "Solis Green India" },
    status: { stringValue: "approved" },
    category: { stringValue: "solar-company" },
    district: { stringValue: "Multiple" },
    towns: { stringValue: "Kottayam, Pathanamthitta, Alappuzha, Kollam" },
    phone: { stringValue: "+919539316623" },
    whatsapp: { stringValue: "+919539316623" },
    email: { stringValue: "solisgreenindia@gmail.com" },
    website: { stringValue: "https://servekerala.in/solis-green-india/" },
    description: { stringValue: "Solar plant installation, subsidy assistance, and turnkey EPC solutions across Kottayam, Pathanamthitta, Alappuzha, and Kollam." },
    createdAt: { timestampValue: new Date().toISOString() }
  }
};

const celtron = {
  fields: {
    name: { stringValue: "Celtron Energies" },
    status: { stringValue: "approved" },
    category: { stringValue: "solar-company" },
    district: { stringValue: "Multiple" },
    towns: { stringValue: "Pathanamthitta, Kottayam" },
    phone: { stringValue: "+919072221810" },
    whatsapp: { stringValue: "+919072221810" },
    email: { stringValue: "celtronenergies@gmail.com" },
    website: { stringValue: "https://servekerala.in/celtron-energies/" },
    description: { stringValue: "Solar plant engineering, hybrid inverters, solar batteries, accessories, and AMC support across Pathanamthitta and Kottayam." },
    createdAt: { timestampValue: new Date().toISOString() }
  }
};

async function insertDoc(data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  console.log(json);
}

async function run() {
  console.log("Inserting Solis...");
  await insertDoc(solis);
  console.log("Inserting Celtron...");
  await insertDoc(celtron);
  console.log("Done");
}

run();
