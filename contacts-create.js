import { notion, DB, title, richText, select, multiSelect, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

// Actual CRM schema:
//   Name        → title
//   Email       → rich_text  (NOT email type)
//   Phone       → phone_number
//   Role        → rich_text
//   Status      → select  ("Active" | "Benched" | "Unknown")
//   Select      → select  ("Internal" | "External")   ← this is the "Type" field
//   Relates To  → multi_select
//   (Company, Website, Type do NOT exist as text/url fields)

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, role, email, phone, status, type, relatesTo, notes } = body;

    if (!name) return err(400, 'name is required');

    const page = await notion.pages.create({
      parent: { database_id: DB.CRM },
      properties: {
        Name:         title(name),
        Role:         richText(role    || ''),
        Email:        richText(email   || ''),
        Phone:        { phone_number: phone || null },
        Status:       select(status || 'Active'),
        Select:       select(type   || 'External'),
        'Relates To': multiSelect(relatesTo || []),
      },
    });

    // Voice/quick-add flows pass an inline `notes` string. The CRM DB has no
    // notes property, so capture it as a block on the contact page rather than
    // dropping it silently.
    if (notes && notes.trim()) {
      await notion.blocks.children.append({
        block_id: page.id,
        children: [{
          object: 'block', type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '🗒️' },
            rich_text: [{ type: 'text', text: { content: notes.trim() } }],
            color: 'gray_background',
          },
        }],
      });
    }

    return ok({ id: page.id, name });
  } catch (e) {
    return err(500, e.message);
  }
};
