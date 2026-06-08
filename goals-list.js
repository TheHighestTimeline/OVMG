import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const res = await notion.databases.query({
      database_id: DB.GOALS,
      page_size: 100,
      sorts: [{ property: 'Quarter', direction: 'ascending' }],
    });

    const goals = res.results.map(p => ({
      id:       p.id,
      goal:     getProp(p, 'Goal') || getProp(p, 'Name') || getProp(p, 'Title') || '',
      owner:    getProp(p, 'Owner'),
      status:   getProp(p, 'Status'),
      priority: getProp(p, 'Priority'),
      quarter:  getProp(p, 'Quarter'),
      progress: getProp(p, 'Progress') ?? 0,
      notes:    getProp(p, 'Notes'),
      category: getProp(p, 'Category') || getProp(p, 'Deal Category') || [],
    }));

    return ok(goals);
  } catch (e) {
    return err(500, e.message);
  }
};
