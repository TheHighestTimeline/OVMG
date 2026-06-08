import fetch from 'node-fetch';
import { ok, err, CORS } from './_notion.js';
import { requireAdmin } from './_auth.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS };
  const authErr = requireAdmin(context);
  if (authErr) return authErr;

  try {
    const body  = JSON.parse(event.body || '{}');
    // Only banned and fullName may be updated here — roles are set at invite time only
    const { id, banned, fullName } = body;
    if (!id) return err(400, 'id is required');

    const siteUrl = process.env.URL || `https://${process.env.SITE_NAME}.netlify.app`;
    const token   = context.clientContext?.identity?.token;

    const payload = {};
    if (banned   !== undefined) payload.banned        = banned;
    if (fullName !== undefined) payload.user_metadata = { full_name: fullName };

    const res = await fetch(`${siteUrl}/.netlify/identity/admin/users/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      return err(res.status, msg);
    }

    return ok({ id, updated: true });
  } catch (e) {
    return err(500, e.message);
  }
};
