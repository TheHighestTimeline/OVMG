// playbook-save-block — Phase 16 editor with rich text + tables + toggles.
// Updates / deletes / appends Notion blocks.
//
// POST body:
//   { action: 'update', blockId, type, rich_text: [...] }   // rich text content
//   { action: 'update', blockId, type, content: 'plain' }   // plain text (legacy)
//   { action: 'update_row', blockId, cells: [[rich_text], ...] }  // table row
//   { action: 'update_checkbox', blockId, checked: true }   // to-do
//   { action: 'delete', blockId }
//   { action: 'append', pageId, blocks: [...], after?: blockId }
//   { action: 'create_image_external', pageId, url, after? }
//   { action: 'create_embed', pageId, url, after? }
//   { action: 'create_bookmark', pageId, url, after? }
//   { action: 'create_table', pageId, rows, cols, hasColumnHeader?, after? }
//   { action: 'create_toggle', pageId, rich_text?, after? }
//   { action: 'append_row', tableId, cells: [[rich_text], ...] }

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
  if (!token) throw new Error('No Notion token available. Connect your Notion workspace in the dashboard.');
  return new Client({ auth: token });
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (event.httpMethod !== 'POST') return err(405, 'POST required');
  const unauth = await requireAuth(event); if (unauth) return unauth;

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return err(400, 'Invalid JSON'); }

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');
    if (!canAccessPlaybook(user)) return err(403, 'Playbook is OVMG-only');

    const notion = await getNotionClient(user.id);
    const { action } = body;

    // ── Update a rich-text-bearing block ───────────────────────────────────
    if (action === 'update') {
      const { blockId, type, rich_text, content } = body;
      if (!blockId) return err(400, 'blockId required');
      if (!type)    return err(400, 'type required');
      const rt = Array.isArray(rich_text) ? rich_text : buildRichTextFromPlain(content ?? '');
      await notion.blocks.update({ block_id: blockId, [type]: { rich_text: rt } });
      return ok({ updated: true, blockId });
    }

    // ── Toggle a to-do checkbox ────────────────────────────────────────────
    if (action === 'update_checkbox') {
      const { blockId, checked } = body;
      if (!blockId) return err(400, 'blockId required');
      await notion.blocks.update({ block_id: blockId, to_do: { checked: !!checked } });
      return ok({ updated: true, blockId });
    }

    // ── Update a table row's cells ─────────────────────────────────────────
    if (action === 'update_row') {
      const { blockId, cells } = body;
      if (!blockId) return err(400, 'blockId required');
      if (!Array.isArray(cells)) return err(400, 'cells array required');
      await notion.blocks.update({ block_id: blockId, table_row: { cells } });
      return ok({ updated: true, blockId });
    }

    // ── Append blocks (generic) ────────────────────────────────────────────
    if (action === 'append') {
      const { pageId, blocks, after } = body;
      if (!pageId) return err(400, 'pageId required');
      if (!Array.isArray(blocks) || blocks.length === 0) return err(400, 'blocks array required');
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: blocks,
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    // ── Specialized creators ───────────────────────────────────────────────
    if (action === 'create_image_external') {
      const { pageId, url, after } = body;
      if (!pageId || !url) return err(400, 'pageId and url required');
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: [{ object: 'block', type: 'image', image: { type: 'external', external: { url } } }],
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'create_embed') {
      const { pageId, url, after } = body;
      if (!pageId || !url) return err(400, 'pageId and url required');
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: [{ object: 'block', type: 'embed', embed: { url } }],
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'create_bookmark') {
      const { pageId, url, after } = body;
      if (!pageId || !url) return err(400, 'pageId and url required');
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: [{ object: 'block', type: 'bookmark', bookmark: { url } }],
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'create_table') {
      const { pageId, rows = 2, cols = 2, hasColumnHeader = false, after } = body;
      if (!pageId) return err(400, 'pageId required');
      const emptyRow = () => ({
        object: 'block',
        type: 'table_row',
        table_row: { cells: Array.from({ length: cols }, () => []) },
      });
      const tableBlock = {
        object: 'block',
        type: 'table',
        table: {
          table_width: cols,
          has_column_header: !!hasColumnHeader,
          has_row_header: false,
          children: Array.from({ length: rows }, emptyRow),
        },
      };
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: [tableBlock],
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'create_toggle') {
      const { pageId, rich_text, after } = body;
      if (!pageId) return err(400, 'pageId required');
      const rt = Array.isArray(rich_text) ? rich_text : [{ type: 'text', text: { content: 'Toggle' } }];
      const resp = await notion.blocks.children.append({
        block_id: pageId,
        children: [{ object: 'block', type: 'toggle', toggle: { rich_text: rt } }],
        ...(after ? { after } : {}),
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'append_row') {
      const { tableId, cells } = body;
      if (!tableId) return err(400, 'tableId required');
      const resp = await notion.blocks.children.append({
        block_id: tableId,
        children: [{ object: 'block', type: 'table_row', table_row: { cells: cells || [[]] } }],
      });
      return ok({ appended: true, results: resp.results || [] });
    }

    if (action === 'delete') {
      const { blockId } = body;
      if (!blockId) return err(400, 'blockId required');
      await notion.blocks.delete({ block_id: blockId });
      return ok({ deleted: true, blockId });
    }

    return err(400, `Unknown action: ${action}`);
  } catch (e) {
    console.error('[playbook-save-block]', e.message);
    return err(500, e.message);
  }
};

function buildRichTextFromPlain(content) {
  if (typeof content === 'string') return content === '' ? [] : [{ type: 'text', text: { content } }];
  return [];
}
