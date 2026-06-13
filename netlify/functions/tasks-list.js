import { airtableList, fromAirtableRecord, TASKS_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_TASKS || 'Master Action Board';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const records = await airtableList(TABLE(), {
      sort: [{ field: 'Due Date', direction: 'asc' }],
    });

    const tasks = records.map(r => {
      const t = fromAirtableRecord(r, TASKS_MAP);
      // Normalise multi-value fields
      t.dealCategory         = Array.isArray(t.dealCategory)         ? t.dealCategory         : (t.dealCategory         ? [t.dealCategory]         : []);
      t.relatedOpportunities = Array.isArray(t.relatedOpportunities) ? t.relatedOpportunities : (t.relatedOpportunities ? [t.relatedOpportunities] : []);
      t.companyNames         = []; // dealCategory is the source of truth in Airtable
      return t;
    });

    return ok(tasks);
  } catch (e) {
    return err(500, e.message);
  }
};
