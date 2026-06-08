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
        database_id: DB.CRM,
        start_cursor: cursor,
        page_size: 100,
        sorts: [{ property: 'Name', direction: 'ascending' }],
      });
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : null;
    } while (cursor);

    const contacts = pages.map(p => ({
      id:        p.id,
      name:      getProp(p, 'Name') || getProp(p, 'Full Name') || '(unnamed)',
      company:   getProp(p, 'Company'),
      role:      getProp(p, 'Role') || getProp(p, 'Title'),
      email:     getProp(p, 'Email'),
      phone:     getProp(p, 'Phone'),
      website:   getProp(p, 'Website'),
      status:    getProp(p, 'Status'),
      type:      getProp(p, 'Type'),
      relatesTo: getProp(p, 'Relates To') || getProp(p, 'Related To') || [],
      updatedAt: p.last_edited_time,
    }));

    return ok(contacts);
  } catch (e) {
    return err(500, e.message);
  }
};
