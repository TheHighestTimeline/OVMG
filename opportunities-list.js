// opportunities-list — GET: all Opportunities from the Notion Opportunities DB.
// An Opportunity is the overall effort (e.g. "OVMG x StormVex"); it carries a
// Deal Category (the internal company) and rolls up its related tasks. The
// dashboard joins these to tasks (via task.relatedOpportunities) and to company
// pages (via dealCategory) — see src/views/Opportunities.jsx.
import { notion, DB, getProp, ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = await requireAuth(event);
  if (authErr) return authErr;

  try {
    const pages = [];
    let cursor;
    do {
      const res = await notion.databases.query({
        database_id: DB.OPPORTUNITIES,
        start_cursor: cursor,
        page_size: 100,
      });
      pages.push(...res.results);
      cursor = res.has_more ? res.next_cursor : null;
    } while (cursor);

    const opportunities = pages.map(p => ({
      id:           p.id,
      name:         getProp(p, 'Opportunity') || getProp(p, 'Name') || '(untitled)',
      dealCategory: getProp(p, 'Deal Category') || [],
      stage:        getProp(p, 'Stage'),
      status:       getProp(p, 'Status'),         // status-type property
      priority:     getProp(p, 'Priority'),
      dealValue:    getProp(p, 'Deal Value'),
      nextAction:   getProp(p, 'Next Action'),
      nextActionDate: getProp(p, 'Next Action Date'),
      // driveLink is still encoded as a "[drive]: <url>" line at the top of Notes
      // (no dedicated Notion property for it). Strip it (and any legacy [kanban]:
      // line) from the visible notes. internal/external now lives in the real
      // "Work Type" select, not in Notes.
      notes:        (() => { const r = getProp(p, 'Notes') || ''; return r.replace(/^\[(?:drive|kanban)\]:.*\n?/gm, '').trim(); })(),
      driveLink:    (() => { const r = getProp(p, 'Notes') || ''; const m = r.match(/^\[drive\]:\s*(.+)/m); return m ? m[1].trim() : null; })(),
      kanbanType:   (() => { const w = getProp(p, 'Work Type'); return w === 'Internal' ? 'internal' : w === 'External' ? 'external' : null; })(),
      mainPoc:      getProp(p, 'Main POC'),
      mainEmail:    getProp(p, 'Main Email'),
      mainPhone:    getProp(p, 'Main Phone'),
      companyIds:   getProp(p, 'Deal From') || [],
      taskIds:      getProp(p, 'Roll Up Tasks') || [],
      updatedAt:    p.last_edited_time,
    }));

    return ok(opportunities);
  } catch (e) {
    return err(500, e.message);
  }
};
