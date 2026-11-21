(function () {
  const container = document.getElementById('admin-seo-tracker-container');
  if (!container) return;
  const defaults = {
    name: 'ServeKerala Kerala Services',
    targetDomain: 'servekerala.in',
    languageCode: 'en',
    device: 'desktop',
    depth: 10,
    competitors: ['justdial.com', 'naatilepani.com'],
    keywords: [
      'plumber in Thiruvalla|Thiruvalla,Kerala,India',
      'electrician in Thiruvalla|Thiruvalla,Kerala,India',
      'AC service in Thiruvalla|Thiruvalla,Kerala,India',
      'solar installation in Kottayam|Kottayam,Kerala,India',
      'plumber in Kottayam|Kottayam,Kerala,India',
      'electrician in Kottayam|Kottayam,Kerala,India',
      'home cleaning in Alappuzha|Alappuzha,Kerala,India',
      'pest control in Alappuzha|Alappuzha,Kerala,India',
      'CCTV installation in Alappuzha|Alappuzha,Kerala,India',
      'water purifier service in Pala|Pala,Kottayam,Kerala,India'
    ]
  };
  let runInProgress = false;
  let currentSettings = defaults;
  let historyChart = null;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const collection = name => window.db.collection(name);
  const userToken = async () => {
    if (!window.auth?.currentUser) throw new Error('Your admin sign-in is not active. Sign in again and retry.');
    return window.auth.currentUser.getIdToken();
  };
  const asPosition = row => row?.position ? `#${row.position}` : 'Not in top results';

  function setStatus(message, kind) {
    const el = document.getElementById('seo-tracker-status');
    el.textContent = message;
    el.className = `sk-rank-status ${kind || ''}`;
  }

  function keywordLines(settings) {
    return (settings.keywords || []).map(row => typeof row === 'string' ? row : `${row.keyword}|${row.locationName || ''}`).join('\n');
  }

  function readForm() {
    const keywords = document.getElementById('sk-rank-keywords').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
      const [keyword, ...locationParts] = line.split('|');
      return {keyword: keyword.trim(), locationName: locationParts.join('|').trim()};
    }).filter(row => row.keyword);
    return {
      name: document.getElementById('sk-rank-campaign-name').value.trim() || 'ServeKerala Rank Campaign',
      targetDomain: document.getElementById('sk-rank-domain').value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0],
      languageCode: document.getElementById('sk-rank-language').value,
      device: document.getElementById('sk-rank-device').value,
      depth: Number(document.getElementById('sk-rank-depth').value) === 100 ? 100 : 10,
      competitors: document.getElementById('sk-rank-competitors').value.split(/[\s,]+/).map(v => v.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]).filter(v => v.includes('.')).slice(0, 5),
      keywords
    };
  }

  function renderShell() {
    container.innerHTML = `
      <div class="sk-rank-header">
        <div><div class="sk-rank-eyebrow">ORGANIC SEARCH · GOOGLE</div><h2>Position Tracking</h2><p>Measure local rankings for ServeKerala and the domains competing for the same searches.</p></div>
        <button type="button" id="sk-rank-run" class="btn btn-primary">Run tracking check</button>
      </div>
      <div id="seo-tracker-status" class="sk-rank-status">Loading campaign…</div>
      <div class="sk-rank-stats" id="sk-rank-stats"></div>
      <section class="sk-rank-panel">
        <div class="sk-rank-panel-heading"><div><h3>Campaign settings</h3><p>One keyword per line. Add a location after a pipe: <code>plumber Thiruvalla|Thiruvalla,Kerala,India</code>.</p></div><button id="sk-rank-save" class="btn btn-outline" type="button">Save campaign</button></div>
        <div class="sk-rank-form-grid">
          <label>Campaign name<input id="sk-rank-campaign-name" maxlength="80"></label>
          <label>Website domain<input id="sk-rank-domain" maxlength="120"></label>
          <label>Google language<select id="sk-rank-language"><option value="en">English</option><option value="ml">Malayalam</option></select></label>
          <label>Device<select id="sk-rank-device"><option value="desktop">Desktop</option><option value="mobile">Mobile</option></select></label>
          <label>Organic depth<select id="sk-rank-depth"><option value="10">Top 10</option><option value="100">Top 100</option></select></label>
          <label>Competitor domains (up to 5)<input id="sk-rank-competitors" placeholder="justdial.com, naatilepani.com"></label>
          <label class="sk-rank-keywords-field">Tracked keywords and locations<textarea id="sk-rank-keywords" rows="8"></textarea></label>
        </div>
        <p class="sk-rank-cost-note">Rank checks use a paid SERP data provider. Each keyword is a billable request; Top 100 results can cost more than Top 10. Checks run only when you press the button.</p>
      </section>
      <section class="sk-rank-panel"><div class="sk-rank-panel-heading"><div><h3>Visibility trend</h3><p>Campaign visibility index based on tracked organic positions.</p></div><span id="sk-rank-last-run"></span></div><div class="sk-rank-chart-wrap"><canvas id="sk-rank-chart" aria-label="Campaign visibility over time"></canvas></div></section>
      <section class="sk-rank-panel"><div class="sk-rank-panel-heading"><div><h3>Keyword rankings</h3><p>Latest result for the site and each configured competitor.</p></div></div><div class="sk-rank-table-wrap"><table class="sk-rank-table"><thead id="sk-rank-head"></thead><tbody id="sk-rank-body"><tr><td>Save a campaign and run a check to populate rankings.</td></tr></tbody></table></div></section>
      <section class="sk-rank-panel"><div class="sk-rank-panel-heading"><div><h3>Recent checks</h3><p>Saved SERP snapshots for this campaign.</p></div></div><div id="sk-rank-history" class="sk-rank-history"></div></section>`;

    document.getElementById('sk-rank-save').addEventListener('click', saveCampaign);
    document.getElementById('sk-rank-run').addEventListener('click', runCampaign);
  }

  function fillForm(settings) {
    document.getElementById('sk-rank-campaign-name').value = settings.name || defaults.name;
    document.getElementById('sk-rank-domain').value = settings.targetDomain || defaults.targetDomain;
    document.getElementById('sk-rank-language').value = settings.languageCode || 'en';
    document.getElementById('sk-rank-device').value = settings.device || 'desktop';
    document.getElementById('sk-rank-depth').value = String(settings.depth || 10);
    document.getElementById('sk-rank-competitors').value = (settings.competitors || defaults.competitors).join(', ');
    document.getElementById('sk-rank-keywords').value = keywordLines(settings);
  }

  async function loadCampaign() {
    const doc = await collection('seo_tracker_settings').doc('global').get();
    currentSettings = doc.exists ? {...defaults, ...doc.data()} : defaults;
    fillForm(currentSettings);
    await loadHistory();
    setStatus('Campaign ready. Checks are run on demand and stored in this dashboard.', '');
  }

  async function saveCampaign() {
    try {
      const settings = readForm();
      if (!settings.keywords.length) throw new Error('Add at least one keyword.');
      if (settings.keywords.length > 100) throw new Error('A campaign can contain up to 100 keywords.');
      if (!settings.targetDomain.includes('.')) throw new Error('Enter a valid website domain.');
      await collection('seo_tracker_settings').doc('global').set({...settings, updatedAt: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
      currentSettings = settings;
      setStatus('Campaign saved.', 'success');
    } catch (error) { setStatus(error.message || 'Could not save the campaign.', 'error'); }
  }

  async function callRankApi(settings, row, idToken) {
    const response = await fetch('/api/admin/seo-tracker', {
      method: 'POST', headers: {'Content-Type':'application/json', 'Authorization':`Bearer ${idToken}`},
      body: JSON.stringify({keyword:row.keyword, locationName:row.locationName || 'Kerala,India', languageCode:settings.languageCode, device:settings.device, depth:settings.depth, targetDomain:settings.targetDomain, competitors:settings.competitors})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `SERP request failed (${response.status}).`);
    return data;
  }

  async function runCampaign() {
    if (runInProgress) return;
    runInProgress = true;
    const button = document.getElementById('sk-rank-run');
    button.disabled = true;
    try {
      const settings = readForm();
      if (!settings.keywords.length) throw new Error('Add keywords before running the campaign.');
      if (settings.keywords.length > 100) throw new Error('A campaign can contain up to 100 keywords.');
      await collection('seo_tracker_settings').doc('global').set({...settings, updatedAt: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true});
      currentSettings = settings;
      const idToken = await userToken();
      const results = [];
      for (let start = 0; start < settings.keywords.length; start += 3) {
        const chunk = settings.keywords.slice(start, start + 3);
        const checked = await Promise.all(chunk.map(async row => {
          try { return {...await callRankApi(settings, row, idToken), status:'ok'}; }
          catch (error) { return {keyword:row.keyword, locationName:row.locationName, error:error.message, status:'error'}; }
        }));
        results.push(...checked);
        setStatus(`Checking ${Math.min(start + chunk.length, settings.keywords.length)} of ${settings.keywords.length} keywords…`, '');
      }
      const successful = results.filter(row => row.status === 'ok');
      if (!successful.length) throw new Error(results.find(row => row.error)?.error || 'No keyword checks completed.');
      const ownDomain = settings.targetDomain;
      const metric = domain => {
        const ranks = successful.map(row => row.rankings?.[domain]?.position || null);
        const found = ranks.filter(Boolean);
        return {visibility: Math.round(ranks.reduce((sum, rank) => sum + (rank ? Math.max(0, (101 - rank) / 100) * 100 : 0), 0) / ranks.length), top10: found.filter(rank => rank <= 10).length, averagePosition: found.length ? Math.round(found.reduce((sum, rank) => sum + rank, 0) / found.length * 10) / 10 : null};
      };
      const run = {
        campaignName: settings.name, targetDomain: ownDomain, competitors: settings.competitors,
        locationLabel: 'Per-keyword locations', device: settings.device, depth: settings.depth,
        results, metrics: Object.fromEntries([ownDomain, ...settings.competitors].map(domain => [domain, metric(domain)])),
        providerCost: successful.reduce((sum, row) => sum + (row.providerCost || 0), 0),
        successfulChecks: successful.length, failedChecks: results.length - successful.length,
        completedAt: firebase.firestore.FieldValue.serverTimestamp(), createdAt: Date.now()
      };
      await collection('seo_tracker_runs').add(run);
      await loadHistory();
      const failed = results.length - successful.length;
      setStatus(`Check complete: ${successful.length} keywords checked${failed ? `, ${failed} failed` : ''}. Provider reported cost $${run.providerCost.toFixed(4)}.`, failed ? 'warning' : 'success');
    } catch (error) { setStatus(error.message || 'Could not run the campaign.', 'error'); }
    finally { runInProgress = false; button.disabled = false; }
  }

  function displayTime(run) {
    const value = run.completedAt?.toDate ? run.completedAt.toDate() : new Date(run.createdAt || Date.now());
    return value.toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
  }

  async function loadHistory() {
    const snapshot = await collection('seo_tracker_runs').orderBy('createdAt', 'desc').limit(40).get();
    const runs = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}));
    renderHistory(runs);
    renderRankings(runs[0]);
    renderStats(runs[0]);
    renderChart(runs.slice(0, 12).reverse());
  }

  function renderStats(latest) {
    const items = [currentSettings.targetDomain, ...(currentSettings.competitors || [])];
    const own = latest?.metrics?.[currentSettings.targetDomain] || {};
    document.getElementById('sk-rank-stats').innerHTML = [
      ['Campaign visibility', latest ? `${own.visibility || 0}%` : '—', 'Average position-weighted index across tracked terms'],
      ['Top 10 rankings', latest ? `${own.top10 || 0} / ${latest.successfulChecks}` : '—', 'Keywords with a top 10 organic result'],
      ['Tracked keywords', `${currentSettings.keywords?.length || 0}`, `${items.length} domains compared`],
      ['Last check', latest ? displayTime(latest) : 'Not run', latest ? `${latest.successfulChecks} successful checks` : 'Run your first SERP snapshot']
    ].map(([label,value,caption]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(caption)}</small></article>`).join('');
  }

  function renderRankings(latest) {
    const head = document.getElementById('sk-rank-head');
    const body = document.getElementById('sk-rank-body');
    const domains = [currentSettings.targetDomain, ...(currentSettings.competitors || [])];
    head.innerHTML = `<tr><th>Keyword / location</th>${domains.map((domain,index) => `<th>${index === 0 ? 'ServeKerala' : escapeHtml(domain)}</th>`).join('')}</tr>`;
    if (!latest) { body.innerHTML = `<tr><td colspan="${domains.length + 1}">No checks yet. Run a tracking check to collect the first results.</td></tr>`; return; }
    body.innerHTML = latest.results.map(row => `<tr><td><strong>${escapeHtml(row.keyword)}</strong><small>${escapeHtml(row.locationName || 'Kerala,India')}</small></td>${domains.map(domain => {
      const ranking = row.rankings?.[domain];
      return `<td class="${ranking?.position && ranking.position <= 10 ? 'sk-rank-good' : ''}">${row.status === 'error' ? '<span class="sk-rank-error">Check failed</span>' : `<strong>${escapeHtml(asPosition(ranking))}</strong>${ranking?.url ? `<a href="${escapeHtml(ranking.url)}" target="_blank" rel="noopener">Result page ↗</a>` : ''}`}</td>`;
    }).join('')}</tr>`).join('');
  }

  function renderHistory(runs) {
    document.getElementById('sk-rank-history').innerHTML = runs.length ? runs.slice(0, 20).map(run => {
      const own = run.metrics?.[currentSettings.targetDomain] || {};
      return `<div><strong>${escapeHtml(displayTime(run))}</strong><span>${escapeHtml(run.campaignName || 'Rank campaign')}</span><span>${escapeHtml(String(own.visibility ?? 0))}% visibility</span><span>${escapeHtml(String(run.successfulChecks || 0))} keywords</span><span>$${Number(run.providerCost || 0).toFixed(4)}</span></div>`;
    }).join('') : '<p>No saved checks yet.</p>';
    document.getElementById('sk-rank-last-run').textContent = runs.length ? `Latest: ${displayTime(runs[0])}` : '';
  }

  function renderChart(runs) {
    if (!window.Chart) return;
    if (historyChart) historyChart.destroy();
    const canvas = document.getElementById('sk-rank-chart');
    if (!canvas) return;
    const domains = [currentSettings.targetDomain, ...(currentSettings.competitors || [])];
    const colors = ['#0b7653','#4f46e5','#f97316','#0891b2','#db2777','#64748b'];
    historyChart = new Chart(canvas, {
      type:'line', data:{labels:runs.map(run => displayTime(run)), datasets:domains.map((domain,index) => ({label:index === 0 ? 'ServeKerala' : domain, data:runs.map(run => run.metrics?.[domain]?.visibility ?? null), borderColor:colors[index], backgroundColor:colors[index], tension:.28, spanGaps:true}))},
      options:{responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false}, scales:{y:{min:0,max:100,title:{display:true,text:'Visibility index'}}}, plugins:{legend:{position:'bottom'}}}
    });
  }

  function onAdminTabChange(event) {
    const button = event.target.closest('.content-type-btn');
    if (!button || button.getAttribute('data-type') !== 'seo_settings') return;
    loadCampaign().catch(error => setStatus(error.message || 'Could not load tracking data.', 'error'));
  }

  renderShell();
  document.addEventListener('click', onAdminTabChange);
})();
