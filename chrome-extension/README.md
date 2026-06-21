# Walkthrough Recorder — Chrome Extension

Records clicks on any website (screenshot + click position per step), then opens
a full editor to add captions, hotspots, arrows, rectangles, blur/redaction, and
spotlight highlights to each step. Exports the finished walkthrough as a
self-contained, embeddable HTML demo (ZIP).

## Install (unpacked — there's no Chrome Web Store listing for this, so this is the only way to install it)

1. Download this repo from GitHub: click the green **Code** button → **Download ZIP**
   (or `git clone` it if you're comfortable with git).
2. **Unzip the downloaded file.** Chrome will not accept a `.zip` for the
   next step — it needs a regular, unzipped folder.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode** (toggle, top right).
5. Click **Load unpacked** and select the unzipped `chrome-extension/` folder
   directly (the one containing `manifest.json`) — not the parent repo
   folder, and not the ZIP file.
6. Pin the extension (puzzle-piece icon in the toolbar → pin "Walkthrough
   Recorder") so it's always one click away.

Chrome will keep it installed like this across restarts. You only redo this
if you delete/move the folder or want to pick up a newer version of it.

## Recording a walkthrough

1. Go to the page you want to start recording on.
2. Click the extension icon → type a project name → **Start Recording**.
   The popup closes and a small recording indicator appears on the page.
3. Use the site normally. Every click you make captures a screenshot plus the
   exact click position as a new step — you don't have to do anything extra
   per click.
4. When you've covered everything you want in the guide, click the extension
   icon again → **Stop & Review**.

## The editor ("viewer") after you stop recording

Stopping a recording opens the **editor** automatically in a new tab — this
is where you turn the raw clicks into a finished guide:

- A filmstrip of every captured step down the side/top.
- Per step: write a caption (title + body), drag the hotspot to fine-tune
  position, and add annotations — arrow, rectangle, blur/redaction, spotlight,
  or text — directly on the screenshot.
- Global settings: an intro slide, a persistent call-to-action, a final CTA,
  and brand colors/presets that apply across the whole guide.
- A **Preview** mode that plays the guide back exactly as a viewer would see
  it, with the same step counter and progress bar that ship in the final
  export.
- **Export ZIP** — downloads a self-contained HTML demo (the "player"). No
  servers or extension required to view it — open `index.html` in the ZIP
  directly, or host it anywhere.

You can also reopen the editor for any past project later from the
**Recent projects** list in the popup.

## Publishing

Upload the exported ZIP to the Netlify guide-hosting site (the separate
`netlify-site/` project) to get a public URL and an `<iframe>` embed snippet
you can paste into the live client site. Or skip hosting entirely and just
unzip + embed `index.html` wherever you like.

## Replacing an existing Storylane guide with an exact recreation

If you have an old Storylane PDF export and want to recreate that guide in
this tool — same steps, same click positions, same captions where available
— instead of re-recording it by hand:

```
pip install pymupdf pillow pytesseract   # pytesseract is optional, see note below
python tools/import_storylane_pdf.py "Old Guide.pdf" "New Project Name"
```

What it does, page by page: pulls out the actual embedded screenshot image
(not a re-render — the original pixels), finds the small click/spotlight
overlay image Storylane stamps on top of it, and computes the click position
as a percentage of the screenshot from that overlay's position. If Tesseract
is installed it also OCRs the caption banner above the screenshot for each
step. It writes `Old Guide-import.json` next to the PDF — one step per PDF
page, in order.

**Tesseract is a separate program, not just a Python package** — `pip
install pytesseract` only installs the Python wrapper. If you want captions
pulled automatically, also install the Tesseract OCR engine itself (Windows
installer: https://github.com/UB-Mannheim/tesseract/wiki). If you skip this,
the import still works fully — captions are just left blank for you to
type in manually inside the editor.

Then in the extension popup, click **Import Storylane PDF…** and pick that
`*-import.json` file. It loads as a brand-new project, already pre-populated
with every step, screenshot, and click position — open it straight into the
editor, fill in/adjust any captions, and export like any other guide. The
result is a guide built natively in this tool (same player, same step
counter/progress bar, your own brand styling) that reproduces the original
Storylane guide's content and click flow — not a literal copy of Storylane's
file, since it's now running on this tool's own player.

**What this has been verified against:** the import logic was run end-to-end
against a real Storylane PDF export (13 pages/steps) — every page's
screenshot extracted correctly, 12 of 13 steps had a click overlay and each
produced a distinct, correctly-positioned click percentage, and OCR correctly
read out existing captions verbatim on the pages that had one (and correctly
came back blank on pages that genuinely had no caption text in the source,
not as a failure). If a future PDF export differs significantly in layout
from this one, double-check the first couple of imported steps in the editor
before relying on the rest.

## File layout

- `manifest.json` — MV3 manifest.
- `background.js` — service worker; multi-project state, message protocol.
- `content.js` / `content.css` — runs on the recorded page; captures clicks
  (including inside same-origin iframes), shows the recording indicator.
- `popup.html` / `popup.js` — toolbar popup: start/stop, recent projects,
  Storylane PDF import.
- `review.html` / `review.css` / `review.js` — the step editor + ZIP export
  (this is also the page that plays back the exported demo, templated out
  into the export).
- `lib/jszip.min.js` — used client-side to build the export ZIP.
- `tools/import_storylane_pdf.py` — standalone converter described above.

## Version notes

This build merges two prior in-progress versions found in the project
history: the multi-project background/popup/content-script plumbing (v2.4)
and the full step-annotation editor (v2.3, which already had every annotation
tool — text, arrow, rect, blur, spotlight — plus brand presets, intro slide,
persistent CTA, and zoom). Both speak the same `chrome.runtime` message
protocol, so they were combined directly rather than rewritten.
