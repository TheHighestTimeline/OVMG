import { notion, title, richText, select, multiSelect, date, number, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const DB = process.env.NOTION_CLIENTS_DB_ID || '';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  const unauth = await requireAuth(event); if (unauth) return unauth;
  if (!DB) return err(400, 'NOTION_CLIENTS_DB_ID not set');

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }
  if (!body.name) return err(400, 'name required');

  try {
    const page = await notion.pages.create({
      parent: { database_id: DB },
      properties: {
        'Name':             title(body.name),
        'Genre':            select(body.genre || null),
        'Bio':              richText(body.bio || ''),
        'Brand Voice':      richText(body.brandVoice || ''),
        'Target Audience':  richText(body.targetAudience || ''),
        "Do's":             multiSelect(body.dos || []),
        "Don'ts":           multiSelect(body.donts || []),
        'Brand Colors':     richText((body.brandColors || []).join(', ')),
        'IG Handle':        richText(body.handles?.instagram || body.ig || ''),
        'TikTok Handle':    richText(body.handles?.tiktok || body.tiktok || ''),
        'Facebook Handle':  richText(body.handles?.facebook || ''),
        'YouTube Handle':   richText(body.handles?.youtube || ''),
        'Color':            richText(body.color || '#d96b3a'),
        'Initials':         richText(body.initials || ''),
        'Drive Folder ID':  richText(body.driveFolderId || ''),
        'Last Synced':      date(new Date().toISOString()),
      },
    });
    return ok({ id: page.id, ...body });
  } catch (e) {
    console.error('[social:artists-create]', e.message);
    return err(500, e.message);
  }
};
