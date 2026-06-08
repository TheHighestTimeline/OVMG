import { notion, richText, select, multiSelect, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { id, company, role, email, phone, website, status, type, relatesTo } = body;

    if (!id) return err(400, 'id is required');

    const props = {};
    if (company   !== undefined) props['Company']    = richText(company);
    if (role      !== undefined) props['Role']       = richText(role);
    if (email     !== undefined) props['Email']      = { email: email || null };
    if (phone     !== undefined) props['Phone']      = { phone_number: phone || null };
    if (website   !== undefined) props['Website']    = { url: website || null };
    if (status    !== undefined) props['Status']     = select(status);
    if (type      !== undefined) props['Type']       = select(type);
    if (relatesTo !== undefined) props['Relates To'] = multiSelect(relatesTo);

    await notion.pages.update({ page_id: id, properties: props });
    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
