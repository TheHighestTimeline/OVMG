// opportunities-delete — DELETE: archive (trash) an Opportunity in Notion.
import { notion, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  const { id } = body;
  if (!id) return err(400, 'id is required');

  try {
    await notion.pages.update({ page_id: id, archived: true });
    return ok({ id, deleted: true });
  } catch (e) {
    return err(500, e.message);
  }
};
