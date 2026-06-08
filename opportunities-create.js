// opportunities-create — POST: create a new Opportunity in Notion.
import { notion, DB, title, richText, select, multiSelect, number, date, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  const { name, stage, dealCategory, priority, dealValue, notes, nextAction, nextActionDate, mainPoc, mainEmail, mainPhone, kanbanType } = body;
  if (!name) return err(400, 'name is required');

  // internal/external maps to the Notion "Work Type" select (Internal/External).
  const workType = kanbanType === 'internal' ? 'Internal' : kanbanType === 'external' ? 'External' : null;

  try {
    const page = await notion.pages.create({
      parent: { database_id: DB.OPPORTUNITIES },
      properties: {
        Opportunity:      title(name),
        Stage:            select(stage || 'Intake'),
        'Deal Category':  multiSelect(Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean)),
        Priority:         select(priority || null),
        'Deal Value':     number(dealValue != null ? Number(dealValue) : null),
        Notes:            richText(notes || ''),
        'Next Action':    richText(nextAction || ''),
        'Next Action Date': date(nextActionDate || null),
        'Main POC':       richText(mainPoc   || ''),
        'Main Email':     { email: mainEmail || null },
        'Main Phone':     { phone_number: mainPhone || null },
        'Work Type':      select(workType),
      },
    });
    return ok({ id: page.id, name });
  } catch (e) {
    return err(500, e.message);
  }
};
