(() => {
  'use strict';
  const script = document.currentScript;
  const ownerEmail = (script?.dataset.ownerEmail || '').trim().toLowerCase();
  if (!ownerEmail || typeof firebase === 'undefined') return;

  const config = {
    apiKey: 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc',
    authDomain: 'servekerala2026.firebaseapp.com',
    projectId: 'servekerala2026',
    storageBucket: 'servekerala2026.firebasestorage.app',
    messagingSenderId: '122091003614',
    appId: '1:122091003614:web:e2114b7064aceff4f5ac4f'
  };
  if (!firebase.apps.length) firebase.initializeApp(config);
  const db = firebase.firestore();
  const esc = value => String(value || '').trim();
  const safeExternalUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
    catch (_) { return ''; }
  };

  function trackProfileLink(id, type, data) {
    if (typeof window.trackListingClick !== 'function') return;
    window.trackListingClick(id, type, true, 'listings', {
      name: data.name || '', category: data.category || 'solar',
      district: data.district || '', towns: data.towns || '',
      button_location: 'company_profile'
    });
  }

  function updateContactLinks(id, data) {
    const phone = esc(data.phone).replace(/[^0-9+]/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      if (!phone) return;
      link.href = `tel:${phone}`;
      link.removeAttribute('onclick');
      link.addEventListener('click', () => trackProfileLink(id, 'call', data));
    });
    const waPhone = esc(data.whatsapp || data.phone).replace(/\D/g, '');
    document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
      if (!waPhone) return;
      link.href = `https://wa.me/${waPhone}`;
      link.rel = 'noopener noreferrer';
      link.removeAttribute('onclick');
      link.addEventListener('click', () => trackProfileLink(id, 'whatsapp', data));
    });
    const externalWebsite = safeExternalUrl(data.website);
    if (externalWebsite && !new URL(externalWebsite).hostname.endsWith('servekerala.in')) {
      document.querySelectorAll('a[data-owner-website]').forEach(link => {
        link.href = externalWebsite;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', () => trackProfileLink(id, 'website', data));
      });
    }
  }

  async function sync() {
    try {
      const snapshot = await db.collection('listings').where('email', '==', ownerEmail).get();
      let record = null;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'approved') record = {id: doc.id, data};
      });
      if (!record) return;
      const {id, data} = record;
      const title = esc(data.seoTitle) || `${esc(data.name)} | Local Solar Services in Kerala | ServeKerala.in`;
      const description = (esc(data.seoDescription) || esc(data.description)).slice(0, 160);
      document.title = title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && description) desc.content = description;
      [['og:title', title], ['og:description', description], ['twitter:title', title], ['twitter:description', description]].forEach(([name, value]) => {
        const meta = document.querySelector(`meta[property="${name}"],meta[name="${name}"]`);
        if (meta && value) meta.content = value;
      });
      const heading = document.querySelector('h1');
      if (heading && data.name) heading.textContent = data.name;
      const intro = heading?.parentElement?.querySelector('p');
      if (intro && data.description) intro.textContent = data.description;
      const introContainer = heading?.parentElement;
      if (introContainer && data.logo?.url) {
        let logo = document.getElementById('owner-business-logo');
        if (!logo) { logo = document.createElement('img'); logo.id = 'owner-business-logo'; introContainer.insertBefore(logo, heading); }
        logo.src = safeExternalUrl(data.logo.url) || '';
        logo.alt = data.logo.altText || `${esc(data.name)} logo`;
        logo.style.cssText = 'width:88px;height:88px;object-fit:contain;border-radius:12px;margin-bottom:14px';
      }
      if (introContainer && data.coverImage?.url) {
        let cover = document.getElementById('owner-business-cover');
        if (!cover) { cover = document.createElement('img'); cover.id = 'owner-business-cover'; introContainer.append(cover); }
        cover.src = safeExternalUrl(data.coverImage.url) || '';
        cover.alt = data.coverImage.altText || `${esc(data.name)} cover photo`;
        cover.style.cssText = 'display:block;width:100%;max-height:340px;object-fit:cover;border-radius:14px;margin:20px 0';
      }
      const servicesHeading = Array.from(document.querySelectorAll('h2')).find(node => /services offered/i.test(node.textContent));
      const servicesList = servicesHeading?.parentElement?.querySelector('ul');
      if (servicesList && data.servicesOffered) {
        servicesList.replaceChildren(...String(data.servicesOffered).split(/\n|,/).map(item => item.trim()).filter(Boolean).map(item => {
          const li = document.createElement('li'); li.textContent = item; return li;
        }));
      }
      updateContactLinks(id, data);
      trackProfileLink(id, 'view', data);
    } catch (error) {
      console.warn('Business profile sync unavailable; showing saved page content.', error);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, {once:true});
  else sync();
})();
