// build_replace_images.js
// One-off driver for guide https://app.storylane.io/share/y3d110tsfhmi
// ("Replace Images + Add New Photos"), built from data extracted directly
// out of Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  'f754034f-8359-4e26-97de-9be54aa8c339': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/ugglmh7t4k9qe5y9oah6p2lzvk5a.png',
  '92bc48bf-1ea8-4fe8-8649-58b167ca279a': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/j1q5jfsqj1ton4f6b7tmir1zcjre.png',
  '62397c41-11c3-413b-8e19-2b4d54252d70': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/5g3ax1v9tqolskelrrej0b7sun10.png',
  '57f6a89c-94a7-457c-a6b7-554e5f837c24': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/ksn532yv7hc5esjjpoljxqqsldq8.png',
  '6de9181d-c5af-499d-a2bb-1035344d8c21': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/098mic12da4baw7qp9tdw7qumqws.png',
  'c1e63876-fb52-41f6-833f-1dcef546eba9': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/adszoj21x9az3vv6kgyccdju3ink.png',
  'a8e728eb-39b6-4497-9153-c7e9022f6d2c': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/0mamxiiyuqpn3lb965b1nrqv32ea.png',
  '0a635ba8-2e80-40db-9886-bfd5083c30cf': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/ybvgcf9uop2yhmn0lrdoozfjjdsi.png',
  'b0e5dab4-3402-483a-8255-aa1654c54879': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/vqx7vu4gfh87hghyc1s2huooxulo.png',
  '267ecb35-cebb-436b-b0d3-c59d02f3a738': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/80rf8up8bghfe6lbb1n1qd5lxoq2.png',
  '1a6c7e41-b272-45df-b82e-1f6cb38dd49e': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/9qjvia18i8iewcokupzwcob3sqvl.png',
  '2c6c0a8f-cc1a-438d-8bc9-1c6b6bf1095c': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/j58va36rs1zff86spsvd769ihyqc.png',
  'f372b957-e025-4c30-a715-f6f34bc71356': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/yo8oap8vwolxz39jcx0nzxtu4p3d.png',
  '3fcd8285-57a5-4b83-8c66-6063dff7293b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/2x1c4n2mtz6rq2k8r6cwjm8awsql.png',
  '33b7e835-fdb7-45de-8020-0e151e6e264b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/et5gc1k0b3mzc4lrs4jawhmk4sah.png',
  '234c96c2-507f-4579-9244-a90a9316e187': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/uqcc880cor6gnu6q8m8jcvifbi1a.png',
  'db1593ef-d5a5-46c3-a37e-77f7c00681f5': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/82vsgupy7c24ydtqnpgfkh8mf26u.png',
  'f1631752-8321-4bf3-a629-763dd99dccf1': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/ywy4wo9697ibq3jg9r39fngrnro7.png',
  '2f103829-6806-44d0-a2b0-9c659e397ef6': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/6hgmziy42ylfhykajh2ywyok1gfl.png',
  'b424b938-6482-44e5-8c7b-58bde7637a13': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/jgxidj6ia0gs8f6zf1dpzjuxzzts.png',
  '6e49153c-cb8e-4dca-84fa-e9d1cdf44d8b': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/9rcbs01wo40s8h59a7zg6jmad1rl.png',
  '5c8c3f5b-80e9-4c87-a992-089057c070b8': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/xnqfgw52o5jqycsiu999g1dif5jy.png',
  '03c7bf43-6e82-4e5e-b541-a1be578abcd4': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_4dc09245-f077-4e76-b541-c2e1896134f1/page/787h2a4j82pj4kd2d00h6y979za9.png'
};

