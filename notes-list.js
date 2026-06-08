import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  const contactId = event.queryStringParameters?.contactId;
  if (!contactId) return err(400, 'contactId is required');

  try {
    const res = await notion.databases.query({
      database_id: DB.NOTES,
      // The Calls/Notes DB's relation back to a contact is named "CRM" (not
      // "Contact") — querying the wrong property name was returning a 500.
      filter: {
        property: 'CRM',
        relation: { contains: contactId },
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 50,
    });

    const notes = res.results.map(p => ({
      id:          p.id,
      title:       getProp(p, 'Title') || getProp(p, 'Name') || 'Note',
      body:        getProp(p, 'Raw Notes / Transcript') || getProp(p, 'AI Summary') || '',
      type:        getProp(p, 'Type') || 'Note',
      summary:     getProp(p, 'AI Summary') || '',
      createdTime: p.created_time,
    }));

    return ok(notes);
  } catch (e) {
    return err(500, e.message);
  }
};
