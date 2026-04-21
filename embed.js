/**
 * Vogler Marketing — Readiness-Score (Shadow DOM Embed)
 * Lädt sich selbst in einen Shadow DOM Container — komplett CSS-isoliert,
 * aber mit vollem Zugriff auf dataLayer, Cookies und Meta Pixel.
 *
 * Einbettung auf Webflow:
 *   <div id="vm-readiness-score"></div>
 *   <script src="https://dustinjeff.github.io/vogler-readiness-score/embed.js"></script>
 */
(function() {
  'use strict';

  var mount = document.getElementById('vm-readiness-score');
  if (!mount) return;

  // --- Fonts (global, weil Shadow DOM font-face erbt) ---
  if (!document.querySelector('link[href*="Didact+Gothic"]')) {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Didact+Gothic&family=JetBrains+Mono:wght@400;600&display=swap';
    document.head.appendChild(fl);
  }

  // --- Shadow DOM ---
  var shadow = mount.attachShadow({mode: 'open'});

  // --- Tracking (direkt in dataLayer, kein postMessage) ---
  function trackEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    var d = {event: eventName, rechner_name: (params || {}).rechner || 'unknown'};
    for (var k in params) {
      if (params.hasOwnProperty(k)) d['rechner_' + k] = params[k];
    }
    window.dataLayer.push(d);
  }

  trackEvent('rechner_started', {rechner: 'readiness-score'});

  // --- DOM Helpers ---
  function $(id) { return shadow.querySelector('#' + id); }
  function $$(sel) { return shadow.querySelectorAll(sel); }

  // ==========================================================================
  // DATA
  // ==========================================================================
  var questions = [
    {
      id: 'acquisition',
      label: 'Neukundengewinnung',
      text: 'Wie gewinnst du heute die meisten Neukunden?',
      options: [
        { text: 'Gar nicht systematisch', value: 0 },
        { text: 'Empfehlungen / Mundpropaganda', value: 25 },
        { text: 'Messen / Events', value: 50 },
        { text: 'Kaltakquise / Outbound', value: 50 },
        { text: 'Google Ads / Paid Media', value: 75 },
        { text: 'Mehrere Kan\u00e4le systematisch verbunden', value: 100 }
      ]
    },
    {
      id: 'crm',
      label: 'CRM-System',
      text: 'Hast du ein CRM im Einsatz?',
      options: [
        { text: 'Nein / Excel / Notizen', value: 0 },
        { text: 'Ja, aber kaum gepflegt', value: 25 },
        { text: 'Ja, aktiv genutzt', value: 75 },
        { text: 'Ja, mit Automationen und Pipeline-Tracking', value: 100 }
      ]
    },
    {
      id: 'speed',
      label: 'Reaktionszeit',
      text: 'Wie schnell wird ein neuer Lead kontaktiert?',
      options: [
        { text: 'Gar nicht systematisch', value: 0 },
        { text: 'Wenn jemand Zeit hat', value: 25 },
        { text: 'Innerhalb 24 Stunden', value: 50 },
        { text: 'Unter 1 Stunde', value: 75 },
        { text: 'Unter 5 Minuten, automatisiert', value: 100 }
      ]
    },
    {
      id: 'landingpages',
      label: 'Landingpages',
      text: 'Hast du dedizierte Landingpages f\u00fcr deine Angebote?',
      options: [
        { text: 'Wir schalten keine Ads', value: 0 },
        { text: 'Nein, Ads gehen auf die Homepage', value: 25 },
        { text: 'Ja, aber ohne Tracking', value: 50 },
        { text: 'Ja, mit Tracking und Conversion-Optimierung', value: 100 }
      ]
    },
    {
      id: 'tracking',
      label: 'Conversion-Tracking',
      text: 'Ist Conversion-Tracking eingerichtet?',
      options: [
        { text: 'Nein / Wei\u00df ich nicht', value: 0 },
        { text: 'Google Analytics ist installiert', value: 25 },
        { text: 'GA4 + Events sind konfiguriert', value: 50 },
        { text: 'GA4 + GTM + Conversion-Events + Attribution', value: 100 }
      ]
    },
    {
      id: 'handoff',
      label: '\u00dcbergabe Marketing \u2192 Vertrieb',
      text: 'Gibt es einen definierten \u00dcbergabeprozess von Marketing an Vertrieb?',
      options: [
        { text: 'Nein, Marketing und Vertrieb arbeiten getrennt', value: 0 },
        { text: 'Informell / per E-Mail', value: 25 },
        { text: 'Definierter Prozess aber manuell', value: 50 },
        { text: 'Automatisiert mit Scoring und Kriterien', value: 100 }
      ]
    },
    {
      id: 'leads',
      label: 'Lead-Volumen',
      text: 'Wie viele qualifizierte Anfragen bekommst du pro Monat?',
      options: [
        { text: 'Keine Ahnung', value: 0 },
        { text: 'Unter 5', value: 25 },
        { text: '5\u201320', value: 50 },
        { text: '20+', value: 100 }
      ]
    },
    {
      id: 'cac',
      label: 'CAC-Kenntnis',
      text: 'Wei\u00dft du was ein Neukunde dich kostet (CAC)?',
      options: [
        { text: 'Nein', value: 0 },
        { text: 'Ungef\u00e4hr', value: 25 },
        { text: 'Ja, pro Kanal aufgeschl\u00fcsselt', value: 100 }
      ]
    },
    {
      id: 'nurturing',
      label: 'E-Mail-Nurturing',
      text: 'Hast du E-Mail-Nurturing f\u00fcr Leads die noch nicht kaufbereit sind?',
      options: [
        { text: 'Nein', value: 0 },
        { text: 'Newsletter, aber kein gezieltes Nurturing', value: 25 },
        { text: 'Willkommens-Sequenz nach Opt-in', value: 50 },
        { text: 'Automatisiertes Nurturing mit Segmentierung und Scoring', value: 100 }
      ]
    },
    {
      id: 'cycle',
      label: 'Sales-Zyklus',
      text: 'Wie lang ist dein durchschnittlicher Sales-Zyklus?',
      options: [
        { text: 'Wei\u00df ich nicht', value: 0 },
        { text: 'Unter 4 Wochen', value: 100 },
        { text: '1\u20133 Monate', value: 75 },
        { text: '3\u20136 Monate', value: 75 },
        { text: '\u00dcber 6 Monate', value: 50 }
      ]
    }
  ];

  var profiles = [
    {
      min: 0, max: 25,
      title: 'Kein System vorhanden',
      color: 'var(--red)',
      bgColor: 'var(--red-bg)',
      desc: 'Du arbeitest ohne Marketing-Infrastruktur. Jeder Neukunde ist Zufall. Der gr\u00f6\u00dfte Hebel: Grundlagen aufbauen \u2014 Tracking, Landingpages, erste Kampagnen. Das ist genau das was Demand Capture macht.',
      rec: 'Demand Capture \u2014 ab 3.000 \u20ac/Monat',
      link: 'https://vogler-marketing-26-04.webflow.io/leistungen-demand-capture',
      btnText: 'Demand Capture ansehen \u2192'
    },
    {
      min: 26, max: 50,
      title: 'Fundament fehlt',
      color: 'var(--yellow)',
      bgColor: 'var(--yellow-bg)',
      desc: 'Einzelne Bausteine existieren, aber sie sind nicht verbunden. Leads kommen rein, gehen aber verloren. Du brauchst ein System das Kan\u00e4le, Infrastruktur und Prozesse verbindet.',
      rec: 'Demand Capture oder Growth Engine \u2014 ab 3.000 \u20ac/Monat',
      link: 'https://vogler-marketing-26-04.webflow.io/leistungen',
      btnText: 'Alle Systeme vergleichen \u2192'
    },
    {
      min: 51, max: 75,
      title: 'Gute Basis, Potenzial nicht ausgesch\u00f6pft',
      color: 'var(--green)',
      bgColor: 'var(--green-bg)',
      desc: 'Du machst vieles richtig. Aber Marketing und Vertrieb arbeiten noch nicht als ein System. Der n\u00e4chste Schritt: Nurturing, Scoring und Vertriebs\u00fcbergabe verbinden \u2014 damit kein Lead mehr verloren geht.',
      rec: 'Growth Engine oder Revenue System \u2014 ab 5.500 \u20ac/Monat',
      link: 'https://vogler-marketing-26-04.webflow.io/leistungen-growth-engine',
      btnText: 'Growth Engine ansehen \u2192'
    },
    {
      min: 76, max: 90,
      title: 'Bereit f\u00fcr Skalierung',
      color: 'var(--green)',
      bgColor: 'var(--green-bg)',
      desc: 'Dein Marketing-System ist \u00fcberdurchschnittlich. Du hast die Grundlagen \u2014 jetzt geht es um Volumen, bessere Attribution und h\u00f6here Conversion Rates. Der n\u00e4chste Schritt: Mit deinen echten Zahlen rechnen und den gr\u00f6\u00dften Hebel finden.',
      rec: 'Lass uns gemeinsam skalieren',
      link: 'https://vogler-marketing-26-04.webflow.io/erstgespraech',
      btnText: 'Erstgespr\u00e4ch vereinbaren \u2192'
    },
    {
      min: 91, max: 100,
      title: 'Top-Level \u2014 Respekt.',
      color: 'var(--accent)',
      bgColor: 'rgba(244, 231, 90, 0.1)',
      desc: 'Wow, du hast dein Business im Griff. Chapeau! Oder du hast gerade alles auf Maximum gestellt um zu testen. Falls ersteres: Dein System l\u00e4uft auf einem Level das die wenigsten B2B-Unternehmen erreichen. Falls letzteres: Stell dir vor wie es w\u00e4re wenn diese Antworten echt w\u00e4ren. Der Unterschied zwischen deiner Realit\u00e4t und diesem Score \u2014 das ist dein Potenzial.',
      rec: 'Ehrlicher Vergleich? 30 Minuten reichen.',
      link: 'https://vogler-marketing-26-04.webflow.io/erstgespraech',
      btnText: 'Erstgespr\u00e4ch vereinbaren \u2192'
    }
  ];

  var insights = {
    acquisition: {
      strong: 'Systematische Neukundengewinnung \u2014 du bist nicht auf Zufall angewiesen',
      weak: 'Kein System f\u00fcr Neukundengewinnung \u2014 jeder Kunde ist Gl\u00fcckssache'
    },
    crm: {
      strong: 'CRM aktiv im Einsatz \u2014 gute Grundlage f\u00fcr Scoring und Pipeline-Tracking',
      weak: 'Kein funktionierendes CRM \u2014 Leads gehen verloren, kein \u00dcberblick \u00fcber die Pipeline'
    },
    speed: {
      strong: 'Schnelle Lead-Reaktion \u2014 das erh\u00f6ht die Abschlussquote um bis zu 7x',
      weak: 'Zu langsame Lead-Reaktion \u2014 nach 30 Minuten sinkt die Abschlussquote um 80%'
    },
    landingpages: {
      strong: 'Dedizierte Landingpages mit Tracking \u2014 Grundlage f\u00fcr Conversion-Optimierung',
      weak: 'Keine dedizierten Landingpages \u2014 Werbebudget verpufft auf der Homepage'
    },
    tracking: {
      strong: 'Conversion-Tracking eingerichtet \u2014 du wei\u00dft was funktioniert und was nicht',
      weak: 'Kein Conversion-Tracking \u2014 du investierst blind ohne zu wissen was funktioniert'
    },
    handoff: {
      strong: 'Definierter Marketing-Vertrieb-Prozess \u2014 kein Lead f\u00e4llt durchs Raster',
      weak: 'Keine \u00dcbergabe Marketing \u2192 Vertrieb \u2014 79% der Leads konvertieren nie ohne Follow-up'
    },
    leads: {
      strong: 'Gutes Lead-Volumen \u2014 die Basis f\u00fcr planbares Wachstum steht',
      weak: 'Zu wenige qualifizierte Anfragen \u2014 kein planbares Wachstum m\u00f6glich'
    },
    cac: {
      strong: 'CAC pro Kanal bekannt \u2014 du kannst gezielt Budget auf profitable Kan\u00e4le verschieben',
      weak: 'Customer Acquisition Cost unbekannt \u2014 du kannst nicht beurteilen ob Marketing profitabel ist'
    },
    nurturing: {
      strong: 'E-Mail-Nurturing aktiv \u2014 du holst Leads ab die noch nicht kaufbereit sind',
      weak: 'Kein Nurturing \u2014 95% der Website-Besucher sind noch nicht kaufbereit und gehen verloren'
    },
    cycle: {
      strong: 'Sales-Zyklus bekannt und steuerbar \u2014 Forecasting und Planung m\u00f6glich',
      weak: 'Sales-Zyklus unbekannt \u2014 ohne diese Zahl ist kein verl\u00e4ssliches Forecasting m\u00f6glich'
    }
  };

  // ==========================================================================
  // STATE
  // ==========================================================================
  var current = 0;
  var answers = new Array(questions.length).fill(null);

  // ==========================================================================
  // CSS
  // ==========================================================================
  var CSS = '\
    :host { display: block; }\
    .vm-root {\
      --bg: #0a0a0a; --bg-card: #141414; --bg-input: #1a1a1a;\
      --border: #2a2a2a; --border-focus: #4a4a4a;\
      --text: #e8e8e8; --text-muted: #888; --text-dim: #666;\
      --accent: #f4e75a; --accent-hover: #f7ed7a;\
      --green: #22c55e; --green-bg: rgba(34,197,94,0.1);\
      --yellow: #eab308; --yellow-bg: rgba(234,179,8,0.1);\
      --red: #ef4444; --red-bg: rgba(239,68,68,0.1);\
      --font: "Didact Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;\
      --mono: "JetBrains Mono","SF Mono","Fira Code",monospace;\
      font-family: var(--font); color: var(--text); line-height: 1.6; -webkit-font-smoothing: antialiased;\
    }\
    * { margin: 0; padding: 0; box-sizing: border-box; }\
    .tool-box { background: var(--bg); border-radius: 20px; padding: 40px 32px; color: var(--text); box-shadow: 0 8px 32px rgba(0,0,0,0.15); }\
    .tool-header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 32px; }\
    .tool-header h1 { font-size: 28px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 12px; }\
    .tool-header p { color: var(--text-muted); font-size: 16px; max-width: 560px; margin: 0 auto; }\
    .progress-bar { margin-bottom: 32px; }\
    .progress-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; color: var(--text-muted); }\
    .progress-info .step-label { color: var(--text); font-weight: 500; }\
    .progress-track { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }\
    .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease; }\
    .question-slide { display: none; animation: fadeIn 0.3s ease; }\
    .question-slide.active { display: block; }\
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }\
    .question-number { font-size: 13px; color: var(--accent); font-family: var(--mono); margin-bottom: 8px; }\
    .question-text { font-size: 22px; font-weight: 600; margin-bottom: 28px; line-height: 1.3; }\
    .options-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }\
    .option-item { position: relative; }\
    .option-item input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }\
    .option-label { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 15px; line-height: 1.4; }\
    .option-label:hover { border-color: var(--border-focus); background: var(--bg-input); }\
    .option-radio { width: 20px; height: 20px; min-width: 20px; border-radius: 50%; border: 2px solid var(--border); transition: all 0.2s; display: flex; align-items: center; justify-content: center; }\
    .option-radio::after { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); transform: scale(0); transition: transform 0.2s; }\
    .option-item input[type="radio"]:checked + .option-label { border-color: var(--accent); background: rgba(244,231,90,0.05); }\
    .option-item input[type="radio"]:checked + .option-label .option-radio { border-color: var(--accent); }\
    .option-item input[type="radio"]:checked + .option-label .option-radio::after { transform: scale(1); }\
    .nav-row { display: flex; justify-content: space-between; align-items: center; }\
    .btn { font-family: var(--font); font-size: 15px; font-weight: 600; padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }\
    .btn:disabled { opacity: 0.3; cursor: not-allowed; }\
    .btn-primary { background: var(--accent); color: var(--bg); }\
    .btn-primary:hover:not(:disabled) { background: var(--accent-hover); }\
    .btn-secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }\
    .btn-secondary:hover:not(:disabled) { border-color: var(--border-focus); color: var(--text); }\
    .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }\
    .btn-outline:hover { background: rgba(244,231,90,0.08); }\
    .btn-ghost { background: transparent; color: var(--text-muted); font-size: 13px; padding: 8px 16px; }\
    .btn-ghost:hover { color: var(--text); }\
    .result-section { display: none; animation: fadeIn 0.4s ease; }\
    .result-section.active { display: block; }\
    .score-display { text-align: center; padding: 40px 0 32px; }\
    .score-number { font-family: var(--mono); font-size: 72px; font-weight: 600; line-height: 1; margin-bottom: 4px; }\
    .score-label { font-family: var(--mono); font-size: 20px; color: var(--text-muted); }\
    .score-bar-wrapper { max-width: 480px; margin: 24px auto 0; }\
    .score-bar-track { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }\
    .score-bar-fill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }\
    .profile-card { background: var(--bg-card); border-radius: 12px; padding: 28px; margin: 28px 0; border-left: 4px solid; }\
    .profile-badge { display: inline-block; font-size: 12px; font-weight: 600; font-family: var(--mono); padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }\
    .profile-title { font-size: 20px; font-weight: 600; margin-bottom: 12px; }\
    .profile-desc { color: var(--text-muted); font-size: 15px; line-height: 1.6; margin-bottom: 16px; }\
    .profile-recommendation { font-size: 14px; color: var(--text); }\
    .profile-recommendation strong { color: var(--accent); }\
    .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }\
    .analysis-card { background: var(--bg-card); border-radius: 12px; padding: 24px; }\
    .analysis-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }\
    .analysis-card .dot { width: 8px; height: 8px; border-radius: 50%; }\
    .analysis-card ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }\
    .analysis-card li { font-size: 14px; color: var(--text-muted); display: flex; align-items: flex-start; gap: 10px; line-height: 1.4; }\
    .cta-area { border-top: 1px solid var(--border); padding-top: 32px; margin-top: 32px; text-align: center; }\
    .cta-area h3 { font-size: 18px; margin-bottom: 8px; }\
    .cta-area .cta-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; }\
    .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }\
    .cta-buttons .btn { min-width: 220px; }\
    .email-form { display: none; max-width: 420px; margin: 20px auto 0; animation: fadeIn 0.3s ease; }\
    .email-form.visible { display: block; }\
    .email-input-row { display: flex; gap: 8px; }\
    .email-input-row input { flex: 1; font-family: var(--font); font-size: 14px; padding: 12px 16px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 8px; color: var(--text); outline: none; transition: border-color 0.2s; }\
    .email-input-row input:focus { border-color: var(--accent); }\
    .email-input-row input::placeholder { color: var(--text-dim); }\
    .email-sent { display: none; text-align: center; color: var(--green); font-size: 14px; margin-top: 12px; }\
    .email-sent.visible { display: block; }\
    .share-row { margin-top: 12px; }\
    .share-copied { display: none; color: var(--green); font-size: 13px; margin-top: 6px; }\
    .share-copied.visible { display: inline; }\
    .restart-row { text-align: center; margin-top: 24px; }\
    @media (max-width: 768px) { .analysis-grid { grid-template-columns: 1fr; } }\
    @media (max-width: 600px) {\
      .tool-box { padding: 24px 18px; border-radius: 12px; }\
      .tool-header h1 { font-size: 22px; }\
      .tool-header p { font-size: 14px; }\
      .question-text { font-size: 18px; }\
      .score-number { font-size: 56px; }\
      .btn { padding: 12px 20px; font-size: 14px; }\
      .cta-buttons { flex-direction: column; align-items: center; }\
      .cta-buttons .btn { width: 100%; }\
      .email-input-row { flex-direction: column; }\
    }\
  ';

  // ==========================================================================
  // HTML
  // ==========================================================================
  var HTML = '\
  <div class="vm-root"><div class="tool-box">\
    <div class="tool-header">\
      <h1>Marketing Readiness-Score</h1>\
      <p>10 Fragen. 3 Minuten. Finde heraus, wie bereit dein Unternehmen f\u00fcr systematisches Marketing-Wachstum ist.</p>\
    </div>\
    <div class="progress-bar" id="progressBar">\
      <div class="progress-info">\
        <span class="step-label" id="stepLabel">Frage 1 von 10</span>\
        <span id="stepPercent">0%</span>\
      </div>\
      <div class="progress-track">\
        <div class="progress-fill" id="progressFill" style="width: 0%"></div>\
      </div>\
    </div>\
    <div id="questionsContainer"></div>\
    <div class="nav-row" id="navRow">\
      <button class="btn btn-secondary" id="btnBack" data-action="prevQuestion" disabled>Zur\u00fcck</button>\
      <button class="btn btn-primary" id="btnNext" data-action="nextQuestion" disabled>Weiter</button>\
    </div>\
    <div class="result-section" id="resultSection">\
      <div class="score-display">\
        <div class="score-number" id="scoreNumber">0</div>\
        <div class="score-label">/ 100</div>\
        <div class="score-bar-wrapper">\
          <div class="score-bar-track">\
            <div class="score-bar-fill" id="scoreBarFill" style="width: 0%"></div>\
          </div>\
        </div>\
      </div>\
      <div class="profile-card" id="profileCard">\
        <div class="profile-badge" id="profileBadge"></div>\
        <div class="profile-title" id="profileTitle"></div>\
        <div class="profile-desc" id="profileDesc"></div>\
        <div class="profile-recommendation" id="profileRec"></div>\
      </div>\
      <div class="analysis-grid" id="analysisGrid">\
        <div class="analysis-card" id="strengthsCard">\
          <h3><span class="dot" style="background:var(--green)"></span>St\u00e4rkste Bereiche</h3>\
          <ul id="strengthsList"></ul>\
        </div>\
        <div class="analysis-card" id="weaknessesCard">\
          <h3><span class="dot" style="background:var(--red)"></span>Gr\u00f6\u00dfter Handlungsbedarf</h3>\
          <ul id="weaknessesList"></ul>\
        </div>\
      </div>\
      <div class="cta-area">\
        <h3>Dein n\u00e4chster Schritt</h3>\
        <p class="cta-sub">Besprich dein Ergebnis mit einem Experten \u2014 kostenlos und unverbindlich.</p>\
        <div class="cta-buttons">\
          <a id="ctaPrimary" href="#" class="btn btn-primary"></a>\
          <button class="btn btn-outline" data-action="toggleEmailForm">Ergebnis per E-Mail senden</button>\
        </div>\
        <a id="ctaSecondary" href="https://vogler-marketing-26-04.webflow.io/erstgespraech" style="display:none;color:var(--text-muted);font-size:14px;margin-top:12px;text-decoration:none;border-bottom:1px solid var(--border)">Oder direkt Erstgespr\u00e4ch vereinbaren \u2192</a>\
        <div class="email-form" id="emailForm">\
          <div class="email-input-row">\
            <input type="email" id="emailInput" placeholder="deine@email.de">\
            <button class="btn btn-primary" data-action="sendEmail" style="min-width:auto;padding:12px 20px">Senden</button>\
          </div>\
        </div>\
        <div class="email-sent" id="emailSent">Ergebnis gesendet.</div>\
        <div class="share-row">\
          <button class="btn btn-ghost" data-action="copyShareLink">Rechner-Link teilen</button>\
          <span class="share-copied" id="shareCopied">Link kopiert</span>\
        </div>\
      </div>\
      <div class="restart-row">\
        <button class="btn btn-ghost" data-action="restart">Nochmal starten</button>\
      </div>\
    </div>\
  </div></div>';

  // --- Inject ---
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;

  // ==========================================================================
  // BUILD QUESTION SLIDES
  // ==========================================================================
  var container = $('questionsContainer');
  questions.forEach(function(q, i) {
    var slide = document.createElement('div');
    slide.className = 'question-slide' + (i === 0 ? ' active' : '');
    slide.id = 'slide-' + i;

    var optionsHtml = '';
    q.options.forEach(function(opt, j) {
      optionsHtml += '<div class="option-item">' +
        '<input type="radio" name="q' + i + '" id="q' + i + '_' + j + '" value="' + opt.value + '" data-question="' + i + '" data-value="' + opt.value + '">' +
        '<label class="option-label" for="q' + i + '_' + j + '">' +
        '<span class="option-radio"></span>' +
        opt.text +
        '</label></div>';
    });

    slide.innerHTML = '<div class="question-number">Frage ' + (i + 1) + '</div>' +
      '<div class="question-text">' + q.text + ' <span style="font-size:14px;color:var(--text-muted);font-weight:400">(nur 1 Antwort)</span></div>' +
      '<div class="options-list">' + optionsHtml + '</div>';

    container.appendChild(slide);
  });

  // ==========================================================================
  // UI UPDATE
  // ==========================================================================
  function updateUI() {
    var pct = Math.round((current / questions.length) * 100);
    $('stepLabel').textContent = 'Frage ' + (current + 1) + ' von ' + questions.length;
    $('stepPercent').textContent = pct + '%';
    $('progressFill').style.width = pct + '%';

    $('btnBack').disabled = current === 0;

    var btnNext = $('btnNext');
    btnNext.disabled = answers[current] === null;
    btnNext.textContent = current === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter';
  }

  // ==========================================================================
  // CORE LOGIC
  // ==========================================================================
  function selectAnswer(questionIndex, value) {
    answers[questionIndex] = value;
    updateUI();

    trackEvent('rechner_step', {
      rechner: 'readiness-score',
      step: questionIndex + 1,
      step_name: questions[questionIndex].id,
      answer_value: value
    });

    // Auto-advance after short delay
    if (current < questions.length - 1) {
      setTimeout(function() { nextQuestion(); }, 500);
    }
  }

  function nextQuestion() {
    if (answers[current] === null) return;

    if (current === questions.length - 1) {
      showResult();
      return;
    }

    $('slide-' + current).classList.remove('active');
    current++;
    $('slide-' + current).classList.add('active');
    updateUI();
  }

  function prevQuestion() {
    if (current === 0) return;
    $('slide-' + current).classList.remove('active');
    current--;
    $('slide-' + current).classList.add('active');
    updateUI();
  }

  function showResult() {
    $('slide-' + current).classList.remove('active');
    $('progressBar').style.display = 'none';
    $('navRow').style.display = 'none';
    $('resultSection').classList.add('active');

    var total = answers.reduce(function(sum, v) { return sum + v; }, 0);
    var score = Math.round(total / questions.length);

    // Animate score number
    var scoreEl = $('scoreNumber');
    var counter = 0;
    var step = Math.max(1, Math.floor(score / 40));
    var interval = setInterval(function() {
      counter += step;
      if (counter >= score) {
        counter = score;
        clearInterval(interval);
      }
      scoreEl.textContent = counter;
    }, 25);

    // Score bar
    var profile = null;
    for (var p = 0; p < profiles.length; p++) {
      if (score >= profiles[p].min && score <= profiles[p].max) {
        profile = profiles[p];
        break;
      }
    }
    if (!profile) profile = profiles[profiles.length - 1];

    var barFill = $('scoreBarFill');
    barFill.style.background = profile.color;
    setTimeout(function() { barFill.style.width = score + '%'; }, 100);

    // Score number color
    scoreEl.style.color = profile.color;

    // Profile card
    var card = $('profileCard');
    card.style.borderLeftColor = profile.color;

    var badge = $('profileBadge');
    badge.textContent = profile.title;
    badge.style.background = profile.bgColor;
    badge.style.color = profile.color;

    $('profileTitle').textContent = profile.title;
    $('profileDesc').textContent = profile.desc;
    $('profileRec').innerHTML = '<strong>Empfehlung:</strong> ' + profile.rec;

    // Strengths & Weaknesses
    var scored = questions.map(function(q, i) { return { id: q.id, label: q.label, value: answers[i], index: i }; });
    var sortedDesc = scored.slice().sort(function(a, b) { return b.value - a.value; });
    var sortedAsc = scored.slice().sort(function(a, b) { return a.value - b.value; });

    var strengths = sortedDesc.slice(0, 3);
    var weaknesses = sortedAsc.slice(0, 3);

    var strengthsList = $('strengthsList');
    strengthsList.innerHTML = strengths.map(function(s) {
      return '<li><span style="color:var(--green);font-size:16px;min-width:18px">\u2713</span>' + insights[s.id].strong + '</li>';
    }).join('');

    var weaknessesList = $('weaknessesList');
    weaknessesList.innerHTML = weaknesses.map(function(w) {
      return '<li><span style="color:var(--red);font-size:16px;min-width:18px">\u2717</span>' + insights[w.id].weak + '</li>';
    }).join('');

    // Tracking
    trackEvent('rechner_result', {
      rechner: 'readiness-score',
      score: score,
      profile: profile.title,
      strengths: strengths.map(function(s) { return s.id; }).join(','),
      weaknesses: weaknesses.map(function(w) { return w.id; }).join(',')
    });

    // Dynamic CTAs
    var ctaPrimary = $('ctaPrimary');
    ctaPrimary.href = profile.link;
    ctaPrimary.textContent = profile.btnText;

    $('ctaSecondary').style.display = 'inline';

    mount.scrollIntoView({behavior: 'smooth'});
  }

  function toggleEmailForm() {
    var form = $('emailForm');
    form.classList.toggle('visible');
    if (form.classList.contains('visible')) {
      $('emailInput').focus();
    }
  }

  function sendEmail() {
    var email = $('emailInput').value;
    if (!email || email.indexOf('@') === -1) return;

    trackEvent('rechner_lead_capture', {
      rechner: 'readiness-score',
      action: 'email_result'
    });

    // Simulate sending (in production: POST to backend/Brevo)
    $('emailForm').classList.remove('visible');
    $('emailSent').classList.add('visible');
  }

  function copyShareLink() {
    var url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(url).then(function() {
      var el = $('shareCopied');
      el.classList.add('visible');
      setTimeout(function() { el.classList.remove('visible'); }, 2000);
    });
    trackEvent('rechner_cta_clicked', {rechner: 'readiness-score', cta: 'link_teilen'});
  }

  function restart() {
    answers.fill(null);
    current = 0;

    $('resultSection').classList.remove('active');
    $('progressBar').style.display = '';
    $('navRow').style.display = '';
    $('emailForm').classList.remove('visible');
    $('emailSent').classList.remove('visible');

    // Reset all radios
    $$('input[type="radio"]').forEach(function(r) { r.checked = false; });

    // Show first slide
    $$('.question-slide').forEach(function(s) { s.classList.remove('active'); });
    $('slide-0').classList.add('active');

    updateUI();
    mount.scrollIntoView({behavior: 'smooth'});
  }

  // ==========================================================================
  // EVENT DELEGATION (statt inline onclick)
  // ==========================================================================
  shadow.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;

    switch(action) {
      case 'nextQuestion': nextQuestion(); break;
      case 'prevQuestion': prevQuestion(); break;
      case 'toggleEmailForm': toggleEmailForm(); break;
      case 'sendEmail': sendEmail(); break;
      case 'copyShareLink': copyShareLink(); break;
      case 'restart': restart(); break;
    }
  });

  // Radio button change delegation
  shadow.addEventListener('change', function(e) {
    var el = e.target;
    if (el.type === 'radio' && el.dataset.question !== undefined) {
      selectAnswer(parseInt(el.dataset.question), parseInt(el.dataset.value));
    }
  });

  // ==========================================================================
  // INIT
  // ==========================================================================
  updateUI();

})();
