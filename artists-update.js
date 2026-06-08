import { notion, richText, select, multiSelect, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }
  if (!body.id) return err(400, 'id required');

  const props = {};
  if (body.bio !== undefined)             props['Bio']             = richText(body.bio);
  if (body.brandVoice !== undefined)      props['Brand Voice']     = richText(body.brandVoice);
  if (body.targetAudience !== undefined)  props['Target Audience'] = richText(body.targetAudience);
  if (body.dos !== undefined)             props["Do's"]            = multiSelect(body.dos);
  if (body.donts !== undefined)           props["Don'ts"]          = multiSelect(body.donts);
  if (body.brandColors !== undefined)     props['Brand Colors']    = richText((body.brandColors || []).join(', '));
  if (body.genre !== undefined)           props['Genre']           = select(body.genre);
  if (body.driveFolderId !== undefined)   props['Drive Folder ID'] = richText(body.driveFolderId);

  try {
    await notion.pages.update({ page_id: body.id, properties: props });
    return ok({ id: body.id });
  } catch (e) {
    console.error('[social:artists-update]', e.message);
    return err(500, e.message);
  }
};
