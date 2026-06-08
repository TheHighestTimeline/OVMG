// playbook-links-list (§3) — list the Notion-page links for a playbook scope.
// GET ?company=<slug|global>. Any authenticated user can read (the Playbook tab
// itself is gated to OVMG/admins on the front end + access.js).
import { ok, err, CORS } from './_notion.js';
import { requireAuth } from './_auth.js';
import { getSupabase } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };

  const unauthorized = await requireAuth(event);
  if (unauthorized) return unauthorized;

  const company = (event.queryStringParameters?.company || 'global').trim() || 'global';

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('playbook_links')
      .select('*')
      .eq('company', company)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    return ok({ links: (data || []).map(r => ({ id: r.id, name: r.name, url: r.url, editUrl: r.edit_url || null, position: r.position })) });
  } catch (e) {
    console.error('[playbook-links-list]', e.message);
    return err(500, e.message);
  }
};
