# Booking Inquiry Form + Booking Email — standalone walkthrough

Exported from Storylane guide: https://app.storylane.io/share/adlozv1s36vc

## Deploy to Netlify

Drag this whole folder onto https://app.netlify.com/drop, or connect it as a
site in Netlify (publish directory = this folder). `netlify.toml` is already
set up to allow the page to be embedded in an iframe (for the Amplify site).

## Embed on your Amplify site

```html
<iframe
  src="https://YOUR-NETLIFY-SITE.netlify.app/"
  style="width:100%; height:700px; border:0;"
  allow="clipboard-write"
></iframe>
```

## Important — image hosting caveat

The 12 step screenshots in `index.html` currently reference Storylane's own
asset CDN (`app-pages.storylane.io`) directly — they were not re-downloaded
and embedded locally in this pass, because the environment that built this
file has no general outbound internet access (only this chat's Chrome
connector and an allow-listed set of domains).

Practically:
- The page works right now, today, because that CDN is still live.
- It will keep working as long as Storylane's CDN stays up, independent of
  whether you keep paying for a Storylane *subscription* — CDN delivery and
  account/billing are typically separate systems. But this is not guaranteed
  long-term, and is not the same as being fully independent of Storylane.

For a fully self-hosted copy (images downloaded into `assets/` and referenced
locally, zero dependency on Storylane infrastructure), run the new
`import_storylane_url.py` importer from a machine with normal internet access
(see below) and point it at the same share URL — it will produce this same
HTML plus a local `assets/` folder, and you can swap that in before
cancelling Storylane.

## Reusable importer (for the rest of your guides)

`import_storylane_url.py` (next to this README's parent tools folder) takes
any `https://app.storylane.io/share/...` URL, reads the same structured data
Storylane itself uses to render the guide (no click-walking or screenshots
needed), downloads every step image, and calls `build_player.js` to produce
an `index.html` + `assets/` bundle just like this one — fully self-hosted.
