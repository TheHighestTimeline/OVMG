// playbook-block-children — Phase 11 / Phase 16 (personal token support).
// Fetches the children of a specific Notion block on-demand.
// GET /.netlify/functions/playbook-block-children?blockId=xxx

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
  if (!token) throw new Error('No Notion token available.');
  return new Client({ auth: token });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  const blockId = event.queryStringParameters?.blockId;
  if (!blockId) return err(400, 'blockId required');

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');
    if (!canAccessPlaybook(user)) return err(403, 'Playbook is OVMG-only');

    const notion = await getNotionClient(user.id);
    const blocks = [];
    let cursor = undefined;
    do {
      const resp = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
      blocks.push(...(resp.results || []));
      cursor = resp.has_more ? resp.next_cursor : undefined;
    } while (cursor);

    return ok({ blocks });
  } catch (e) {
    console.error('[playbook-block-children]', e.message);
    return err(500, e.message);
  }
};
