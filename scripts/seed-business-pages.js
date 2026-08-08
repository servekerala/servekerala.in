const project_id = "servekerala2026";

async function syncBusinessPages() {
  console.log("Fetching listings from Firestore...");
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/listings`);
  const json = await res.json();
  
  if (!json.documents) {
    console.log("No listings found.");
    return;
  }

  for (const doc of json.documents) {
    const fields = doc.fields;
    const name = fields.name ? fields.name.stringValue : "";
    const status = fields.status ? fields.status.stringValue : "";

    if (status !== "approved" || !name) continue;

    // Generate slug from name or website URL
    let slug = "";
    if (fields.website && fields.website.stringValue.includes("/business/")) {
      const match = fields.website.stringValue.match(/\/business\/([^/]+)/);
      if (match) slug = match[1];
    }
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    console.log(`Syncing business page: ${name} -> slug: ${slug}`);

    const patchUrl = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/business_pages/${slug}`;
    const payload = {
      fields: {
        name: { stringValue: name },
        slug: { stringValue: slug },
        category: { stringValue: fields.category ? fields.category.stringValue : "default" },
        description: { stringValue: fields.description ? fields.description.stringValue : "" },
        phone: { stringValue: fields.phone ? fields.phone.stringValue : "" },
        whatsapp: { stringValue: fields.whatsapp ? fields.whatsapp.stringValue : (fields.phone ? fields.phone.stringValue : "") },
        email: { stringValue: fields.email ? fields.email.stringValue : "" },
        website: { stringValue: fields.website ? fields.website.stringValue : "" },
        address: { stringValue: fields.address ? fields.address.stringValue : "" },
        mapUrl: { stringValue: fields.mapUrl ? fields.mapUrl.stringValue : "" },
        district: { stringValue: fields.district ? fields.district.stringValue : "" },
        towns: { stringValue: fields.towns ? fields.towns.stringValue : "" },
        servicesOffered: { stringValue: fields.servicesOffered ? fields.servicesOffered.stringValue : "" },
        whyChooseUs: { stringValue: fields.whyChooseUs ? fields.whyChooseUs.stringValue : "" },
        status: { stringValue: "approved" }
      }
    };

    const updateRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (updateRes.ok) {
      console.log(`Successfully synced ${slug} to business_pages!`);
    } else {
      const errText = await updateRes.text();
      console.error(`Failed to sync ${slug}:`, errText);
    }
  }
}

syncBusinessPages();
