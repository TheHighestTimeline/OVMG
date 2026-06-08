import { notion, DB, title, richText, select, multiSelect, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, company, role, email, phone, website, status, type, relatesTo } = body;

    if (!name) return err(400, 'name is required');

    const page = await notion.pages.create({
      parent: { database_id: DB.CRM },
      properties: {
        Name:       title(name),
        Company:    richText(company || ''),
        Role:       richText(role || ''),
        Email:      { email: email || null },
        Phone:      { phone_number: phone || null },
        Website:    { url: website || null },
        Status:     select(status || 'Active'),
        Type:       select(type   || 'External'),
        'Relates To': multiSelect(relatesTo || []),
      },
    });

    return ok({ id: page.id, name });
  } catch (e) {
    return err(500, e.message);
  }
};
