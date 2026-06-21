// background.js v2.2

const DEFAULT_PALETTE = {
  primary1: '#6366f1',   // tooltip bg, hotspot, progress bar
  primary2: '#1A1348',   // persistent CTA bg
  primary3: '#4f46e5',   // intro slide button bg
  secondary1: '#FFFFFF', // tooltip text
  secondary2: '#818cf8', // hover/highlight
  secondary3: '#374151'  // frame border accent
};

const DEFAULT_PERSISTENT_CTA = {
  enabled: false,
  emoji: '👉',
  text: 'Talk to Sales',
  alignment: 'bottom-right',
  bgColor: '#1A1348',
  textColor: '#FFFFFF',
  url: '',
  openInNewWindow: true
};

const DEFAULT_FINAL_CTA = {
  enabled: false,
  text: 'Get Started',
  url: '',
  secondaryText: '',
  secondaryUrl: ''
};

const DEFAULT_INTRO = {
  enabled: true,
  title: '', // falls back to project name if empty
  subtitle: '',
  buttonText: 'Start Demo',
  customBackgroundImage: null // base64 override; null = auto-generate from step 1
};

const DEFAULT_STATE = {
  recording: false,
  steps: [],
  startTabId: null,
  startUrl: null,
  projectName: 'Untitled Walkthrough',
  intro: { ...DEFAULT_INTRO },
  cta: { ...DEFAULT_FINAL_CTA },
  persistentCta: { ...DEFAULT_PERSISTENT_CTA },
  activePreset: null
};

const STATE = { ...DEFAULT_STATE };
let BRAND_PRESETS = {};

chrome.storage.local.get(['recordingState', 'brandPresets'], (data) => {
  if (data.recordingState) {
    Object.assign(STATE, { ...DEFAULT_STATE, ...data.recordingState });
    // Migrate any old fields if needed
    if (!STATE.intro) STATE.intro = { ...DEFAULT_INTRO };
    if (!STATE.persistentCta) STATE.persistentCta = { ...DEFAULT_PERSISTENT_CTA };
  }
  if (data.brandPresets) {
    BRAND_PRESETS = migratePresets(data.brandPresets);
  }
});

// Migrate v2/v2.1 presets (had primaryColor + bgMode) to v2.2 palette structure
function migratePresets(presets) {
  const migrated = {};
  for (const [name, p] of Object.entries(presets)) {
    if (p.palette) {
      migrated[name] = p; // already v2.2
    } else {
      const primary = p.primaryColor || '#6366f1';
      migrated[name] = {
        bgMode: p.bgMode || 'light',
        palette: {
          ...DEFAULT_PALETTE,
          primary1: primary,
          primary3: primary
        },
        tooltipStyle: 'colored'
      };
    }
  }
  return migrated;
}

