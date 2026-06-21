// build_godaddy_buy_domain.js
// One-off driver for guide https://app.storylane.io/share/0z4gn80tlaib
// ("GODADDY Buy a Domain"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.
//
// This guide has no video_clip / typing-animation widgets -- it's a plain
// popup -> hotspot x5 -> popup flow.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  'a4c4ba54-67b4-4f6f-ae93-f2a94e28ad76': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_53040781-d66e-4682-8fc7-14ae9fefbd6c/page/3hr011za4bcznz6jprrxy7xad0b5.png',
  '9b57c49e-a90f-46ff-b734-530773c2ae39': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_53040781-d66e-4682-8fc7-14ae9fefbd6c/page/94lj62q31es1gkdwkb0c77qhnxzd.png',
  'b3ef0780-43e7-4fea-82c6-deffc792120f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_53040781-d66e-4682-8fc7-14ae9fefbd6c/page/9de794p48u8zp2uo24s75b7txflh.png',
  '4027a940-d271-4383-b763-faaea3946c91': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_53040781-d66e-4682-8fc7-14ae9fefbd6c/page/8q71i54302e680cbhwt71aokk5ld.png',
  '1cfc3810-7347-4213-b33a-530c8cb36150': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_53040781-d66e-4682-8fc7-14ae9fefbd6c/page/1ft2yo5j8qndp5feogowa2nqyjr5.png'
};

const WIDGETS = [
  { kind: 'hotspot', page_id: 'a4c4ba54-67b4-4f6f-ae93-f2a94e28ad76', desc: 'Type your desired domain into the search field', cta_pos: 'right', ox: 37.15966448931116, oy: 23.397406799105337, zoom: null },
  { kind: 'hotspot', page_id: '9b57c49e-a90f-46ff-b734-530773c2ae39', desc: 'Click the search button to continue.', cta_pos: 'right', ox: 65.9375, oy: 23.271130625686062, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'b3ef0780-43e7-4fea-82c6-deffc792120f', desc: 'Scroll to view your available options and press the cart button to add to your cart.', cta_pos: 'right', ox: 74.20798693586698, oy: 44.09720789349884, zoom: null },
  { kind: 'hotspot', page_id: '4027a940-d271-4383-b763-faaea3946c91', desc: 'Click "Looks Good, Keep Going" to confirm your selection.', cta_pos: 'right', ox: 74.375, oy: 95.06037321624589, zoom: 1.2 },
  { kind: 'hotspot', page_id: '1cfc3810-7347-4213-b33a-530c8cb36150', desc: 'Click "Continue to cart" to proceed with your demo.', cta_pos: 'right', ox: 65.15241488519399, oy: 55.70072271788142, zoom: null }
];

const CLOSING_MESSAGE = 'Once complete, you will be able to view the domain from "My Products" section on your dashboard.';

function zoomScalarToRegion(ox, oy, scalar) {
  const w = 100 / scalar;
  const h = 100 / scalar;
  let x = ox - w / 2;
  let y = oy - h / 2;
  x = Math.max(0, Math.min(100 - w, x));
  y = Math.max(0, Math.min(100 - h, y));
  return { x, y, w, h };
}

const steps = WIDGETS.map(w => ({
  image: PAGE_URLS[w.page_id],
  clickX: w.ox,
  clickY: w.oy,
  title: '',
  body: w.desc,
  position: w.cta_pos || 'right',
  tooltipWidth: null,
  zoom: w.zoom ? zoomScalarToRegion(w.ox, w.oy, w.zoom) : null,
  zoomReset: false,
  annotations: []
}));

// Step 4 ("Looks Good, Keep Going", oy ~95%) sits at the very bottom of the
// frame -- same overflow risk seen on prior guides' bottom-anchored hotspots.
// Position its tooltip above the hotspot to avoid clipping.
if (steps.length >= 4) {
  steps[3].position = 'top';
}

// Split the click instruction (title) from the closing message (body) on the
// final step, and position the tooltip above the hotspot for extra headroom.
if (steps.length) {
  const last = steps[steps.length - 1];
  last.title = last.body;
  last.body = CLOSING_MESSAGE;
  last.position = 'top';
  last.tooltipWidth = 340;
}

const html = playerTemplate({
  title: 'GODADDY Buy a Domain',
  intro: {
    enabled: true,
    title: 'Buy Your Domain on GoDaddy',
    subtitle: 'Learn how to buy your first domain on GoDaddy.',
    buttonText: 'Start Demo',
    customBackgroundImage: null
  },
  persistentCta: { enabled: false },
  finalCta: { enabled: false, text: 'Get Started', url: '' },
  palette: DEFAULT_PALETTE,
  bgMode: 'light',
  tooltipStyle: 'default',
  startIndex: -1,
  steps,
  useStepImageForIntro: steps[0] && steps[0].image
});

const outDir = path.join(__dirname, 'godaddy-buy-domain-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
