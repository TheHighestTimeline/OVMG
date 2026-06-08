// notion-oauth-callback — Phase 16.
// Handles the redirect from Notion after the user authorizes.
// Exchanges the code for an access_token, stores in user_notion_connections.
// Sends a postMessage to the opener window so the dashboard can react.

import { getSupabase } from './_supabase.js';

const CORS = { 'Access-Control-Allow-Origin': '*' };

function html(body) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body,
  };
}

export const handler = async (event) => {
  const { code, state, error: oauthError } = event.queryStringParameters || {};

  if (oauthError) {
    return html(`<script>window.opener?.postMessage({type:'ovmg.notion.error',error:'${oauthError}'},'*');window.close();</script>`);
  }

  if (!code || !state) {
    return html(`<script>window.opener?.postMessage({type:'ovmg.notion.error',error:'Missing code or state'},'*');window.close();</script>`);
  }

  try {
    const supabase = getSupabase();

    // Verify state
    const { data: stateRow, error: stateErr } = await supabase
      .from('notion_oauth_state').select('user_id, expires_at').eq('state', state).single();
    if (stateErr || !stateRow) {
      return html(`<script>window.opener?.postMessage({type:'ovmg.notion.error',error:'Invalid or expired state'},'*');window.close();</script>`);
    }
    if (new Date(stateRow.expires_at) < new Date()) {
      return html(`<script>window.opener?.postMessage({type:'ovmg.notion.error',error:'Authorization expired — try again'},'*');window.close();</script>`);
    }

    // Exchange code for token
    const redirectUri = `${(process.env.PUBLIC_URL || process.env.URL || 'https://ovmgdashboard.netlify.app').replace(/\/$/, '')}/.netlify/functions/notion-oauth-callback`;
    const credentials = Buffer.from(`${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`).toString('base64');

    const tokenRes = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Token exchange failed');
    }

    // Upsert into user_notion_connections
    const { error: upsertErr } = await supabase.from('user_notion_connections').upsert({
      user_id:        stateRow.user_id,
      access_token:   tokenData.access_token,
      workspace_id:   tokenData.workspace_id,
      workspace_name: tokenData.workspace_name,
      workspace_icon: tokenData.workspace_icon,
      bot_id:         tokenData.bot_id,
      owner:          tokenData.owner,
      updated_at:     new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (upsertErr) throw upsertErr;

    // Clean up state
    await supabase.from('notion_oauth_state').delete().eq('state', state);

    const wsName = tokenData.workspace_name || 'your workspace';
    return html(`
      <html><body style="font-family:sans-serif;background:#0e1014;color:#e8e8e8;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="text-align:center;">
          <div style="font-size:40px;margin-bottom:12px;">✓</div>
          <p style="font-size:14px;">Connected to <strong>${wsName}</strong></p>
          <p style="font-size:12px;color:#666;">Closing…</p>
        </div>
        <script>
          window.opener?.postMessage({
            type: 'ovmg.notion.connected',
            workspaceName: ${JSON.stringify(wsName)},
            workspaceIcon: ${JSON.stringify(tokenData.workspace_icon || '')},
          }, '*');
          setTimeout(() => window.close(), 1200);
        </script>
      </body></html>
    `);
  } catch (e) {
    console.error('[notion-oauth-callback]', e.message);
    return html(`<script>window.opener?.postMessage({type:'ovmg.notion.error',error:${JSON.stringify(e.message)}},'*');window.close();</script>`);
  }
};
