import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const pages = [];
    let cursor;
    do {
      const res = await notion.databases.query({
        database_id: DB.TASKS,
        start_cursor: cursor,
        page_size: 100,
        sorts: [{ property: 'Due Date', direction: 'ascending' }],
      });
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : null;
    } while (cursor);

    const tasks = pages.map(p => ({
      id:           p.id,
      task:         getProp(p, 'Task') || getProp(p, 'Name') || getProp(p, 'Title') || '(untitled)',
      status:       getProp(p, 'Status'),
      priority:     getProp(p, 'Priority'),
      owner:        getProp(p, 'Owner') || (Array.isArray(getProp(p, 'Assignee')) ? (getProp(p, 'Assignee') || []).join(', ') : null),
      dueDate:      getProp(p, 'Due Date'),
      dealCategory: getProp(p, 'Deal Category') || [],
      companyNames: getProp(p, 'Company Names') || [],
      updatedAt:    p.last_edited_time,
    }));

    return ok(tasks);
  } catch (e) {
    return err(500, e.message);
  }
};
