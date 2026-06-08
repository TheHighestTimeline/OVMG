// Updates a lead's status and optional fields in the OVM Sales Pipeline database.
// Also supports appending a timestamped callout note to the lead's page (matches tasks pattern).
import { notion, select, richText, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  if (event.httpMethod !== 'PATCH') return err(405, 'Method not allowed');

  try {
    const {
      id, status, assignedTo, notes, emailSent, dmSent, nextAction,
      updateNote, // optional — appends a timestamped callout block
    } = JSON.parse(event.body || '{}');
    if (!id) return err(400, 'id is required');

    const props = {};
    if (status     !== undefined) props['Status']                  = select(status);
    if (assignedTo !== undefined) props['Assigned Partner / Owner'] = richText(assignedTo);
    if (notes      !== undefined) props['Notes']                   = richText(notes);
    if (nextAction !== undefined) props['Next Action']             = richText(nextAction);
    if (emailSent  !== undefined) props['Email Sent']              = { checkbox: !!emailSent };
    if (dmSent     !== undefined) props['Instagram DM Sent']       = { checkbox: !!dmSent };

    if (Object.keys(props).length > 0) {
      await notion.pages.update({ page_id: id, properties: props });
    }

    // Append a typed or voice note as a timestamped callout block (newest accumulate at the bottom of the page, frontend reverses for display)
    if (updateNote && String(updateNote).trim()) {
      const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      await notion.blocks.children.append({
        block_id: id,
        children: [{
          object: 'block',
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '🗣️' },
            rich_text: [{ type: 'text', text: { content: `[${ts}] ${updateNote}` } }],
            color: 'gray_background',
          },
        }],
      });
    }

    return ok({ id, updated: true });
  } catch (e) {
    console.error('outreach-update error:', e);
    return err(500, e.message);
  }
};
