const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'main.css');
const newCss = `
/* --- SEO TOPIC CLUSTER PAGES --- */
.hero-seo-banner {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  text-align: center;
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.hero-seo-banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, rgba(4,120,87,0.9) 0%, rgba(6,78,59,0.8) 100%);
  z-index: 1;
}
.hero-seo-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.hero-seo-h1 {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.hero-seo-sub {
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 32px;
  opacity: 0.9;
}
.hero-cta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.btn-hero {
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}
.btn-hero-primary {
  background: white;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.btn-hero-primary:hover {
  transform: translateY(-2px);
  background: #f8fafc;
}
.btn-hero-wa {
  background: #25D366;
  color: white;
  box-shadow: 0 4px 12px rgba(37,211,102,0.3);
}
.btn-hero-wa:hover {
  transform: translateY(-2px);
  background: #20bd5a;
}
.btn-hero-outline {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
}
.btn-hero-outline:hover {
  background: rgba(255,255,255,0.2);
}

.quick-info-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
}
.quick-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.info-icon {
  background: rgba(16,185,129,0.1);
  color: var(--primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.info-text h4 {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 4px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-text p {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.destinations-table-wrapper {
  background: var(--bg-surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
}
.destinations-table {
  width: 100%;
  border-collapse: collapse;
}
.destinations-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-weight: 700;
  color: var(--text-muted);
  font-size: 14px;
  text-transform: uppercase;
  border-bottom: 2px solid var(--border-color);
}
.destinations-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 16px;
  font-weight: 500;
}
.destinations-table tr:last-child td {
  border-bottom: none;
}
.destinations-table tr:hover {
  background: #f8fafc;
}

.why-choose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.why-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.2s;
}
.why-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
.why-icon {
  font-size: 32px;
  margin-bottom: 16px;
}
.why-item h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}
.why-item p {
  color: var(--text-muted);
  font-size: 15px;
  margin: 0;
  line-height: 1.5;
}
`;

fs.appendFileSync(cssPath, newCss);
console.log('CSS Appended successfully.');
