import { notion, DB, title, richText, select, multiSelect, date, relation, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { task, status, priority, owner, dueDate, dealCategory, taskType, note, relatedOpportunity } = body;

    if (!task) return err(400, 'task is required');

    const properties = {
      Task:            title(task),
      Status:          select(status || 'Not started'),
      Priority:        select(priority || null),
      Owner:           richText(owner || ''),
      'Due Date':      date(dueDate || null),
      // Deal Category is the company link — a task surfaces on a company's page
      // when its Deal Category matches that company (see SLUG_TO_DEAL_CATEGORY).
      'Deal Category': multiSelect(Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean)),
    };
    // Task Type = the section / subgroup inside a company (Admin, Client, Team,
    // External, …). Only written when provided so existing automations are safe.
    if (taskType) properties['Task Type'] = select(taskType);
    // Link the task to an Opportunity (Kanban card) so it rolls up on that card
    // and surfaces on the company's task board.
    if (relatedOpportunity) properties['Related Opportunities'] = relation([relatedOpportunity]);

    const page = await notion.pages.create({
      parent: { database_id: DB.TASKS },
      properties,
    });

    // Optional first note, captured at creation time as a timestamped callout
    // (same format the update endpoint uses) so context isn't lost on intake.
    if (note && note.trim()) {
      const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      await notion.blocks.children.append({
        block_id: page.id,
        children: [{
          object: 'block', type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '🗣️' },
            rich_text: [{ type: 'text', text: { content: `[${ts}] ${note.trim()}` } }],
            color: 'gray_background',
          },
        }],
      });
    }

    return ok({ id: page.id, task, status, priority, owner, dueDate, taskType: taskType || null, dealCategory: dealCategory || [] });
  } catch (e) {
    return err(500, e.message);
  }
};
