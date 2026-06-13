// GET  /.netlify/functions/email-state  → returns current user's saved email state
// POST /.netlify/functions/email-state  → upserts current user's state
import { notion, ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';

const DB_ID = process.env.NOTION_EMAIL_STATE_DB_ID || 'c0208c0522b94b99b2e5bad511e0c937';

// Find existing state record for this user
async function findRecord(email) {
  const res = await notion.databases.query({
    database_id: DB_ID,
    filter: { property: 'UserEmail', title: { equals: email } },
    page_size: 1,
  });
  return res.results[0] || null;
}

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  const user  = await getUser(event);
  const email = user?.email;
  if (!email) return err(401, 'Could not identify user');

  // ── GET: return saved state ───────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    try {
      const page = await findRecord(email);
      if (!page) return ok({ lastLabel: 'INBOX', lastThreadId: null, draftTo: '', draftSubject: '', draftBody: '' });

      const p = page.properties;
      const rt = key => p[key]?.rich_text?.map(r => r.plain_text).join('') || '';

      return ok({
        lastLabel:    rt('LastLabel')    || 'INBOX',
        lastThreadId: rt('LastThreadId') || null,
        draftTo:      rt('DraftTo'),
        draftSubject: rt('DraftSubject'),
        draftBody:    rt('DraftBody'),
      });
    } catch (e) {
      console.error('email-state GET error:', e);
      return err(500, e.message);
    }
  }

  // ── POST: upsert state ───────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    try {
      const { lastLabel, lastThreadId, draftTo, draftSubject, draftBody } = JSON.parse(event.body || '{}');

      const rt  = text => ({ rich_text: [{ text: { content: (text || '').slice(0, 2000) } }] });
      const now = new Date().toISOString().slice(0, 10);

      const props = {
        LastLabel:    rt(lastLabel    || 'INBOX'),
        LastThreadId: rt(lastThreadId || ''),
        DraftTo:      rt(draftTo      || ''),
        DraftSubject: rt(draftSubject || ''),
        DraftBody:    rt(draftBody    || ''),
        UpdatedAt:    { date: { start: now } },
      };

      const existing = await findRecord(email);
      if (existing) {
        await notion.pages.update({ page_id: existing.id, properties: props });
      } else {
        await notion.pages.create({
          parent: { database_id: DB_ID },
          properties: {
            UserEmail: { title: [{ text: { content: email } }] },
            ...props,
          },
        });
      }

      return ok({ saved: true });
    } catch (e) {
      console.error('email-state POST error:', e);
      return err(500, e.message);
    }
  }

  return err(405, 'Method not allowed');
};
