// Saves a reference-site note to the Notion NOTES database and tags it
// so Tanner can easily filter feedback from the References tab.
import { notion, DB, ok, err, CORS, title, richText, select } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed');

  try {
    const { site, siteUrl, note, authorName, authorEmail } = JSON.parse(event.body || '{}');
    if (!site || !note) return err(400, 'site and note are required');

    const pageTitle = `[Ref Note] ${site} — ${authorName || authorEmail || 'Team'}`;

    const page = await notion.pages.create({
      parent: { database_id: DB.NOTES },
      properties: {
        Name:    title(pageTitle),
        // Most NOTES DBs have a rich_text "Content" or "Notes" field — try both gracefully
        ...(DB.NOTES ? { Content: richText(`Site: ${siteUrl}\nFrom: ${authorName} (${authorEmail})\n\n${note}`) } : {}),
      },
      children: [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: { rich_text: [{ type: 'text', text: { content: `Feedback for: ${site}` } }] },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: `🔗 ${siteUrl}` } }] },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: `👤 From: ${authorName || 'Unknown'} (${authorEmail || 'no email'})` } }] },
        },
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: note } }] },
        },
      ],
    });

    return ok({ id: page.id });
  } catch (e) {
    // If "Content" property doesn't exist in the NOTES schema, retry without it
    if (e.code === 'validation_error' || e.status === 400) {
      try {
        const { site, siteUrl, note, authorName, authorEmail } = JSON.parse(event.body || '{}');
        const pageTitle = `[Ref Note] ${site} — ${authorName || authorEmail || 'Team'}`;
        const page = await notion.pages.create({
          parent: { database_id: DB.NOTES },
          properties: { Name: title(pageTitle) },
          children: [
            { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ type: 'text', text: { content: `Feedback for: ${site}` } }] } },
            { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: `🔗 ${siteUrl}` } }] } },
            { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: `👤 From: ${authorName || 'Unknown'} (${authorEmail || 'no email'})` } }] } },
            { object: 'block', type: 'divider', divider: {} },
            { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: note } }] } },
          ],
        });
        return ok({ id: page.id });
      } catch (e2) {
        console.error('references-note retry error:', e2);
        return err(500, e2.message);
      }
    }
    console.error('references-note error:', e);
    return err(500, e.message);
  }
};
