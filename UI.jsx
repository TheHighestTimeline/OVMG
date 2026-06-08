import fetch from 'node-fetch';
import { ok, err, CORS } from './_notion.js';
import { requireAdmin } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAdmin(context);
  if (authErr) return authErr;

  try {
    const { email } = JSON.parse(event.body || '{}');
    if (!email) return err(400, 'email is required');

    const siteUrl = process.env.URL || `https://${process.env.SITE_NAME}.netlify.app`;
    const token   = context.clientContext?.identity?.token;

    // Trigger a recovery email via the identity admin API
    const res = await fetch(`${siteUrl}/.netlify/identity/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return err(res.status, msg);
    }

    return ok({ sent: true, email });
  } catch (e) {
    return err(500, e.message);
  }
};
