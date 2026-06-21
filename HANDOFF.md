# Handoff: Walkthrough Recorder project

Paste this entire document as your first message in the new chat. It's written to be self-contained — the new session has no memory of prior conversations.

## What this project is

A Chrome extension + Netlify-hosted player that records click-through product walkthroughs and exports them as standalone, embeddable HTML players — built to fully replace Storylane as a paid service for the user (OVMG / Tanner, tanner@onevibemediagroup.com). Standing mandate: match Storylane's behavior and visual polish "as close as we can get without being illegal" (i.e., don't copy their code/assets verbatim, but replicate the UX).

Repo root (this is the folder the user has shared/mounted):
`OVMG-TheHighestTimeline-ovmg-tools-wlakthrough-recorder/`

## Repo layout

```
chrome-extension/       — the actual Chrome extension (recorder + review/editor UI)
  manifest.json
  background.js, content.js, content.css   — recording side (captures clicks/screenshots in-page)
  popup.html / popup.js                    — extension popup UI
  review.html / review.js                  — the BIG one: in-extension step editor + exporter.
                                              review.js contains playerTemplate() — a function that
                                              generates the full standalone exported-player HTML.
                                              ~2277 lines. Treat with care (see "known bug" below).
  check.js, zzcheck.js                      — inert 0-byte leftover temp files from past debugging,
                                              harmless, safe to delete whenever.
netlify-site/            — marketing/landing site for hosting exported guides, deployed via Netlify
exported-guides/
  booking-inquiry-form-booking-email/
    index.html           — THE CURRENT DELIVERABLE. A finished, working exported player for the
                           Storylane guide https://app.storylane.io/share/adlozv1s36vc
                           ("Booking Inquiry Form + Booking Email"). 12 steps. This is what's been
                           handed to the user so far and iterated on per their feedback.
tools/
  booking-guide-builder/  — Node-based one-off build pipeline used to (re)generate the file above.
    playerTemplate.js     — pure function, extracted verbatim from chrome-extension/review.js's
                            internal playerTemplate() so it can run standalone under Node. MUST be
                            kept in sync with review.js's copy any time player markup/behavior
                            changes (there are two copies of this logic — see "known bug" below).
    build_booking_guide.js — hardcoded step data (image URLs, click coordinates, tooltip text,
                            zoom regions) for this specific guide, pulled from Storylane's
                            __NEXT_DATA__ JSON. Run with `node build_booking_guide.js` from inside
                            this folder; it writes booking-inquiry-guide/index.html, which then
                            gets copied to exported-guides/booking-inquiry-form-booking-email/.
    booking-inquiry-guide/index.html — build output (intermediate, gets copied to exported-guides/)
README.md                — top-level project README (check this for anything not covered here)
```

## Current state (as of this handoff)

The booking-inquiry-form-booking-email guide is functionally complete and has been delivered to the user multiple times with iterative fixes:

1. Initial full HTML export built and delivered.
2. User reported tooltip text boxes were cut off near frame edges on some steps (3, 11, 12), and one tooltip was covering its own target button. Fixed by replacing the naive `positionTooltip()` (which blindly trusted a stored left/right/top/bottom side) with an edge-aware version that auto-flips sides and clamps position when the tooltip would overflow the frame — matching Storylane's own confirmed live-player behavior. This fix was applied in **three places** (must stay in sync):
   - `tools/booking-guide-builder/playerTemplate.js` (the exported player's runtime script)
   - `chrome-extension/review.js`'s embedded copy of `playerTemplate()` (same logic, used when exporting from the extension itself)
   - `chrome-extension/review.js`'s separate **editor-preview** `positionTooltip(step)` function (different from the above — this one drives the live drag/resize preview UI inside the extension's review screen, not the exported player)
