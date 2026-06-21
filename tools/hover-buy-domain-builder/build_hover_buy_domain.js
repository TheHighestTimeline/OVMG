// build_hover_buy_domain.js
// One-off driver for guide https://app.storylane.io/share/ngatrub3bmee
// ("HOVER Buy a Domain"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.
//
// This guide has a video_clip widget between the "click empty search field"
// hotspot and the "click search button" hotspot. The clip is just a recording
// of the user typing a domain name into the field (6s, played at 2x). Since
// the player has no video support, the cleanest match for the live experience
// is NOT a separate placeholder frame for the clip -- it's making step 1
// itself animate from "empty field" to "typed field" on click, then continue.
// Step 1's typedImage points at the page already used as step 2's full
// before/after frame for the typed state.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  '811b7575-5e33-40dc-a7bc-d6d75b57f88a': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/2otpzhg3vypyi28n9inlpyplxud2.png',
  'e2c5e506-751e-472c-bfe1-bd436065a979': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/fw2ujg2pg3z1fv3fdnegb05vwook.png',
  '33d94b1a-5e64-42bc-a7d9-580d41f61b2b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/z0mc31akbl4iec0giqnuzhlkdvl8.png',
  '5dfc0ec2-7bc9-46e0-abbc-792efa614eb8': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/ys5visukcg5maooq0x29o37mlpmt.png',
  '8c2cb6b0-6c00-4bcd-a246-cdb4283846b4': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/ytmxs6i4do0hpx0w71niv4uyre5z.png',
  '477dcddf-c190-40a3-b571-995e029895c3': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_b1703a8f-b751-4ccc-ab2e-957b5b742f99/page/o6nyedj0t3qmrzzmorn7kw79xudi.png'
};

const CLOSING_MESSAGE = "Congratulations on completing this guide! Visit help.hover.com for additional support with managing your new domain.";

// kind 'video_clip' has been intentionally dropped from this list -- its
// effect is now expressed as a typedImage on the preceding hotspot step.
const WIDGETS = [
  { kind: 'popup', page_id: '811b7575-5e33-40dc-a7bc-d6d75b57f88a', desc: 'Buy your domain on Hover' },
  { kind: 'hotspot', page_id: '811b7575-5e33-40dc-a7bc-d6d75b57f88a', desc: 'Click the "Enter the domain you want" search field to begin', cta_pos: 'right', ox: 25.12049683293745, oy: 49.646894403957205, zoom: null, typed_page_id: 'e2c5e506-751e-472c-bfe1-bd436065a979' },
  { kind: 'hotspot', page_id: 'e2c5e506-751e-472c-bfe1-bd436065a979', desc: 'Click the search button to check domain availability', cta_pos: 'right', ox: 52.41971001583532, oy: 49.584719207458825, zoom: 1.2 },
  { kind: 'hotspot', page_id: '33d94b1a-5e64-42bc-a7d9-580d41f61b2b', desc: 'Click "Add to cart" to select your chosen domain', cta_pos: 'right', ox: 71.94959916864607, oy: 35.64399472886387, zoom: null },
  { kind: 'hotspot', page_id: '5dfc0ec2-7bc9-46e0-abbc-792efa614eb8', desc: 'Click "1 Item" to review your cart contents', cta_pos: 'right', ox: 83.90625, oy: 3.8419319429198686, zoom: 1.2 },
  { kind: 'hotspot', page_id: '8c2cb6b0-6c00-4bcd-a246-cdb4283846b4', desc: 'Click "Secure Checkout" to proceed to payment', cta_pos: 'right', ox: 50.554607086302454, oy: 82.90704808123493, zoom: null },
  { kind: 'popup', page_id: '477dcddf-c190-40a3-b571-995e029895c3', desc: "You're Ready to Register Your Domain!" }
];

function zoomScalarToRegion(ox, oy, scalar) {
  const w = 100 / scalar;
  const h = 100 / scalar;
  let x = ox - w / 2;
  let y = oy - h / 2;
  x = Math.max(0, Math.min(100 - w, x));
  y = Math.max(0, Math.min(100 - h, y));
  return { x, y, w, h };
}

const hotspotWidgets = WIDGETS.filter(w => w.kind === 'hotspot');

const steps = hotspotWidgets.map(w => ({
  image: PAGE_URLS[w.page_id],
  clickX: w.ox,
  clickY: w.oy,
  title: '',
  body: w.desc,
  position: w.cta_pos || 'right',
  tooltipWidth: null,
  zoom: w.zoom ? zoomScalarToRegion(w.ox, w.oy, w.zoom) : null,
  zoomReset: false,
  annotations: [],
  typedImage: w.typed_page_id ? PAGE_URLS[w.typed_page_id] : undefined
}));

// Put the click instruction in the title and the closing message in the body
// (rather than concatenating both into one long body string), and position
// the final tooltip above the hotspot since the button sits near the bottom
// of the frame -- avoids the tooltip overflowing past the visible viewport.
if (steps.length) {
  const last = steps[steps.length - 1];
  last.title = last.body;
  last.body = CLOSING_MESSAGE;
  last.position = 'top';
  last.tooltipWidth = 320;
}

const html = playerTemplate({
  title: 'HOVER Buy a Domain',
  intro: {
    enabled: true,
    title: 'Buy your domain on Hover',
    subtitle: 'Learn how to buy your domain through Hover.',
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

const outDir = path.join(__dirname, 'hover-buy-domain-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
