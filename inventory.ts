@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

/* ============== Tokens ============== */
:root {
  --bg-0: #0a0c11;
  --bg-1: #0e1117;
  --bg-card: #12151c;
  --bg-elev: #161a23;
  --bg-input: #0c0f15;
  --border: rgba(255,255,255,0.07);
  --border-strong: rgba(255,255,255,0.12);
  --border-bright: rgba(255,255,255,0.20);
  --text: #e9ebef;
  --text-2: #aab1bf;
  --text-3: #6c7585;
  --text-4: #4a525f;

  --live: oklch(0.78 0.14 155);
  --live-soft: oklch(0.78 0.14 155 / 0.14);
  --live-edge: oklch(0.78 0.14 155 / 0.35);

  --pre: oklch(0.82 0.14 75);
  --pre-soft: oklch(0.82 0.14 75 / 0.14);
  --pre-edge: oklch(0.82 0.14 75 / 0.32);

  --util-high: oklch(0.72 0.17 28);
  --util-mid: oklch(0.82 0.14 75);
  --util-low: oklch(0.74 0.10 235);

  --serif: "Instrument Serif", Georgia, "Times New Roman", serif;
  --sans: "Hanken Grotesk", "Helvetica Neue", Helvetica, ui-sans-serif, system-ui, sans-serif;

  --radius: 14px;
  --radius-sm: 8px;
  --maxw: 1360px;
  --shadow-card: 0 1px 0 rgba(255,255,255,0.025) inset, 0 30px 60px -40px rgba(0,0,0,0.6);
}

* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: var(--bg-0);
  color: var(--text);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body {
  background:
    radial-gradient(1200px 600px at 50% -200px, rgba(180,195,220,0.04), transparent 60%),
    var(--bg-0);
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; }

.serif-num { font-family: var(--serif); font-style: italic; font-weight: 400; letter-spacing: -0.01em; }

/* ============== Top bar ============== */
.topbar {
  position: sticky; top: 0; z-index: 30;
  backdrop-filter: blur(14px) saturate(140%);
  background: color-mix(in srgb, var(--bg-0) 78%, transparent);
  border-bottom: 1px solid var(--border);
}
.topbar-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
}
.brand { display: flex; align-items: center; gap: 10px; font-size: 14px; letter-spacing: -0.005em; }
.brand-mark { font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
.brand-sep { color: var(--text-4); }
.brand-product { color: var(--text-2); }
.top-nav { display: flex; align-items: center; gap: 22px; font-size: 13.5px; color: var(--text-2); }
.top-link { color: var(--text-2); transition: color .15s; }
.top-link:hover { color: var(--text); }
.top-divider { width: 1px; height: 16px; background: var(--border-strong); }
.status-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 10px;
  border: 1px solid var(--live-edge);
  background: var(--live-soft);
  color: var(--live);
  border-radius: 999px;
  font-size: 12.5px;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.pill-short { display: none; }
.pill-full  { display: inline; }
.contact { color: var(--text-2); font-size: 13px; }
.contact:hover { color: var(--text); }

/* ============== Dot ============== */
.dot { width: 7px; height: 7px; border-radius: 999px; display: inline-block; flex: none; }
.dot-live { background: var(--live); box-shadow: 0 0 0 3px var(--live-soft); }
.dot-preorder { background: var(--pre); box-shadow: 0 0 0 3px var(--pre-soft); }

/* ============== Page shell ============== */
.page { max-width: var(--maxw); margin: 0 auto; padding: 0 32px 80px; }

/* ============== Hero ============== */
.hero { padding: 72px 0 36px; }
.hero-eyebrow {
  display: flex; align-items: center; gap: 14px;
  font-size: 12.5px; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 28px;
}
.kicker { color: var(--text-2); }
.kicker-sep { width: 18px; height: 1px; background: var(--border-strong); }
.kicker-muted { color: var(--text-3); text-transform: none; letter-spacing: 0.01em; font-size: 13px; }
.hero-title {
  font-family: var(--sans);
  font-weight: 500;
  font-size: clamp(44px, 6.2vw, 86px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  margin: 0 0 28px;
  color: var(--text);
  max-width: 16ch;
}
.hero-title em {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--text);
}
.hero-lede {
  max-width: 62ch; font-size: 17px; line-height: 1.55; color: var(--text-2); margin: 0;
}
.hero-lede .em { color: var(--text); }

/* ============== Stats strip ============== */
.stats {
  margin-top: 24px;
  padding: 28px;
  border: 1px solid var(--border);
  background: linear-gradient(180deg, var(--bg-1), var(--bg-0));
  border-radius: var(--radius);
}
.stats-row { display: flex; align-items: stretch; gap: 36px; flex-wrap: wrap; }
.stat { display: flex; flex-direction: column; gap: 6px; }
.stat-value {
  font-family: var(--serif);
  font-style: italic;
  font-weight: 400;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text);
}
.stat-unit { font-size: 22px; color: var(--text-2); font-style: italic; }
.stat-label {
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}
.stat-live .stat-value { color: var(--live); }
.stat-spacer { flex: 1; min-width: 12px; }
.price-chip {
  align-self: stretch;
  display: flex; flex-direction: column; justify-content: center; gap: 6px;
  padding: 12px 16px;
  min-width: 180px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
}
.price-chip-name { font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-3); }
.price-chip-price { display: flex; align-items: baseline; gap: 6px; }
.price-chip-price .serif-num { font-size: 24px; color: var(--text); }
.price-chip-unit { font-size: 13px; color: var(--text-2); }

