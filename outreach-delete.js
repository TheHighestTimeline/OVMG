// outreach-delete — archives a lead in the OVM Sales Pipeline Notion DB.
// Notion has no hard delete via the API; archiving moves the page to the
// workspace trash (recoverable for 30 days), which is the right behavior for a
// gated "delete this lead" action.
import { notion, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }
  if (!body.id) return err(400, 'id is required');

  try {
    await notion.pages.update({ page_id: body.id, archived: true });
    return ok({ id: body.id, deleted: true });
  } catch (e) {
    console.error('[outreach-delete]', e.message);
    return err(500, e.message);
  }
};
