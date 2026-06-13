import { airtableList, fromAirtableRecord, CONTACTS_MAP } from './_airtable.js';
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

const TABLE = () => process.env.AIRTABLE_TABLE_CONTACTS || 'CRM Contacts';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const records = await airtableList(TABLE(), {
      sort: [{ field: 'Name', direction: 'asc' }],
    });

    const contacts = records.map(r => ({
      ...fromAirtableRecord(r, CONTACTS_MAP),
      company: r.fields['Company'] ?? null,
      website: r.fields['Website'] ?? null,
    }));

    return ok(contacts);
  } catch (e) {
    return err(500, e.message);
  }
};
