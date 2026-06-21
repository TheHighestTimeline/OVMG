# Walkthrough Recorder v2.3

## v2.3 changelog

**Bug fixes**
- Tooltip body now respects line breaks (newlines in your text render correctly)
- "Preview from this step" now works (was being blocked by Chrome's popup blocker on async window.open)
- Enter key in text annotation popup now commits (Shift+Enter for newline)

**New features**
- **Tooltip resize handle** — drag the bottom-right corner of any tooltip to resize. Width persists per step.
- **Zoom viewport (🔍 tool, keyboard: Z)** — drag a region on a step to set a zoom area. Player crops/zooms to that region. Persists across subsequent steps until cleared with the ✕ button.

## Quick install

1. Remove old version from `chrome://extensions`
2. Unzip `walkthrough-recorder-v2.3.zip`
3. Load unpacked → pick the unzipped folder
4. Refresh any tab you want to record on

## How the zoom viewport works

1. Open the editor on any step
2. Click the 🔍 button in the canvas toolbar (or press Z)
3. Drag a rectangle on the screenshot — that becomes the zoom area
4. The yellow dashed box marks the zoom region
5. **In the player**, that step (and all subsequent steps) zoom into that area
6. To zoom out, click ✕ Clear on the zoom box, or press the zoom tool again on a later step and draw a new region

The player smoothly transitions between zoom areas as you advance through steps. If step 3 has a zoom set on the email field, and step 4 has no zoom set, step 4 inherits step 3's zoom. To return to full view, set a new zoom on a later step (or hit Clear).

## Deploying your demos

The extension generates a ZIP file. To get a hostable URL:

**Option 1 — Netlify Drop (fastest):**
1. Unzip the ZIP from the extension
2. Go to https://app.netlify.com/drop
3. Drag the unzipped folder onto the page
4. Get a URL like `your-demo.netlify.app`
5. Embed that URL in Framer

**Option 2 — Multi-demo site:**
Create a folder like `amplify-demos/` with subfolders for each demo:
```
amplify-demos/
  booking-inquiry-form/
    index.html
    assets/
  swap-highlighted-photos/
    index.html
    assets/
```
Drag the whole `amplify-demos` folder onto Netlify Drop.
Each demo accessible at `amplify-demos.netlify.app/booking-inquiry-form/` etc.

## Keyboard shortcuts

| Key | Action |
|---|---|
| V | Select tool |
| A | Arrow tool |
| R | Rectangle tool |
| T | Text tool |
| B | Blur tool |
| S | Spotlight (inverted blur) |
| Z | Zoom viewport |
| ← → | Previous / next step |
| Delete | Delete selected annotation |
| Esc | Deselect |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
