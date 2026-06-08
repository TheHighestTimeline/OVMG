import { notion, title, richText, select, date, relation, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const DB = process.env.NOTION_POSTS_DB_ID || '';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;
  if (!DB) return ok({ id: 'local_' + Date.now() });

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  try {
    const page = await notion.pages.create({
      parent: { database_id: DB },
      properties: {
        'Name':         title((body.caption || '').slice(0, 60) || 'Untitled Post'),
        'Client':       body.client_id && body.client_id.length > 20 ? relation([body.client_id]) : { rich_text: [{ text: { content: body.client_id || '' } }] },
        'Platform':     select(body.platform || 'instagram'),
        'Caption':      richText(body.caption || ''),
        'Hashtags':     richText(body.hashtags || ''),
        'Status':       select(body.status || 'draft'),
        'Scheduled At': date(body.scheduled_at || null),
        'AI Generated': { checkbox: !!body.ai_generated },
      },
    });
    return ok({ id: page.id, ...body });
  } catch (e) {
    console.error('[social:posts-create]', e.message);
    return ok({ id: 'local_' + Date.now(), ...body });  // soft-fail so UI keeps working
  }
};
