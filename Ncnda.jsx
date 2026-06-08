// Returns all leads from the OVM Sales Pipeline Notion database.
import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAuth(context);
  if (authErr) return authErr;

  if (!DB.OUTREACH) return err(503, 'NOTION_OUTREACH_DB_ID env var not set');

  try {
    const pages = [];
    let cursor;
    do {
      const res = await notion.databases.query({
        database_id: DB.OUTREACH,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : null;
    } while (cursor);

    const leads = pages.map(p => ({
      id:           p.id,
      name:         getProp(p, 'Lead / Business Name') || 'Unnamed Lead',
      status:       getProp(p, 'Status')               || 'No Status',
      contactName:  getProp(p, 'Contact Name')         || '',
      businessType: getProp(p, 'Business Type')        || '',
      cityState:    getProp(p, 'City / State')         || '',
      email:        getProp(p, 'Contact Email')        || '',
      phone:        getProp(p, 'Phone')                || '',
      website:      getProp(p, 'Website')              || '',
      instagram:    getProp(p, 'Instagram')            || '',
      linkedin:     getProp(p, 'LinkedIn')             || '',
      assignedTo:   getProp(p, 'Assigned Partner / Owner') || '',
      emailSent:    getProp(p, 'Email Sent')           ?? false,
      dmSent:       getProp(p, 'Instagram DM Sent')   ?? false,
      leadQuality:  getProp(p, 'Lead Quality')         || '',
      priority:     getProp(p, 'Priority')             || '',
      source:       getProp(p, 'Source')               || '',
      notes:        getProp(p, 'Notes')                || '',
      nextAction:   getProp(p, 'Next Action')          || '',
      nextFollowUp: getProp(p, 'Next Follow-Up Date')  || '',
      recOffer:     getProp(p, 'Recommended Offer')    || '',
      airtableLink: getProp(p, 'Airtable Link')        || '',
      createdTime:  p.created_time,
      url:          p.url,
    }));

    return ok(leads);
  } catch (e) {
    console.error('outreach-list error:', e);
    return err(500, e.message);
  }
};
