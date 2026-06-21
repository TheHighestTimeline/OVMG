// build_update_shows_flyers_weekly.js
// One-off driver for guide https://app.storylane.io/share/7gfhpc8eb9tc
// ("Update Shows + Flyers (Weekly Routine)"), built from data extracted directly
// out of Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  '80218181-5ee7-478f-999e-dbc87cdba914': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/157n75od6nqn8stnttvs108zxybg.png',
  '2fbd9337-b864-449b-8ffc-1b68a29e4d13': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/se8c5adq9mvme9ov8u6vtxhb8zqs.png',
  '4b2de5a5-f010-4ca0-81da-3208bb39890e': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/3ml9qwjncoffg01bxkn7ui8ybgeu.png',
  'a6be946e-9e5c-4c37-b4e6-451114fec80f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/xplklgdrxhp0uy4y0urrxj856hqc.png',
  'bc174232-f374-4092-b299-8bf07a3a2044': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/el1eielsh9crcj8d65nv0v9z38qd.png',
  '9339678c-f341-4ae0-bd4a-bdea89929bbb': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/vs1xwmgznwqsucupk1otj8fty0dp.png',
  '2878fcd3-ffed-4c32-88a9-501564631bbf': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/j0c18jz8j6opn76ibernfm18ii8g.png',
  'b2d426ad-1ff9-419b-8efb-0464a5ca04b3': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/gr1ttshi10b3doh11c380buassqy.png',
  'e8ddb5e9-e350-4388-85d5-814c48bf75dd': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_40817507-804c-4ace-be54-f0c69410abd1/page/3uazjlruzdf8cmbjwjrmy9lb9c9a.png'
};

const WIDGETS = [
  { kind: 'popup', page_id: '80218181-5ee7-478f-999e-dbc87cdba914', desc: 'Update Shows + Flyers (Weekly Routine)' },
  { kind: 'hotspot', page_id: '80218181-5ee7-478f-999e-dbc87cdba914', desc: 'Click on the image to get started.', cta_pos: 'right', ox: 54.736633810978475, oy: 44.73201915910585, zoom: null },
  { kind: 'hotspot', page_id: 'e8ddb5e9-e350-4388-85d5-814c48bf75dd', desc: 'Click on the image in the right sidebar.', cta_pos: 'right', ox: 88.99214699540737, oy: 60.260203259342326, zoom: 1.2 },
  { kind: 'hotspot', page_id: '9339678c-f341-4ae0-bd4a-bdea89929bbb', desc: 'Select the image from your gallery.', cta_pos: 'right', ox: 68.97685959591195, oy: 52.09324268902361, zoom: 1.2 },
  { kind: 'hotspot', page_id: '2878fcd3-ffed-4c32-88a9-501564631bbf', desc: 'Click on the "Buy Now" button.', cta_pos: 'right', ox: 48.877624555845394, oy: 76.03569580131605, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'bc174232-f374-4092-b299-8bf07a3a2044', desc: 'Click here to update the button link.', cta_pos: 'right', ox: 89.01178370362699, oy: 68.33961374578037, zoom: 1.2 },
  { kind: 'hotspot', page_id: '2fbd9337-b864-449b-8ffc-1b68a29e4d13', desc: 'Use this option to update the button link.', cta_pos: 'right', ox: 71.0746480061267, oy: 76.5122843113259, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'b2d426ad-1ff9-419b-8efb-0464a5ca04b3', desc: 'After updating the link, close this.', cta_pos: 'right', ox: 79.19149963159265, oy: 68.55366217934065, zoom: 1.2 },
  { kind: 'hotspot', page_id: '4b2de5a5-f010-4ca0-81da-3208bb39890e', desc: 'Go live instantly with one action—your professional website is now accessible to the world.', cta_pos: 'right', ox: 96.85538218226476, oy: 4.444257762397483, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'a6be946e-9e5c-4c37-b4e6-451114fec80f', desc: 'Push changes in real-time whenever inspiration strikes—your site evolves as quickly as your ideas do.', cta_pos: 'right', ox: 85.10742469473716, oy: 33.078545493364274, zoom: 1.2 }
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
  annotations: []
}));

const html = playerTemplate({
  title: 'Update Shows + Flyers (Weekly Routine)',
  intro: {
    enabled: true,
    title: 'Update Shows + Flyers (Weekly Routine)',
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

const outDir = path.join(__dirname, 'update-shows-flyers-weekly-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
