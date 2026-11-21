# Semrush-Style SEO Position Tracker & Competitor Rankings Engine

ServeKerala.in includes a dedicated, Semrush-style Position Tracking suite inside the Admin Dashboard (`/admin` → **SEO** tab).

---

## 🌟 Key Features

1. **Semrush Project Campaign Ribbon**:
   - Scope: `servekerala.in` vs Top 4 Competitors (`justdial.com`, `sulekha.com`, `indiamart.com`, `naatilepani.com`).
   - Geo-targeting: `Kerala, India (Google.co.in)`.
   - Devices: `Desktop & Mobile`.
   - Live Sync: Connected to Cloud Firestore (`seo_tracker_keywords` and `seo_tracker_runs`).

2. **Top 4 Semrush Metric KPI Cards**:
   - **Visibility Index (%)**: Weighted CTR share across all tracked positions with delta indicator.
   - **Estimated Organic Traffic**: Monthly projected clicks based on search volume $\times$ CTR curve.
   - **Average Position**: Weighted mean SERP rank across all tracked Kerala keywords.
   - **Rankings Distribution**: Visual breakdown across Top 3, Top 10, Top 20, and Top 100 with Gainers (▲), Losers (▼), and Stable (⏸) indicators.

3. **Competitors Landscape & Benchmark Matrix**:
   - Comprehensive side-by-side comparison table between `servekerala.in (You)`, `justdial.com`, `sulekha.com`, `indiamart.com`, and `naatilepani.com`.
   - Tracks Visibility %, Estimated Monthly Traffic, Top 3, Top 10, Top 20 keyword counts, Average Position, and Share of Voice (SOV %).

4. **Multi-Domain Visibility Trend Chart**:
   - Interactive comparative multi-line trend chart (`Chart.js`) showing visibility movements over 7 Days, 14 Days, and 30 Days.

5. **Keyword Rankings Grid (Semrush Positions)**:
   - Pre-seeded with 28 high-intent local Kerala service queries across solar installation, inverter/battery, plumbing, electrical, AC repair, CCTV, painting, pest control, cleaning, and Auto Mithram.
   - **Search Intent Badges**: `[T]` Transactional, `[C]` Commercial, `[I]` Informational, `[N]` Navigational.
   - **SERP Feature Badges**: Detected Google features (`📍 Pack`, `⭐ Reviews`, `🔗 Sitelinks`, `❓ PAA`).
   - **Volume & KD%**: Search volume per month and Semrush-style Keyword Difficulty pill (`🟢 Easy`, `🟡 Medium`, `🟠 Hard`, `🔴 Very Hard`).
   - **ServeKerala Rank**: Prominent rank badge (`#1`, `#2`, etc.) with real-time movement delta (`▲`, `▼`, `—`).
   - **Competitor Ranks**: Side-by-side rankings for Justdial, Sulekha, IndiaMART, and NaatilePani.
   - **Direct Google SERP Link**: Instant `Google SERP ↗` button opening the live search query on Google India for immediate verification.

6. **Interactive Management**:
   - `⚡ Run SERP Scan`: Triggers live simulation/scan, calculates rank shifts, logs snapshot run, and updates the multi-domain chart.
   - `➕ Add Tracked Keyword`: Modal to add new custom keywords with location, intent, volume, and target URL.
   - `📥 Export Semrush CSV`: Exports complete position dataset to standard CSV.
   - `🔄 Reset`: Re-seeds the 28 default Kerala keywords anytime.

---

## 🔒 Security & Firestore Rules

Admin read and write access for `seo_tracker_keywords` and `seo_tracker_runs` is enforced in `firestore.rules`:
```javascript
match /seo_tracker_runs/{document} {
  allow read, write: if isAdmin();
}
match /seo_tracker_keywords/{document} {
  allow read, write: if isAdmin();
}
```
