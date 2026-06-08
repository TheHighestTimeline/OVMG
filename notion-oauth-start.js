// notion-oauth-start — Phase 16.
// Generates the Notion OAuth consent URL so users can connect their
// personal Notion workspace to the dashboard. Requires a "Public Integration"
// set up at https://www.notion.so/my-integrations with:
//   - Redirect URI: https://ovmgdashboard.netlify.app/.netlify/functions/notion-oauth-callback
//   - NOTION_OAUTH_CLIENT_ID and NOTION_OAUTH_CLIENT_SECRET in Netlify env vars.

import { ok, err, CORS } from './_notion.js';
import { requireAuth, getUser } from './_auth.js';
import { getSupabase } from './_supabase.js';
import crypto from 'crypto';

function getRedirectUri() {
  const base = process.env.PUBLIC_URL || process.env.URL || 'https://ovmgdashboard.netlify.app';
  return `${base.replace(/\/$/, '')}/.netlify/functions/notion-oauth-callback`;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const unauth = await requireAuth(event); if (unauth) return unauth;

  const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
  if (!clientId) return err(503, 'NOTION_OAUTH_CLIENT_ID is not configured in Netlify env vars.');

  try {
    const user = await getUser(event);
    if (!user) return err(401, 'No user');

    const state = crypto.randomBytes(24).toString('hex');
    const supabase = getSupabase();

    // Clean up expired states first
    supabase.from('notion_oauth_state').delete()
      .lt('expires_at', new Date().toISOString())
      .then(() => {}, () => {});

    await supabase.from('notion_oauth_state').insert({ state, user_id: user.id });

    const params = new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  getRedirectUri(),
      response_type: 'code',
      owner:         'user',
      state,
    });

    return ok({ url: `https://api.notion.com/v1/oauth/authorize?${params}`, state });
  } catch (e) {
    console.error('[notion-oauth-start]', e.message);
    return err(500, e.message);
  }
};