const WIDGETS = [
  { kind: 'popup', page_id: 'f754034f-8359-4e26-97de-9be54aa8c339', desc: 'Replace Gallary Images + Add New Photos' },
  { kind: 'hotspot', page_id: 'f754034f-8359-4e26-97de-9be54aa8c339', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 44.72459261012556, oy: 35.30935603080036, zoom: null },
  { kind: 'hotspot', page_id: '92bc48bf-1ea8-4fe8-8649-58b167ca279a', desc: 'Make sure the image layer is selected.', cta_pos: 'right', ox: 11.966642054782167, oy: 44.95654593761326, zoom: 1.2 },
  { kind: 'hotspot', page_id: '03c7bf43-6e82-4e5e-b541-a1be578abcd4', desc: 'Click here to add a new image.', cta_pos: 'right', ox: 89.24655274978474, oy: 65.95564506868071, zoom: 1.2 },
  { kind: 'hotspot', page_id: '33b7e835-fdb7-45de-8020-0e151e6e264b', desc: 'Click "Choose Image…" to upload your visual content.', cta_pos: 'right', ox: 69.09165716258849, oy: 52.64119649905243, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'f1631752-8321-4bf3-a629-763dd99dccf1', desc: 'Right-click to show all options.', cta_pos: 'right', ox: 16.69805093262932, oy: 49.08517715290014, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'a8e728eb-39b6-4497-9153-c7e9022f6d2c', desc: 'Click to open the scrolling gallery component.', cta_pos: 'right', ox: 20.456228842177875, oy: 17.670255550949086, zoom: 1.2 },
  { kind: 'hotspot', page_id: '1a6c7e41-b272-45df-b82e-1f6cb38dd49e', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 32.19378648251863, oy: 40.778452366213955, zoom: null },
  { kind: 'hotspot', page_id: '57f6a89c-94a7-457c-a6b7-554e5f837c24', desc: 'Click here to change the image.', cta_pos: 'right', ox: 88.50294685505813, oy: 69.56205985190242, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'b0e5dab4-3402-483a-8255-aa1654c54879', desc: 'Choose an image from your gallery.', cta_pos: 'right', ox: 68.35210029265932, oy: 59.08261768319302, zoom: 1.2 },
  { kind: 'hotspot', page_id: '2f103829-6806-44d0-a2b0-9c659e397ef6', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 47.550728125800994, oy: 43.285093523485656, zoom: 1.2 },
  { kind: 'hotspot', page_id: '3fcd8285-57a5-4b83-8c66-6063dff7293b', desc: 'Click here to change the image.', cta_pos: 'right', ox: 88.89696724646608, oy: 80.71135652771163, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'b424b938-6482-44e5-8c7b-58bde7637a13', desc: 'Choose an image from your gallery.', cta_pos: 'right', ox: 68.87269451870247, oy: 59.08723268238802, zoom: 1.2 },
  { kind: 'hotspot', page_id: '5c8c3f5b-80e9-4c87-a992-089057c070b8', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 56.39315256058721, oy: 40.03541302897156, zoom: 1.2 },
  { kind: 'hotspot', page_id: '62397c41-11c3-413b-8e19-2b4d54252d70', desc: 'Click here to change the image.', cta_pos: 'right', ox: 88.68781276246958, oy: 70.27458656632378, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'f372b957-e025-4c30-a715-f6f34bc71356', desc: 'Choose an image from your gallery.', cta_pos: 'right', ox: 68.97987225036445, oy: 58.67056647465775, zoom: 1.2 },
  { kind: 'hotspot', page_id: '6de9181d-c5af-499d-a2bb-1035344d8c21', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 37.31459169106911, oy: 71.14689860193121, zoom: 1.2 },
  { kind: 'hotspot', page_id: '6e49153c-cb8e-4dca-84fa-e9d1cdf44d8b', desc: 'Click here to change the image.', cta_pos: 'right', ox: 92.96876589457194, oy: 79.51081420020233, zoom: 1.2 },
  { kind: 'hotspot', page_id: '267ecb35-cebb-436b-b0d3-c59d02f3a738', desc: 'Choose an image from your gallery.', cta_pos: 'right', ox: 74.63541825612387, oy: 58.21584138938849, zoom: 1.2 },
  { kind: 'hotspot', page_id: '2c6c0a8f-cc1a-438d-8bc9-1c6b6bf1095c', desc: 'Click here to open the image settings.', cta_pos: 'right', ox: 49.32016934554804, oy: 67.01259230207765, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'db1593ef-d5a5-46c3-a37e-77f7c00681f5', desc: 'Click here to change the image.', cta_pos: 'right', ox: 88.59346056777069, oy: 69.35371096211964, zoom: 1.2 },
  { kind: 'hotspot', page_id: '234c96c2-507f-4579-9244-a90a9316e187', desc: 'Choose an image from your gallery.', cta_pos: 'right', ox: 73.7500031789144, oy: 57.98562029282824, zoom: 1.2 },
  { kind: 'hotspot', page_id: 'c1e63876-fb52-41f6-833f-1dcef546eba9', desc: 'Click "Publish" to make your site live.', cta_pos: 'right', ox: 97.34377066294353, oy: 3.654677576298336, zoom: 1.2 },
  { kind: 'hotspot', page_id: '0a635ba8-2e80-40db-9886-bfd5083c30cf', desc: 'Click "Update" to save your published changes.', cta_pos: 'right', ox: 85.3182198906028, oy: 33.1441849034951, zoom: 1.2 }
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
  title: 'Replace Images + Add New Photos',
  intro: {
    enabled: true,
    title: 'Replace Images + Add New Photos',
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

const outDir = path.join(__dirname, 'replace-images-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
