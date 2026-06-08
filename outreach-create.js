// Creates a new lead in the OVM Sales Pipeline Notion database.
import { notion, DB, title, richText, select, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed');
  if (!DB.OUTREACH) return err(503, 'NOTION_OUTREACH_DB_ID env var not set');

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      name, contactName, businessType, cityState, email, phone,
      website, instagram, linkedin, source, leadQuality, priority,
      status, assignedTo, recOffer, nextAction, notes,
    } = body;

    if (!name || !String(name).trim()) return err(400, 'name is required');

    const props = {
      'Lead / Business Name':       title(name),
    };

    // Only set fields the caller provided (so we don't clobber Notion defaults with empty values)
    if (status        !== undefined) props['Status']                    = select(status || 'No Status');
    if (contactName   !== undefined) props['Contact Name']              = richText(contactName);
    if (businessType  !== undefined) props['Business Type']             = select(businessType || null);
    if (cityState     !== undefined) props['City / State']              = richText(cityState);
    if (email         !== undefined) props['Contact Email']             = { email: email || null };
    if (phone         !== undefined) props['Phone']                     = { phone_number: phone || null };
    if (website       !== undefined) props['Website']                   = { url: website || null };
    if (instagram     !== undefined) props['Instagram']                 = { url: instagram || null };
    if (linkedin      !== undefined) props['LinkedIn']                  = { url: linkedin || null };
    if (source        !== undefined) props['Source']                    = select(source || null);
    if (leadQuality   !== undefined) props['Lead Quality']              = select(leadQuality || null);
    if (priority      !== undefined) props['Priority']                  = select(priority || null);
    if (assignedTo    !== undefined) props['Assigned Partner / Owner']  = richText(assignedTo);
    if (recOffer      !== undefined) props['Recommended Offer']         = richText(recOffer);
    if (nextAction    !== undefined) props['Next Action']               = richText(nextAction);
    if (notes         !== undefined) props['Notes']                     = richText(notes);

    const page = await notion.pages.create({
      parent: { database_id: DB.OUTREACH },
      properties: props,
    });

    return ok({ id: page.id, name, created: true });
  } catch (e) {
    console.error('outreach-create error:', e);
    // Notion's "Property type does not match" errors are common during DB schema drift.
    // Bubble up the message so the frontend can surface it.
    return err(500, e.message || 'Failed to create lead');
  }
};
