import { notion, richText, select, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }
  if (!body.id) return err(400, 'id required');
  if (body.id.startsWith('local_') || body.id.startsWith('sp_') || body.id.startsWith('p')) return ok({ id: body.id }); // local-only id, nothing to update

  const props = {};
  if (body.caption !== undefined)      props['Caption']      = richText(body.caption);
  if (body.hashtags !== undefined)     props['Hashtags']     = richText(body.hashtags);
  if (body.status !== undefined)       props['Status']       = select(body.status);
  if (body.scheduled_at !== undefined) props['Scheduled At'] = date(body.scheduled_at);

  try {
    await notion.pages.update({ page_id: body.id, properties: props });
    return ok({ id: body.id });
  } catch (e) {
    console.error('[social:posts-update]', e.message);
    return ok({ id: body.id });  // soft-fail
  }
};
