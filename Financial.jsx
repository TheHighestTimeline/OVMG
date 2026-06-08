import { notion, DB, title, richText, select, relation, ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { contactId, title: noteTitle, body: noteBody, type, summary } = body;

    const page = await notion.pages.create({
      parent: { database_id: DB.NOTES },
      properties: {
        Title:   title(noteTitle || 'Voice Note'),
        Body:    richText(noteBody || ''),
        Summary: richText(summary || ''),
        Type:    select(type || 'Note'),
        ...(contactId ? { Contact: relation([contactId]) } : {}),
      },
    });

    return ok({ id: page.id, created: true });
  } catch (e) {
    return err(500, e.message);
  }
};
