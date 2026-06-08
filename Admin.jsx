import { notion, DB, title, richText, select, multiSelect, number, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { goal, owner, quarter, status, priority, progress, notes, category } = body;

    if (!goal) return err(400, 'goal is required');

    const page = await notion.pages.create({
      parent: { database_id: DB.GOALS },
      properties: {
        Goal:     title(goal),
        Owner:    richText(owner || ''),
        Quarter:  select(quarter || 'Q2 2026'),
        Status:   select(status || 'Not Started'),
        Priority: select(priority || null),
        Progress: number(progress || 0),
        Notes:    richText(notes || ''),
        Category: multiSelect(category || []),
      },
    });

    return ok({ id: page.id, goal });
  } catch (e) {
    return err(500, e.message);
  }
};