function persistState() { chrome.storage.local.set({ recordingState: STATE }); }
function persistPresets() { chrome.storage.local.set({ brandPresets: BRAND_PRESETS }); }

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case 'GET_STATE':
          sendResponse({
            recording: STATE.recording,
            stepCount: STATE.steps.length,
            projectName: STATE.projectName
          });
          break;

        case 'START_RECORDING':
          STATE.recording = true;
          STATE.steps = [];
          STATE.projectName = msg.projectName || 'Untitled Walkthrough';
          STATE.cta = { ...DEFAULT_FINAL_CTA };
          STATE.persistentCta = { ...DEFAULT_PERSISTENT_CTA };
          STATE.intro = { ...DEFAULT_INTRO };
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          STATE.startTabId = activeTab?.id;
          STATE.startUrl = activeTab?.url;
          persistState();
          if (activeTab?.id) {
            try { await chrome.tabs.sendMessage(activeTab.id, { type: 'RECORDING_STARTED' }); } catch (e) {}
          }
          sendResponse({ ok: true });
          break;

        case 'STOP_RECORDING':
          STATE.recording = false;
          persistState();
          const allTabs = await chrome.tabs.query({});
          for (const t of allTabs) {
            try { await chrome.tabs.sendMessage(t.id, { type: 'RECORDING_STOPPED' }); } catch (e) {}
          }
          if (STATE.steps.length > 0) {
            await chrome.tabs.create({ url: chrome.runtime.getURL('review.html') });
          }
          sendResponse({ ok: true, stepCount: STATE.steps.length });
          break;

        case 'CAPTURE_CLICK':
          if (!STATE.recording) {
            sendResponse({ ok: false, reason: 'not recording' });
            return;
          }
          try {
            const tab = sender.tab;
            const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
            const { clientX, clientY, viewportW, viewportH } = msg;
            const clickX = viewportW > 0 ? Math.max(0, Math.min(100, (clientX / viewportW) * 100)) : 50;
            const clickY = viewportH > 0 ? Math.max(0, Math.min(100, (clientY / viewportH) * 100)) : 50;
            const step = makeStep({
              imageDataUrl: dataUrl,
              clickX, clickY,
              targetText: msg.targetText || '',
              targetSelector: msg.targetSelector || '',
              pageUrl: tab.url, pageTitle: tab.title
            });
            STATE.steps.push(step);
            persistState();
            sendResponse({ ok: true, stepNumber: STATE.steps.length });
          } catch (err) {
            console.error('Capture failed:', err);
            sendResponse({ ok: false, reason: err.message });
          }
          break;

        case 'GET_STEPS':
          sendResponse({
            steps: STATE.steps,
            projectName: STATE.projectName,
            intro: STATE.intro,
            cta: STATE.cta,
            persistentCta: STATE.persistentCta,
            activePreset: STATE.activePreset
          });
          break;

        case 'UPDATE_STEPS':
          if (msg.steps !== undefined) STATE.steps = msg.steps;
          if (msg.projectName !== undefined) STATE.projectName = msg.projectName;
          if (msg.intro) STATE.intro = msg.intro;
          if (msg.cta) STATE.cta = msg.cta;
          if (msg.persistentCta) STATE.persistentCta = msg.persistentCta;
          if (msg.activePreset !== undefined) STATE.activePreset = msg.activePreset;
          persistState();
          sendResponse({ ok: true });
          break;

        case 'CLEAR_PROJECT':
          Object.assign(STATE, DEFAULT_STATE);
          persistState();
          sendResponse({ ok: true });
          break;

        case 'OPEN_REVIEW':
          await chrome.tabs.create({ url: chrome.runtime.getURL('review.html') });
          sendResponse({ ok: true });
          break;

        case 'GET_PRESETS':
          sendResponse({ presets: BRAND_PRESETS });
          break;

        case 'SAVE_PRESET':
          BRAND_PRESETS[msg.name] = msg.preset;
          persistPresets();
          sendResponse({ ok: true });
          break;

        case 'DELETE_PRESET':
          delete BRAND_PRESETS[msg.name];
          persistPresets();
          sendResponse({ ok: true });
          break;
      }
    } catch (err) {
      console.error('Message handler error:', err);
      sendResponse({ ok: false, error: err.message });
    }
  })();
  return true;
});

function makeStep(partial) {
  return {
    id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    imageDataUrl: partial.imageDataUrl,
    clickX: partial.clickX ?? 50,
    clickY: partial.clickY ?? 50,
    targetText: partial.targetText || '',
    targetSelector: partial.targetSelector || '',
    pageUrl: partial.pageUrl || '',
    pageTitle: partial.pageTitle || '',
    timestamp: Date.now(),
    tooltipTitle: '',
    tooltipBody: '',
    tooltipPosition: 'bottom',
    annotations: []
  };
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (STATE.recording && changeInfo.status === 'complete') {
    try { await chrome.tabs.sendMessage(tabId, { type: 'RECORDING_STARTED' }); } catch (e) {}
  }
});
