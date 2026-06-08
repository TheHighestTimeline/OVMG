// opportunities-update — PATCH: update an Opportunity in Notion.
import { notion, richText, select, multiSelect, number, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  const { id, name, stage, dealCategory, priority, dealValue, notes, nextAction, nextActionDate, mainPoc, mainEmail, mainPhone, kanbanType } = body;
  if (!id) return err(400, 'id is required');

  try {
    const props = {};
    // internal/external → Notion "Work Type" select (Internal/External). '' clears it.
    if (kanbanType !== undefined) props['Work Type'] = select(kanbanType === 'internal' ? 'Internal' : kanbanType === 'external' ? 'External' : null);
    if (name          !== undefined) props['Opportunity']       = { title: [{ text: { content: String(name || '') } }] };
    if (stage         !== undefined) props['Stage']             = select(stage);
    if (dealCategory  !== undefined) props['Deal Category']     = multiSelect(Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean));
    if (priority      !== undefined) props['Priority']          = select(priority);
    if (dealValue     !== undefined) props['Deal Value']        = number(dealValue != null ? Number(dealValue) : null);
    if (notes         !== undefined) props['Notes']             = richText(notes || '');
    if (nextAction    !== undefined) props['Next Action']       = richText(nextAction || '');
    if (nextActionDate !== undefined) props['Next Action Date'] = date(nextActionDate || null);
    if (mainPoc       !== undefined) props['Main POC']         = richText(mainPoc   || '');
    if (mainEmail     !== undefined) props['Main Email']       = { email: mainEmail || null };
    if (mainPhone     !== undefined) props['Main Phone']       = { phone_number: mainPhone || null };

    if (Object.keys(props).length > 0) {
      await notion.pages.update({ page_id: id, properties: props });
    }
    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
