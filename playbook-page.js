// playbook-page — Phase 11 / Phase 16 (personal token support).
// Fetches full block content for a single Notion page.
// GET /.netlify/functions/playbook-page?pageId=xxx

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
    if (data?.access_token) return new Client({ auth: data.access_token });
  } catch {}
  const token = process.env.PLAYBOOK_NOTION_TOKEN || process.env.NOTION_TOKEN;
  if (!token) throw new Error('No Notion token. Connect your Notion workspace in Settings.');
  return new Client({ auth: token });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  const pageId = event.queryStringParameters?.pageId;
  if (!pageId) return err(400, 'pageId required');

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');
    if (!canAccessPlaybook(user)) return err(403, 'Playbook is OVMG-only');

    const notion = await getNotionClient(user.id);
    const [page, blocks] = await Promise.all([
      notion.pages.retrieve({ page_id: pageId }),
      fetchAllChildren(notion, pageId),
    ]);

    return ok({
      page: {
        id:         page.id,
        title:      extractTitle(page),
        icon:       page.icon?.emoji || '',
        url:        page.url,
        lastEdited: page.last_edited_time,
      },
      blocks,
    });
  } catch (e) {
    console.error('[playbook-page]', e.message);
    return err(500, e.message);
  }
};

async function fetchAllChildren(notion, blockId) {
  const out = [];
  let cursor = undefined;
  do {
    const resp = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    out.push(...(resp.results || []));
    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);
  return out;
}

function extractTitle(page) {
  const props = page.properties || {};
  for (const v of Object.values(props)) {
    if (v.type === 'title') return (v.title || []).map(t => t.plain_text).join('') || '(untitled)';
  }
  return '(untitled)';
}
