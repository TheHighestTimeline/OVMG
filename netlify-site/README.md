# Walkthrough Guide Dashboard — Netlify Hosting Site

Hosts walkthrough ZIPs exported by the Chrome extension. Upload a ZIP, get a
public URL and an iframe embed code to paste into the live site (e.g. the
Amplify/Framer site).

## Deploy

1. Push this folder to its own GitHub repo (or branch) and connect it to a new
   Netlify site, **or** run `netlify deploy` from inside this folder with the
   Netlify CLI.
2. Netlify Blobs is used for storage — no database or external service setup
   needed beyond the Netlify site itself.
3. `netlify.toml` already wires up the redirects (`/api/upload`, `/api/guides`,
   `/api/guides/:slug`, `/guides/*`) and forces
   `X-Frame-Options: ALLOWALL` / `Content-Security-Policy: frame-ancestors *`
   so hosted guides can be iframed from any site.

## Using the dashboard

1. Open the deployed site.
2. Drag a walkthrough ZIP (from the Chrome extension's **Export ZIP**) onto
   the drop zone, fill in title/slug/description, click **Publish Guide**.
3. Click **Get Embed** on any published guide to copy an `<iframe>` snippet —
   paste that into the live site.
4. Re-uploading a ZIP under the same slug replaces the guide in place (old
   files are deleted first), so updating a published guide is just
   re-publishing under the same slug.

## File layout

- `index.html` / `app.js` / `styles.css` — the dashboard UI (drag-drop
  upload, guide list, embed-code popup).
- `netlify/functions/upload.js` — `POST /api/upload`, unpacks the ZIP into
  Netlify Blobs (`guide-files`) and writes a `guides-index` entry.
- `netlify/functions/list.js` — `GET /api/guides`, returns all published
  guides.
- `netlify/functions/delete.js` — `DELETE /api/guides/:slug`.
- `netlify/functions/serve.js` — `GET /guides/:slug[/*]`, serves the guide's
  files (this is what the iframe embed actually points at).
- `netlify.toml` / `_redirects` — routing + the frame-embedding headers.
- `package.json` — `@netlify/blobs`, `jszip`, `lambda-multipart-parser`.

## Install dependencies locally (optional, for `netlify dev`)

```
npm install
netlify dev
```
