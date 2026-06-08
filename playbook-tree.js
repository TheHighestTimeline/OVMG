// playbook-tree — Phase 11 / Phase 16 (personal token support).
// Returns the Notion page hierarchy.
// Prefers the user's personal OAuth token (from user_notion_connections) so
// they see their own workspace. Falls back to PLAYBOOK_NOTION_TOKEN / NOTION_TOKEN.

import { Client } from '@notionhq/client';
import { ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';
import { getSupabase } from './_supabase.js';

function canAccessPlaybook(user) {
  const ovmgEmail = (user?.email || '').endsWith('@onevibemediagroup.com');
  const roles = [].concat(user?.publicMetadata?.roles || [], user?.publicMetadata?.role ? [user.publicMetadata.role] : []);
  return ovmgEmail || roles.includes('admin');
}

async function getNotionClient(userId) {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('user_notion_connections').select('access_token').eq('user_id', userId).single();
    if (data?.access_token) return { client: new Client({ auth: data.access_token }), personal: true };
  } catch {}
  const token = process.env.PLAYBOOK_NOTION_TOKEN || process.env.NOTION_TOKEN;
  if (!token) return { client: null, personal: false };
  return { client: new Client({ auth: token }), personal: false };
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');
    if (!canAccessPlaybook(user)) return err(403, 'Playbook is OVMG-only');

    const { client, personal } = await getNotionClient(user.id);
    if (!client) return err(503, 'Notion not configured. Connect your Notion workspace or set PLAYBOOK_NOTION_TOKEN.');

    const rawRootId = event.queryStringParameters?.rootId;
    const rootId = normalizeNotionId(rawRootId);

    // ── Fast path: a specific root page is pinned ─────────────────────────────
    // Walk just that page's child-page subtree instead of searching the whole
    // workspace (which times out on large workspaces).
    if (rootId) {
      const pagesById = {};

      // Try as a page first, then as a database — and surface the real Notion
      // error so we can tell apart "bad token" / "bad id" / "not shared".
      let rootPage = null;
      let pageErr = null;
      try {
        rootPage = await client.pages.retrieve({ page_id: rootId });
      } catch (e1) {
        pageErr = e1;
        try {
          const db = await client.databases.retrieve({ database_id: rootId });
          rootPage = {
            id: db.id,
            properties: {},
            icon: db.icon,
            last_edited_time: db.last_edited_time,
            url: db.url,
            _dbTitle: (db.title || []).map(t => t.plain_text).join('') || '(untitled database)',
          };
        } catch (e2) {
          const code = e1?.code || e2?.code || 'unknown';
          const msg  = e1?.body || e1?.message || 'unknown error';
          return err(404, `Notion could not open root id "${rootId}" (code: ${code}). ${msg}`);
        }
      }

      pagesById[rootPage.id] = {
        id: rootPage.id,
        title: rootPage._dbTitle || extractTitle(rootPage),
        icon: rootPage.icon?.emoji || (rootPage.icon?.type === 'external' ? '🔗' : ''),
        parentId: null, lastEdited: rootPage.last_edited_time, url: rootPage.url,
      };

      // Bounded BFS over child_page blocks (cap to stay within function timeout)
      const MAX_PAGES = 300;
      const queue = [rootPage.id];
      let visited = 0;
      while (queue.length && visited < MAX_PAGES) {
        const parentId = queue.shift();
        visited++;
        let cursor = undefined;
        do {
          const resp = await client.blocks.children.list({ block_id: parentId, page_size: 100, start_cursor: cursor })
            .catch(() => ({ results: [] }));
          for (const b of resp.results || []) {
            if (b.type === 'child_page') {
              pagesById[b.id] = {
                id: b.id, title: b.child_page?.title || '(untitled)', icon: '',
                parentId, lastEdited: b.last_edited_time, url: '',
              };
              if (pagesById[parentId]) pagesById[parentId].hasChildren = true;
              if (Object.keys(pagesById).length < MAX_PAGES) queue.push(b.id);
            }
          }
          cursor = resp.has_more ? resp.next_cursor : undefined;
        } while (cursor);
      }

      return ok({ rootPages: [pagesById[rootPage.id]], pagesById, personal });
    }

    // ── Default path: search the whole workspace ──────────────────────────────
    const allPages = [];
    let cursor = undefined;
    do {
      const resp = await client.search({
        filter: { property: 'object', value: 'page' },
        sort:   { direction: 'descending', timestamp: 'last_edited_time' },
        page_size: 100,
        start_cursor: cursor,
      });
      allPages.push(...(resp.results || []));
      cursor = resp.has_more ? resp.next_cursor : undefined;
    } while (cursor);

    const pages = allPages.map(p => ({
      id:         p.id,
      title:      extractTitle(p),
      icon:       p.icon?.emoji || (p.icon?.type === 'external' ? '🔗' : ''),
      parentId:   p.parent?.type === 'page_id' ? p.parent.page_id : null,
      parentType: p.parent?.type,
      lastEdited: p.last_edited_time,
      url:        p.url,
    }));

    const pagesById = Object.fromEntries(pages.map(p => [p.id, p]));
    for (const p of pages) {
      if (p.parentId && pagesById[p.parentId]) pagesById[p.parentId].hasChildren = true;
    }

    const rootPages = pages.filter(p => !pagesById[p.parentId]);
    return ok({ rootPages, pagesById, personal });
  } catch (e) {
    console.error('[playbook-tree]', e.message);
    return err(500, e.message);
  }
};

function extractTitle(page) {
  const props = page.properties || {};
  for (const v of Object.values(props)) {
    if (v.type === 'title') return (v.title || []).map(t => t.plain_text).join('') || '(untitled)';
  }
  return '(untitled)';
}

// Extract a Notion id from a URL, slug, or bare id and re-format as a dashed
// UUID. The id is always the LAST 32 hex chars of the URL (a title slug like
// "OneVibeMediaGroup-INC-" can contain hex letters, so we must take the tail,
// not the first match). Query/hash are dropped first. Returns null if invalid.
function normalizeNotionId(input) {
  if (!input) return null;
  const noQuery = String(input).split(/[?#]/)[0];
  const h = noQuery.replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (h.length < 32) return null;
  const x = h.slice(-32);
  return `${x.slice(0,8)}-${x.slice(8,12)}-${x.slice(12,16)}-${x.slice(16,20)}-${x.slice(20)}`;
}
