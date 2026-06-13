import { airtableList, fromAirtableRecord, OPPORTUNITIES_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_OPPORTUNITIES || 'Opportunities';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const records = await airtableList(TABLE());

    const opportunities = records.map(r => {
      const opp = fromAirtableRecord(r, OPPORTUNITIES_MAP);

      // Work Type → kanbanType
      const wt = r.fields['Work Type'];
      opp.kanbanType = wt === 'Internal' ? 'internal' : wt === 'External' ? 'external' : null;

      // Drive link — dedicated field in Airtable (was encoded in Notes text in Notion)
      opp.driveLink = r.fields['Drive Link'] || null;

      // Linked records
      opp.companyIds = r.fields['Deal From']      || [];
      opp.taskIds    = r.fields['Roll Up Tasks']  || [];

      // Normalise dealCategory to array
      if (!Array.isArray(opp.dealCategory)) {
        opp.dealCategory = opp.dealCategory ? [opp.dealCategory] : [];
      }

      return opp;
    });

    return ok(opportunities);
  } catch (e) {
    return err(500, e.message);
  }
};
