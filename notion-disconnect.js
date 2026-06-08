// notion-disconnect — removes the user's Notion OAuth connection.
import { ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';
import { getSupabase } from './_supabase.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  if (event.httpMethod !== 'POST') return err(405, 'POST required');
  const unauth = await requireAuth(event); if (unauth) return unauth;

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');

    const supabase = getSupabase();
    await supabase.from('user_notion_connections').delete().eq('user_id', user.id);

    return ok({ disconnected: true });
  } catch (e) {
    console.error('[notion-disconnect]', e.message);
    return err(500, e.message);
  }
};
