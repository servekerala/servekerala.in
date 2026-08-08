const fs = require('fs');

let content = fs.readFileSync('scripts/generate-seo-pages.js', 'utf8');

const schemaInjectionCode = `
        const schema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": servicePlural + " in " + town + ", " + district,
          "serviceType": serviceName,
          "provider": {
            "@type": "LocalBusiness",
            "name": "ServeKerala.in Verified " + servicePlural,
            "areaServed": {
              "@type": "City",
              "name": town,
              "containedInPlace": {
                "@type": "AdministrativeArea",
                "name": district
              }
            }
          },
          "areaServed": {
            "@type": "City",
            "name": town
          },
          "description": metaDesc
        };

        const schemaScript = \`<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n</script>\`;
        
        let html = template
          .replace(/\\{\\{TITLE\\}\\}/g, title)
          .replace(/\\{\\{META_DESCRIPTION\\}\\}/g, metaDesc)
          .replace(/\\{\\{H1_HEADING\\}\\}/g, h1)
          .replace(/\\{\\{SEO_INTRO\\}\\}/g, introText)
          .replace(/\\{\\{SEO_FAQS\\}\\}/g, faqs)
          .replace(/\\{\\{SEO_NEARBY_TOWNS\\}\\}/g, nearbyTowns)
          .replace(/\\{\\{SEO_RELATED_SERVICES\\}\\}/g, relatedServices)
          .replace(/\\{\\{SERVICE_NAME\\}\\}/g, serviceName)
          .replace(/\\{\\{SERVICE_SLUG\\}\\}/g, serviceSlug)
          .replace(/\\{\\{TOWN_NAME\\}\\}/g, town)
          .replace(/\\{\\{DISTRICT_NAME\\}\\}/g, district)
          .replace(/\\{\\{SERVICE_ID\\}\\}/g, serviceId)
          .replace(/\\{\\{DISTRICT_ID\\}\\}/g, districtId);

        // Inject schema before </head>
        html = html.replace('</head>', \`  \${schemaScript}\\n</head>\`);
`;

content = content.replace(/let html = template[\s\S]*?\.replace\(\/\\{\\{DISTRICT_ID\\}\\}\/g, districtId\);/, schemaInjectionCode);

fs.writeFileSync('scripts/generate-seo-pages.js', content, 'utf8');
console.log('Updated generate-seo-pages.js with Schema Generator!');
