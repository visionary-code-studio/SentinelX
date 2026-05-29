
    let isLoggedIn = false;
    let bcInterval = null;

    // ===== PAGES =====
    function showPage(name) {
      if (name === 'dashboard' && !isLoggedIn) {
        showModal('signin');
        return;
      }
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const pg = document.getElementById('page-' + name);
      if (pg) { pg.classList.add('active'); window.scrollTo(0, 0) }
      if (name === 'dashboard') { renderDash('overview'); startDashLiveUpdates(); }
      else { stopDashLiveUpdates(); }
    }
    function scrollTo_(id) {
      showPage('home');
      setTimeout(() => { const el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100);
    }

    // ===== DASHBOARD SEARCH =====
    function handleDashSearch(e) {
      if (e.key === 'Enter' || e.type === 'keyup') {
        const term = e.target.value.toLowerCase();
        if (term.length < 3) return;
        const items = document.querySelectorAll('.sidebar-item');
        if (term.includes('iot') || term.includes('vulnerab') || term.includes('scan')) switchDashTab('iot', items[1]);
        else if (term.includes('network') || term.includes('anomal')) switchDashTab('network', items[2]);
        else if (term.includes('incident')) switchDashTab('incidents', items[3]);
        else if (term.includes('intel') || term.includes('predict') || term.includes('attack')) switchDashTab('intel', items[4]);
        else if (term.includes('soc') || term.includes('overview') || term.includes('real-time')) switchDashTab('overview', items[0]);
      }
    }

    // ===== MOBILE MENU =====
    function toggleMobileMenu() {
      document.getElementById('navLinks').classList.toggle('mobile-open');
      document.getElementById('hamburgerBtn').classList.toggle('open');
    }
    function closeMobileMenu() {
      document.getElementById('navLinks').classList.remove('mobile-open');
      document.getElementById('hamburgerBtn').classList.remove('open');
    }

    // ===== MODALS =====
    function showModal(name) {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
      if (name) { const m = document.getElementById('modal-' + name); if (m) m.classList.add('show') }
    }
    function closeModal(e, name) { if (e.target === e.currentTarget) closeModal2(name) }
    function closeModal2(name) { const m = document.getElementById('modal-' + name); if (m) m.classList.remove('show') }

    // ===== AUTH =====
    function doSignin() { isLoggedIn = true; closeModal2('signin'); showPage('dashboard'); }
    function doRegister() { isLoggedIn = true; closeModal2('register'); showPage('dashboard'); }
    function doLogout() { isLoggedIn = false; showPage('home'); }

    // ===== BOOKING WITH AUTO-REDIRECT =====
    let redirectTimer = null;
    function submitBooking() {
      const n = document.getElementById('f-name').value;
      const em = document.getElementById('f-email').value;
      if (!n || !em) { alert('Please fill in required fields (Name and Email)'); return }
      document.getElementById('bookingForm').style.display = 'none';
      document.getElementById('bookingSuccess').classList.add('show');
      // Start redirect countdown
      const progress = document.getElementById('redirectProgress');
      const text = document.getElementById('redirectText');
      progress.style.width = '100%';
      let countdown = 3;
      text.textContent = 'Redirecting to platform in ' + countdown + '...';
      redirectTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) { text.textContent = 'Redirecting to platform in ' + countdown + '...'; }
        else {
          clearInterval(redirectTimer);
          text.textContent = 'Launching platform...';
          isLoggedIn = true;
          setTimeout(() => showPage('dashboard'), 300);
        }
      }, 1000);
    }

    // ===== ACCORDIONS =====
    function toggleAccord(el) {
      const body = el.querySelector('.accord-body');
      const arrow = el.querySelector('.accord-arrow');
      body.classList.toggle('open');
      arrow.classList.toggle('open');
    }

    // ===== COUNTER ANIMATION =====
    function animateCount(id, target, suffix) {
      let cur = 0; const el = document.getElementById(id);
      if (!el) return;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => { cur = Math.min(cur + step, target); el.textContent = cur + (suffix || ''); if (cur >= target) clearInterval(t) }, 25);
    }
    animateCount('cnt1', 14327, '');
    animateCount('cnt2', 3842, '');
    animateCount('cnt3', 48, 'ms');
    animateCount('cnt4', 94, '');

    // ===== TICKER =====
    const tickerData = [
      { sev: 'CRITICAL', msg: 'PLC-004 — Unauthorized modbus register write detected', loc: 'Zone A' },
      { sev: 'HIGH', msg: 'IoT-Sensor-12 — Anomalous data exfiltration pattern', loc: 'Plant Floor' },
      { sev: 'MEDIUM', msg: 'SCADA-HMI-01 — Brute force login attempt blocked', loc: 'Control Room' },
      { sev: 'HIGH', msg: 'Router-OT-7 — Unexpected outbound connection', loc: 'Network Edge' },
      { sev: 'LOW', msg: 'Camera-Grid-3 — Firmware version EOL alert', loc: 'Perimeter' },
      { sev: 'CRITICAL', msg: 'Historian-DB — SQL injection pattern in query', loc: 'Data Center' },
    ];
    function buildTicker() {
      const t = document.getElementById('ticker');
      if (!t) return;
      const items = [...tickerData, ...tickerData];
      t.innerHTML = items.map(i => `<span class="ticker-item"><span class="dot" style="background:${i.sev === 'CRITICAL' ? '#E05533' : i.sev === 'HIGH' ? 'var(--amber)' : i.sev === 'MEDIUM' ? 'var(--teal)' : 'var(--text3)'}"></span>[${i.sev}] ${i.msg} — ${i.loc}</span>`).join('');
    }
    buildTicker();

    // ===== THREAT CARDS =====
    const threats = [
      { sev: 'critical', label: 'CRITICAL', score: '9.8', title: 'PLC-004 Modbus Exploit', meta: 'OT Zone A • 2 min ago', cls: 'c' },
      { sev: 'high', label: 'HIGH', score: '7.4', title: 'IoT Exfil Pattern', meta: 'Sensor Cluster • 5 min ago', cls: 'h' },
      { sev: 'medium', label: 'MEDIUM', score: '5.1', title: 'HMI Login Anomaly', meta: 'Control Room • 12 min ago', cls: 'm' },
      { sev: 'critical', label: 'CRITICAL', score: '9.2', title: 'SCADA Auth Bypass', meta: 'Control Layer • 18 min ago', cls: 'c' },
      { sev: 'high', label: 'HIGH', score: '6.8', title: 'OT Lateral Movement', meta: 'Network Edge • 21 min ago', cls: 'h' },
      { sev: 'medium', label: 'MEDIUM', score: '4.3', title: 'Firmware EOL Device', meta: 'Perimeter • 35 min ago', cls: 'm' },
    ];
    function buildThreatCards() {
      const el = document.getElementById('threatCards');
      if (!el) return;
      el.innerHTML = threats.map((t, i) => `
    <div class="threat-card ${t.sev}" style="animation-delay:${i * 0.1}s">
      <div class="score-ring ${t.cls}">${t.score}</div>
      <div class="threat-label">${t.label}</div>
      <div class="threat-title">${t.title}</div>
      <div class="threat-meta">${t.meta}</div>
    </div>`).join('');
    }
    buildThreatCards();

    // ===== SCROLL REVEAL =====
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }) }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ===== DASHBOARD =====
    let activeDashTab = 'overview';
    let dashLiveInterval = null;
    let liveKpiData = { threats: 12, devices: 247, risk: 7.8, response: 48 };

    function switchDashTab(tab, btn) {
      activeDashTab = tab;
      document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderDash(tab);
    }

    function startDashLiveUpdates() {
      stopDashLiveUpdates();
      dashLiveInterval = setInterval(() => {
        // Simulate KPI changes
        liveKpiData.threats += Math.random() > 0.6 ? 1 : 0;
        liveKpiData.devices += Math.random() > 0.9 ? 1 : 0;
        liveKpiData.risk = Math.round((liveKpiData.risk + ((Math.random() - 0.45) * 0.3)) * 10) / 10;
        liveKpiData.risk = Math.max(5, Math.min(9.9, liveKpiData.risk));
        liveKpiData.response = Math.max(30, Math.min(80, liveKpiData.response + Math.round((Math.random() - 0.5) * 6)));
        // Update KPI cards if on overview
        if (activeDashTab === 'overview') {
          const t = document.getElementById('liveThreats'); if (t) t.textContent = liveKpiData.threats;
          const d = document.getElementById('liveDevices'); if (d) d.textContent = liveKpiData.devices;
          const r = document.getElementById('liveRisk'); if (r) r.textContent = liveKpiData.risk;
          const m = document.getElementById('liveResponse'); if (m) m.textContent = liveKpiData.response + 'ms';
        }
        // Occasionally show toast notification
        if (Math.random() > 0.7) { showDashToast(); }
      }, 5000);
    }
    function stopDashLiveUpdates() { if (dashLiveInterval) { clearInterval(dashLiveInterval); dashLiveInterval = null; } }

    const toastAlerts = [
      { icon: '🔴', title: 'CRITICAL: PLC-004 Register Write', body: 'Unauthorized modbus write detected in OT Zone A' },
      { icon: '🟠', title: 'HIGH: Anomalous Outbound Traffic', body: 'Router-OT-7 initiating connections to unknown external IP' },
      { icon: '🟡', title: 'MEDIUM: Brute Force Attempt', body: '5 failed login attempts on SCADA-HMI-01 in 30 seconds' },
      { icon: '⚠️', title: 'New Device Detected', body: 'Unknown device 10.4.2.88 appeared on network segment B' },
      { icon: '🔵', title: 'Policy Update', body: 'Alert threshold modified by Security Admin at 14:23' },
    ];
    function showDashToast() {
      const toast = document.getElementById('dashToast');
      const alert = toastAlerts[Math.floor(Math.random() * toastAlerts.length)];
      document.getElementById('toastTitle').textContent = alert.title;
      document.getElementById('toastBody').textContent = alert.body;
      toast.querySelector('.dash-toast-icon').textContent = alert.icon;
      toast.classList.add('show');
      setTimeout(() => closeDashToast(), 4000);
    }
    function closeDashToast() { document.getElementById('dashToast').classList.remove('show'); }

    const incidents = [
      { sev: 'critical', label: 'CRITICAL', title: 'PLC-004 Unauthorized Register Write', time: '2 min ago', device: 'PLC-004 / Zone A', id: 'INC-2847', detail: 'An unauthorized Modbus register write was detected on PLC-004 in OT Zone A. The write attempted to modify setpoint registers controlling temperature thresholds in reactor unit 3.', actions: ['Isolate PLC-004 from network', 'Review Modbus access control lists', 'Check for firmware tampering', 'Notify OT operations manager'] },
      { sev: 'high', label: 'HIGH', title: 'Anomalous Data Exfiltration Detected', time: '5 min ago', device: 'IoT-Sensor-12 / Plant Floor', id: 'INC-2846', detail: 'IoT-Sensor-12 is transmitting data volumes 340% above baseline to an external IP address. Pattern matches known data staging behavior prior to exfiltration.', actions: ['Block external IP at firewall', 'Capture traffic for forensics', 'Inspect sensor configuration', 'Reset sensor credentials'] },
      { sev: 'critical', label: 'CRITICAL', title: 'SCADA HMI Authentication Bypass Attempt', time: '18 min ago', device: 'SCADA-HMI-01 / Control Room', id: 'INC-2845', detail: 'Multiple authentication bypass attempts detected against SCADA-HMI-01 using known CVE-2024-3721 exploit payload. Attack originated from internal network segment.', actions: ['Patch HMI system immediately', 'Enable MFA on remote access', 'Review internal network segmentation', 'Conduct lateral movement analysis'] },
      { sev: 'high', label: 'HIGH', title: 'Unexpected Outbound Connection Established', time: '21 min ago', device: 'Router-OT-7 / Network Edge', id: 'INC-2844', detail: 'Router-OT-7 established an outbound connection to IP 185.220.101.x on port 443. This IP is associated with known C2 infrastructure.', actions: ['Block destination IP', 'Inspect router configuration', 'Check for rogue firmware', 'Enable DNS sinkholing'] },
      { sev: 'medium', label: 'MEDIUM', title: 'Legacy Protocol Cleartext Communication', time: '34 min ago', device: 'Historian-DB / Data Center', id: 'INC-2843', detail: 'Cleartext Telnet session detected between Historian-DB and legacy SCADA system. Credentials may be exposed to network sniffing.', actions: ['Migrate to SSH/encrypted protocol', 'Enable network segmentation', 'Add monitoring rule for cleartext protocols'] },
      { sev: 'low', label: 'LOW', title: 'IoT Camera Firmware End-of-Life Alert', time: '1 hr ago', device: 'Camera-Grid-03 / Perimeter', id: 'INC-2842', detail: 'Camera-Grid-03 is running firmware v2.1.4 which reached end-of-life. No security patches will be issued. Known vulnerabilities include DNS rebinding and RTSP stream exposure.', actions: ['Schedule firmware replacement', 'Restrict camera network access', 'Add compensating controls'] },
    ];

    const iotDevices = [
      { name: 'PLC-004', type: 'Siemens S7-300', score: 9.8, cls: 'c', vulns: [{ t: 'v-crit', txt: 'Hardcoded credentials (CVE-2024-1234)' }, { t: 'v-crit', txt: 'Unauthenticated modbus access' }, { t: 'v-high', txt: 'Outdated firmware v2.1.4' }] },
      { name: 'IoT-Sensor-12', type: 'Phoenix Contact', score: 7.4, cls: 'h', vulns: [{ t: 'v-high', txt: 'Weak TLS 1.0 encryption' }, { t: 'v-high', txt: 'Default admin password' }, { t: 'v-med', txt: 'Open debug port 8080' }] },
      { name: 'SCADA-HMI-01', type: 'Wonderware InTouch', score: 9.2, cls: 'c', vulns: [{ t: 'v-crit', txt: 'SQL injection in query handler' }, { t: 'v-crit', txt: 'No MFA on remote access' }, { t: 'v-high', txt: 'Exposed admin panel' }] },
      { name: 'Router-OT-7', type: 'Hirschmann EAGLE', score: 6.8, cls: 'h', vulns: [{ t: 'v-high', txt: 'Unnecessary services enabled' }, { t: 'v-med', txt: 'Weak SNMP community string' }, { t: 'v-med', txt: 'No egress filtering' }] },
      { name: 'Camera-Grid-03', type: 'Axis P3245', score: 4.3, cls: 'm', vulns: [{ t: 'v-med', txt: 'Firmware EOL — no patches' }, { t: 'v-med', txt: 'RTSP stream not encrypted' }, { t: 'v-med', txt: 'DNS rebinding vulnerability' }] },
      { name: 'Historian-DB', type: 'OSIsoft PI Server', score: 8.1, cls: 'c', vulns: [{ t: 'v-crit', txt: 'SQL injection vector' }, { t: 'v-high', txt: 'Overprivileged service account' }, { t: 'v-high', txt: 'No data-at-rest encryption' }] },
    ];

    function toggleIncidentDetail(id) {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('open');
    }

    function renderDash(tab) {
      const el = document.getElementById('dashContent');
      if (!el) return;
      if (tab === 'overview') {
        el.innerHTML = `
      <div class="dash-kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Active Threats</div><div class="kpi-val red" id="liveThreats">${liveKpiData.threats}</div><div class="kpi-sub down">↑ 3 in last hour</div></div>
        <div class="kpi-card"><div class="kpi-label">Devices Online</div><div class="kpi-val teal" id="liveDevices">${liveKpiData.devices}</div><div class="kpi-sub up">↑ 99.2% uptime</div></div>
        <div class="kpi-card"><div class="kpi-label">Risk Score</div><div class="kpi-val amber" id="liveRisk">${liveKpiData.risk}</div><div class="kpi-sub down">↑ from 6.9 yesterday</div></div>
        <div class="kpi-card"><div class="kpi-label">Mean Response</div><div class="kpi-val" id="liveResponse">${liveKpiData.response}ms</div><div class="kpi-sub up">↓ 12ms improvement</div></div>
      </div>
      <div class="dash-panels">
        <div class="panel">
          <div class="panel-title">Live Incident Feed <span>Auto-refreshing • Click to expand</span></div>
          ${incidents.slice(0, 4).map((inc, idx) => `<div><div class="incident-item" onclick="toggleIncidentDetail('inc-ov-${idx}')"><span class="severity-badge sev-${inc.sev}">${inc.label}</span><div class="incident-info"><h4>${inc.title}</h4><p>${inc.device} • ${inc.time}</p></div></div><div class="incident-detail" id="inc-ov-${idx}"><h5>Investigation Summary</h5><p>${inc.detail}</p><h5 style="margin-top:0.75rem">Recommended Actions</h5><ul>${inc.actions.map(a => '<li>' + a + '</li>').join('')}</ul></div></div>`).join('')}
        </div>
        <div class="panel">
          <div class="panel-title">Device Status <span>${liveKpiData.devices} devices</span></div>
          <div class="device-list">
            <div class="device-item"><span class="device-name">PLC-004</span><span class="device-status ds-critical">⚠ Critical</span></div>
            <div class="device-item"><span class="device-name">SCADA-HMI-01</span><span class="device-status ds-critical">⚠ Critical</span></div>
            <div class="device-item"><span class="device-name">IoT-Sensor-12</span><span class="device-status ds-warn">⚡ Warning</span></div>
            <div class="device-item"><span class="device-name">Router-OT-7</span><span class="device-status ds-warn">⚡ Warning</span></div>
            <div class="device-item"><span class="device-name">Historian-DB</span><span class="device-status ds-ok">✓ Online</span></div>
            <div class="device-item"><span class="device-name">Camera-Grid-03</span><span class="device-status ds-ok">✓ Online</span></div>
          </div>
        </div>
      </div>
      <div class="panel" style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:1.25rem">
        <div class="panel-title">Threat Activity — 24h Window <span>Simulated telemetry • Live updates</span></div>
        <div id="sparklineArea" style="display:flex;align-items:flex-end;gap:3px;height:60px;padding-top:8px">${Array.from({ length: 48 }, (_, i) => { const h = Math.floor(Math.random() * 55 + 5); const c = h > 45 ? '#B64018' : h > 30 ? 'var(--amber)' : 'var(--teal)'; return `<div style="flex:1;height:${h}px;background:${c};border-radius:2px;opacity:0.7;transition:height 0.5s"></div>` }).join('')}</div>
      </div>`;
      } else if (tab === 'iot') {
        el.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between">
        <div><h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800">IoT Vulnerability Scanner</h2><p style="font-size:0.8rem;color:var(--text3);margin-top:2px">Continuous assessment of ${liveKpiData.devices} connected devices</p></div>
        <span class="severity-badge sev-critical" style="font-size:0.75rem;padding:5px 12px">7 Critical Vulnerabilities</span>
      </div>
      <div class="iot-grid">${iotDevices.map(d => `
        <div class="iot-device">
          <div class="iot-device-header"><span class="iot-device-name">${d.name}</span><div class="iot-score score-ring ${d.cls}">${d.score}</div></div>
          <p style="font-size:0.7rem;color:var(--text3);margin-bottom:0.6rem">${d.type}</p>
          <ul class="iot-vulns">${d.vulns.map(v => `<li class="${v.t}">${v.txt}</li>`).join('')}</ul>
        </div>`).join('')}</div>
      <div class="bc-panel">
        <div class="bc-title">🔗 Blockchain Secure Data Exchange</div>
        <p style="font-size:0.75rem;color:var(--text3);margin-bottom:1rem">Distributed ledger technology for tamper-proof industrial communication. Real-time cryptographic device authentication system active.</p>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:1rem;">
          <div style="background:var(--card-bg);border-radius:6px;padding:1rem;border:1px solid rgba(255,255,255,0.05)">
            <h5 style="font-size:0.75rem;color:var(--text);margin-bottom:0.5rem">Device Authentication</h5>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.7rem"><span style="color:var(--text2)">Auth Nodes</span><span style="color:var(--teal)">24 Active</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.7rem"><span style="color:var(--text2)">Consensus State</span><span style="color:var(--teal)">Validated</span></div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.7rem"><span style="color:var(--text2)">Encryption Layer</span><span style="color:var(--amber)">AES-256</span></div>
          </div>
          <div class="bc-ledger" id="bcLedger">
          </div>
        </div>
      </div>`;
        startBlockchainLogs();
      } else if (tab === 'network') {
        el.innerHTML = `
      <h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:0.25rem">Network Anomaly Detection</h2>
      <p style="font-size:0.8rem;color:var(--text3);margin-bottom:1rem">Real-time network topology and anomaly visualization</p>
      <div class="network-vis" id="netVis">
        <div class="net-center">CORE</div>
      </div>
      <div class="dash-panels" style="margin-top:1rem">
        <div class="panel"><div class="panel-title">Anomaly Detections <span>Last 1h</span></div>${[{ sev: 'high', label: 'HIGH', title: 'Lateral Movement: PLC→HMI', time: '8 min ago' }, { sev: 'critical', label: 'CRITICAL', title: 'Beaconing Pattern Detected', time: '15 min ago' }, { sev: 'medium', label: 'MEDIUM', title: 'Port Scan from 10.4.2.31', time: '29 min ago' }].map(i => `<div class="incident-item"><span class="severity-badge sev-${i.sev}">${i.label}</span><div class="incident-info"><h4>${i.title}</h4><p>${i.time}</p></div></div>`).join('')}</div>
        <div class="panel"><div class="panel-title">Protocol Distribution</div>${[['Modbus TCP', '38%', 'var(--amber)'], ['EtherNet/IP', '24%', 'var(--teal)'], ['DNP3', '18%', '#669399'], ['OPC-UA', '12%', 'var(--text3)'], ['Other', '8%', 'var(--dark-red)']].map(([p, v, c]) => `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><span style="font-size:0.78rem;font-family:'Space Mono',monospace;color:var(--text2)">${p}</span><div style="display:flex;align-items:center;gap:8px"><div style="width:80px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px"><div style="height:100%;width:${v};background:${c};border-radius:2px"></div></div><span style="font-size:0.72rem;color:var(--text3);font-family:'Space Mono',monospace;min-width:28px">${v}</span></div></div>`).join('')}</div>
      </div>`;
        buildNetworkVis();
      } else if (tab === 'incidents') {
        el.innerHTML = `
      <div style="margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between"><div><h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800">Incident Management</h2><p style="font-size:0.8rem;color:var(--text3);margin-top:2px">Active and recent security incidents • Click to expand details</p></div><span class="severity-badge sev-critical" style="font-size:0.75rem;padding:5px 12px">3 Critical Open</span></div>
      <div class="panel" style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:1.25rem">
        ${incidents.map((inc, idx) => `<div><div class="incident-item" style="padding:0.85rem 0" onclick="toggleIncidentDetail('inc-full-${idx}')"><div style="display:flex;align-items:flex-start;gap:0.75rem;width:100%"><span class="severity-badge sev-${inc.sev}">${inc.label}</span><div style="flex:1"><div style="display:flex;justify-content:space-between"><h4 style="font-size:0.83rem;font-weight:600;color:var(--text)">${inc.title}</h4><span style="font-size:0.68rem;color:var(--text3);font-family:'Space Mono',monospace">${inc.time}</span></div><p style="font-size:0.72rem;color:var(--text3);margin-top:3px;font-family:'Space Mono',monospace">${inc.device} • ${inc.id}</p></div></div></div><div class="incident-detail" id="inc-full-${idx}"><h5>Investigation Summary</h5><p>${inc.detail}</p><h5 style="margin-top:0.75rem">Recommended Actions</h5><ul>${inc.actions.map(a => '<li>' + a + '</li>').join('')}</ul></div></div>`).join('')}
      </div>`;
      } else if (tab === 'intel') {
        el.innerHTML = `
      <h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:0.25rem">Threat Intelligence Feed</h2>
      <p style="font-size:0.8rem;color:var(--text3);margin-bottom:1rem">AI-curated threat intel and predictive attack analytics</p>
      <div class="dash-kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi-card"><div class="kpi-label">Active IOCs</div><div class="kpi-val amber">1,284</div><div class="kpi-sub">Indicators of Compromise</div></div>
        <div class="kpi-card"><div class="kpi-label">Attack Predictions</div><div class="kpi-val red">4</div><div class="kpi-sub down">High confidence vectors</div></div>
        <div class="kpi-card"><div class="kpi-label">Intel Sources</div><div class="kpi-val teal">12</div><div class="kpi-sub up">Feeds active</div></div>
      </div>
      <div class="panel" style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:1.25rem;margin-top:1rem"><div class="panel-title">Predicted Attack Vectors <span>Next 24h, AI-ranked</span></div>
        ${[{ title: 'Spear Phishing → OT Pivot', conf: '89%', target: 'SCADA Layer', sev: 'critical' }, { title: 'Ransomware via Exposed RDP', conf: '74%', target: 'Historian DB', sev: 'high' }, { title: 'Supply Chain Firmware Injection', conf: '61%', target: 'IoT Sensors', sev: 'high' }, { title: 'DNS Tunneling for C2', conf: '47%', target: 'Network Edge', sev: 'medium' }].map(i => `<div class="incident-item"><span class="severity-badge sev-${i.sev}" style="min-width:60px;text-align:center">${i.conf}</span><div class="incident-info"><h4>${i.title}</h4><p>Target: ${i.target}</p></div></div>`).join('')}
      </div>`;
      } else if (tab === 'devices') {
        el.innerHTML = `
      <h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:1rem">Asset Inventory</h2>
      <div class="device-list">${[['PLC-004', 'Siemens S7-300', 'OT Zone A', 'ds-critical', '⚠ Critical'], ['SCADA-HMI-01', 'Wonderware InTouch', 'Control Room', 'ds-critical', '⚠ Critical'], ['IoT-Sensor-12', 'Phoenix Contact', 'Plant Floor', 'ds-warn', '⚡ Warning'], ['Router-OT-7', 'Hirschmann EAGLE', 'Network Edge', 'ds-warn', '⚡ Warning'], ['Camera-Grid-03', 'Axis P3245', 'Perimeter', 'ds-ok', '✓ Online'], ['Historian-DB', 'OSIsoft PI', 'Data Center', 'ds-ok', '✓ Online'], ['Firewall-OT-1', 'Fortinet FortiGate', 'DMZ', 'ds-ok', '✓ Online'], ['Switch-Core-2', 'Cisco Catalyst', 'Network Core', 'ds-ok', '✓ Online']].map(([n, t, z, s, l]) => `<div class="device-item"><div><span class="device-name">${n}</span><span style="font-size:0.7rem;color:var(--text3);margin-left:10px">${t} • ${z}</span></div><span class="device-status ${s}">${l}</span></div>`).join('')}</div>`;
      } else if (tab === 'policy') {
        el.innerHTML = `
      <h2 style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:1rem">Policy & Access Control</h2>
      <div class="dash-panels">
        <div class="panel"><div class="panel-title">Active Roles</div>${[['SOC Analyst', 'Full incident access, read-only assets', 'teal'], ['Plant Manager', 'Risk summary, device status only', 'amber'], ['Security Admin', 'Full platform access, policy management', 'amber'], ['OT Technician', 'Device health, no incident data', 'teal'], ['Executive', 'Dashboard summary, no raw logs', 'text3']].map(([r, p, c]) => `<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><p style="font-size:0.8rem;font-weight:600;color:var(--${c})">${r}</p><p style="font-size:0.72rem;color:var(--text3);margin-top:2px">${p}</p></div>`).join('')}</div>
        <div class="panel"><div class="panel-title">Recent Audit Events</div>${[['SOC-Analyst-1 logged in', '3 min ago'], ['Policy updated: Alert threshold', '12 min ago'], ['Failed auth: admin@192.168.4.5', '28 min ago'], ['New device registered: PLC-009', '1h ago'], ['Role escalation: SysAdmin granted', '2h ago']].map(([e, t]) => `<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;justify-content:space-between"><p style="font-size:0.75rem;color:var(--text2)">${e}</p><p style="font-size:0.7rem;color:var(--text3);font-family:'Space Mono',monospace">${t}</p></div>`).join('')}</div>
      </div>`;
      }
    }

    function startBlockchainLogs() {
      if (bcInterval) clearInterval(bcInterval);
      const ledger = document.getElementById('bcLedger');
      if (!ledger) return;

      const devices = ['PLC-004', 'IoT-Sensor-12', 'SCADA-HMI-01', 'Router-OT-7'];
      let txCount = 0;

      const addRow = () => {
        if (txCount > 50) { ledger.innerHTML = ''; txCount = 0; }
        const d = devices[Math.floor(Math.random() * devices.length)];
        const hash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const row = document.createElement('div');
        row.className = 'bc-row';
        row.innerHTML = `<span style="width:80px">${d}</span><span style="color:#7EC8A0">Encrypted</span><span class="bc-hash">0x${hash}</span>`;
        ledger.prepend(row);
        txCount++;
      };
      for(let i=0; i<4; i++) addRow();
      bcInterval = setInterval(addRow, 1500);
    }

    function buildNetworkVis() {
      const el = document.getElementById('netVis');
      if (!el) return;
      const nodes = [
        { x: 50, y: 50, bg: 'var(--amber2)', label: 'PLC' },
        { x: 75, y: 35, bg: 'var(--amber)', label: 'HMI' },
        { x: 25, y: 35, bg: 'var(--teal)', label: 'RTU' },
        { x: 80, y: 65, bg: '#E05533', label: 'IOT' },
        { x: 20, y: 65, bg: 'var(--teal)', label: 'NET' },
        { x: 55, y: 80, bg: 'var(--text3)', label: 'CAM' },
        { x: 40, y: 20, bg: 'var(--amber)', label: 'SCA' },
      ];
      nodes.forEach((n, i) => {
        const d = document.createElement('div');
        d.style.cssText = `position:absolute;left:${n.x}%;top:${n.y}%;transform:translate(-50%,-50%);width:34px;height:34px;background:${n.bg}22;border:1.5px solid ${n.bg};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-family:'Space Mono',monospace;color:${n.bg};font-weight:700;animation:nodeFloat ${3 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`;
        d.textContent = n.label;
        el.appendChild(d);
      });
    }

    // ===== SIMULATE LIVE THREAT CARD UPDATES =====
    setInterval(() => {
      const cards = document.querySelectorAll('.threat-card');
      if (cards.length) {
        const i = Math.floor(Math.random() * cards.length);
        cards[i].style.opacity = '0.5';
        setTimeout(() => { cards[i].style.opacity = '1' }, 300);
      }
    }, 3000);

    // ===== AI CHATBOT =====
    let chatOpen = false;
    function toggleChat() {
      chatOpen = !chatOpen;
      document.getElementById('chatPanel').classList.toggle('open', chatOpen);
      document.getElementById('chatFab').style.display = chatOpen ? 'none' : 'flex';
      if (chatOpen) document.getElementById('chatInput').focus();
    }

    const chatKB = [
      { keys: ['what is sentinelx', 'about sentinelx', 'tell me about', 'what does sentinelx do'], answer: 'SentinelX is an AI-powered industrial cybersecurity platform designed for OT/ICS environments. It combines threat detection, SOC dashboards, IoT vulnerability scanning, network anomaly detection, and predictive analytics into a unified security command center. Our platform helps factories, utilities, and critical infrastructure operators detect threats early, understand risk, and respond faster.' },
      { keys: ['ot security', 'ot vs it', 'difference between ot and it'], answer: 'OT (Operational Technology) security focuses on protecting industrial control systems like PLCs, SCADA, and HMIs — systems that directly control physical processes. Unlike IT security, OT environments prioritize availability over confidentiality, have legacy devices that can\'t be easily patched, use specialized protocols like Modbus and DNP3, and require zero-downtime operations. A single security failure in OT can cause physical damage, environmental harm, or safety incidents.' },
      { keys: ['ics threat', 'common ics', 'industrial threat', 'scada threat', 'common threats'], answer: 'Common ICS/SCADA threats include: 1) **Unauthorized access** to control systems via weak authentication; 2) **Ransomware attacks** targeting historian databases and HMI systems; 3) **Man-in-the-middle attacks** on unencrypted industrial protocols like Modbus; 4) **Supply chain compromises** through infected firmware updates; 5) **Insider threats** from disgruntled employees with plant access; 6) **APT campaigns** like TRITON/TRISIS specifically designed to target safety systems.' },
      { keys: ['anomaly detection', 'how does anomaly', 'ml detection', 'ai detection'], answer: 'SentinelX\'s anomaly detection uses ML models trained on baseline OT/IoT behavioral patterns. Here\'s how it works: 1) **Baseline Learning** — we profile normal traffic patterns, device communication cadences, and protocol behaviors; 2) **Real-time Scoring** — every network flow and device action is scored against the baseline; 3) **Deviation Flagging** — statistical outliers are flagged with severity scores from 0-10; 4) **Context Enrichment** — alerts are enriched with device info, CVE data, and historical patterns; 5) **Priority Ranking** — ML ranks alerts by business impact, reducing analyst fatigue.' },
      { keys: ['soc dashboard', 'what is soc', 'security operations'], answer: 'A SOC (Security Operations Center) Dashboard is the central nerve center for security monitoring. SentinelX\'s SOC Dashboard provides: real-time incident feeds with severity classification, device health monitoring across all OT/IoT assets, threat activity trend charts, KPI cards for key security metrics, and expandable incident details with investigation context and recommended actions. It\'s designed to give analysts a single-pane-of-glass view across the entire industrial environment.' },
      { keys: ['vulnerability', 'iot vulnerability', 'vulnerability scanner', 'iot scanner'], answer: 'SentinelX\'s IoT Vulnerability Scanner continuously assesses connected devices for: outdated firmware with known CVEs, hardcoded or default credentials, open debug ports and unnecessary services, weak encryption protocols (TLS 1.0, cleartext), misconfigured network settings, and end-of-life software without patches. Each device receives a risk score (0-10) so teams can prioritize remediation where it matters most.' },
      { keys: ['modbus', 'protocol', 'dnp3', 'opc', 'industrial protocol'], answer: 'Industrial protocols like Modbus TCP, DNP3, and OPC-UA are the communication backbone of OT environments. **Modbus** is widely used but lacks authentication and encryption — making it vulnerable to spoofing and replay attacks. **DNP3** is common in utilities and offers some security features. **OPC-UA** is the most modern with built-in security. SentinelX monitors traffic across all these protocols to detect anomalous commands, unauthorized writes, and suspicious communication patterns.' },
      { keys: ['plc', 'what is a plc', 'programmable logic'], answer: 'A PLC (Programmable Logic Controller) is a ruggedized industrial computer used to control manufacturing processes — from assembly lines to chemical reactors. PLCs read sensor inputs and execute logic to control actuators, valves, and motors. They are critical targets because compromising a PLC can directly manipulate physical processes, potentially causing equipment damage, product defects, or safety hazards. SentinelX monitors PLC communication patterns to detect unauthorized register reads/writes.' },
      { keys: ['scada', 'what is scada'], answer: 'SCADA (Supervisory Control and Data Acquisition) systems provide centralized monitoring and control over distributed industrial processes. SCADA systems include HMI (Human-Machine Interface) screens, communication infrastructure, and remote terminal units. They\'re used in power grids, water treatment, oil & gas, and manufacturing. SCADA security is critical because these systems often span large geographic areas, use legacy protocols, and control essential infrastructure.' },
      { keys: ['risk score', 'how is risk calculated', 'risk assessment'], answer: 'SentinelX calculates risk scores using a multi-factor model: **Vulnerability Score** (based on CVE severity and device exposure) × **Threat Likelihood** (based on active threat intelligence and attack patterns) × **Business Impact** (based on device criticality and operational role). The composite score (0-10) gives executives a clear, actionable view of their security posture without needing deep technical expertise.' },
      { keys: ['book demo', 'demo', 'get started', 'how to start', 'pricing'], answer: 'You can book a demo of SentinelX right from our landing page! Click the "Book a Demo" button in the hero section or navigate to the demo booking form. Fill in your name, email, organization, and role — and you\'ll be redirected to the full platform dashboard where you can explore all features including the SOC Dashboard, IoT Scanner, Network Monitor, and Threat Intelligence feed.' },
      { keys: ['help', 'what can you do', 'capabilities', 'features'], answer: 'I can help you with: 🛡️ **SentinelX Features** — learn about our platform modules and capabilities; 🔒 **OT/ICS Security** — understand industrial cybersecurity concepts; ⚠️ **Threat Intelligence** — learn about common ICS threats and attack vectors; 📊 **SOC Workflows** — understand security operations and incident response; 🔍 **Vulnerability Assessment** — learn about IoT and device security; 📱 **Industrial Protocols** — Modbus, DNP3, OPC-UA and their security implications. Just ask me anything!' },
      { keys: ['zero trust', 'zero-trust'], answer: 'Zero Trust is a security model where no user, device, or network segment is trusted by default — every access request must be verified. In industrial environments, SentinelX applies zero-trust principles by: continuously validating device identity and behavior, enforcing least-privilege access to control systems, monitoring all east-west traffic within OT segments, requiring authentication for every protocol interaction, and logging all actions for audit trails.' },
      { keys: ['incident response', 'how to respond', 'what to do when'], answer: 'Effective ICS incident response follows these steps: 1) **Detection** — SentinelX flags anomalous behavior with severity scores; 2) **Triage** — analysts review context, affected devices, and business impact; 3) **Containment** — isolate affected segments without disrupting critical operations; 4) **Investigation** — analyze logs, traffic captures, and device states; 5) **Remediation** — patch vulnerabilities, reset credentials, update policies; 6) **Recovery** — restore normal operations and verify system integrity; 7) **Lessons Learned** — update detection rules and response playbooks.' },
    ];

    function findChatResponse(msg) {
      const lower = msg.toLowerCase().trim();
      for (const kb of chatKB) {
        for (const key of kb.keys) {
          if (lower.includes(key)) return kb.answer;
        }
      }
      // Fuzzy fallback — check for any keyword overlap
      const words = lower.split(/\s+/);
      let bestMatch = null, bestScore = 0;
      for (const kb of chatKB) {
        let score = 0;
        for (const key of kb.keys) {
          const keyWords = key.split(/\s+/);
          for (const w of words) {
            if (w.length > 2 && keyWords.some(kw => kw.includes(w) || w.includes(kw))) score++;
          }
        }
        if (score > bestScore) { bestScore = score; bestMatch = kb; }
      }
      if (bestScore >= 2) return bestMatch.answer;
      return "That's a great question! While I don't have a specific answer for that in my current knowledge base, I'd recommend booking a demo with our team for a detailed walkthrough. You can also explore the SentinelX platform dashboard to see our capabilities in action. Try asking about: OT security, anomaly detection, ICS threats, SCADA, PLCs, or SentinelX features!";
    }

    function addChatMsg(text, type) {
      const msgs = document.getElementById('chatMessages');
      const div = document.createElement('div');
      div.className = 'chat-msg ' + type;
      div.innerHTML = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function sendChat() {
      const input = document.getElementById('chatInput');
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      addChatMsg(msg, 'user');
      // Hide quick replies after first message
      document.getElementById('chatQuickReplies').style.display = 'none';
      // Show typing indicator
      const typing = document.getElementById('chatTyping');
      typing.classList.add('show');
      document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
      // Simulate response delay
      setTimeout(() => {
        typing.classList.remove('show');
        const response = findChatResponse(msg);
        addChatMsg(response, 'bot');
      }, 800 + Math.random() * 1200);
    }

    function sendQuickReply(btn) {
      const msg = btn.textContent;
      document.getElementById('chatInput').value = msg;
      sendChat();
    }
  