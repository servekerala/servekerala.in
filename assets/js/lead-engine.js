// ==========================================================
// SERVEKERALA.IN – GENUINE LEAD GENERATION & CONVERSION ENGINE
// ==========================================================

(function() {
  'use strict';

  // 1. Smart WhatsApp URL Builder
  window.buildWhatsAppUrl = function(phone, businessName, category, location, customMsg) {
    if (!phone) return '#';
    const digits = phone.replace(/\D/g, '');
    const cleanPhone = digits.length === 10 ? '91' + digits : digits;
    
    let text = `Hello`;
    if (businessName) text += ` ${businessName}`;
    text += `, I found your verified profile on ServeKerala.in`;
    if (category) text += ` for ${category}`;
    if (location) text += ` in ${location}`;
    text += `. `;
    
    if (customMsg) {
      text += customMsg;
    } else {
      text += `I would like to inquire about your services and get a price estimate. Please let me know your availability.`;
    }
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // 2. State & Active Target
  let currentLeadTarget = {
    businessId: '',
    businessName: '',
    phone: '',
    whatsapp: '',
    category: '',
    district: '',
    town: '',
    collectionName: 'listings'
  };

  // 3. Inject Modal Styles & HTML
  function injectLeadModal() {
    if (document.getElementById('sk-lead-modal-container')) return;

    // Inject CSS
    const style = document.createElement('style');
    style.id = 'sk-lead-engine-styles';
    style.textContent = `
      .sk-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(11, 59, 44, 0.65);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      .sk-modal-backdrop.active {
        opacity: 1;
        visibility: visible;
      }
      .sk-modal-card {
        background: #ffffff;
        width: 100%;
        max-width: 520px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(11, 59, 44, 0.25);
        border: 1px solid rgba(212, 175, 55, 0.2);
        transform: translateY(20px) scale(0.97);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        padding: 28px;
        box-sizing: border-box;
      }
      .sk-modal-backdrop.active .sk-modal-card {
        transform: translateY(0) scale(1);
      }
      .sk-modal-close {
        position: absolute;
        top: 18px;
        right: 18px;
        background: #f1f5f9;
        border: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        color: #475569;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .sk-modal-close:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
      .sk-modal-header {
        margin-bottom: 20px;
        padding-right: 28px;
      }
      .sk-modal-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #dcfce7;
        color: #15803d;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .sk-modal-title {
        font-size: 22px;
        font-weight: 800;
        color: #0B3B2C;
        margin: 0 0 6px 0;
        line-height: 1.25;
      }
      .sk-modal-subtitle {
        font-size: 13.5px;
        color: #64748b;
        margin: 0;
        line-height: 1.45;
      }
      .sk-form-group {
        margin-bottom: 16px;
      }
      .sk-form-label {
        display: block;
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 6px;
      }
      .sk-form-label span.req {
        color: #dc2626;
      }
      .sk-form-input, .sk-form-select, .sk-form-textarea {
        width: 100%;
        padding: 11px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 14.5px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: #f8fafc;
      }
      .sk-form-input:focus, .sk-form-select:focus, .sk-form-textarea:focus {
        outline: none;
        border-color: #0B3B2C;
        box-shadow: 0 0 0 3px rgba(11, 59, 44, 0.12);
        background: #ffffff;
      }
      .sk-urgency-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .sk-urgency-btn {
        padding: 9px 8px;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        border-radius: 8px;
        font-size: 12.5px;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }
      .sk-urgency-btn:hover {
        border-color: #0B3B2C;
        background: #f8fafc;
      }
      .sk-urgency-btn.selected {
        border-color: #16A34A;
        background: #dcfce7;
        color: #15803d;
        font-weight: 700;
      }
      .sk-btn-submit {
        width: 100%;
        padding: 13px;
        background: #0B3B2C;
        color: #ffffff;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(11, 59, 44, 0.2);
        margin-top: 20px;
      }
      .sk-btn-submit:hover {
        background: #06281E;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(11, 59, 44, 0.25);
      }
      .sk-btn-submit:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .sk-trust-footer {
        margin-top: 14px;
        text-align: center;
        font-size: 12px;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .sk-success-box {
        text-align: center;
        padding: 20px 10px;
      }
      .sk-success-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }
      .sk-success-title {
        font-size: 22px;
        font-weight: 800;
        color: #0B3B2C;
        margin-bottom: 8px;
      }
      .sk-success-desc {
        color: #475569;
        font-size: 14.5px;
        line-height: 1.55;
        margin-bottom: 22px;
      }
      .sk-wa-direct-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 13px;
        background: #16A34A;
        color: #ffffff;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 700;
        text-decoration: none;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
        transition: all 0.2s;
      }
      .sk-wa-direct-btn:hover {
        background: #15803d;
      }

      /* Mobile Sticky Contact Bar */
      .sk-mobile-bottom-bar {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        padding: 10px 14px;
        box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
        z-index: 9998;
        gap: 10px;
      }
      @media (max-width: 768px) {
        .sk-mobile-bottom-bar.visible {
          display: flex;
        }
        body.has-mobile-bar {
          padding-bottom: 68px;
        }
      }
      .sk-mob-btn {
        flex: 1;
        padding: 11px 8px;
        border-radius: 10px;
        font-size: 13.5px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .sk-mob-btn-call {
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #cbd5e1;
      }
      .sk-mob-btn-wa {
        background: #dcfce7;
        color: #15803d;
        border: 1px solid #86efac;
      }
      .sk-mob-btn-quote {
        background: #0B3B2C;
        color: #ffffff;
        border: none;
        flex: 1.2;
      }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const modalContainer = document.createElement('div');
    modalContainer.id = 'sk-lead-modal-container';
    modalContainer.innerHTML = `
      <div class="sk-modal-backdrop" id="sk-modal-backdrop">
        <div class="sk-modal-card" id="sk-modal-card">
          <button type="button" class="sk-modal-close" id="sk-modal-close-btn" aria-label="Close modal">&times;</button>
          
          <div id="sk-modal-form-view">
            <div class="sk-modal-header">
              <span class="sk-modal-badge">⚡ Instant Quote Request</span>
              <h3 class="sk-modal-title" id="sk-modal-target-title">Request a Free Callback</h3>
              <p class="sk-modal-subtitle" id="sk-modal-target-subtitle">
                Connect directly with verified local professionals. 100% free with zero commission.
              </p>
            </div>

            <form id="sk-lead-form">
              <div class="sk-form-group">
                <label class="sk-form-label" for="sk-lead-name">Your Full Name <span class="req">*</span></label>
                <input type="text" id="sk-lead-name" class="sk-form-input" placeholder="e.g. Rahul Menon" required minlength="2">
              </div>

              <div class="sk-form-group">
                <label class="sk-form-label" for="sk-lead-phone">Phone / WhatsApp Number <span class="req">*</span></label>
                <input type="tel" id="sk-lead-phone" class="sk-form-input" placeholder="e.g. 98470 12345" required pattern="[0-9]{10}" maxlength="10">
                <small style="font-size: 11.5px; color: #64748b; margin-top: 3px; display: block;">10-digit mobile number for direct response.</small>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="sk-form-group">
                  <label class="sk-form-label" for="sk-lead-town">Your Town / Area <span class="req">*</span></label>
                  <input type="text" id="sk-lead-town" class="sk-form-input" placeholder="e.g. Thiruvalla" required>
                </div>
                <div class="sk-form-group">
                  <label class="sk-form-label" for="sk-lead-service">Service Needed</label>
                  <input type="text" id="sk-lead-service" class="sk-form-input" placeholder="e.g. Solar Installation">
                </div>
              </div>

              <div class="sk-form-group">
                <label class="sk-form-label">When do you need this done?</label>
                <div class="sk-urgency-grid">
                  <button type="button" class="sk-urgency-btn selected" data-val="Urgent (Today/Tomorrow)">🔥 Urgent</button>
                  <button type="button" class="sk-urgency-btn" data-val="Within this week">📅 This Week</button>
                  <button type="button" class="sk-urgency-btn" data-val="Just planning/pricing">💬 Getting Quotes</button>
                </div>
                <input type="hidden" id="sk-lead-urgency" value="Urgent (Today/Tomorrow)">
              </div>

              <div class="sk-form-group">
                <label class="sk-form-label" for="sk-lead-notes">Brief Work Requirement (Optional)</label>
                <textarea id="sk-lead-notes" class="sk-form-textarea" rows="2" placeholder="e.g., Need 3kW on-grid solar quote / Pipe leak repair in kitchen..."></textarea>
              </div>

              <button type="submit" class="sk-btn-submit" id="sk-lead-submit-btn">
                <span>Submit Quote Request</span> &rarr;
              </button>

              <div class="sk-trust-footer">
                <span>🛡️ Verified Local Service</span>
                <span>•</span>
                <span>🔒 Zero Spam Guarantee</span>
              </div>
            </form>
          </div>

          <div id="sk-modal-success-view" style="display: none;">
            <!-- Populated dynamically on submit -->
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);

    // Bind Close Handlers
    const backdrop = document.getElementById('sk-modal-backdrop');
    const closeBtn = document.getElementById('sk-modal-close-btn');

    const closeModal = () => {
      backdrop.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) closeModal();
    });

    // Urgency buttons
    const urgencyBtns = modalContainer.querySelectorAll('.sk-urgency-btn');
    const urgencyInput = document.getElementById('sk-lead-urgency');
    urgencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        urgencyBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        urgencyInput.value = btn.getAttribute('data-val');
      });
    });

    // Form Submit
    const form = document.getElementById('sk-lead-form');
    form.addEventListener('submit', handleLeadFormSubmit);
  }

  // 4. Open Modal Public API
  window.openQuoteModal = function(options = {}) {
    injectLeadModal();

    currentLeadTarget = {
      businessId: options.businessId || '',
      businessName: options.businessName || 'Verified Local Partner',
      phone: options.phone || '',
      whatsapp: options.whatsapp || options.phone || '',
      category: options.category || '',
      district: options.district || '',
      town: options.town || '',
      collectionName: options.collectionName || 'listings'
    };

    // Update Header
    const titleEl = document.getElementById('sk-modal-target-title');
    const subEl = document.getElementById('sk-modal-target-subtitle');
    const serviceInput = document.getElementById('sk-lead-service');
    const townInput = document.getElementById('sk-lead-town');

    if (currentLeadTarget.businessName && currentLeadTarget.businessName !== 'Verified Local Partner') {
      titleEl.textContent = `Get a Quote from ${currentLeadTarget.businessName}`;
      subEl.textContent = `Direct customer inquiry. Your message will be delivered directly to this provider.`;
    } else {
      titleEl.textContent = `Request a Free Service Callback`;
      subEl.textContent = `Get competitive direct WhatsApp quotes from verified local professionals near you.`;
    }

    if (currentLeadTarget.category && !serviceInput.value) {
      serviceInput.value = currentLeadTarget.category.charAt(0).toUpperCase() + currentLeadTarget.category.slice(1);
    }
    if (currentLeadTarget.town && !townInput.value) {
      townInput.value = currentLeadTarget.town;
    } else if (currentLeadTarget.district && !townInput.value) {
      townInput.value = currentLeadTarget.district;
    }

    // Reset view
    document.getElementById('sk-modal-form-view').style.display = 'block';
    document.getElementById('sk-modal-success-view').style.display = 'none';

    // Show
    const backdrop = document.getElementById('sk-modal-backdrop');
    backdrop.classList.add('active');
    setTimeout(() => {
      const nameInput = document.getElementById('sk-lead-name');
      if (nameInput) nameInput.focus();
    }, 150);
  };

  // 5. Handle Submit Logic
  function handleLeadFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('sk-lead-name').value.trim();
    const rawPhone = document.getElementById('sk-lead-phone').value.trim();
    const town = document.getElementById('sk-lead-town').value.trim();
    const service = document.getElementById('sk-lead-service').value.trim();
    const urgency = document.getElementById('sk-lead-urgency').value;
    const notes = document.getElementById('sk-lead-notes').value.trim();
    const submitBtn = document.getElementById('sk-lead-submit-btn');

    if (!name || rawPhone.length !== 10) {
      alert('Please enter your full name and a valid 10-digit mobile number.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Saving inquiry...</span>`;

    const leadPayload = {
      customerName: name,
      customerPhone: rawPhone,
      customerLocation: town,
      serviceNeeded: service || currentLeadTarget.category || 'General Service',
      urgency: urgency,
      notes: notes,
      businessId: currentLeadTarget.businessId || 'general_lead',
      businessCollection: currentLeadTarget.collectionName || 'listings',
      businessName: currentLeadTarget.businessName || 'General Directory Lead',
      businessCategory: currentLeadTarget.category || '',
      businessDistrict: currentLeadTarget.district || '',
      businessTown: currentLeadTarget.town || '',
      sourceUrl: window.location.href,
      status: 'new', // new | contacted | converted | closed
      createdAt: typeof firebase !== 'undefined' ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
    };

    // Save to Firestore 'leads'
    const savePromise = (typeof firebase !== 'undefined' && firebase.firestore)
      ? firebase.firestore().collection('leads').add(leadPayload)
      : Promise.resolve();

    // Increment business callbackRequests
    if (currentLeadTarget.businessId && typeof firebase !== 'undefined') {
      const coll = currentLeadTarget.collectionName || 'listings';
      firebase.firestore().collection(coll).doc(currentLeadTarget.businessId).update({
        callbackRequests: firebase.firestore.FieldValue.increment(1)
      }).catch(err => console.warn('Could not increment callbackRequests:', err));
    }

    // Analytics event
    if (typeof pushAnalyticsEvent === 'function') {
      pushAnalyticsEvent('callback_request', {
        business_id: currentLeadTarget.businessId,
        business_name: currentLeadTarget.businessName,
        category: currentLeadTarget.category,
        district: currentLeadTarget.district,
        town: town,
        button_location: 'quote_modal'
      });
      pushAnalyticsEvent('lead_submission', {
        service_needed: service,
        urgency: urgency
      });
    }

    savePromise.finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Submit Quote Request</span> &rarr;`;

      // Build instant WhatsApp continuation link
      const waMsg = `Hi ${currentLeadTarget.businessName}, I just submitted a quote request on ServeKerala.in:\n\n👤 Name: ${name}\n📞 Phone: ${rawPhone}\n📍 Location: ${town}\n🛠️ Service: ${service || 'General'}\n⚡ Timeline: ${urgency}${notes ? `\n📝 Details: ${notes}` : ''}\n\nPlease share your estimate and availability.`;
      
      const waUrl = buildWhatsAppUrl(currentLeadTarget.whatsapp || currentLeadTarget.phone, currentLeadTarget.businessName, service, town, waMsg);

      // Render Success View
      const formView = document.getElementById('sk-modal-form-view');
      const successView = document.getElementById('sk-modal-success-view');

      formView.style.display = 'none';
      successView.style.display = 'block';
      successView.innerHTML = `
        <div class="sk-success-box">
          <div class="sk-success-icon">🎉</div>
          <h3 class="sk-success-title">Inquiry Sent Successfully!</h3>
          <p class="sk-success-desc">
            Thank you <strong>${name}</strong>! Your quote request has been routed directly to <strong>${currentLeadTarget.businessName}</strong>. Expect a direct callback or WhatsApp shortly.
          </p>

          ${currentLeadTarget.whatsapp ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="sk-wa-direct-btn" id="sk-direct-wa-btn">
              <span>💬 Open Direct in WhatsApp Now</span>
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Tap above to send this inquiry directly to their WhatsApp.</p>
          ` : ''}

          <button type="button" class="btn btn-outline" style="margin-top: 16px; width: 100%; border-radius: 12px; padding: 12px;" onclick="document.getElementById('sk-modal-backdrop').classList.remove('active')">
            Close Window
          </button>
        </div>
      `;

      // Auto-track direct WhatsApp click from modal if clicked
      const directWaBtn = document.getElementById('sk-direct-wa-btn');
      if (directWaBtn && typeof trackListingClick === 'function') {
        directWaBtn.addEventListener('click', () => {
          trackListingClick(currentLeadTarget.businessId, 'whatsapp', true, currentLeadTarget.collectionName);
        });
      }
    });
  }

  // 6. Sticky Mobile Action Bar Helper for Business Profile Pages
  window.initMobileBottomBar = function(bizData) {
    if (document.getElementById('sk-mobile-bottom-bar')) return;

    const phone = bizData.phone || '';
    const whatsapp = bizData.whatsapp || phone;
    const name = bizData.name || '';
    const category = bizData.category || '';
    const district = bizData.district || '';

    const waUrl = buildWhatsAppUrl(whatsapp, name, category, district);

    const bar = document.createElement('div');
    bar.id = 'sk-mobile-bottom-bar';
    bar.className = 'sk-mobile-bottom-bar visible';
    bar.innerHTML = `
      ${phone ? `
        <a href="tel:${phone}" class="sk-mob-btn sk-mob-btn-call" onclick="if(typeof trackListingClick==='function')trackListingClick('${bizData.id}','call',true,'${bizData.collectionName||'listings'}')">
          📞 Call
        </a>
      ` : ''}
      ${whatsapp ? `
        <a href="${waUrl}" target="_blank" rel="noopener" class="sk-mob-btn sk-mob-btn-wa" onclick="if(typeof trackListingClick==='function')trackListingClick('${bizData.id}','whatsapp',true,'${bizData.collectionName||'listings'}')">
          💬 WhatsApp
        </a>
      ` : ''}
      <button type="button" class="sk-mob-btn sk-mob-btn-quote" id="sk-mob-quote-btn">
        ⚡ Get Quote
      </button>
    `;

    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-bar');

    document.getElementById('sk-mob-quote-btn').addEventListener('click', () => {
      window.openQuoteModal({
        businessId: bizData.id,
        businessName: name,
        phone: phone,
        whatsapp: whatsapp,
        category: category,
        district: district,
        town: bizData.towns || '',
        collectionName: bizData.collectionName || 'listings'
      });
    });
  };

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', () => {
    injectLeadModal();
  });

})();