/* ============== Catalog layout ============== */
.catalog { margin-top: 40px; }
.catalog-inner {
  display: grid;
  grid-template-columns: 248px 1fr;
  gap: 32px;
  align-items: flex-start;
}

/* ============== Sidebar ============== */
.sidebar { position: sticky; top: 76px; padding: 4px 4px 0 0; }
.sidebar-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.side-label { font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); }
.clear-btn {
  background: none; border: 0; color: var(--text-2); font-size: 12px;
  padding: 4px 8px; border-radius: 6px;
}
.clear-btn:hover { color: var(--text); background: var(--bg-card); }
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--bg-input);
  margin-top: 16px;
  color: var(--text-3);
  transition: border-color .15s;
}
.search-wrap:focus-within { border-color: var(--border-strong); color: var(--text-2); }
.search-input {
  background: none; border: 0; outline: none; color: var(--text);
  font-family: inherit; font-size: 13.5px; flex: 1; padding: 0;
}
.search-input::placeholder { color: var(--text-3); }
.filter-group { margin-top: 22px; }
.filter-title { font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 10px; }
.filter-list { display: flex; flex-direction: column; gap: 2px; }
.filter-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; padding: 8px 10px;
  border: 1px solid transparent;
  background: none;
  border-radius: 8px;
  color: var(--text-2);
  font-size: 13.5px;
  text-align: left;
  width: 100%;
  transition: background .15s, color .15s, border-color .15s;
}
.filter-row:hover { color: var(--text); background: var(--bg-card); }
.filter-row.is-active { color: var(--text); background: var(--bg-elev); border-color: var(--border-strong); }
.filter-row-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.filter-row-left > span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.filter-count { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--text-3); }
.filter-row.is-active .filter-count { color: var(--text); }
.chip-glyph {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 32px; height: 18px; padding: 0 6px;
  font-size: 10px; letter-spacing: 0.06em; font-weight: 600;
  background: var(--bg-elev); border: 1px solid var(--border-strong);
  border-radius: 4px; color: var(--text-2);
}
.site-code {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 38px; height: 18px; padding: 0 6px;
  font-size: 10px; letter-spacing: 0.06em; font-weight: 600;
  background: var(--bg-elev); border: 1px solid var(--border-strong);
  border-radius: 4px; color: var(--text-2);
}
.sidebar-foot {
  margin-top: 28px; padding: 16px 14px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px;
}
.foot-title { font-size: 13px; color: var(--text); margin-bottom: 4px; }
.foot-body { font-size: 12.5px; color: var(--text-3); line-height: 1.5; margin-bottom: 12px; }
.foot-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--live); font-size: 12.5px;
  border-bottom: 1px dashed var(--live-edge); padding-bottom: 1px;
}
.foot-link:hover { border-bottom-color: var(--live); }

