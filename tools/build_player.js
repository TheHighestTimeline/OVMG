#!/usr/bin/env node
// build_player.js
// Generic driver: reads a steps.json (produced by import_storylane_url.py, or
// hand-written) and renders it through the same playerTemplate() used by the
// chrome-extension's own Export button, producing a standalone index.html.
//
// Usage:
//   node build_player.js <steps.json> <output_dir>
//
// steps.json shape:
// {
//   "title": "Guide title",
//   "intro": { "enabled": true, "title": "...", "subtitle": "", "buttonText": "Start Demo" },
//   "palette": { ... }            // optional, defaults to DEFAULT_PALETTE
//   "bgMode": "light",            // optional
//   "tooltipStyle": "default",    // optional
//   "steps": [
//     { "image": "assets/step-001.png", "clickX": 47.9, "clickY": 35.9,
//       "title": "", "body": "...", "position": "right", "tooltipWidth": null,
//       "zoom": { "x":0,"y":0,"w":50,"h":50 } | null, "zoomReset": false,
//       "annotations": [] }
//   ]
// }

const fs = require('fs');
const path = require('path');
const { playerTemplate, DEFAULT_PALETTE } = require('./playerTemplate.js');

const [, , inputPath, outDirArg] = process.argv;

if (!inputPath) {
  console.error('Usage: node build_player.js <steps.json> [output_dir]');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const outDir = outDirArg || path.dirname(inputPath);
fs.mkdirSync(outDir, { recursive: true });

const html = playerTemplate({
  title: data.title || 'Walkthrough',
  intro: data.intro || { enabled: true, title: data.title || 'Walkthrough', subtitle: '', buttonText: 'Start Demo' },
  persistentCta: data.persistentCta || { enabled: false },
  finalCta: data.finalCta || { enabled: false, text: 'Get Started', url: '' },
  palette: data.palette || DEFAULT_PALETTE,
  bgMode: data.bgMode || 'light',
  tooltipStyle: data.tooltipStyle || 'default',
  startIndex: typeof data.startIndex === 'number' ? data.startIndex : -1,
  steps: data.steps || [],
  useStepImageForIntro: (data.steps && data.steps[0] && data.steps[0].image) || ''
});

const outPath = path.join(outDir, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath, '(' + html.length + ' bytes),', (data.steps || []).length, 'steps');
