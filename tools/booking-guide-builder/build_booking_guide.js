// build_booking_guide.js
// One-off driver for guide https://app.storylane.io/share/adlozv1s36vc
// ("Booking Inquiry Form + Booking Email"), built from data extracted directly
// out of Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets).
//
// NOTE on images: these step images currently reference Storylane's own public
// asset CDN (app-pages.storylane.io) directly. They will keep working as long as
// that CDN stays up, but for full independence from Storylane the images should
// be downloaded and self-hosted under assets/ — see import_storylane_url.py for
// the general tool that does this automatically when run from a machine with
// normal (non-sandboxed) internet access.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('./playerTemplate.js');

// page_id -> full-res screenshot URL (from entities.projects[].pages[])
const PAGE_URLS = {
  'db3bfec5-dc6e-4905-8772-4bac765fbde7': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/zsb5vjs3pgtpl0jqtehrru8a2avt.png',
  'fd674925-3c06-47b1-b914-ebe963b3591a': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/lpba2d1swkdd35q8wjwfet7sz8b2.png',
  '5567e4a7-26d1-445d-806e-59dfcf5a8f77': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/j4ydm758r8dgf2wg32h4ansg0gv1.png',
  'f87916a3-584e-4fe6-8012-2ee8e6ff35d0': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/iyup43ghv9j2mgcfxp3d3c7caz8e.png',
  '41fce35f-5f4d-4e09-8922-a4c9a55674f6': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/7cgnpj1vmrbxckwpq34kn0khtdhx.png',
  'd01dae94-b1e3-4dbd-a400-12161cc357cc': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/3twav9m4s2w5hrh8ne7zo8qxq4ld.png',
  '1a17f5f9-249d-4c10-acf8-21eabcfa55b6': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/qngo5o6bsv89n1c3i95y3214v0ed.png',
  '49e215c5-8051-4c7a-85c2-fbbade65c52b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/0m5fag9cno4qrgy53okhscwehinj.png',
  '9dd767df-47c0-469d-b741-1518701a9926': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/v707ui260mwyi971j8brm40m7ww8.png',
  '45f95423-9038-4083-b816-4ab52f293904': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/z0uicqzcph0q7lyk0cc1njjp6cg9.png',
  '39ec9dfe-dd15-412b-a130-784104e046a2': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/00c2ehc9yuyzzxf5c77g9gaf2sew.png',
  '1cbeca4d-cbf5-440b-9bec-8e36d2506e91': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_07f573e2-1dc6-4b4a-805b-5d420459b747/page/dw0ch4pbcz2em39h8yvac3or6mxb.png'
};

// Ordered widgets exactly as returned by entities.flows[].widgets, pulled from
// entities.widgets[id] (kind, page_id, options.description.value stripped of
// HTML, options.cta.position, options.root.offset.{x,y}, options.root.zoom).
const WIDGETS = [
  { kind: 'popup', page_id: 'db3bfec5-dc6e-4905-8772-4bac765fbde7', desc: 'Booking Inquiry Form + Booking Email' },
  { kind: 'hotspot', page_id: 'db3bfec5-dc6e-4905-8772-4bac765fbde7', desc: 'Click here to open the form settings.', cta_pos: 'right', ox: 47.96793679662281, oy: 35.94483985651744, zoom: null },
  { kind: 'hotspot', page_id: 'fd674925-3c06-47b1-b914-ebe963b3591a', desc: 'Make sure the contact form layer is selected.', cta_pos: 'right', ox: 15.30679404002289, oy: 48.503012907150975, zoom: 1.2 },
  { kind: 'hotspot', page_id: '5567e4a7-26d1-445d-806e-59dfcf5a8f77', desc: 'Click here to begin configuring your email settings.', cta_pos: 'right', ox: 89.30845686716417, oy: 55.24490959717765, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'f87916a3-584e-4fe6-8012-2ee8e6ff35d0', desc: 'Add or update your email address here.', cta_pos: 'right', ox: 72.56849500463185, oy: 62.8363358248757, zoom: 1.2 },
  { kind: 'hotspot', page_id: '41fce35f-5f4d-4e09-8922-a4c9a55674f6', desc: 'Click the button to proceed with verification.', cta_pos: 'right', ox: 80.21261284732662, oy: 63.077947226954095, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'd01dae94-b1e3-4dbd-a400-12161cc357cc', desc: 'Click "Send Verification Email" to verify your email address.', cta_pos: 'right', ox: 81.81417675776696, oy: 71.91367609037769, zoom: 1.2 },
  { kind: 'hotspot', page_id: '1a17f5f9-249d-4c10-acf8-21eabcfa55b6', desc: 'Click here to change your email subject.', cta_pos: 'right', ox: 72.33289863298411, oy: 74.6486784602139, zoom: 1.2 },
  { kind: 'hotspot', page_id: '49e215c5-8051-4c7a-85c2-fbbade65c52b', desc: 'You can also change the body of the email.', cta_pos: 'right', ox: 72.45370388728507, oy: 81.71402141524817, zoom: 1.2 },
  { kind: 'hotspot', page_id: '9dd767df-47c0-469d-b741-1518701a9926', desc: 'Click the "X" button to confirm your notification preferences (important).', cta_pos: 'right', ox: 77.39031219502694, oy: 55.540776999005836, zoom: 1.2 },
  { kind: 'hotspot', page_id: '45f95423-9038-4083-b816-4ab52f293904', desc: 'If you want to make any field required or optional, select that field.', cta_pos: 'right', ox: 47.47708649916222, oy: 52.50420412725173, zoom: 1.2 },
  { kind: 'hotspot', page_id: '39ec9dfe-dd15-412b-a130-784104e046a2', desc: 'Click “No” if you don’t want this field to be required, and click “Yes” if you want this field to be required.', cta_pos: 'right', ox: 88.0628302464987, oy: 76.43044777898427, zoom: 1.2 },
  { kind: 'hotspot', page_id: '1cbeca4d-cbf5-440b-9bec-8e36d2506e91', desc: 'Click “Publish” to make all the changes live.', cta_pos: 'right', ox: 96.30210399627686, oy: 3.654677576298336, zoom: 1.2 }
];

// Storylane's hotspot zoom is a scalar multiplier anchored at the hotspot's own
// offset point (ox, oy), with no separate zoomOffset observed in this guide.
// Convert to our { x, y, w, h } percent-of-image region format:
//   w = h = 100 / zoomScalar
//   x = ox - w/2  (clamped to [0, 100-w])
//   y = oy - h/2  (clamped to [0, 100-h])
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
  annotations: []
}));

const introWidget = WIDGETS.find(w => w.kind === 'popup');

const html = playerTemplate({
  title: 'Booking Inquiry Form + Booking Email',
  intro: {
    enabled: true,
    title: 'Booking Inquiry Form + Booking Email',
    subtitle: '',
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

const outDir = path.join(__dirname, 'booking-inquiry-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
