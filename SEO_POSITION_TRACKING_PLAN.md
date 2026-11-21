# ServeKerala.in: Semrush Position Tracking

## Campaign settings

- **Domain:** `servekerala.in` (root domain, including subdomains only if Semrush has a reason to track them)
- **Search engine:** Google
- **Location:** Kerala, India, at the most specific supported level. Use the actual target city if the campaign is meant to measure local pack and city-level results.
- **Language:** English for this first campaign
- **Device:** Desktop to match the existing screenshot. Create a separate mobile campaign later if mobile performance needs its own trend line.
- **Update frequency:** Weekly is fine for a small site and matches the screenshot. Daily updates are useful only when someone will review them and act on changes.
- **Competitors to compare:** `justdial.com`, `naatilepani.com`, and `panikkaar.com`. These are plausible directory/marketplace comparisons based on their Kerala local-services positioning; verify the actual SERP overlap in Semrush before keeping all three. Keep `supersavvy.in` only if it appears for the keywords you care about.

## Starter keyword set (10)

Use the exact local phrasing people search for, and make sure the corresponding page has genuine listings or useful coverage before tracking it as a priority.

1. `plumber in Thiruvalla`
2. `electrician in Thiruvalla`
3. `AC service in Thiruvalla`
4. `solar installation in Kottayam`
5. `plumber in Kottayam`
6. `electrician in Kottayam`
7. `home cleaning in Alappuzha`
8. `pest control in Alappuzha`
9. `CCTV installation in Alappuzha`
10. `water purifier service in Pala`

These cover multiple services and towns represented by the site's generated landing pages. They are a starter measurement set, not a claim that these have the highest search volume. Use Semrush Keyword Overview and Google Search Console query data to replace terms that have no impressions or do not match actual customer demand. Track a separate branded term such as `ServeKerala` only if brand discovery is a KPI; it should not replace a service keyword.

## Reading the current screenshot

The screenshot shows 10 tracked keywords, India / Google / English / Desktop, 2 competitors, 10.00% visibility, zero estimated traffic, and weekly updates. The 10% visibility is only for that small keyword set and configuration; it is not a site-wide SEO score. Country-level tracking can also blur useful local changes, so use a Kerala or target-city location. The zero traffic estimate is a model estimate, not a substitute for Search Console clicks or analytics conversions.

## Review routine

Review weekly: rankings by target URL, keyword movement, local pack/SERP features, and whether the page actually offers the requested service in that town. In Search Console, compare impressions, clicks, average position, and indexed status for those same landing pages. Expand the keyword set only after the first 10 are mapped cleanly to useful pages and have enough impressions to learn from.

## Site-side work completed

The sitemap generator now uses the standard sitemap namespace, omits explicit `noindex` pages and pages whose canonical points elsewhere, and no longer adds hard-coded event detail URLs that may not correspond to real pages. Regenerate it with `node scripts/build-sitemap.js` after changing site pages.
