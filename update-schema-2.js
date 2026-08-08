const fs = require('fs');

let content = fs.readFileSync('scripts/generate-auto-seo.js', 'utf8');

const townSchemaCode = `
      const townSchema = {
        "@context": "https://schema.org",
        "@type": "TaxiService",
        "name": "Auto Drivers in " + town + ", " + district,
        "description": metaTown,
        "areaServed": {
          "@type": "City",
          "name": town,
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": district
          }
        },
        "provider": {
          "@type": "LocalBusiness",
          "name": "Auto Mithram - " + town
        }
      };
      const townSchemaScript = \`<script type="application/ld+json">\\n\${JSON.stringify(townSchema, null, 2)}\\n</script>\`;

      let htmlTown = template
        .replace(/\\{\\{TITLE\\}\\}/g, titleTown)
        .replace(/\\{\\{META_DESCRIPTION\\}\\}/g, metaTown)
        .replace(/\\{\\{H1_HEADING\\}\\}/g, h1Town)
        .replace(/\\{\\{SEO_INTRO\\}\\}/g, introTown)
        .replace(/\\{\\{SEO_FAQS\\}\\}/g, generateFaqs(town, false))
        .replace(/\\{\\{SEO_NEARBY_STANDS\\}\\}/g, generateNearbyStands(stands, '', districtId, townSlug))
        .replace(/\\{\\{SEO_NEARBY_TOWNS\\}\\}/g, generateNearbyTowns(towns, town, districtId))
        .replace(/\\{\\{TOWN_NAME\\}\\}/g, town)
        .replace(/\\{\\{DISTRICT_NAME\\}\\}/g, district)
        .replace(/\\{\\{DISTRICT_ID\\}\\}/g, districtId)
        .replace(/\\{\\{STAND_NAME\\}\\}/g, '')
        .replace(/\\{\\{BREADCRUMB_TRAIL\\}\\}/g, breadcrumbsTown);

      htmlTown = htmlTown.replace('</head>', \`  \${townSchemaScript}\\n</head>\`);
`;

const standSchemaCode = `
        const standSchema = {
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": "Auto Stand near " + stand + ", " + town,
          "description": metaStand,
          "areaServed": {
            "@type": "Place",
            "name": stand,
            "containedInPlace": {
              "@type": "City",
              "name": town
            }
          },
          "provider": {
            "@type": "LocalBusiness",
            "name": "Auto Mithram - " + stand + " Stand"
          }
        };
        const standSchemaScript = \`<script type="application/ld+json">\\n\${JSON.stringify(standSchema, null, 2)}\\n</script>\`;

        let htmlStand = template
          .replace(/\\{\\{TITLE\\}\\}/g, titleStand)
          .replace(/\\{\\{META_DESCRIPTION\\}\\}/g, metaStand)
          .replace(/\\{\\{H1_HEADING\\}\\}/g, h1Stand)
          .replace(/\\{\\{SEO_INTRO\\}\\}/g, introStand)
          .replace(/\\{\\{SEO_FAQS\\}\\}/g, generateFaqs(\`the \${stand} stand\`, true))
          .replace(/\\{\\{SEO_NEARBY_STANDS\\}\\}/g, generateNearbyStands(stands, standSlug, districtId, townSlug))
          .replace(/\\{\\{SEO_NEARBY_TOWNS\\}\\}/g, generateNearbyTowns(towns, town, districtId))
          .replace(/\\{\\{TOWN_NAME\\}\\}/g, town)
          .replace(/\\{\\{DISTRICT_NAME\\}\\}/g, district)
          .replace(/\\{\\{DISTRICT_ID\\}\\}/g, districtId)
          .replace(/\\{\\{STAND_NAME\\}\\}/g, stand)
          .replace(/\\{\\{BREADCRUMB_TRAIL\\}\\}/g, breadcrumbsStand);

        htmlStand = htmlStand.replace('</head>', \`  \${standSchemaScript}\\n</head>\`);
`;

content = content.replace(/let htmlTown = template[\s\S]*?\.replace\(\/\\{\\{BREADCRUMB_TRAIL\\}\\}\/g, breadcrumbsTown\);/, townSchemaCode);
content = content.replace(/let htmlStand = template[\s\S]*?\.replace\(\/\\{\\{BREADCRUMB_TRAIL\\}\\}\/g, breadcrumbsStand\);/, standSchemaCode);

fs.writeFileSync('scripts/generate-auto-seo.js', content, 'utf8');
console.log('Updated generate-auto-seo.js with Schema Generator!');
