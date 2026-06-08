import { notion, DB, title, richText, select, multiSelect, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { task, status, priority, owner, dueDate, dealCategory, companyNames } = body;

    if (!task) return err(400, 'task is required');

    const page = await notion.pages.create({
      parent: { database_id: DB.TASKS },
      properties: {
        Task:          title(task),
        Status:        select(status || 'Not started'),
        Priority:      select(priority || null),
        Owner:         richText(owner || ''),
        'Due Date':    date(dueDate || null),
        'Deal Category': multiSelect(dealCategory || []),
        'Company Names': multiSelect(companyNames || []),
      },
    });

    return ok({ id: page.id, task, status, priority, owner, dueDate });
  } catch (e) {
    return err(500, e.message);
  }
};
