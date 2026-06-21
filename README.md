# Walkthrough Recorder — Project Root

This folder contains two independent, push-ready projects. They are meant to
live on two separate branches (or two separate repos) since they deploy
completely differently:

- **`chrome-extension/`** → the Chrome extension (recorder + editor + export).
  Push this to a branch like `chrome-extension` / load it unpacked locally.
- **`netlify-site/`** → the guide-hosting dashboard. Push this to a branch
  like `netlify-hosting` and connect it to Netlify.

Each has its own `README.md` with setup instructions.

## Suggested push workflow

```
# from this folder
git checkout -b chrome-extension
git add chrome-extension
git commit -m "Chrome extension: recorder + editor + Storylane import"
git push -u origin chrome-extension

git checkout main
git checkout -b netlify-hosting
git add netlify-site
git commit -m "Netlify guide-hosting dashboard"
git push -u origin netlify-hosting
```

(Adjust to however you want the two pushed — separate repos work just as
well; nothing in either folder references the other by path.)

## End-to-end flow

1. Record a walkthrough with the Chrome extension → edit/annotate each step →
   **Export ZIP**.
2. Upload that ZIP to the Netlify dashboard → publish → copy the iframe embed
   code.
3. Paste the embed code into the live Amplify/Framer site.

To retire an old Storylane guide: run
`chrome-extension/tools/import_storylane_pdf.py` against its PDF export,
import the result into the extension, touch up captions, export, and publish
— see `chrome-extension/README.md` for details.

## Other folders here (not part of either deliverable)

- `_unrelated-website-files/` — OVMG marketing-site pages/images that were
  tangled into this same repo folder; left untouched, just relocated so they
  don't get mixed into either branch.
- `_archive-scrambled-originals/` — the original files from this folder
  before reconstruction. Their filenames and contents had gotten mismatched
  (e.g. a file named `background.js` actually contained a PNG, etc.) — every
  one was identified and its real content placed correctly into
  `chrome-extension/` or `netlify-site/` above. Kept here only as a paper
  trail; safe to delete once you've confirmed the two project folders look
  right.
- `_v23_reference/` — the intact prior version you uploaded mid-session,
  which is what supplied the full step-annotation editor
  (`review.html/css/js`). Kept for reference; safe to delete.
