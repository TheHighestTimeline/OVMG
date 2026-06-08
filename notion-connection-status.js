// notion-connection-status — returns the current user's Notion connection info.
import { ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';
import { getSupabase } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');

    const supabase = getSupabase();
    const { data } = await supabase
      .from('user_notion_connections')
      .select('workspace_id, workspace_name, workspace_icon, created_at, updated_at')
      .eq('user_id', user.id)
      .single();

    return ok({
      connected: !!data,
      workspace: data ? {
        id:        data.workspace_id,
        name:      data.workspace_name,
        icon:      data.workspace_icon,
        connectedAt: data.created_at,
      } : null,
      oauthConfigured: !!(process.env.NOTION_OAUTH_CLIENT_ID),
    });
  } catch (e) {
    console.error('[notion-connection-status]', e.message);
    return err(500, e.message);
  }
};