/* ============== Grid toolbar ============== */
.grid-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.result-count { font-size: 14px; color: var(--text-2); }
.result-count .serif-num { font-size: 22px; color: var(--text); margin-right: 4px; }
.toolbar-controls { display: flex; align-items: center; gap: 10px; }
.seg {
  display: inline-flex;
  border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg-card); padding: 3px; gap: 2px;
}
.seg button {
  background: none; border: 0; padding: 6px 12px;
  font-size: 12.5px; color: var(--text-3);
  border-radius: 6px; transition: all .15s;
}
.seg button:hover { color: var(--text); }
.seg button.is-on { background: var(--bg-elev); color: var(--text); }
.seg-sm button { padding: 6px 8px; display: inline-flex; align-items: center; }

/* ============== Grid ============== */
.grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }

/* ============== Card ============== */
.card {
  position: relative;
  display: flex; flex-direction: column;
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: linear-gradient(180deg,rgba(255,255,255,0.012),transparent 60%), var(--bg-card);
  box-shadow: var(--shadow-card);
  transition: border-color .15s;
}
.card:hover { border-color: var(--border-strong); }
.card.density-compact { padding: 18px; }
.card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-head-left { display: flex; align-items: center; gap: 8px; }
.status-tag {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  font-size: 11.5px; letter-spacing: 0.04em;
  border: 1px solid;
}
.status-tag.live { color: var(--live); background: var(--live-soft); border-color: var(--live-edge); }
.status-tag.preorder { color: var(--pre); background: var(--pre-soft); border-color: var(--pre-edge); }
.site-tag {
  font-size: 10.5px; letter-spacing: 0.08em; font-weight: 600;
  padding: 4px 8px;
  border: 1px solid var(--border-strong);
  border-radius: 5px;
  color: var(--text-2); background: var(--bg-elev);
}
.card-id { font-size: 11px; color: var(--text-4); letter-spacing: 0.04em; }
.card-title-row { margin-bottom: 18px; }
.card-title {
  margin: 0 0 6px;
  font-weight: 500;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.022em;
  color: var(--text);
}
.card-sub { font-size: 13.5px; color: var(--text-3); display: flex; gap: 8px; align-items: center; }
.dot-sep { color: var(--text-4); }

/* specs */
.specs {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 0; margin: 0 0 18px;
  border-top: 1px dashed var(--border);
  border-bottom: 1px dashed var(--border);
}
.spec-row {
  display: grid; grid-template-columns: 64px 1fr;
  gap: 10px; padding: 10px 0;
  align-items: baseline;
  border-bottom: 1px dashed var(--border);
}
.spec-row:nth-last-child(-n+2) { border-bottom: 0; }
.spec-row:nth-child(odd) { padding-right: 14px; border-right: 1px dashed var(--border); }
.spec-row:nth-child(even) { padding-left: 14px; }
.spec-row dt { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); margin: 0; }
.spec-row dd { margin: 0; font-size: 13.5px; color: var(--text); line-height: 1.35; }
.spec-row-highlight { grid-column: 1 / -1; border-right: 0 !important; padding-right: 0 !important; padding-left: 0 !important; }
.spec-row-highlight dd { font-weight: 500; }
.spec-muted { color: var(--text-3); font-weight: 400; }

/* util */
.util { margin-bottom: 18px; }
.util-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
.util-label { font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-2); }
.util-pct { font-size: 13px; color: var(--text-2); }
.util-pct .serif-num { font-size: 16px; color: var(--text); margin-right: 2px; }
.util-track { height: 4px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
.util-fill { height: 100%; border-radius: 999px; transition: width .3s ease; }
.util-high .util-fill { background: var(--util-high); }
.util-mid .util-fill  { background: var(--util-mid); }
.util-low .util-fill  { background: var(--util-low); }
.util-high .util-label { color: var(--util-high); }
.util-foot { font-size: 11.5px; color: var(--text-3); margin-top: 6px; }

/* badges */
.badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
.badge {
  font-size: 10.5px; letter-spacing: 0.06em;
  padding: 4px 8px; color: var(--text-2);
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border);
  border-radius: 4px;
}

/* card footer */
.card-foot {
  margin-top: auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 14px; padding-top: 18px;
  border-top: 1px solid var(--border);
}
.price-block { display: flex; flex-direction: column; gap: 4px; }
.price-main { display: flex; align-items: baseline; gap: 4px; }
.price-num { font-size: 38px; line-height: 1; color: var(--text); }
.price-unit { font-size: 14px; color: var(--text-2); }
.price-fine { font-size: 11.5px; color: var(--text-3); }

