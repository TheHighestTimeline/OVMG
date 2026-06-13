import { airtableCreate, toAirtableFields, OPPORTUNITIES_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_OPPORTUNITIES || 'Opportunities';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return err(400, 'Invalid JSON'); }

  const { name, stage, dealCategory, priority, dealValue, notes, driveLink, nextAction, nextActionDate, mainPoc, mainEmail, mainPhone, kanbanType } = body;
  if (!name) return err(400, 'name is required');

  try {
    const obj = {
      name,
      stage:          stage || 'Intake',
      dealCategory:   Array.isArray(dealCategory) ? dealCategory : [dealCategory].filter(Boolean),
      notes:          notes      || '',
      nextAction:     nextAction || '',
      mainPoc:        mainPoc    || '',
      mainEmail:      mainEmail  || '',
      mainPhone:      mainPhone  || '',
    };
    if (priority       != null) obj.priority       = priority;
    if (dealValue      != null) obj.dealValue       = Number(dealValue);
    if (nextActionDate != null) obj.nextActionDate  = nextActionDate;

    const fields = toAirtableFields(obj, OPPORTUNITIES_MAP);
    if (driveLink  != null) fields['Drive Link']  = driveLink;
    if (kanbanType !== undefined) {
      fields['Work Type'] = kanbanType === 'internal' ? 'Internal' : kanbanType === 'external' ? 'External' : null;
    }

    const record = await airtableCreate(TABLE(), fields);
    return ok({ id: record.id, name });
  } catch (e) {
    return err(500, e.message);
  }
};
