// playerTemplate.js
// Extracted verbatim (pure-function) from chrome-extension/review.js so it can be
// reused outside the extension by Node-based importer/generator scripts.
// Keep this file in sync with review.js's playerTemplate()/escapeHtml()/DEFAULT_PALETTE
// any time the player markup/behavior changes in the extension.

const DEFAULT_PALETTE = {
  primary1: '#6366f1', primary2: '#1A1348', primary3: '#4f46e5',
  secondary1: '#FFFFFF', secondary2: '#818cf8', secondary3: '#374151'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function playerTemplate(opts) {
  const { title, intro, persistentCta, finalCta, palette, bgMode, tooltipStyle, startIndex, steps, useStepImageForIntro } = opts;
  const isDark = bgMode === 'dark';

  // Tooltip style maps
  let ttBg, ttColor, ttBodyColor;
  if (tooltipStyle === 'colored') {
    ttBg = palette.primary1;
    ttColor = palette.secondary1;
    ttBodyColor = `${palette.secondary1}E6`;
  } else if (tooltipStyle === 'dark') {
    ttBg = '#0f172a'; ttColor = '#fff'; ttBodyColor = 'rgba(255,255,255,0.85)';
  } else {
    ttBg = '#fff'; ttColor = '#0f172a'; ttBodyColor = '#475569';
  }

  // Persistent CTA HTML
  let persistentCtaHtml = '';
  if (persistentCta && persistentCta.enabled && persistentCta.url) {
    const target = persistentCta.openInNewWindow ? 'target="_blank" rel="noopener"' : '';
    persistentCtaHtml = `<a class="persistent-cta ${persistentCta.alignment}" href="${escapeHtml(persistentCta.url)}" ${target} style="background:${persistentCta.bgColor};color:${persistentCta.textColor};">${persistentCta.emoji ? `<span>${escapeHtml(persistentCta.emoji)}</span>` : ''}<span>${escapeHtml(persistentCta.text)}</span></a>`;
  }

  // Final-screen CTA HTML
  const finalCtaHtml = (finalCta && finalCta.enabled && finalCta.url) ? `
    <a class="cta-btn primary" href="${escapeHtml(finalCta.url)}" target="_blank" rel="noopener" style="background:${palette.primary3};color:${palette.secondary1};">${escapeHtml(finalCta.text || 'Get Started')}</a>
    ${finalCta.secondaryUrl ? `<a class="cta-btn secondary" href="${escapeHtml(finalCta.secondaryUrl)}" target="_blank" rel="noopener">${escapeHtml(finalCta.secondaryText || 'Learn More')}</a>` : ''}
  ` : `<button class="cta-btn primary" onclick="restart()" style="background:${palette.primary3};color:${palette.secondary1};">Restart</button>`;

  // Intro slide HTML
  let introHtml = '';
  if (intro && intro.enabled) {
    const introBg = intro.customBackgroundImage || useStepImageForIntro || (steps[0] && steps[0].image) || '';
    introHtml = `
      <div class="intro-slide" id="intro-slide" style="background-image:url('${introBg}');">
        <div class="intro-overlay">
          <h1 class="intro-title">${escapeHtml(intro.title || title)}</h1>
          ${intro.subtitle ? `<p class="intro-subtitle">${escapeHtml(intro.subtitle)}</p>` : ''}
          <button class="intro-button" onclick="startDemo()" style="background:${palette.primary3};color:${palette.secondary1};">${escapeHtml(intro.buttonText || 'Start Demo')}</button>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  :root {
    --primary1: ${palette.primary1};
    --primary2: ${palette.primary2};
    --primary3: ${palette.primary3};
    --secondary1: ${palette.secondary1};
    --secondary2: ${palette.secondary2};
    --secondary3: ${palette.secondary3};
    --bg: ${isDark ? '#0a0e1a' : '#f8fafc'};
    --panel: ${isDark ? '#111827' : '#ffffff'};
    --text: ${isDark ? '#f9fafb' : '#0f172a'};
    --text-2: ${isDark ? '#9ca3af' : '#64748b'};
    --border: ${isDark ? '#1f2937' : '#e2e8f0'};
    --tt-bg: ${ttBg};
    --tt-color: ${ttColor};
    --tt-body-color: ${ttBodyColor};
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  .progress { height: 3px; background: var(--border); }
  .progress-bar { height: 100%; background: var(--primary1); width: 0%; transition: width 0.4s ease; }
  .stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: hidden; position: relative; }
  .frame { position: relative; max-width: 100%; max-height: 100%; border-radius: 10px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,${isDark ? '0.5' : '0.15'}); background: ${isDark ? '#000' : '#fff'}; }
  .zoom-content { position: relative; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: 0 0; }
  .frame img { display: block; max-width: 100%; max-height: calc(100vh - 100px); width: auto; height: auto; }
  .ann-host { position: absolute; inset: 0; pointer-events: none; }
  .ann-rect, .ann-text, .ann-blur, .ann-arrow, .ann-spotlight { position: absolute; }
  .ann-arrow { pointer-events: none; }
  .ann-arrow svg { width: 100%; height: 100%; overflow: visible; }
  .ann-blur { background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  .ann-spotlight { background: transparent; pointer-events: auto; }
  .ann-text { display: flex; align-items: center; word-wrap: break-word; white-space: pre-wrap; }
  .ann-text-inner { width: 100%; }
  .hotspot { position: absolute; width: 26px; height: 26px; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; }
  /* Single thin ring that pulses outward (transient animation) — not a second
     permanently-visible circle. */
  .hotspot::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: transparent; border: 2px solid var(--primary1); opacity: 0.85; animation: pulse 1.4s linear infinite; }
  /* The actual click marker: one solid gradient-filled dot, no white border/box-shadow ring. */
  .hotspot::after { content: ''; position: absolute; inset: 0; background: linear-gradient(var(--primary1), var(--primary1-dark, var(--primary1))); border-radius: 50%; box-shadow: inset 0 0.5px 0 0.5px rgba(255,255,255,0.3); }
  @keyframes pulse { 0% { transform: scale(1); opacity: 0.85; } 100% { transform: scale(2); opacity: 0; } }
  .tooltip { position: absolute; background: var(--tt-bg); color: var(--tt-color); padding: 20px; border-radius: 16px; box-shadow: inset 0 0 0 1px var(--tt-bg), 0 2px 6px rgba(40,40,40,0.08), 0 2px 4px rgba(40,40,40,0.06); width: 300px; max-width: 600px; z-index: 9; animation: ttIn 0.3s ease-out; }
  @keyframes ttIn { from { opacity: 0; } to { opacity: 1; } }
  .tooltip-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; line-height: 1.3; color: var(--tt-color); }
  .tooltip-body { font-size: 13px; color: var(--tt-body-color); line-height: 1.5; white-space: pre-wrap; }
  .controls { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: var(--panel); border-top: 1px solid var(--border); }
  .step-counter { font-size: 12px; color: var(--text-2); font-weight: 500; }
  .ctrl-btns { display: flex; gap: 8px; }
  .ctrl-btn { padding: 8px 16px; background: transparent; color: var(--text); border: 1px solid var(--border); border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .ctrl-btn:hover { background: var(--border); }
  .ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .ctrl-btn.primary { background: var(--primary1); color: #fff; border-color: var(--primary1); }
  .ctrl-btn.primary:hover { filter: brightness(1.1); }
  .complete-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.85); color: #fff; display: none; align-items: center; justify-content: center; flex-direction: column; z-index: 100; text-align: center; padding: 40px; }
  .complete-overlay.visible { display: flex; }
  .complete-overlay h2 { font-size: 28px; margin-bottom: 12px; }
  .complete-overlay p { font-size: 15px; opacity: 0.8; margin-bottom: 24px; max-width: 420px; }
  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .cta-btn { padding: 12px 24px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; border: none; text-decoration: none; display: inline-block; font-family: inherit; transition: all 0.15s; }
  .cta-btn:hover { filter: brightness(1.1); }
  .cta-btn.secondary { background: transparent !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.3); }
  .cta-btn.secondary:hover { background: rgba(255,255,255,0.1) !important; }
  .persistent-cta { position: absolute; z-index: 20; display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; font-weight: 600; font-size: 13px; cursor: pointer; text-decoration: none; font-family: inherit; box-shadow: 0 8px 24px rgba(0,0,0,0.3); transition: transform 0.1s, filter 0.15s; border: none; }
  .persistent-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .persistent-cta.bottom-right { bottom: 80px; right: 20px; }
  .persistent-cta.bottom-left { bottom: 80px; left: 20px; }
  .persistent-cta.top-right { top: 20px; right: 20px; }
  .persistent-cta.top-left { top: 20px; left: 20px; }

  /* Intro slide */
  .intro-slide { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 50; display: flex; align-items: center; justify-content: center; }
  .intro-slide.hidden { display: none; }
  .intro-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
  .intro-title { font-size: 44px; font-weight: 700; color: #fff; margin-bottom: 16px; max-width: 80%; line-height: 1.15; }
  .intro-subtitle { font-size: 17px; color: rgba(255,255,255,0.9); margin-bottom: 36px; max-width: 60%; line-height: 1.5; }
  .intro-button { padding: 16px 36px; border: none; border-radius: 10px; font-weight: 600; font-size: 16px; cursor: pointer; font-family: inherit; box-shadow: 0 12px 32px rgba(0,0,0,0.4); transition: all 0.15s; }
  .intro-button:hover { filter: brightness(1.1); transform: translateY(-1px); }

  @media (max-width: 768px) {
    .stage { padding: 10px; }
    .tooltip { max-width: 240px; padding: 10px 12px; }
    .tooltip-title { font-size: 13px; }
    .tooltip-body { font-size: 12px; }
    .controls { padding: 10px 14px; }
    .ctrl-btn { padding: 6px 12px; font-size: 12px; }
    .intro-title { font-size: 28px; }
    .intro-subtitle { font-size: 14px; max-width: 80%; }
    .persistent-cta { padding: 8px 12px; font-size: 12px; }
    .persistent-cta.bottom-right, .persistent-cta.bottom-left { bottom: 70px; }
  }
</style>
</head>
<body>
  <div class="progress"><div class="progress-bar" id="progress-bar"></div></div>
  <div class="stage" id="stage">
    <div class="frame" id="frame">
      <div class="zoom-content" id="zoom-content">
        <img id="step-image" alt="" />
        <div class="ann-host" id="ann-host"></div>
        <div class="hotspot" id="hotspot"></div>
        <div class="tooltip" id="tooltip">
          <div class="tooltip-title" id="tt-title"></div>
          <div class="tooltip-body" id="tt-body"></div>
        </div>
      </div>
      ${persistentCtaHtml}
    </div>
    ${introHtml}
    <div class="complete-overlay" id="complete-overlay">
      <h2>Walkthrough complete</h2>
      <p>Thanks for taking the tour.</p>
      <div class="cta-row">${finalCtaHtml}</div>
    </div>
  </div>
  <div class="controls">
    <span class="step-counter" id="counter">1 / 1</span>
    <div class="ctrl-btns">
      <button class="ctrl-btn" id="prev-btn">Back</button>
      <button class="ctrl-btn primary" id="next-btn">Next →</button>
    </div>
  </div>

<script>
const STEPS = ${JSON.stringify(steps)};
const HAS_INTRO = ${intro && intro.enabled ? 'true' : 'false'};
let idx = ${typeof startIndex === 'number' ? startIndex : (intro && intro.enabled ? -1 : 0)};

const img = document.getElementById('step-image');
const hotspot = document.getElementById('hotspot');
const tooltip = document.getElementById('tooltip');
const ttTitle = document.getElementById('tt-title');
const ttBody = document.getElementById('tt-body');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const completeOverlay = document.getElementById('complete-overlay');
const annHost = document.getElementById('ann-host');
const introSlide = document.getElementById('intro-slide');
const zoomContent = document.getElementById('zoom-content');

// Compute effective zoom for each step. A step either draws its own zoom
// region (starts/changes the zoom from here on), explicitly marks zoomReset
// (zooms back out from here on), or has neither (in which case it silently
// inherits whatever zoom was active on the previous step) — this is what
// produces a real "zoom in, hold across a few steps, then zoom back out"
// sequence on playback.
function computeEffectiveZooms() {
  const result = [];
  let active = null;
  for (const s of STEPS) {
    if (s.zoom) {
      active = s.zoom;
    } else if (s.zoomReset) {
      active = null;
    }
    // else: no own zoom state on this step — inherit "active" unchanged
    result.push(active);
  }
  return result;
}
const EFFECTIVE_ZOOMS = computeEffectiveZooms();

function applyZoomForStep(stepIdx) {
  const z = EFFECTIVE_ZOOMS[stepIdx];
  if (!z || !zoomContent) {
    if (zoomContent) {
      // Origin stays fixed at 0 0 (set once below) — only 'transform' itself
      // is ever transitioned, matching Storylane's single-matrix zoom so the
      // browser interpolates one smooth affine transform instead of jumping
      // transform-origin mid-animation.
      zoomContent.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    return;
  }
  // Calculate scale to fit the zoom region into the frame
  // z is { x, y, w, h } in percent of the original image
  const scaleX = 100 / z.w;
  const scaleY = 100 / z.h;
  const scale = Math.min(scaleX, scaleY);
  // Center of the zoom region, in percent of the unscaled content box.
  const ox = z.x + z.w / 2;
  const oy = z.y + z.h / 2;
  // With transform-origin fixed at 0 0, scaling about the top-left then
  // translating by (tx, ty) recreates "scale about the region's center" —
  // the exact technique Storylane uses on its own zoomed screenshot layer.
  const cw = zoomContent.clientWidth || 0;
  const ch = zoomContent.clientHeight || 0;
  const tx = cw * (0.5 - (ox / 100) * scale);
  const ty = ch * (0.5 - (oy / 100) * scale);
  zoomContent.style.transform = 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + tx + ', ' + ty + ')';
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function startDemo() {
  if (introSlide) introSlide.classList.add('hidden');
  idx = 0;
  render();
}

function render() {
  if (idx === -1) {
    // Show intro slide; nothing else to render
    if (introSlide) introSlide.classList.remove('hidden');
    progressBar.style.width = '0%';
    counter.textContent = 'Intro';
    prevBtn.style.opacity = '0.4'; prevBtn.disabled = true;
    nextBtn.textContent = 'Start →';
    return;
  }
  if (introSlide) introSlide.classList.add('hidden');

  if (idx >= STEPS.length) {
    completeOverlay.classList.add('visible');
    notifyParent('complete');
    return;
  }
  completeOverlay.classList.remove('visible');
  const s = STEPS[idx];
  img.src = s.image;
  ttTitle.textContent = s.title || '';
  ttBody.textContent = s.body || '';
  counter.textContent = (idx + 1) + ' / ' + STEPS.length;
  progressBar.style.width = ((idx + 1) / STEPS.length * 100) + '%';
  hotspot.style.left = s.clickX + '%';
  hotspot.style.top = s.clickY + '%';
  positionTooltip(s);
  renderAnnotations(s);
  applyZoomForStep(idx);
  prevBtn.disabled = idx === 0;
  prevBtn.style.opacity = idx === 0 ? '0.4' : '1';
  nextBtn.textContent = (idx === STEPS.length - 1) ? 'Finish' : 'Next →';
  notifyParent('step', { index: idx, total: STEPS.length });
}

function positionTooltip(s) {
  tooltip.style.left = ''; tooltip.style.top = ''; tooltip.style.right = ''; tooltip.style.bottom = '';
  tooltip.style.transform = '';
  // Apply stored tooltip width or default
  tooltip.style.width = s.tooltipWidth ? (s.tooltipWidth + 'px') : '280px';
  tooltip.style.maxWidth = '600px';
  const tp = s.position;
  if (tp && typeof tp === 'object' && tp.x !== undefined) {
    tooltip.style.left = tp.x + '%';
    tooltip.style.top = tp.y + '%';
    return;
  }
  const offset = 28;
  switch (tp || 'bottom') {
    case 'top': tooltip.style.left = s.clickX + '%'; tooltip.style.top = 'calc(' + s.clickY + '% - ' + offset + 'px)'; tooltip.style.transform = 'translate(-50%, -100%)'; break;
    case 'bottom': tooltip.style.left = s.clickX + '%'; tooltip.style.top = 'calc(' + s.clickY + '% + ' + offset + 'px)'; tooltip.style.transform = 'translateX(-50%)'; break;
    case 'left': tooltip.style.left = 'calc(' + s.clickX + '% - ' + offset + 'px)'; tooltip.style.top = s.clickY + '%'; tooltip.style.transform = 'translate(-100%, -50%)'; break;
    case 'right': tooltip.style.left = 'calc(' + s.clickX + '% + ' + offset + 'px)'; tooltip.style.top = s.clickY + '%'; tooltip.style.transform = 'translateY(-50%)'; break;
  }
}

function renderAnnotations(s) {
  annHost.innerHTML = '';
  (s.annotations || []).forEach(ann => {
    const el = document.createElement('div');
    if (ann.type === 'arrow') {
      el.className = 'ann-arrow';
      const minX = Math.min(ann.x1, ann.x2);
      const maxX = Math.max(ann.x1, ann.x2);
      const minY = Math.min(ann.y1, ann.y2);
      const maxY = Math.max(ann.y1, ann.y2);
      const padPct = 1.5;
      const left = minX - padPct;
      const top = minY - padPct;
      const w = (maxX - minX) + padPct * 2;
      const h = (maxY - minY) + padPct * 2;
      el.style.left = left + '%'; el.style.top = top + '%';
      el.style.width = w + '%'; el.style.height = h + '%';
      const svgX1 = ((ann.x1 - left) / w) * 100;
      const svgY1 = ((ann.y1 - top) / h) * 100;
      const svgX2 = ((ann.x2 - left) / w) * 100;
      const svgY2 = ((ann.y2 - top) / h) * 100;
      const stroke = (ann.style && ann.style.stroke) || '#ef4444';
      const sw = (ann.style && ann.style.strokeWidth) || 3;
      el.innerHTML = '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="arr-' + ann.id + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth"><polygon points="0 0, 6 3, 0 6" fill="' + stroke + '" /></marker></defs><line x1="' + svgX1 + '" y1="' + svgY1 + '" x2="' + svgX2 + '" y2="' + svgY2 + '" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linecap="round" vector-effect="non-scaling-stroke" marker-end="url(#arr-' + ann.id + ')" /></svg>';
    } else if (ann.type === 'rect') {
      el.className = 'ann-rect';
      el.style.left = ann.x + '%'; el.style.top = ann.y + '%';
      el.style.width = ann.w + '%'; el.style.height = ann.h + '%';
      const st = ann.style || {};
      el.style.border = (st.strokeWidth || 3) + 'px solid ' + (st.stroke || '#ef4444');
      el.style.borderRadius = (st.radius || 0) + 'px';
      if (st.fill && st.fill !== 'transparent') el.style.background = hexToRgba(st.fill, st.fillOpacity != null ? st.fillOpacity : 0.2);
    } else if (ann.type === 'text') {
      el.className = 'ann-text';
      el.style.left = ann.x + '%'; el.style.top = ann.y + '%';
      el.style.width = ann.w + '%'; el.style.height = ann.h + '%';
      const st = ann.style || {};
      el.style.color = st.color || '#0f172a';
      el.style.fontSize = (st.fontSize || 16) + 'px';
      el.style.fontWeight = st.fontWeight || '600';
      el.style.textAlign = st.align || 'center';
      el.style.padding = (st.padding || 8) + 'px';
      el.style.borderRadius = (st.radius || 6) + 'px';
      if (st.bgColor && (st.bgOpacity == null || st.bgOpacity > 0)) el.style.background = hexToRgba(st.bgColor, st.bgOpacity != null ? st.bgOpacity : 1);
      if (st.borderWidth > 0) el.style.border = st.borderWidth + 'px solid ' + (st.borderColor || '#ef4444');
      const inner = document.createElement('div');
      inner.className = 'ann-text-inner';
      inner.textContent = ann.text || '';
      el.appendChild(inner);
    } else if (ann.type === 'blur') {
      el.className = 'ann-blur';
      el.style.left = ann.x + '%'; el.style.top = ann.y + '%';
      el.style.width = ann.w + '%'; el.style.height = ann.h + '%';
      const st = ann.style || {};
      el.style.background = 'rgba(15, 23, 42, ' + (st.opacity != null ? st.opacity : 0.92) + ')';
    } else if (ann.type === 'spotlight') {
      el.className = 'ann-spotlight';
      el.style.left = ann.x + '%'; el.style.top = ann.y + '%';
      el.style.width = ann.w + '%'; el.style.height = ann.h + '%';
      const st = ann.style || {};
      el.style.borderColor = st.borderColor || '#FFFFFF';
      el.style.borderWidth = (st.borderWidth || 2) + 'px';
      el.style.borderStyle = 'solid';
      el.style.borderRadius = (st.radius || 4) + 'px';
      el.style.boxShadow = '0 0 0 9999px rgba(15, 23, 42, ' + (st.opacity != null ? st.opacity : 0.85) + ')';
    }
    annHost.appendChild(el);
  });
}

function next() {
  if (idx === -1) { idx = 0; }
  else { idx++; }
  render();
}
function prev() {
  if (idx > 0) { idx--; render(); }
  else if (idx === 0 && HAS_INTRO) { idx = -1; render(); }
}
function restart() { idx = HAS_INTRO ? -1 : 0; render(); }

function notifyParent(type, data) {
  try {
    if (window.parent !== window) {
      window.parent.postMessage(Object.assign({ source: 'walkthrough', type: type }, data), '*');
    }
  } catch (e) {}
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
hotspot.addEventListener('click', next);
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === 'Enter') next();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'Escape') restart();
});

render();
</script>
</body>
</html>`;
}

module.exports = { playerTemplate, DEFAULT_PALETTE, escapeHtml };
