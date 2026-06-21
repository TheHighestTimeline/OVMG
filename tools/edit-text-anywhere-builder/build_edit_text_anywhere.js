// build_edit_text_anywhere.js
// One-off driver for guide https://app.storylane.io/share/qluo1im39aoq
// ("Edit Text Anywhere"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  'af85f30d-0482-419f-9c23-f25a4acffc53': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/zx6w2hdh75ltutyg9xdt8m2le64g.png',
  'b49afe14-5db4-4149-b115-998278c349ba': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/x3jmjvd5sbn58lc1trihzf8gprxz.png',
  '0a09f08c-bab9-4f5d-97ad-89efb2a6d822': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/jge0sbwgtgetpfeidwxaw4pnipsm.png',
  'd1a6b659-e63d-4dee-a292-8f84837a475d': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/tdetttlcz6jgp63hw6eqxuj5mebn.png',
  '8910a3ee-d228-4e8b-94d8-8472b97d023c': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/ctf4tqqv6372s5tintw8ami8zz0p.png',
  'f7a50b84-90ee-4f7d-a3e0-2494f0f66da9': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/zijlgiqhs7zlbb5qmht4ya4qsg38.png',
  'c98b4872-8d8d-47ba-a15f-2531aa72f70f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/6983gbb0sm3250x0zbho8mgb6aqr.png',
  '4e2d6a1c-8e41-414b-9e70-cc9c8750412f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_d2ed48d9-5cce-4bbc-a487-f039aad74f26/page/bvgzd38rcip974h8klnfxzl09a27.png'
};

const WIDGETS = [
  { kind: 'popup', page_id: 'f7a50b84-90ee-4f7d-a3e0-2494f0f66da9', desc: 'Edit Text Anywhere' },
  { kind: 'hotspot', page_id: 'f7a50b84-90ee-4f7d-a3e0-2494f0f66da9', desc: 'Click here to update the title text.', cta_pos: 'right', ox: 32.79015902866729, oy: 32.20144587455036, zoom: null },
  { kind: 'hotspot', page_id: '4e2d6a1c-8e41-414b-9e70-cc9c8750412f', desc: 'Click to add your page title text', cta_pos: 'right', ox: 89.20482995771829, oy: 68.31776244190152, zoom: 1.2 },
  { kind: 'hotspot', page_id: '8910a3ee-d228-4e8b-94d8-8472b97d023c', desc: 'Click here to update the heading text.', cta_pos: 'right', ox: 58.21045718483719, oy: 38.55995726792234, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'b49afe14-5db4-4149-b115-998278c349ba', desc: 'Click here to change the heading text.', cta_pos: 'right', ox: 89.06058729418021, oy: 69.00362414061426, zoom: 1.2 },
  { kind: 'hotspot', page_id: '0a09f08c-bab9-4f5d-97ad-89efb2a6d822', desc: 'Double-click to change the text.', cta_pos: 'right', ox: 46.353885976451934, oy: 53.23860304845058, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'd1a6b659-e63d-4dee-a292-8f84837a475d', desc: 'Repeat the same steps for all the content—simply double-click to change anything.', cta_pos: 'right', ox: 47.4653315973747, oy: 64.85880625456589, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'af85f30d-0482-419f-9c23-f25a4acffc53', desc: 'Click "Publish" to make your site live', cta_pos: 'right', ox: 96.99497620210231, oy: 7.857590418696225, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'c98b4872-8d8d-47ba-a15f-2531aa72f70f', desc: 'Click "Update" to save your latest changes', cta_pos: 'right', ox: 85.98112173046258, oy: 33.07284155856833, zoom: 1.2 }
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
  title: 'Edit Text Anywhere',
  intro: {
    enabled: true,
    title: 'Edit Text Anywhere',
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

const outDir = path.join(__dirname, 'edit-text-anywhere-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