/* CTA */
.cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 16px;
  border: 1px solid;
  border-radius: 9px;
  font-size: 13.5px; font-weight: 500;
  background: transparent;
  transition: background .15s, transform .15s, filter .15s;
  white-space: nowrap;
}
.cta:disabled { opacity: 0.5; cursor: not-allowed; }
.cta-live { color: var(--bg-0); background: var(--live); border-color: var(--live); }
.cta-live:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
.cta-preorder { color: var(--bg-0); background: var(--pre); border-color: var(--pre); }
.cta-preorder:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
.btn-ghost {
  background: none; border: 1px solid var(--border-strong);
  color: var(--text-2); padding: 11px 16px; border-radius: 9px; font-size: 13.5px;
}
.btn-ghost:hover { color: var(--text); border-color: var(--border-bright); }

/* empty state */
.empty {
  grid-column: 1/-1;
  padding: 60px; text-align: center;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
}
.empty-title { font-size: 18px; color: var(--text); margin-bottom: 6px; font-family: var(--serif); font-style: italic; }
.empty-body { color: var(--text-3); margin-bottom: 14px; font-size: 14px; }

/* ============== Modal ============== */
.modal-scrim {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(5,7,11,0.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 60px 24px;
  overflow-y: auto;
  animation: scrim-in .2s ease;
}
@keyframes scrim-in { from { opacity: 0; } to { opacity: 1; } }
.modal {
  position: relative; width: 100%; max-width: 560px;
  background: var(--bg-1);
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  padding: 36px 36px 30px;
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6);
  animation: modal-in .25s cubic-bezier(.2,.7,.3,1);
}
@keyframes modal-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.modal-close {
  position: absolute; top: 14px; right: 14px;
  background: none; border: 0; color: var(--text-3);
  width: 30px; height: 30px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--bg-elev); color: var(--text); }
.modal-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.modal-site { font-size: 12px; color: var(--text-3); letter-spacing: 0.04em; }
.modal-title {
  font-weight: 500; font-size: 32px; line-height: 1.1;
  letter-spacing: -0.025em; margin: 0 0 12px;
}
.modal-title em { font-family: var(--serif); font-style: italic; font-weight: 400; }
.modal-lede { font-size: 14.5px; line-height: 1.55; color: var(--text-2); margin: 0 0 24px; }
.modal-lede .em { color: var(--text); }
.modal-lede em { font-family: var(--serif); font-style: italic; color: var(--text); }

/* form */
.form { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field > span { font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3); }
.field > span .opt { text-transform: none; letter-spacing: 0; color: var(--text-4); }
.field input, .field textarea {
  width: 100%; padding: 11px 13px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text); font-family: inherit; font-size: 14px;
  outline: none; transition: border-color .15s, background .15s;
  resize: vertical;
}
.field input:focus, .field textarea:focus { border-color: var(--border-bright); background: var(--bg-0); }
.field input::placeholder, .field textarea::placeholder { color: var(--text-4); }
.form-foot { margin-top: 6px; display: flex; flex-direction: column; gap: 14px; }
.form-fine { font-size: 11.5px; color: var(--text-3); line-height: 1.5; }
.form-actions { display: flex; gap: 10px; justify-content: space-between; }

/* submitted */
.check {
  width: 44px; height: 44px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--live-soft); color: var(--live);
  border: 1px solid var(--live-edge);
  border-radius: 999px; margin-bottom: 18px;
}
.receipt {
  margin-top: 18px;
  border: 1px solid var(--border);
  border-radius: 10px; background: var(--bg-input);
  padding: 4px 16px; margin-bottom: 22px;
}
.receipt-row {
  display: flex; justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed var(--border);
  font-size: 13px;
}
.receipt-row:last-child { border-bottom: 0; }
.receipt-row span:first-child { color: var(--text-3); }

/* ============== Page footer ============== */
.page-foot { margin-top: 80px; border-top: 1px solid var(--border); padding-top: 40px; }
.foot-grid {
  display: grid; grid-template-columns: 1.7fr 1fr 1fr 1fr;
  gap: 36px; padding-bottom: 32px;
}
.foot-mark { font-size: 14px; margin-bottom: 12px; }
.foot-fine { font-size: 12.5px; color: var(--text-3); line-height: 1.6; max-width: 50ch; }
.foot-h { font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-3); margin-bottom: 10px; }
.foot-col { display: flex; flex-direction: column; gap: 8px; }
.foot-col a { color: var(--text-2); font-size: 13.5px; }
.foot-col a:hover { color: var(--text); }
.foot-base {
  border-top: 1px solid var(--border);
  padding: 18px 0 4px;
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--text-3);
}

