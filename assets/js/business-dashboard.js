(() => {
  'use strict';

  const config = {
    apiKey: 'AIzaSyCX0GVM7M09qd2b5FlgvETPzJL702MMpMc',
    authDomain: 'servekerala2026.firebaseapp.com',
    projectId: 'servekerala2026',
    storageBucket: 'servekerala2026.firebasestorage.app',
    messagingSenderId: '122091003614',
    appId: '1:122091003614:web:e2114b7064aceff4f5ac4f',
    measurementId: 'G-P3J3NLRKDL'
  };
  const $ = id => document.getElementById(id);
  let auth = null;
  let db = null;
  let firebaseReady = false;
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) firebase.initializeApp(config);
      auth = firebase.auth();
      db = firebase.firestore();
      firebaseReady = true;
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
  let profiles = [];
  let selected = null;
  let pendingImages = {logo: null, coverImage: null};
  let activeUploads = 0;
  let serviceCatalog = [];
  let serviceCategories = [];
  let serviceCatalogReady = false;
  const fields = {
    name: 'profile-name', shortDescription: 'profile-short', description: 'profile-description',
    servicesOffered: 'profile-services', towns: 'profile-towns', phone: 'profile-phone',
    whatsapp: 'profile-whatsapp', website: 'profile-website', address: 'profile-address',
    whyChooseUs: 'profile-why', seoTitle: 'profile-seo-title', seoDescription: 'profile-seo-description'
  };

  function showStatus(target, message, error = false) {
    const node = $(target);
    node.textContent = message;
    node.classList.toggle('error', error);
  }
  function formatBytes(bytes) {
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  function setPanel(name) {
    $('auth-panel').hidden = name !== 'auth';
    $('verify-panel').hidden = name !== 'verify';
    $('dashboard-panel').hidden = name !== 'dashboard';
  }
  function friendlyError(error) {
    if (error.code === 'auth/operation-not-allowed') return 'Email and password sign-in is disabled in Firebase. Enable the Email/Password provider in Firebase Authentication settings.';
    if (error.code === 'auth/unauthorized-domain') return 'This website domain is not authorized in Firebase Authentication. Add the current domain in Firebase Console → Authentication → Settings → Authorized domains.';
    if (error.code === 'auth/network-request-failed') return 'Firebase could not be reached. Check your connection and try again.';
    if (error.code === 'auth/invalid-email') return 'Enter a valid email address.';
    if (error.code === 'auth/too-many-requests') return 'Too many attempts were made. Wait a little and try again.';
    if (error.code === 'auth/user-not-found') return 'No account was found for that email. Create an account first.';
    if (!firebaseReady) return 'The account service did not load. Refresh the page or try again shortly.';
    if (error.code === 'auth/email-already-in-use') return 'That email already has an account. Sign in or reset the password.';
    if (error.code === 'auth/weak-password') return 'Choose a password with at least 8 characters.';
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') return 'Email or password is incorrect.';
    if (error.code === 'permission-denied') return 'No profile is linked to this verified email yet. Make sure it matches the contact email on your listing, or contact ServeKerala support.';
    return error.message || 'Something went wrong. Please try again.';
  }
  $('auth-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!firebaseReady) return showStatus('auth-status', friendlyError({}), true);
    const email = $('owner-email').value.trim().toLowerCase();
    const password = $('owner-password').value;
    const mode = event.submitter?.dataset.authMode || 'signin';
    showStatus('auth-status', mode === 'signup' ? 'Creating account…' : 'Signing in…');
    document.querySelectorAll('[data-auth-mode]').forEach(button => button.disabled = true);
    try {
      if (mode === 'signup') {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.sendEmailVerification();
        $('verify-email').textContent = email;
        setPanel('verify');
        showStatus('verify-status', 'Verification email sent. Check your inbox and spam folder.');
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      showStatus('auth-status', friendlyError(error), true);
    } finally {
      document.querySelectorAll('[data-auth-mode]').forEach(button => button.disabled = false);
    }
  });
  $('reset-password').addEventListener('click', async () => {
    if (!firebaseReady) return showStatus('auth-status', friendlyError({}), true);
    const email = $('owner-email').value.trim().toLowerCase();
    if (!email) return showStatus('auth-status', 'Enter your email address first.', true);
    try { await auth.sendPasswordResetEmail(email); showStatus('auth-status', 'Password reset email sent.'); }
    catch (error) { showStatus('auth-status', friendlyError(error), true); }
  });
  $('resend-verification').addEventListener('click', async () => {
    try { await auth.currentUser.sendEmailVerification(); showStatus('verify-status', 'Verification link sent again.'); }
    catch (error) { showStatus('verify-status', friendlyError(error), true); }
  });
  $('refresh-verification').addEventListener('click', async () => {
    try { await auth.currentUser.reload(); if (auth.currentUser.emailVerified) await auth.currentUser.getIdToken(true); else return showStatus('verify-status', 'Email is not verified yet. Open the verification link, then try again.'); }
    catch (error) { return showStatus('verify-status', friendlyError(error), true); }
  });
  $('verify-signout').addEventListener('click', () => auth.signOut());
  $('owner-signout').addEventListener('click', () => auth.signOut());

  auth.onAuthStateChanged(async user => {
    if (!user) { setPanel('auth'); return; }
    $('signed-in-email').textContent = `Signed in as ${user.email}`;
    if (!user.emailVerified) {
      $('verify-email').textContent = user.email || '';
      setPanel('verify');
      return;
    }
    setPanel('dashboard');
    await loadServiceCatalog();
    await loadProfiles(user);
  });

  async function loadServiceCatalog() {
    serviceCatalogReady = false;
    try {
      const snapshot = await db.collection('cms_settings').doc('global').get();
      const data = snapshot.exists ? snapshot.data() : {};
      serviceCatalog = Array.isArray(data.services) ? data.services.filter(item => item && item.id && item.categoryId && item.name) : [];
      serviceCategories = Array.isArray(data.categories) ? data.categories : [];
      serviceCatalogReady = true;
    } catch (error) {
      console.warn('Could not load approved services for profile editing:', error);
    }
  }

  function renderProfileServiceOptions(profile) {
    const container = $('profile-service-options');
    const counter = $('profile-service-selection-status');
    const isPremium = profile.data.listingTier === 'premium';
    const serviceLimit = isPremium ? 100 : 10;
    const categoryValue = profile.data.categoryId || profile.data.category || '';
    const categoryId = serviceCategories.find(category => category.id === categoryValue || (category.name || '').toLowerCase() === String(categoryValue).toLowerCase())?.id || categoryValue;
    const choices = serviceCatalog.filter(service => service.categoryId === categoryId);
    const oldLines = String(profile.data.servicesOffered || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const oldIds = Array.isArray(profile.data.serviceIds) ? profile.data.serviceIds : [];
    let selectedIds = new Set(oldIds.filter(id => choices.some(service => service.id === id)));
    if (!selectedIds.size) {
      const oldNames = new Set(oldLines.map(line => line.toLocaleLowerCase()));
      selectedIds = new Set(choices.filter(service => oldNames.has(service.name.toLocaleLowerCase())).map(service => service.id));
    }
    const cappedIds = new Set(Array.from(selectedIds).slice(0, serviceLimit));
    container.replaceChildren();
    if (!serviceCatalogReady || !choices.length) {
      const message = document.createElement('span');
      message.className = 'owner-service-option-empty';
      message.textContent = !serviceCatalogReady ? 'Approved service options are unavailable right now. You can still edit the service details below.' : 'No approved service options are listed for this category yet. Contact ServeKerala to suggest one.';
      container.append(message);
    } else {
      choices.forEach(service => {
        const label = document.createElement('label');
        label.className = 'owner-service-option';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'profile-service-id';
        input.value = service.id;
        input.checked = cappedIds.has(service.id);
        const text = document.createElement('span');
        text.textContent = service.name;
        label.append(input, text);
        container.append(label);
      });
    }
    const selectedNames = choices.filter(service => cappedIds.has(service.id)).map(service => service.name.toLocaleLowerCase());
    $('profile-services').value = oldLines.filter(line => !selectedNames.includes(line.toLocaleLowerCase())).join('\n');
    if (counter) counter.textContent = `${isPremium ? 'Premium' : 'Regular'} plan: ${cappedIds.size} of ${serviceLimit} selected`;
    container.onchange = event => {
      if (event.target?.name !== 'profile-service-id') return;
      const checked = container.querySelectorAll('input[name="profile-service-id"]:checked');
      if (checked.length > serviceLimit) {
        event.target.checked = false;
        showStatus('dashboard-status', `Your ${isPremium ? 'Premium' : 'Regular'} plan allows up to ${serviceLimit} services.`, true);
      }
      if (counter) counter.textContent = `${isPremium ? 'Premium' : 'Regular'} plan: ${container.querySelectorAll('input[name="profile-service-id"]:checked').length} of ${serviceLimit} selected`;
    };
  }

  async function loadProfiles(user) {
    showStatus('dashboard-status', 'Loading profiles linked to your email…');
    $('profile-list').replaceChildren();
    profiles = [];
    try {
      const [listingSnap, pageSnap] = await Promise.all([
        db.collection('listings').where('email', '==', user.email.toLowerCase()).get(),
        db.collection('business_pages').where('email', '==', user.email.toLowerCase()).get()
      ]);
      const ownedByEmail = await Promise.all([
        db.collection('listings').where('ownerEmail', '==', user.email.toLowerCase()).get(),
        db.collection('business_pages').where('ownerEmail', '==', user.email.toLowerCase()).get()
      ]);
      const found = new Map();
      listingSnap.forEach(doc => found.set(`listings/${doc.id}`, {id: doc.id, collection: 'listings', data: doc.data()}));
      pageSnap.forEach(doc => found.set(`business_pages/${doc.id}`, {id: doc.id, collection: 'business_pages', data: doc.data()}));
      ownedByEmail[0].forEach(doc => found.set(`listings/${doc.id}`, {id: doc.id, collection: 'listings', data: doc.data()}));
      ownedByEmail[1].forEach(doc => found.set(`business_pages/${doc.id}`, {id: doc.id, collection: 'business_pages', data: doc.data()}));
      profiles = Array.from(found.values());
      if (!profiles.length) {
        showStatus('dashboard-status', 'We could not find an approved listing linked to this verified email. Contact ServeKerala support and include your business name.');
        return;
      }
      showStatus('dashboard-status', `${profiles.length} profile${profiles.length === 1 ? '' : 's'} linked to your account.`);
      profiles.forEach((profile, index) => {
        const row = document.createElement('div');
        row.className = 'owner-profile';
        const details = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = profile.data.name || 'Business profile';
        const meta = document.createElement('div');
        meta.className = 'owner-small';
        meta.textContent = `${profile.data.category || 'Local business'} · ${profile.data.district || 'Kerala'} · ${profile.collection === 'business_pages' ? 'Business profile' : 'Service listing'}`;
        details.append(title, meta);
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'btn btn-primary'; button.textContent = 'Manage profile';
        button.addEventListener('click', () => selectProfile(index));
        row.append(details, button); $('profile-list').append(row);
      });
      selectProfile(0);
    } catch (error) {
      console.error('Business dashboard load failed:', error);
      showStatus('dashboard-status', friendlyError(error), true);
    }
  }

  async function selectProfile(index) {
    selected = profiles[index];
    $('edit-section').hidden = false;
    $('edit-heading').textContent = `Edit ${selected.data.name || 'business profile'}`;
    Object.entries(fields).forEach(([key, id]) => $(id).value = selected.data[key] || '');
    renderProfileServiceOptions(selected);
    selected.publicPath = '';
    if (selected.data.website) {
      try {
        const websiteUrl = new URL(selected.data.website);
        if (!selected.publicPath && websiteUrl.hostname.endsWith('servekerala.in') && websiteUrl.pathname !== '/') {
          selected.publicPath = `${websiteUrl.pathname.replace(/\/$/, '')}/`;
          $('profile-website').value = '';
        }
      } catch (_) {}
    }
    pendingImages = {logo: null, coverImage: null};
    $('profile-logo-file').value = '';
    $('profile-cover-file').value = '';
    setImagePreview('logo', selected.data.logo?.url || '');
    setImagePreview('cover', selected.data.coverImage?.url || '');
    $('profile-logo-status').textContent = '';
    $('profile-cover-status').textContent = '';
    const path = selected.publicPath || (selected.collection === 'business_pages' ? `/business/${selected.id}/` : `/listing/${selected.id}/`);
    $('view-profile').href = path;
    $('edit-section').scrollIntoView({behavior:'smooth', block:'start'});
    await loadAnalytics(selected);
  }

  async function loadAnalytics(profile) {
    ['metric-views','metric-calls','metric-whatsapp','metric-website','metric-inquiries'].forEach(id => $(id).textContent = '0');
    $('owner-leads').replaceChildren();
    $('owner-sources').replaceChildren();
    try {
      const since = firebase.firestore.Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      const snapshot = await db.collection('analytics_events')
        .where('business_id', '==', profile.id)
        .where('timestamp', '>=', since)
        .limit(1000)
        .get();
      const counts = {business_profile_view:0, phone_click:0, whatsapp_click:0, website_click:0, callback_request:0};
      const sources = {};
      snapshot.forEach(doc => {
        const event = doc.data();
        if (Object.prototype.hasOwnProperty.call(counts, event.event_name)) counts[event.event_name]++;
        const referrerHost = (() => { try { return event.referrer ? new URL(event.referrer).hostname : ''; } catch (_) { return ''; } })();
        const source = [event.campaign, event.source, event.medium, referrerHost].filter(Boolean).join(' · ') || 'Direct';
        sources[source] = (sources[source] || 0) + 1;
      });
      $('metric-views').textContent = counts.business_profile_view.toLocaleString();
      $('metric-calls').textContent = counts.phone_click.toLocaleString();
      $('metric-whatsapp').textContent = counts.whatsapp_click.toLocaleString();
      $('metric-website').textContent = counts.website_click.toLocaleString();
      $('metric-inquiries').textContent = counts.callback_request.toLocaleString();
      const topSources = Object.entries(sources).sort((a,b) => b[1]-a[1]).slice(0,5);
      if (topSources.length) topSources.forEach(([source,count]) => {
        const row = document.createElement('div'); row.className = 'owner-profile';
        const label = document.createElement('span'); label.textContent = source;
        const total = document.createElement('strong'); total.textContent = `${count} interactions`;
        row.append(label,total); $('owner-sources').append(row);
      });
      else $('owner-sources').textContent = 'No tracked visitor sources yet.';
    } catch (error) {
      console.warn('Event analytics unavailable:', error);
      ['metric-views','metric-calls','metric-whatsapp','metric-website','metric-inquiries'].forEach(id => $(id).textContent = '—');
      $('owner-sources').textContent = 'Traffic source report is temporarily unavailable.';
    }
    try {
      const leadSnap = await db.collection('leads')
        .where('businessId', '==', profile.id)
        .where('businessCollection', '==', profile.collection)
        .limit(20)
        .get();
      const leads = [];
      leadSnap.forEach(doc => leads.push(doc.data()));
      leads.sort((a,b) => {
        const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return bTime-aTime;
      });
      if (!leads.length) {
        $('owner-leads').textContent = 'No quote enquiries for this profile yet.';
      } else leads.forEach(lead => {
        const row = document.createElement('article'); row.className = 'owner-profile';
        const details = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = lead.customerName || 'Customer enquiry';
        const info = document.createElement('p'); info.className = 'owner-small';
        info.textContent = [lead.serviceNeeded, lead.customerLocation, lead.urgency, lead.status].filter(Boolean).join(' · ');
        const notes = document.createElement('p'); notes.className = 'owner-small'; notes.textContent = lead.notes || '';
        details.append(title, info); if (lead.notes) details.append(notes);
        row.append(details);
        if (lead.customerPhone) {
          const call = document.createElement('a'); call.className = 'btn btn-outline'; call.href = `tel:${String(lead.customerPhone).replace(/[^\d+]/g,'')}`; call.textContent = `Call ${lead.customerPhone}`; row.append(call);
        }
        $('owner-leads').append(row);
      });
    } catch (error) {
      console.warn('Business enquiries unavailable:', error);
      $('owner-leads').textContent = 'Enquiries are temporarily unavailable. Please try again shortly.';
    }
  }

  function setImagePreview(kind, url) {
    const preview = $(`profile-${kind}-preview`);
    if (url) { preview.src = url; preview.hidden = false; }
    else { preview.removeAttribute('src'); preview.hidden = true; }
  }

  async function optimizeProfileImage(file, kind) {
    const maxSourceBytes = 20 * 1024 * 1024;
    const storageLimitBytes = 5 * 1024 * 1024;
    const maxDimension = kind === 'logo' ? 800 : 1600;
    if (file.size > maxSourceBytes) throw new Error('This image is over 20 MB. Choose a smaller image.');

    let image;
    let objectUrl = '';
    try {
      if (typeof createImageBitmap === 'function') {
        image = await createImageBitmap(file);
      } else {
        objectUrl = URL.createObjectURL(file);
        image = await new Promise((resolve, reject) => {
          const element = new Image();
          element.onload = () => resolve(element);
          element.onerror = () => reject(new Error('Could not read this image. Try a JPG, PNG, or WebP file.'));
          element.src = objectUrl;
        });
      }

      const width = image.width || image.naturalWidth;
      const height = image.height || image.naturalHeight;
      if (!width || !height) throw new Error('Could not read this image. Try a JPG, PNG, or WebP file.');
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      if (scale === 1 && file.size <= 400 * 1024) return file;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image optimization is unavailable in this browser.');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', kind === 'logo' ? 0.86 : 0.82));
      if (!blob) throw new Error('Could not optimize this image. Try saving it as JPG or PNG and upload again.');
      if (blob.size > storageLimitBytes) throw new Error('The optimized image is still over 5 MB. Choose a smaller image.');

      const originalName = file.name.replace(/\.[^.]+$/, '') || 'business-image';
      return new File([blob], `${originalName}.webp`, {type: 'image/webp', lastModified: Date.now()});
    } finally {
      if (image && typeof image.close === 'function') image.close();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }

  async function uploadProfileImage(kind, file) {
    const field = kind === 'logo' ? 'logo' : 'coverImage';
    const status = $(`profile-${kind}-status`);
    if (!auth.currentUser?.emailVerified) return showStatus('dashboard-status', 'Verify your account email before uploading images.', true);
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
      status.textContent = 'Choose a JPG, PNG, or WebP image.'; status.classList.add('error'); return;
    }
    if (!selected) {
      status.textContent = 'Image storage is unavailable. Refresh and try again.'; status.classList.add('error'); return;
    }
    status.classList.remove('error'); status.textContent = 'Preparing image…';
    activeUploads++;
    let uploadTimedOut = false;
    try {
      const uploadFile = await optimizeProfileImage(file, kind);
      status.textContent = uploadFile.size < file.size
        ? `Optimized ${formatBytes(file.size)} to ${formatBytes(uploadFile.size)}. Uploading… 0%`
        : `Uploading image… 0%`;
      const token = await auth.currentUser.getIdToken();
      const signatureResponse = await fetch('/api/cloudinary-signature', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({collection: selected.collection, profileId: selected.id, kind: field})
      });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signatureData.error || 'Could not authorize this upload.');

      const result = await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        const body = new FormData();
        body.append('file', uploadFile);
        body.append('api_key', signatureData.apiKey);
        body.append('timestamp', signatureData.timestamp);
        body.append('folder', signatureData.folder);
        body.append('public_id', signatureData.publicId);
        body.append('signature', signatureData.signature);
        request.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(signatureData.cloudName)}/image/upload`);
        request.upload.addEventListener('progress', event => {
          if (event.lengthComputable) status.textContent = `Uploading image… ${Math.round(event.loaded / event.total * 100)}%`;
        });
        request.addEventListener('load', () => {
          let response;
          try { response = JSON.parse(request.responseText); } catch (_) { return reject(new Error('Cloudinary returned an unreadable response.')); }
          if (request.status < 200 || request.status >= 300) return reject(new Error(response.error?.message || 'Cloudinary could not upload this image.'));
          resolve(response);
        });
        request.addEventListener('error', () => reject(new Error('Network error during image upload. Check your connection and retry.')));
        request.addEventListener('timeout', () => { uploadTimedOut = true; reject(new Error('Upload timed out. Check your connection and retry.')); });
        request.timeout = 90000;
        request.send(body);
      });
      status.textContent = 'Finishing upload…';
      pendingImages[field] = {url: result.secure_url, storageProvider: 'cloudinary', publicId: result.public_id, altText: `${selected.data.name || 'Business'} ${kind === 'logo' ? 'logo' : 'cover image'}`};
      setImagePreview(kind, result.secure_url);
      status.textContent = 'Image uploaded. Save profile to publish it.';
    } catch (error) {
      console.error('Profile image upload failed:', error);
      status.classList.add('error');
      if (error.message?.includes('not configured on the server')) {
        status.textContent = 'Cloudinary is not connected yet. Add the Cloudinary server settings, then retry.';
      } else if (uploadTimedOut) {
        status.textContent = error.message || 'Upload stalled. Check your connection and retry.';
      } else {
        status.textContent = error.message || 'Upload failed. Please try again.';
      }
    } finally { activeUploads--; }
  }
  $('profile-logo-file').addEventListener('change', event => { if (event.target.files[0]) uploadProfileImage('logo', event.target.files[0]); });
  $('profile-cover-file').addEventListener('change', event => { if (event.target.files[0]) uploadProfileImage('cover', event.target.files[0]); });

  $('profile-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!selected || !auth.currentUser?.emailVerified) return;
    if (activeUploads) return showStatus('dashboard-status', 'Please wait for image uploads to finish before saving.', true);
    const button = $('save-profile'); button.disabled = true; button.textContent = 'Saving…';
    const updates = {};
    Object.entries(fields).forEach(([key, id]) => updates[key] = $(id).value.trim());
    const selectedServiceIds = Array.from(document.querySelectorAll('#profile-service-options input[name="profile-service-id"]:checked')).map(input => input.value);
    const serviceLimit = selected.data.listingTier === 'premium' ? 100 : 10;
    const otherServiceLines = $('profile-services').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (selectedServiceIds.length + otherServiceLines.length > serviceLimit) {
      button.disabled = false; button.textContent = 'Save profile';
      return showStatus('dashboard-status', `Your ${selected.data.listingTier === 'premium' ? 'Premium' : 'Regular'} plan allows up to ${serviceLimit} service entries total. Remove some selected services or extra lines.`, true);
    }
    if (serviceCatalogReady) {
      const selectedServices = serviceCatalog.filter(service => selectedServiceIds.includes(service.id));
      const otherServices = updates.servicesOffered.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      updates.serviceIds = selectedServices.map(service => service.id);
      updates.servicesOffered = Array.from(new Map([...selectedServices.map(service => service.name), ...otherServices].map(name => [name.toLocaleLowerCase(), name])).values()).join('\n');
    } else {
      updates.serviceIds = selected.data.serviceIds || [];
    }
    if (updates.website && !/^https:\/\//i.test(updates.website)) {
      button.disabled = false; button.textContent = 'Save profile';
      return showStatus('dashboard-status', 'Website links must begin with https://', true);
    }
    updates.logo = pendingImages.logo || selected.data.logo || null;
    updates.coverImage = pendingImages.coverImage || selected.data.coverImage || null;
    updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    try {
      await db.collection(selected.collection).doc(selected.id).update(updates);
      selected.data = {...selected.data, ...updates};
      $('edit-heading').textContent = `Edit ${updates.name || 'business profile'}`;
      showStatus('dashboard-status', 'Profile saved. Your public page will show the updated details.');
      $('profile-list').querySelectorAll('.owner-profile strong')[profiles.indexOf(selected)].textContent = updates.name || 'Business profile';
    } catch (error) { showStatus('dashboard-status', friendlyError(error), true); }
    finally { button.disabled = false; button.textContent = 'Save profile'; }
  });
})();
