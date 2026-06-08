// Lists timestamped callout-note blocks attached to an outreach lead's Notion page.
// Mirrors tasks-notes-list.js exactly so the frontend can reuse the same parsing.
import { notion, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  const id = event.queryStringParameters?.id;
  if (!id) return err(400, 'id is required');

  try {
    const res = await notion.blocks.children.list({ block_id: id, page_size: 100 });
    const notes = (res.results || [])
      .filter(b => b.type === 'callout')
      .map(b => {
        const text  = (b.callout?.rich_text || []).map(r => r.plain_text).join('');
        const match = text.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
        return {
          id:        b.id,
          text,
          timestamp: match ? match[1] : null,
          body:      match ? match[2] : text,
          emoji:     b.callout?.icon?.emoji || '🗣️',
          createdAt: b.created_time,
        };
      })
      .reverse(); // newest first

    return ok(notes);
  } catch (e) {
    console.error('outreach-notes-list error:', e);
    return err(500, e.message);
  }
};