/* ============== Auth pages ============== */
.auth-shell {
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 20px;
  max-width: 540px; margin: 0 auto;
  gap: 20px;
}
.auth-brand {
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; letter-spacing: -0.005em;
  margin-bottom: 4px;
}
.auth-card { width: 100%; }
.auth-note { font-size: 12.5px; color: var(--text-4); text-align: center; line-height: 1.5; }
.auth-clerk-root { width: 100%; }

/* Override Clerk card background to match site */
.cl-card { background: var(--bg-card) !important; border: 1px solid var(--border) !important; }
.cl-headerTitle, .cl-bodyText { color: var(--text) !important; }
.cl-formFieldInput {
  background: var(--bg-input) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}

/* ============== Onboarding ============== */
.onb-section-label {
  font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 12px;
}

/* Nav auth button */
.nav-user-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-size: 12.5px; color: var(--text-2);
  transition: border-color .15s, color .15s;
}
.nav-user-btn:hover { color: var(--text); border-color: var(--border-bright); }
.nav-sign-in {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px;
  background: var(--live-soft);
  border: 1px solid var(--live-edge);
  border-radius: 999px;
  font-size: 12.5px; color: var(--live);
  cursor: pointer;
  transition: filter .15s;
}
.nav-sign-in:hover { filter: brightness(1.1); }

/* ============== Responsive ============== */
@media (max-width: 1180px) {
  .grid { grid-template-columns: 1fr; }
}

@media (max-width: 980px) {
  .catalog-inner { grid-template-columns: 1fr; }
  .sidebar { position: static; }
  .stats-row { gap: 20px; }
  .foot-grid { grid-template-columns: 1fr 1fr; }
}

/* Tablet nav — hide links, keep pill compact */
@media (max-width: 860px) {
  .top-nav { gap: 10px; }
  .top-nav .top-link { display: none; }
  .top-nav .contact { display: none; }
  .top-divider { display: none; }
  .status-pill { font-size: 11px; padding: 4px 9px; }
  .pill-full { display: none; }
  .pill-short { display: inline; }
}

/* Mobile */
@media (max-width: 640px) {
  .page { padding-left: 16px; padding-right: 16px; padding-bottom: 60px; }
  .topbar-inner { padding: 0 16px; height: 52px; }

  /* Nav: just logo + compact status pill */
  .top-nav { gap: 8px; }
  .status-pill { font-size: 11px; padding: 4px 9px; white-space: nowrap; }

  /* Hero */
  .hero { padding: 40px 0 24px; }
  .hero-eyebrow { flex-direction: column; align-items: flex-start; gap: 6px; }
  .kicker-sep { display: none; }
  .hero-title { font-size: clamp(36px, 11vw, 52px); margin-bottom: 18px; }
  .hero-lede { font-size: 15px; }

  /* Stats strip */
  .stats { padding: 20px 16px; }
  .stats-row { gap: 16px 24px; }
  .stat-value { font-size: 28px; }
  .stat-unit { font-size: 16px; }
  .stat-spacer { display: none; }
  .price-chip { min-width: unset; flex: 1; }

  /* Cards */
  .card { padding: 16px; }
  .card-title { font-size: 20px; }
  .price-num { font-size: 30px; }
  .specs { grid-template-columns: 1fr; }
  .spec-row:nth-child(odd) { padding-right: 0; border-right: 0; }
  .spec-row:nth-child(even) { padding-left: 0; }
  .spec-row { border-bottom: 1px dashed var(--border) !important; }

  /* Toolbar */
  .grid-toolbar { flex-direction: column; align-items: flex-start; gap: 10px; }
  .seg button { padding: 5px 9px; font-size: 11.5px; }

  /* Modal */
  .modal-scrim { padding: 16px; align-items: flex-end; }
  .modal { padding: 24px 20px 20px; border-radius: 16px 16px 0 0; }
  .modal-title { font-size: 24px; }
  .form-row { grid-template-columns: 1fr; }

  /* Footer */
  .foot-grid { grid-template-columns: 1fr; gap: 24px; }
  .foot-base { flex-direction: column; gap: 4px; }
}
