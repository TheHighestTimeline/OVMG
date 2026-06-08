import { notion, DB, richText, select, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, status, priority, owner, dueDate, updateNote } = body;

    if (!id) return err(400, 'id is required');

    // Build only the properties that were sent
    const props = {};
    if (status   !== undefined) props['Status']   = select(status);
    if (priority !== undefined) props['Priority']  = select(priority);
    if (owner    !== undefined) props['Owner']     = richText(owner);
    if (dueDate  !== undefined) props['Due Date']  = date(dueDate || null);

    if (Object.keys(props).length > 0) {
      await notion.pages.update({ page_id: id, properties: props });
    }

    // Append voice update note as a page block instead of a property
    // (avoids dependency on a specific "Last Update" property existing in the schema)
    if (updateNote) {
      const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      await notion.blocks.children.append({
        block_id: id,
        children: [
          {
            object: 'block',
            type: 'callout',
            callout: {
              icon: { type: 'emoji', emoji: '🗣️' },
              rich_text: [{ type: 'text', text: { content: `[${ts}] ${updateNote}` } }],
              color: 'gray_background',
            },
          },
        ],
      });
    }

    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
