import { notion, DB, richText, select, multiSelect, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, status, priority, owner, dueDate, task, dealCategory, taskType, updateNote } = body;

    if (!id) return err(400, 'id is required');

    const props = {};
    if (status       !== undefined) props['Status']       = select(status);
    if (priority     !== undefined) props['Priority']     = select(priority);
    if (owner        !== undefined) props['Owner']        = richText(owner);
    if (dueDate      !== undefined) props['Due Date']     = date(dueDate || null);
    // Task Type = the section / subgroup inside a company (Admin, Client, Team, …).
    if (taskType     !== undefined) props['Task Type']    = select(taskType || null);
    // Title field — Notion tasks use "Task" as the title property name
    if (task         !== undefined) props['Task']         = { title: [{ text: { content: String(task || '') } }] };
    // Deal Category is the company link (see SLUG_TO_DEAL_CATEGORY); there is no
    // "Company Names" property in the Tasks DB — writing one errored before.
    if (dealCategory !== undefined) props['Deal Category'] = multiSelect(Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean));

    if (Object.keys(props).length > 0) {
      await notion.pages.update({ page_id: id, properties: props });
    }

    // Append a typed or voice note as a timestamped callout block
    if (updateNote) {
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
    return err(500, e.message);
  }
};
