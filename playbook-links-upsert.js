// playbook-links-upsert (§3) — admin-only. Create/update a playbook's Notion URL.
// Body: { id?, company, name, url, position? }. With id → update, else insert.
import { ok, err, CORS } from './_notion.js';
import { requireAdmin, getUser } from './_auth.js';
import { getSupabase } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };

  const denied = await requireAdmin(event);
  if (denied) return denied;

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return err(400, 'Invalid JSON'); }

  const name = (body.name || 'Playbook').trim() || 'Playbook';
  let url = (body.url || '').trim();
  if (!url) return err(400, 'url is required');
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  // editUrl is optional — the separate notion.so URL used for the "Edit in Notion"
  // button. When omitted the button falls back to the main display URL.
  let editUrl = (body.editUrl || '').trim();
  if (editUrl && !/^https?:\/\//i.test(editUrl)) editUrl = 'https://' + editUrl;
  const company = (body.company || 'global').trim() || 'global';

  const user = await getUser(event);
  const editorId = user?.id || '';
  const payload = {
    company, name, url,
    ...(editUrl ? { edit_url: editUrl } : {}),
    position: Number.isFinite(body.position) ? body.position : 0,
    updated_by_user_id: editorId,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = getSupabase();
    let result;
    if (body.id) {
      const { data, error } = await supabase
        .from('playbook_links').update(payload).eq('id', body.id).select().single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('playbook_links').insert({ ...payload, created_by_user_id: editorId }).select().single();
      if (error) throw error;
      result = data;
    }
    return ok({ link: { id: result.id, name: result.name, url: result.url, editUrl: result.edit_url || null, position: result.position } });
  } catch (e) {
    console.error('[playbook-links-upsert]', e.message);
    return err(500, e.message);
  }
};
