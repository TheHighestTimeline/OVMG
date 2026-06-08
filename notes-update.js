// Updates a note's title and/or body in the NOTES database.
import { notion, DB, richText, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const { id, title, body } = JSON.parse(event.body || '{}');
    if (!id) return err(400, 'id is required');

    const props = {};
    if (title !== undefined) props['Title'] = { title: [{ text: { content: String(title || '') } }] };
    if (body  !== undefined) props['Body']  = richText(body || '');

    if (Object.keys(props).length === 0) return err(400, 'No fields to update');

    await notion.pages.update({ page_id: id, properties: props });
    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
