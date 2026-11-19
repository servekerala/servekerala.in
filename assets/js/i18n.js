// ==========================================================
// SERVEKERALA.IN – BILINGUAL ENGINE (ENGLISH / MALAYALAM)
// ==========================================================

(function() {
  const TRANSLATIONS = {
    en: {
      nav_home: 'Home <span class="nav-sub">ഹോം</span>',
      nav_services: 'Services <span class="nav-sub">സേവനങ്ങൾ</span>',
      nav_list_biz: 'List Your Business',
      nav_contact: 'Contact',
      hero_title: "Find Verified Local Services in Kerala",
      hero_subtitle: "Connect directly with certified plumbers, electricians, solar installers, and local pros across Kerala.",
      search_placeholder: "Search service or city...",
      btn_find_pro: "Find a Pro",
      all_districts: "All Districts",
      all_stands: "All Auto Stands",
      verified_directory: "Verified Stand Directory",
      driver_portal: "Driver Portal",
      join_auto: "Join Auto Mithram",
      btn_call: "Call",
      btn_wa: "WhatsApp",
      btn_map: "📍 Map",
      stand_label: "Stand:",
      hours_label: "Hours:",
      verified_label: "Verified",
      copyright: "© 2026 ServeKerala.in. All rights reserved.",
      
      // Categories & Footer
      cat_battery: "Battery Shops",
      cat_fuel: "Fuel Stations",
      cat_hotels: "Hotels",
      cat_restaurants: "Restaurants",
      cat_hospitals: "Hospitals",
      cat_electricians: "Electricians",
      cat_plumbers: "Plumbers",
      cat_solar: "Solar Installers",
      cat_ac: "AC Service",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_disclaimer: "Disclaimer",
      footer_contact: "Contact Us"
    },
    ml: {
      nav_home: 'Home <span class="nav-sub">ഹോം</span>',
      nav_services: 'സേവനങ്ങൾ <span class="nav-sub">Services</span>',
      nav_list_biz: "ബിസിനസ് ചേർക്കുക",
      nav_contact: "ബന്ധപ്പെടുക",
      hero_title: "കേരളത്തിലെ വിശ്വസനീയമായ പ്രാദേശിക സേവനങ്ങൾ കണ്ടെത്തുക",
      hero_subtitle: "പ്ലംബർമാർ, ഇലക്ട്രീഷ്യന്മാർ, സോളാർ ഇൻസ്റ്റാളർമാർ എന്നിവരുമായി നേരിട്ട് ബന്ധപ്പെടുക.",
      search_placeholder: "സേവനമോ നഗരമോ തിരയുക...",
      btn_find_pro: "സേവനം തിരയുക",
      all_districts: "എല്ലാ ജില്ലകളും",
      all_stands: "എല്ലാ ഓട്ടോ സ്റ്റാൻഡുകളും",
      verified_directory: "അംഗീകൃത സ്റ്റാൻഡ് ഡയറക്ടറി",
      driver_portal: "ഡ്രൈവർ പോർട്ടൽ",
      join_auto: "ഓട്ടോ മിത്രത്തിൽ ചേരുക",
      btn_call: "വിളിക്കുക",
      btn_wa: "വാട്സ്ആപ്പ്",
      btn_map: "📍 മാപ്പ്",
      stand_label: "സ്റ്റാൻഡ്:",
      hours_label: "സമയം:",
      verified_label: "പരിശോധിച്ചതാണ്",
      copyright: "© 2026 ServeKerala.in. എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം.",
      
      // Categories & Footer (Malayalam)
      cat_battery: "ബാറ്ററി ഷോപ്പുകൾ",
      cat_fuel: "ഇന്ധന പമ്പുകൾ",
      cat_hotels: "ഹോട്ടലുകൾ",
      cat_restaurants: "റെസ്റ്റോറന്റുകൾ",
      cat_hospitals: "ആശുപത്രികൾ",
      cat_electricians: "ഇലക്ട്രീഷ്യന്മാർ",
      cat_plumbers: "പ്ലംബർമാർ",
      cat_solar: "സോളാർ ഇൻസ്റ്റാളർമാർ",
      cat_ac: "എസി സർവീസ്",
      footer_privacy: "സ്വകാര്യതാ നയം",
      footer_terms: "നിബന്ധനകളും വ്യവസ്ഥകളും",
      footer_disclaimer: "ഡിസ്ക്ലെയിമർ",
      footer_contact: "ബന്ധപ്പെടുക"
    }
  };

  let currentLang = localStorage.getItem('servekerala_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('servekerala_lang', lang);
    document.documentElement.lang = lang === 'ml' ? 'ml' : 'en';

    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Update active button state in all language toggles
    document.querySelectorAll('.lang-switcher-pill').forEach(pill => {
      pill.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });

    // Update Navigation links text (Home, Services, Auto Mithram, List Your Business, Contact)
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav-links a, header nav a');
    navLinks.forEach(a => {
      if (a.classList.contains('lang-btn')) return;

      const href = (a.getAttribute('href') || '').toLowerCase().trim();
      const txt = a.textContent.trim();

      // Check data-i18n first
      const i18nKey = a.getAttribute('data-i18n');
      if (i18nKey && t[i18nKey]) {
        a.innerHTML = t[i18nKey];
        return;
      }

      // Match by Href or Text Content
      if (href === '/' || href === '/index.html' || href === '#' || href === '' || txt.startsWith('Home') || txt.includes('ഹോം')) {
        a.innerHTML = t.nav_home;
        a.setAttribute('data-i18n', 'nav_home');
      } else if (href.includes('/services') || txt.startsWith('Services') || txt.includes('സേവനങ്ങൾ')) {
        a.innerHTML = t.nav_services;
        a.setAttribute('data-i18n', 'nav_services');
      } else if (href.includes('/auto-mithram') || href.includes('/auto') || txt.startsWith('Auto') || txt.includes('ഓട്ടോ')) {
        a.innerHTML = t.nav_auto;
        a.setAttribute('data-i18n', 'nav_auto');
      } else if (href.includes('/list-your-business') || txt.startsWith('List') || txt.includes('ബിസിനസ്')) {
        a.innerHTML = t.nav_list_biz;
        a.setAttribute('data-i18n', 'nav_list_biz');
      } else if (href.includes('/contact') || txt.startsWith('Contact') || txt.includes('ബന്ധപ്പെടുക')) {
        a.innerHTML = t.nav_contact;
        a.setAttribute('data-i18n', 'nav_contact');
      }
    });

    // Translate marked elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] && !el.classList.contains('lang-btn')) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', t[key]);
        } else {
          el.innerHTML = t[key];
        }
      }
    });

    // Search input placeholders
    const mainSearch = document.getElementById('search-service') || document.getElementById('header-search-input');
    if (mainSearch && t.search_placeholder) mainSearch.placeholder = t.search_placeholder;

    const autoSearch = document.getElementById('search-auto-input');
    if (autoSearch && t.search_auto_placeholder) autoSearch.placeholder = t.search_auto_placeholder;

    // Card Action buttons (Call / WhatsApp)
    document.querySelectorAll('.btn-call span').forEach(el => el.textContent = t.btn_call);
    document.querySelectorAll('.btn-wa span').forEach(el => el.textContent = t.btn_wa);
  }

  function createPillElement() {
    const pill = document.createElement('div');
    pill.className = 'lang-switcher-pill';
    pill.innerHTML = `
      <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
      <button type="button" class="lang-btn ${currentLang === 'ml' ? 'active' : ''}" data-lang="ml">മലയാളം</button>
    `;

    pill.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetLang = btn.getAttribute('data-lang');
        applyLanguage(targetLang);
      });
    });
    return pill;
  }

  function injectLanguageSwitcher() {
    // Desktop Nav
    const mainNavs = document.querySelectorAll('.main-nav');
    mainNavs.forEach(nav => {
      if (!nav.querySelector('.lang-switcher-pill')) {
        nav.appendChild(createPillElement());
      }
    });

    // Mobile Header Bar (Directly visible next to hamburger menu)
    const headers = document.querySelectorAll('.site-header .container');
    headers.forEach(header => {
      const hamburger = header.querySelector('.hamburger-btn');
      if (hamburger && !header.querySelector('.lang-switcher-mobile-header')) {
        const mobPill = createPillElement();
        mobPill.classList.add('lang-switcher-mobile-header');
        header.insertBefore(mobPill, hamburger);
      }
    });

    // Mobile Nav Drawer
    const mobileNavs = document.querySelectorAll('.mobile-nav-links');
    mobileNavs.forEach(nav => {
      if (!nav.querySelector('.lang-switcher-pill')) {
        nav.appendChild(createPillElement());
      }
    });
  }

  window.setLanguage = applyLanguage;

  function init() {
    injectLanguageSwitcher();
    applyLanguage(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
