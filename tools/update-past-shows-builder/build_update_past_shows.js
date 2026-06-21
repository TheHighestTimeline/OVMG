// build_update_past_shows.js
// One-off driver for guide https://app.storylane.io/share/qeoqynwvuivi
// ("Update Past Shows"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.
//
// NOTE on images: these step images currently reference Storylane's own public
// asset CDN (app-pages.storylane.io) directly. They will keep working as long as
// that CDN stays up, but for full independence from Storylane the images should
// be downloaded and self-hosted under assets/.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

// page_id -> full-res screenshot URL
const PAGE_URLS = {
  'dce22e66-ae44-4e4d-a1b4-beeb1a6770b6': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/7itypspn8azzxkejwc6j3sgg7cig.png',
  'fdcc367f-da3c-43ee-8220-02019c271e8b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/6xspxrxlbhc68cem61yqaf3szkrf.png',
  '1c07c6a1-7588-4350-9a55-6b83103fde0d': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/aitv7gy7j4a9t4in4m1961ztpzbm.png',
  '13896e95-45c9-48a2-9e39-d8f88be771f7': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/1v5vvxxteik9pq067mrm4zj7dcdu.png',
  'e202c3bb-db52-4f4b-84f2-575ee67d68d9': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/pom9m71kae46ro0eolk18yoocoju.png',
  'aca2987e-e21d-4bd7-aee2-ef51e17d3ec3': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/2lwtwih7afponlihnrdwi8dzvfe5.png',
  '7336f07d-5532-4303-84f7-9b8f1a220367': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/39hrhjdgxa6meptobe0k7oxpsr9f.png',
  'a191d019-4e26-47dd-9dda-ed76ab016f06': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/jxygolc8s1urclnq88czxyskg2ma.png',
  'bd0adf7e-6c6b-4447-a4ef-499c460979c8': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/i3q0qnrz7cqnadkfgk7e0o42w5cx.png',
  'efc6848e-2483-4abb-ae32-4eb9bfbd22f0': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/5tdefqk153h455o6eh1ej8wrdzys.png',
  '6424a71c-2a68-4f68-9611-5017b828490f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/jjbm8b45nr3prtnatgy2n7turrfv.png',
  '6b8dab9b-df71-4b84-9508-d6958f705c0e': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/djtudz881d5r2sjeuvuen3w3879z.png',
  '5f3fd923-c79e-41f5-a210-8652b75fba12': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/c523y7jxijn1xengrh9tkgssyxq5.png',
  '5c048135-78c2-444c-adbf-3b9237ab800f': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/0pj9xm152ubpzfee2d4rj1gl78qm.png',
  '6206e968-2e16-412f-a2f1-825500fc5791': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_5821758c-fa8c-4f6e-92f8-baf66117baf6/page/kua27mtiy5pl1pfcg2gu8mw56h33.png'
};

// Ordered widgets exactly as returned by entities.flows[].widgets, pulled from
// entities.widgets[id] (kind, page_id, options.description.value stripped of
// HTML, options.cta.position, options.root.offset.{x,y}, options.root.zoom).
const WIDGETS = [
  { kind: 'popup', page_id: 'dce22e66-ae44-4e4d-a1b4-beeb1a6770b6', desc: 'Update Past Shows' },
  { kind: 'hotspot', page_id: 'dce22e66-ae44-4e4d-a1b4-beeb1a6770b6', desc: 'Click here to open the slideshow layer.', cta_pos: 'right', ox: 44.23814862441047, oy: 54.75119610972466, zoom: null },
  { kind: 'hotspot', page_id: 'fdcc367f-da3c-43ee-8220-02019c271e8b', desc: 'Make sure the work layer is selected.', cta_pos: 'right', ox: 14.016706083667057, oy: 70.80636582645283, zoom: 1.2 },
  { kind: 'hotspot', page_id: '1c07c6a1-7588-4350-9a55-6b83103fde0d', desc: 'Right-click to open the slideshow settings.', cta_pos: 'right', ox: 13.963800208895512, oy: 70.51049842462467, zoom: 1.2 },
  { kind: 'hotspot', page_id: '13896e95-45c9-48a2-9e39-d8f88be771f7', desc: 'Click Edit to enter the slideshow component.', cta_pos: 'right', ox: 20.740099447255517, oy: 9.684060616215286, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'e202c3bb-db52-4f4b-84f2-575ee67d68d9', desc: 'Right-click on the last slide to add a new past show.', cta_pos: 'right', ox: 30.701364757361013, oy: 72.90589587421483, zoom: null },
  { kind: 'hotspot', page_id: 'aca2987e-e21d-4bd7-aee2-ef51e17d3ec3', desc: 'Click "Duplicate" to create a copy.', cta_pos: 'right', ox: 37.54937962771124, oy: 48.985322916030526, zoom: 1.2 },
  { kind: 'hotspot', page_id: '7336f07d-5532-4303-84f7-9b8f1a220367', desc: 'Click "Work Slideshow · Primary" to select it.', cta_pos: 'right', ox: 52.52017571646232, oy: 24.763189072671413, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'a191d019-4e26-47dd-9dda-ed76ab016f06', desc: 'Select the slideshow element to customize it.', cta_pos: 'right', ox: 13.352435525888795, oy: 34.68435410634261, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'bd0adf7e-6c6b-4447-a4ef-499c460979c8', desc: 'Click the three dots to add a new show to the slideshow.', cta_pos: 'right', ox: 60.806064731918745, oy: 34.04316634582958, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'efc6848e-2483-4abb-ae32-4eb9bfbd22f0', desc: 'Connect the three dots with the new past show image.', cta_pos: 'right', ox: 47.822854137687635, oy: 58.75901284193547, zoom: 1.2 },
  { kind: 'hotspot', page_id: '6424a71c-2a68-4f68-9611-5017b828490f', desc: 'Click on the image to change or update it.', cta_pos: 'right', ox: 48.25015638123479, oy: 58.23770314471666, zoom: 1.2 },
  { kind: 'hotspot', page_id: '6b8dab9b-df71-4b84-9508-d6958f705c0e', desc: 'Select the image you want to use.', cta_pos: 'right', ox: 89.18767545472112, oy: 50.84892876714253, zoom: 1.2 },
  { kind: 'hotspot', page_id: '5f3fd923-c79e-41f5-a210-8652b75fba12', desc: 'Click "Choose Image…" to upload your own.', cta_pos: 'right', ox: 70.72372085141232, oy: 53.03597210122527, zoom: 1.2 },
  { kind: 'hotspot', page_id: '5c048135-78c2-444c-adbf-3b9237ab800f', desc: 'Click "Publish" to preview your changes live.', cta_pos: 'right', ox: 96.77083492279053, oy: 5.381296281334308, zoom: 1.2 },
  { kind: 'hotspot', page_id: '6206e968-2e16-412f-a2f1-825500fc5791', desc: 'Click "Update" to save and publish changes.', cta_pos: 'right', ox: 85.56663534988392, oy: 33.14419012921976, zoom: 1.2 }
];

// Storylane's hotspot zoom is a scalar multiplier anchored at the hotspot's own
// offset point (ox, oy). Convert to our { x, y, w, h } percent-of-image region.
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
  title: 'Update Past Shows',
  intro: {
    enabled: true,
    title: 'Update Past Shows',
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

const outDir = path.join(__dirname, 'update-past-shows-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
