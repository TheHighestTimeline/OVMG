import { notion, title, richText, select, multiSelect, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

// CRM schema (verified): Name=title, Email=rich_text (NOT email type),
// Phone=phone_number, Role=rich_text, Status=select, Select=select (the "type":
// Internal/External), Relates To=multi_select. There is NO Company/Website/Type
// property — the previous handler wrote those (and Email as an email type), which
// made Notion reject every contact edit. This now mirrors contacts-create.js.
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, name, role, email, phone, status, type, relatesTo } = body;

    if (!id) return err(400, 'id is required');

    const props = {};
    if (name      !== undefined) props['Name']       = title(name);
    if (role      !== undefined) props['Role']       = richText(role);
    if (email     !== undefined) props['Email']      = richText(email || '');
    if (phone     !== undefined) props['Phone']      = { phone_number: phone || null };
    if (status    !== undefined) props['Status']     = select(status);
    if (type      !== undefined) props['Select']     = select(type);
    if (relatesTo !== undefined) props['Relates To'] = multiSelect(relatesTo);
    // `company`/`website` are accepted in the payload for backwards-compat but
    // intentionally NOT written — those properties don't exist in the CRM DB.

    if (Object.keys(props).length > 0) {
      await notion.pages.update({ page_id: id, properties: props });
    }
    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
