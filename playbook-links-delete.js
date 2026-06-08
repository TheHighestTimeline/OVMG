// playbook-links-delete (§3) — admin-only. Remove a playbook link.
import { ok, err, CORS } from './_notion.js';
import { requireAdmin } from './_auth.js';
import { getSupabase } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };

  const denied = await requireAdmin(event);
  if (denied) return denied;

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return err(400, 'Invalid JSON'); }

  if (!body.id) return err(400, 'id is required');

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('playbook_links').delete().eq('id', body.id);
    if (error) throw error;
    return ok({ ok: true });
  } catch (e) {
    console.error('[playbook-links-delete]', e.message);
    return err(500, e.message);
  }
};
