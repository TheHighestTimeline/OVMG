import { airtableUpdate, toAirtableFields, OPPORTUNITIES_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_OPPORTUNITIES || 'Opportunities';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  const { id, name, stage, dealCategory, priority, dealValue, notes, nextAction, nextActionDate, mainPoc, mainEmail, mainPhone, kanbanType } = body;
  if (!id) return err(400, 'id is required');

  try {
    const update = {};
    if (name           !== undefined) update.name           = name;
    if (stage          !== undefined) update.stage          = stage;
    if (dealCategory   !== undefined) update.dealCategory   = Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean);
    if (priority       !== undefined) update.priority       = priority;
    if (dealValue      !== undefined) update.dealValue      = dealValue != null ? Number(dealValue) : null;
    if (notes          !== undefined) update.notes          = notes;
    if (nextAction     !== undefined) update.nextAction     = nextAction;
    if (nextActionDate !== undefined) update.nextActionDate = nextActionDate || null;
    if (mainPoc        !== undefined) update.mainPoc        = mainPoc;
    if (mainEmail      !== undefined) update.mainEmail      = mainEmail;
    if (mainPhone      !== undefined) update.mainPhone      = mainPhone;

    const fields = toAirtableFields(update, OPPORTUNITIES_MAP);
    if (kanbanType !== undefined) {
      fields['Work Type'] = kanbanType === 'internal' ? 'Internal' : kanbanType === 'external' ? 'External' : null;
    }

    if (Object.keys(fields).length === 0) return ok({ id, updated: false });
    await airtableUpdate(TABLE(), id, fields);
    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
