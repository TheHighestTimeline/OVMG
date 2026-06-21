// build_squarespace_buy_domain.js
// One-off driver for guide https://app.storylane.io/share/tprxda3skozo
// ("SQUARESPACE Buy a Domain"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.
//
// This guide has no video_clip / typing-animation widgets -- it's a plain
// popup -> hotspot x5 -> popup flow.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  '9c9fbeb1-b5a3-4379-a571-c9f5e1464ebd': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_e63b26a6-e868-4dfe-b8fc-37b31d8bfca1/page/tvm9j8smmgvqpr2br6hgwc3xxpiu.png',
  '5ce9db8d-9d2c-458a-b714-0da18cd94fcf': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_e63b26a6-e868-4dfe-b8fc-37b31d8bfca1/page/bbbhay8e89cyoptu32ayf5o40szy.png',
  '718bb8f3-9634-4c48-869e-734f76071ef8': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_e63b26a6-e868-4dfe-b8fc-37b31d8bfca1/page/pgcm0nxvnagr0limfdyqvugjy9fv.png',
  'bf43d797-45c7-444f-a763-3e96364337ee': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_e63b26a6-e868-4dfe-b8fc-37b31d8bfca1/page/tnh6gsqs26k5j51jlr4tu9pmr63n.png',
  '70747675-d24b-4768-980c-7c03b6476554': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_e63b26a6-e868-4dfe-b8fc-37b31d8bfca1/page/xgfs4mf416ebrixs0goks90tqvi0.png'
};

const WIDGETS = [
  { kind: 'hotspot', page_id: '9c9fbeb1-b5a3-4379-a571-c9f5e1464ebd', desc: 'Type your desired domain in the search bar (include suffix i.e. com/us/io)', cta_pos: 'right', ox: 11.125668052256533, oy: 59.19780240942642, zoom: null },
  { kind: 'hotspot', page_id: '5ce9db8d-9d2c-458a-b714-0da18cd94fcf', desc: 'Click this button to search', cta_pos: 'right', ox: 39.521971496437054, oy: 59.85449353350446, zoom: 1.2 },
  { kind: 'hotspot', page_id: '718bb8f3-9634-4c48-869e-734f76071ef8', desc: 'Choose your desired domain name and add it to your cart.', cta_pos: 'right', ox: 67.19108768804435, oy: 49.74112008891604, zoom: null },
  { kind: 'hotspot', page_id: 'bf43d797-45c7-444f-a763-3e96364337ee', desc: 'Click on "Checkout" to manage payment options', cta_pos: 'right', ox: 64.87999802058592, oy: 90.02652074753294, zoom: 1.2 },
  { kind: 'hotspot', page_id: '70747675-d24b-4768-980c-7c03b6476554', desc: 'You will be required to create an account.', cta_pos: 'right', ox: 41.911371733966746, oy: 50.556000319129325, zoom: null }
];

const CLOSING_MESSAGE = 'Once your account is created, it will take you back to checkout. Make sure WHOIS Privacy is enabled. Turn Auto-renew ON. Then, you can view your domain in the "Domains" section.';

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

// Split the click instruction (title) from the longer closing message (body)
// on the final step, and position the tooltip above the hotspot since the
// last button (oy ~90.5%) sits near the bottom of the frame -- avoids
// tooltip overflow/clipping against the frame's overflow:hidden bounds.
if (steps.length) {
  const last = steps[steps.length - 1];
  last.title = last.body;
  last.body = CLOSING_MESSAGE;
  last.position = 'top';
  last.tooltipWidth = 340;
}

const html = playerTemplate({
  title: 'SQUARESPACE Buy a Domain',
  intro: {
    enabled: true,
    title: 'How to buy your domain on SQUARESPACE',
    subtitle: 'Learn how to buy your domain directly through SQUARESPACE.',
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

const outDir = path.join(__dirname, 'squarespace-buy-domain-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