3. User then sent 6 screenshots with hand-drawn red arrows showing exactly where 6 hotspot circles (steps 4-9: "Add or update your email address", "proceed with verification", "Send Verification Email", "change your email subject", "change the body", "confirm your notification preferences") should move to — purple circle was slightly off-target on each, tooltip needed to follow. Since the screenshots were pasted inline (not real file attachments), they weren't accessible for pixel-level color analysis — best-effort visual nudges were made to `ox` (clickX) values in `build_booking_guide.js`'s `WIDGETS` array for those 6 steps, per the user's explicit instruction to keep clickY unchanged and just nudge clickX a little. **The user has not yet confirmed these nudges look correct** — this needs visual verification in your session.
4. User asked to change step 9's tooltip text to: `Click the "X" button to confirm your notification preferences (important).` — done, confirmed via grep on the regenerated HTML.

**Immediate next step**: ask the user (or check yourself if you have rendering/screenshot tools) whether the 6 nudged hotspot positions actually look right now. If the user attaches the reference screenshots as real file uploads this time (not pasted inline), you can do exact pixel-color detection (find the purple circle centroid, find the red arrow tip) instead of eyeballing — much more reliable. See "Known bug" section below — if they re-upload, the files will land in your uploads folder and you can run real image analysis with PIL/numpy.

## How to regenerate the deliverable after any data change

```bash
cd tools/booking-guide-builder
node build_booking_guide.js
cp booking-inquiry-guide/index.html ../../exported-guides/booking-inquiry-form-booking-email/index.html
```

Always run `node --check <file>` on any `.js` file you edit before relying on it (rename to `.js` extension first if you wrote it elsewhere) — see why below.

## CRITICAL: known infrastructure bug — read before editing review.js or playerTemplate.js

There is a real, repeatedly-confirmed bug in this environment: after using the Edit or Write tool to modify a file, the bash/shell sandbox's view of that file can be **silently truncated** — not just stale, but physically missing trailing content — even though the Edit/Write tool reported success and even after a full re-Write. This has hit both `chrome-extension/review.js` (2277 lines) and `tools/booking-guide-builder/playerTemplate.js` multiple times, always manifesting as `node --check` or `node build_booking_guide.js` failing with `SyntaxError: Unexpected end of input`, with the truncation point landing mid-statement.

**Symptom**: you used Edit/Write, tool reported success, but running the file in bash throws a syntax error about unexpected end of input.

**Fix that reliably works**: bypass the Edit/Write-to-bash sync path entirely.
1. Use the `Read` tool to pull the complete, correct file content (Read tool's view is reliable; it's specifically the Edit/Write → bash sync that's broken).
2. Write that exact content directly through a bash heredoc:
   ```bash
   cat > /path/to/file.js <<'SOME_UNIQUE_EOF_MARKER'
   ...full file content here...
   SOME_UNIQUE_EOF_MARKER
   ```
3. Validate immediately: `node --check /path/to/file.js` (rename to `.js` if it isn't already — `node --check` rejects other extensions; copy to a temp `.js` file for validation if needed, you can't always rm temp files due to sandbox permission quirks — truncating with `: > file` works as a substitute for deletion if `rm` fails with "Operation not permitted").
4. For very large files where reproducing the whole thing via heredoc from memory is risky, use a hybrid: `head -n <last-known-good-line> file > file.new`, then heredoc-append the corrected tail with `cat >> file.new <<'EOF' ... EOF`, validate, then `mv -f file.new file`.

This is purely an artifact of the Windows-host-to-Linux-sandbox file sync layer in this environment, not a logic bug in the code itself. Don't assume your Edit/Write succeeded just because the tool said so — if a subsequent `node --check` or build run fails with a truncation-shaped syntax error, suspect this bug immediately and use the heredoc workaround rather than debugging the "logic."

## Older pending work (not blocking, no action needed unless user asks)

These were identified earlier in the project but are not in scope unless the user explicitly asks to resume them:
- Confirm/find examples of "blur" and "rectangle outline with text label" annotation types in real Storylane guides (to make sure our annotation renderer supports everything Storylane's does).
- Audit the Storylane project editor more broadly for any other functional features we might be missing.
- Implement whatever gaps are found from the above two audits.

## Style notes for working with this user

- Wants concise, direct responses. No unnecessary explanation, no padding.
- Cares a lot about pixel-level precision on hotspot/tooltip placement — don't guess if you can verify (ask for real file attachments rather than inline-pasted screenshots when precision matters).
- Appreciates being told plainly when something is a best-effort estimate vs. a verified fix.
