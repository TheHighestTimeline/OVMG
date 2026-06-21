// build_create_stunning_designs.js
// One-off driver for guide https://app.storylane.io/share/q7g0nil0pxnu
// ("Create Stunning Designs"), built from data extracted directly out of
// Storylane's embedded __NEXT_DATA__ JSON (entities.projects/flows/widgets),
// pulled via the demo player's ssResponseDataStr.
//
// NOTE: This guide interleaves short video_clip transitions (same .webm page)
// between hotspot steps in the live Storylane player. Our exported player
// (playerTemplate.js) only supports static image steps, so per user direction
// the video transitions are omitted from the step sequence — only the 13 real
// hotspot steps are included. The guide's closing popup text (no hotspot of
// its own) is appended to the final step's body as a closing message.

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('../booking-guide-builder/playerTemplate.js');

const PAGE_URLS = {
  'n34rdwpix232sbh5zo6p2mk5bgto': 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/n34rdwpix232sbh5zo6p2mk5bgto.png',
};

const STEPS_RAW = [
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/n34rdwpix232sbh5zo6p2mk5bgto.png', desc: 'Click on Section.', cta_pos: 'right', ox: 48.18259702618168, oy: 22.922393626274847, zoom: null },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/999ayfq2we11rrv9qvmd4lunpp52.png', desc: 'Select Card to Update Content', cta_pos: 'right', ox: 27.772704876345248, oy: 25.650777487881754, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/yez75wdivbkdzvj3aerxbg4u1sis.png', desc: 'Watch your designs come to life with interactive animations and transitions', cta_pos: 'right', ox: 86.58403255920234, oy: 66.27339534622303, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/1v5q4dmfv4z9558554bpnjcb1i5l.png', desc: 'Access responsive design tools that adapt perfectly to any screen size', cta_pos: 'right', ox: 31.483144488973387, oy: 27.797750596804242, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/woll6adi3a6vva3g0qyyr2czptpm.png', desc: 'Customize text styles to create your unique brand identity', cta_pos: 'right', ox: 83.23758598338524, oy: 67.91911393869921, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/tfki0hqzq18kz79iti8snezkoyf4.png', desc: 'Add dynamic content with our CMS integration for real data in your designs', cta_pos: 'right', ox: 44.013369367935915, oy: 24.730830573616164, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/31yra549hnwwnbuo4hmg8c8mar73.png', desc: 'Import designs from other tools seamlessly with our compatibility features', cta_pos: 'right', ox: 43.387834516338145, oy: 32.272783993752476, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/ko681wat52gli65iu39nxl2h3q7o.png', desc: 'Preview your site instantly and see exactly how users will experience it', cta_pos: 'right', ox: 65.72515216373736, oy: 30.37589106239034, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/sz0qk2t3okn3wop3kqnw6phg59s0.png', desc: 'Collaborate in real-time with team members on the same project', cta_pos: 'right', ox: 65.86476754974605, oy: 31.140652812197125, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/3nx9l73yn8hr26j4vgh87rt4h2f8.png', desc: 'Optimize for performance with our built-in optimization tools', cta_pos: 'right', ox: 86.62412903601535, oy: 46.907667796652014, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/xg4qwbe2256qqlgfsygo7w5zb4xi.png', desc: 'Publish your designs directly to the web with just one click', cta_pos: 'right', ox: 81.11500261796571, oy: 46.3597139866232, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/zgf2yewnxelwnfn4tnu9hzfo4hr3.png', desc: 'Track visitor interactions with integrated analytics', cta_pos: 'right', ox: 65.42082512910743, oy: 41.691600349651786, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/q8j7kh0nc0gvxqxxywwtrhhakt4c.png', desc: 'Access SEO tools to ensure your beautiful designs get discovered', cta_pos: 'right', ox: 63.93904657650244, oy: 47.98448111492981, zoom: 1.2 },
  { image: 'https://app-pages.storylane.io/company/company_cda3a2ff-4c13-4647-b808-93e3c6bdc174/project/project_488c4fbf-a257-414c-9df7-f53f5719dd4e/page/3jfp4ck2t60gnrl24u6mr24oa6p2.png', desc: 'Explore templates that jumpstart your design process', cta_pos: 'right', ox: 41.74622561677289, oy: 42.4622290015229, zoom: 1.2 }
];

const CLOSING_MESSAGE = ' Transform Your Ideas Into Reality Today: Start building beautiful, functional websites without writing a single line of code.';

function zoomScalarToRegion(ox, oy, scalar) {
  const w = 100 / scalar;
  const h = 100 / scalar;
  let x = ox - w / 2;
  let y = oy - h / 2;
  x = Math.max(0, Math.min(100 - w, x));
  y = Math.max(0, Math.min(100 - h, y));
  return { x, y, w, h };
}

const steps = STEPS_RAW.map((w, i) => ({
  image: w.image,
  clickX: w.ox,
  clickY: w.oy,
  title: '',
  body: w.desc + (i === STEPS_RAW.length - 1 ? CLOSING_MESSAGE : ''),
  position: w.cta_pos || 'right',
  tooltipWidth: null,
  zoom: w.zoom ? zoomScalarToRegion(w.ox, w.oy, w.zoom) : null,
  zoomReset: false,
  annotations: []
}));

const html = playerTemplate({
  title: 'Create Stunning Designs',
  intro: {
    enabled: true,
    title: 'Create Stunning Designs',
    subtitle: 'See how Framer transforms your design workflow with powerful visual tools and real-time previews.',
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

const outDir = path.join(__dirname, 'create-stunning-designs-guide');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log('Wrote', path.join(outDir, 'index.html'), '(' + html.length + ' bytes),', steps.length, 'steps');
