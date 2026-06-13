// artists-delete — archives a client/artist page in the Notion roster DB.
// Notion has no hard delete via the API; archiving moves it to the workspace
// trash (recoverable for 30 days), which is the right behavior for a gated
// "delete this client" action in the dashboard.
import { notion, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }
  if (!body.id) return err(400, 'id required');

  try {
    await notion.pages.update({ page_id: body.id, archived: true });
    return ok({ id: body.id, deleted: true });
  } catch (e) {
    console.error('[social:artists-delete]', e.message);
    return err(500, e.message);
  }
};
